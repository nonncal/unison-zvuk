import asyncio
import time
from datetime import UTC, datetime
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.websockets import WebSocket

from app.contracts import models as wire
from app.contracts import ws
from app.db import models as dbm
from app.domain.errors import DomainError
from app.domain.playback import Playback, position_at
from app.domain.rooms import Rooms
from app.resources import Resources
from app.services.clock import Clock
from app.services.metrics import SyncState
from app.services.security import Security
from app.ws.connection import Connection


class Manager:
    def __init__(self, resources: Resources, security: Security, clock: Clock) -> None:
        self.resources = resources
        self.security = security
        self.clock = clock
        self.settings = security.settings
        self.connections: dict[UUID, Connection] = {}
        self.offline_since: dict[UUID, tuple[UUID, datetime]] = {}
        self.registry_lock = asyncio.Lock()
        self.rooms = Rooms(self.settings, security, clock, self.presence)
        self.rooms.start_delay = self.start_delay
        self.playback = Playback(self.rooms, clock)
        self.metrics = resources.metrics

    def start_delay(self, room_id: UUID) -> int:
        active = [c for c in self.connections.values() if c.room_id == room_id and not c.close_code]
        rtts = [
            c.rtt_ms
            for c in active
            if c.rtt_ms is not None and time.monotonic() - c.last_telemetry <= 60
        ]
        # Bounded network lead: buffering clients cannot hold everyone indefinitely.
        delay = max(600, 2 * max(rtts, default=250) + 300)
        if any(
            c.readiness is None or c.readiness.state in {"loading", "buffering"} for c in active
        ):
            delay = max(delay, 1500)
        return min(2000, delay)

    def presence(self, participant_id: UUID, generation: int) -> tuple[str, wire.Readiness | None]:
        connection = self.connections.get(participant_id)
        if connection is None or connection.generation != generation or connection.close_code:
            return "offline", None
        return "online", connection.readiness

    def event(
        self, kind: str, revision: int, payload: dict[str, Any], event_id: UUID | None = None
    ) -> dict[str, Any]:
        return ws.event_adapter.validate_python(
            {
                "v": 1,
                "type": kind,
                "eventId": event_id or uuid4(),
                "serverTimeMs": self.clock.now_ms(),
                "playbackRevision": revision,
                "payload": payload,
            }
        ).model_dump(mode="json", by_alias=True)

    async def current(
        self, db: AsyncSession, connection: Connection
    ) -> tuple[dbm.Room, dbm.Participant]:
        if self.connections.get(connection.participant_id) is not connection or (
            connection.session_expires_at <= datetime.now(UTC)
        ):
            raise DomainError(
                "FORBIDDEN", "Подключение больше не действует", 403, details={"terminal": True}
            )
        room = await self.rooms.room(db, connection.room_id)
        actor = await db.get(dbm.Participant, connection.participant_id)
        if (
            actor is None
            or actor.left_at is not None
            or (actor.connection_generation != connection.generation)
        ):
            raise DomainError(
                "FORBIDDEN", "Подключение больше не действует", 403, details={"terminal": True}
            )
        self.rooms.active(room)
        return room, actor

    async def open(self, websocket: WebSocket, room_id: UUID) -> Connection:
        self.security.check_origin(websocket.headers.get("origin"))
        async with self.registry_lock:
            async with self.resources.sessions.begin() as db:
                session = await self.security.session(
                    db, websocket.cookies.get(self.settings.session_cookie)
                )
                room = await self.rooms.room(db, room_id)
                actor = await db.scalar(
                    select(dbm.Participant).where(
                        dbm.Participant.room_id == room.id, dbm.Participant.session_id == session.id
                    )
                )
                if actor is None or actor.left_reason in {"left", "removed"}:
                    raise DomainError("FORBIDDEN", "Участие больше не действует", 403)
                connection = Connection(
                    websocket,
                    room.id,
                    actor.id,
                    actor.connection_generation + 1,
                    session.expires_at,
                    self.settings.ws_queue_size,
                    metrics=self.metrics,
                    now_ms=self.clock.now_ms,
                )
                if room.status != "active" or room.expires_at <= datetime.now(UTC):
                    reason = "closedByHost" if room.status == "closed" else "expired"
                    state = await db.get(dbm.PlaybackState, room.id)
                    assert state is not None
                    await websocket.accept()
                    connection.put(
                        self.event("room.closed", state.playback_revision, {"reason": reason}),
                        close_after=4004,
                    )
                    return connection
                if actor.left_at is not None:
                    count = await db.scalar(
                        select(func.count())
                        .select_from(dbm.Participant)
                        .where(
                            dbm.Participant.room_id == room.id, dbm.Participant.left_at.is_(None)
                        )
                    )
                    reserved = await db.scalar(
                        select(func.count())
                        .select_from(dbm.Admission)
                        .where(
                            dbm.Admission.room_id == room.id,
                            dbm.Admission.session_id != session.id,
                            dbm.Admission.status == "approved",
                            dbm.Admission.expires_at > datetime.now(UTC),
                        )
                    )
                    if (count or 0) + (reserved or 0) >= room.capacity:
                        raise DomainError("ROOM_FULL", "В комнате нет свободных мест")
                    actor.left_at = None
                    actor.left_reason = None
                    actor.role = "listener"
                actor.connection_generation = connection.generation
                actor.last_seen_at = datetime.now(UTC)
                if room.host_participant_id is None:
                    actor.role = "host"
                    room.host_participant_id = actor.id
                    state = await db.get(dbm.PlaybackState, room.id)
                    assert state is not None
                    db.add(
                        dbm.Outbox(
                            room_id=room.id,
                            revision=state.playback_revision,
                            event_type="host.changed",
                            payload={"participantId": str(actor.id)},
                        )
                    )
                room.presence_seq += 1
                room.empty_since = None
            previous = self.connections.get(connection.participant_id)
            self.connections[connection.participant_id] = connection
            self.offline_since.pop(connection.participant_id, None)
            if previous is not None:
                previous.stop(4001)
            try:
                await websocket.accept()
                async with self.resources.sessions.begin() as db:
                    room = await self.rooms.room(db, room_id)
                    state = await db.get(dbm.PlaybackState, room_id)
                    assert state is not None
                    await self.playback.advance(db, room, state, self.clock.now_ms())
                    snapshot = await self.rooms.snapshot(db, room)
                    connection.put(
                        self.event(
                            "hello",
                            state.playback_revision,
                            {
                                "connectionId": str(connection.id),
                                "epoch": str(state.epoch),
                                "protocolVersion": 1,
                                "snapshot": snapshot.model_dump(mode="json", by_alias=True),
                            },
                        )
                    )
                    await self.rooms.emit_snapshot(db, room)
            except BaseException:
                if self.connections.get(connection.participant_id) is connection:
                    self.connections.pop(connection.participant_id)
                    self.offline_since[connection.participant_id] = (room_id, datetime.now(UTC))
                raise
            return connection

    async def disconnect(self, connection: Connection) -> None:
        async with self.registry_lock:
            if self.connections.get(connection.participant_id) is not connection:
                return
            self.connections.pop(connection.participant_id)
            self.offline_since.pop(connection.participant_id, None)
            async with self.resources.sessions.begin() as db:
                room = await self.rooms.room(db, connection.room_id)
                actor = await db.get(dbm.Participant, connection.participant_id)
                if actor is None or actor.connection_generation != connection.generation:
                    return
                if (
                    room.status != "active"
                    or room.expires_at <= datetime.now(UTC)
                    or actor.left_at is not None
                ):
                    return
                self.offline_since[connection.participant_id] = (
                    connection.room_id,
                    datetime.now(UTC),
                )
                room.presence_seq += 1
                await db.flush()
                await self.rooms.emit_snapshot(db, room)

    async def snapshot(self, connection: Connection) -> wire.Snapshot:
        async with self.resources.sessions.begin() as db:
            room, _ = await self.current(db, connection)
            state = await db.get(dbm.PlaybackState, room.id)
            assert state is not None
            await self.playback.advance(db, room, state, self.clock.now_ms())
            return await self.rooms.snapshot(db, room)

    def all_ready(self, snapshot: wire.Snapshot) -> bool:
        playback = snapshot.playback
        if playback.status == "empty":
            return False
        if playback.status == "ended":
            position = 0
        elif playback.status == "playing":
            position = min(
                playback.duration_ms,
                playback.position_ms + max(0, self.clock.now_ms() - playback.anchor_server_time_ms),
            )
        else:
            position = playback.position_ms
        required = min(3000, max(0, playback.duration_ms - position))
        return bool(snapshot.participants) and all(
            p.connection_state == "online"
            and p.readiness is not None
            and p.readiness.track_id == playback.track_id
            and p.readiness.media_version == playback.media_version
            and p.readiness.state == "ready"
            and p.readiness.autoplay_allowed
            and p.readiness.buffered_ahead_ms >= required
            for p in snapshot.participants
        )

    async def handle(
        self, connection: Connection, command: ws.ClientCommand, received_at_ms: int | None = None
    ) -> None:
        self.metrics.commands.labels(command.type).inc()
        if isinstance(command, ws.SelectTrack | ws.Play | ws.Pause | ws.Seek):
            if not connection.controls.take():
                raise DomainError("RATE_LIMITED", "Слишком много команд", 429)
            if isinstance(command, ws.Seek):
                if time.monotonic() - connection.last_seek < 0.2:
                    raise DomainError("RATE_LIMITED", "Дождитесь завершения перемотки", 429)
                connection.last_seek = time.monotonic()
            if isinstance(command, ws.Play) and not command.payload.allow_not_ready:
                async with self.resources.sessions.begin() as db:
                    room, actor = await self.current(db, connection)
                    state = await db.get(dbm.PlaybackState, room.id)
                    assert state is not None
                    receipt = await db.get(
                        dbm.CommandReceipt, (room.id, actor.id, command.request_id)
                    )
                    early = (receipt is not None and receipt.expires_at > datetime.now(UTC)) or (
                        (actor.role != "host" and not actor.can_edit)
                        or state.status == "empty"
                        or state.pending_transition is not None
                        or command.expected_playback_revision != state.playback_revision
                    )
                    if early:
                        response = await self.playback.mutate(
                            db,
                            room.id,
                            actor.id,
                            connection.generation,
                            command,
                            self.all_ready(await self.rooms.snapshot(db, room)),
                            [],
                        )
                if early:
                    connection.put(
                        self.event("command.ack", response["acceptedPlaybackRevision"], response)
                    )
                    return
                deadline = time.monotonic() + self.settings.readiness_wait_seconds
                while not self.all_ready(await self.snapshot(connection)):
                    if time.monotonic() >= deadline:
                        break
                    await asyncio.sleep(0.1)
            async with self.resources.sessions.begin() as db:
                room, _ = await self.current(db, connection)
                ready = self.all_ready(await self.rooms.snapshot(db, room))
                recent_rtts = [
                    c.rtt_ms
                    for c in self.connections.values()
                    if c.room_id == room.id
                    and c.rtt_ms is not None
                    and time.monotonic() - c.last_telemetry <= 60
                ]
                response = await self.playback.mutate(
                    db,
                    room.id,
                    connection.participant_id,
                    connection.generation,
                    command,
                    ready,
                    recent_rtts,
                )
                if isinstance(command, ws.SelectTrack):
                    for participant_connection in self.connections.values():
                        if participant_connection.room_id == room.id:
                            participant_connection.readiness = None
                    room.presence_seq += 1
                    await db.flush()
                    await self.rooms.emit_snapshot(db, room)
            connection.put(
                self.event("command.ack", response["acceptedPlaybackRevision"], response)
            )
            return
        if not connection.observations.take():
            raise DomainError("RATE_LIMITED", "Слишком много сообщений", 429)
        received = self.clock.now_ms() if received_at_ms is None else received_at_ms
        async with self.resources.sessions.begin() as db:
            room, actor = await self.current(db, connection)
            state = await db.get(dbm.PlaybackState, room.id)
            assert state is not None
            if isinstance(command, ws.ClockProbe):
                connection.put(
                    self.event(
                        "clock.reply",
                        state.playback_revision,
                        {
                            "probeId": str(command.payload.probe_id),
                            "clientSentAtMs": command.payload.client_sent_at_ms,
                            "serverReceivedAtMs": received,
                            "serverSentAtMs": self.clock.now_ms(),
                        },
                    )
                )
            elif isinstance(command, ws.HeartbeatPong):
                if command.payload.ping_id in connection.pings:
                    connection.last_pong = time.monotonic()
                    connection.pings.clear()
                    actor.last_seen_at = datetime.now(UTC)
            elif isinstance(command, ws.SnapshotRequest):
                await self.playback.advance(db, room, state, self.clock.now_ms())
                connection.put(
                    self.event(
                        "room.snapshot",
                        state.playback_revision,
                        (await self.rooms.snapshot(db, room)).model_dump(
                            mode="json", by_alias=True
                        ),
                    )
                )
            elif isinstance(command, ws.ParticipantReadiness):
                if not connection.readiness_limit.take():
                    raise DomainError("RATE_LIMITED", "Слишком частые обновления готовности", 429)
                readiness = command.payload
                if (
                    readiness.track_id != state.track_id
                    or readiness.media_version != state.media_version
                ):
                    raise DomainError("CONFLICT", "Версия трека изменилась")
                if readiness.state == "ready":
                    if not readiness.autoplay_allowed:
                        readiness = readiness.model_copy(update={"state": "autoplayBlocked"})
                    elif readiness.buffered_ahead_ms < min(
                        3000, state.duration_ms - position_at(state, self.clock.now_ms())
                    ):
                        readiness = readiness.model_copy(update={"state": "buffering"})
                connection.readiness = readiness
                self.metrics.participant_readiness(readiness.state)
                room.presence_seq += 1
                await db.flush()
                snapshot = await self.rooms.snapshot(db, room)
                db.add(
                    dbm.Outbox(
                        room_id=room.id,
                        revision=state.playback_revision,
                        event_type="presence.changed",
                        payload={
                            "presenceSeq": room.presence_seq,
                            "participants": [
                                p.model_dump(mode="json", by_alias=True)
                                for p in snapshot.participants
                            ],
                        },
                    )
                )
            elif isinstance(command, ws.SendReaction):
                if not connection.reactions.take():
                    raise DomainError(
                        "RATE_LIMITED", "Подождите немного перед следующей реакцией", 429
                    )
                self.broadcast(
                    room.id,
                    self.event(
                        "reaction.created",
                        state.playback_revision,
                        {"participantId": str(actor.id), "emoji": command.payload.emoji},
                    ),
                )
            elif isinstance(command, ws.Telemetry):
                if time.monotonic() - connection.last_telemetry < 5:
                    raise DomainError("RATE_LIMITED", "Слишком частые измерения", 429)
                if (
                    command.payload.track_id != state.track_id
                    or command.payload.media_version != state.media_version
                ):
                    raise DomainError("CONFLICT", "Версия трека изменилась")
                state_name: SyncState = command.payload.local_state
                if state_name == "playing" and (
                    state.status != "playing"
                    or connection.readiness is None
                    or connection.readiness.state != "ready"
                    or not connection.readiness.autoplay_allowed
                ):
                    state_name = "notReady"
                self.metrics.telemetry(state_name, command.payload.drift_ms, command.payload.rtt_ms)
                connection.rtt_ms = command.payload.rtt_ms
                connection.last_telemetry = time.monotonic()

    async def report_error(
        self,
        connection: Connection,
        request_id: UUID | None,
        error: DomainError,
        close_after: int | None = None,
    ) -> None:
        categories = {
            "PROTOCOL_MISMATCH": "protocol",
            "FORBIDDEN": "authorization",
            "SESSION_EXPIRED": "authorization",
            "RATE_LIMITED": "rateLimit",
            "CONFLICT": "conflict",
            "PENDING_TRANSITION": "conflict",
            "UNAVAILABLE": "unavailable",
            "ROOM_CLOSED": "closed",
            "ROOM_EXPIRED": "closed",
        }
        self.metrics.errors.labels(categories.get(error.code, "other")).inc()
        if error.code in {"ROOM_CLOSED", "ROOM_EXPIRED"}:
            async with self.resources.sessions() as db:
                state = await db.get(dbm.PlaybackState, connection.room_id)
                revision = state.playback_revision if state else 0
            connection.put(
                self.event(
                    "room.closed",
                    revision,
                    {"reason": "closedByHost" if error.code == "ROOM_CLOSED" else "expired"},
                ),
                4004,
            )
            return
        snapshot = None
        revision = 0
        if error.details and "snapshot" in error.details:
            snapshot = error.details["snapshot"]
            revision = snapshot["playbackRevision"]
        else:
            try:
                current = await self.snapshot(connection)
                revision = current.playback_revision
            except DomainError:
                pass
        connection.put(
            self.event(
                "command.error",
                revision,
                {
                    "requestId": str(request_id) if request_id else None,
                    "code": error.code,
                    "message": error.message,
                    "snapshot": snapshot,
                },
            ),
            close_after,
        )

    async def periodic(self) -> None:
        now = time.monotonic()
        for connection in list(self.connections.values()):
            if connection.close_code is not None:
                continue
            if connection.session_expires_at <= datetime.now(UTC) or (
                now - connection.last_pong >= self.settings.offline_seconds
            ):
                connection.stop(1008)
                continue
            if now - connection.last_ping >= self.settings.heartbeat_seconds:
                try:
                    snapshot = await self.snapshot(connection)
                except DomainError as error:
                    if error.code in {"ROOM_CLOSED", "ROOM_EXPIRED"}:
                        async with self.resources.sessions() as db:
                            state = await db.get(dbm.PlaybackState, connection.room_id)
                            revision = state.playback_revision if state else 0
                        connection.put(
                            self.event(
                                "room.closed",
                                revision,
                                {
                                    "reason": "closedByHost"
                                    if error.code == "ROOM_CLOSED"
                                    else "expired"
                                },
                            ),
                            4004,
                        )
                    else:
                        connection.stop(1008)
                    continue
                ping_id = uuid4()
                connection.pings[ping_id] = now
                connection.last_ping = now
                connection.put(
                    self.event(
                        "heartbeat.ping", snapshot.playback_revision, {"pingId": str(ping_id)}
                    )
                )
                connection.put(
                    self.event(
                        "room.snapshot",
                        snapshot.playback_revision,
                        snapshot.model_dump(mode="json", by_alias=True),
                    )
                )

    def broadcast(self, room_id: UUID, event: dict[str, Any]) -> None:
        for connection in list(self.connections.values()):
            if connection.room_id == room_id:
                connection.put(event, 4004 if event["type"] == "room.closed" else None)

    def stop_all(self, code: int = 1012) -> None:
        for connection in self.connections.values():
            connection.stop(code)
