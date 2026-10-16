import asyncio
import logging
import time
from datetime import UTC, datetime, timedelta

from sqlalchemy import BigInteger, and_, or_, select, text
from sqlalchemy.ext.asyncio import AsyncConnection

from app.db import models as dbm
from app.domain.playback import position_at, promote
from app.resources import Resources
from app.services.cleanup import Cleanup
from app.services.clock import Clock
from app.services.job_dispatch import JobDispatcher
from app.services.security import Security
from app.ws.manager import Manager

EVENTS = (
    "room.snapshot",
    "presence.changed",
    "host.changed",
    "playback.state",
    "track.updated",
    "room.closed",
)
OWNER_KEY = "hashtextextended('unison:api:v1:' || current_schema(), 0)"


class Runtime:
    def __init__(self, resources: Resources, security: Security) -> None:
        self.resources = resources
        self.clock = Clock()
        self.manager = Manager(resources, security, self.clock)
        self.rooms = self.manager.rooms
        self.playback = self.manager.playback
        self.settings = security.settings
        self.jobs = JobDispatcher(resources, self.settings)
        self.cleanup = Cleanup(resources, self.settings)
        self.ready = False
        self.owner: AsyncConnection | None = None
        self.owner_locked = False
        self.task: asyncio.Task[None] | None = None
        self.last_lifecycle = 0.0
        self.last_lease_check = 0.0

    async def start(self) -> None:
        await self.acquire()
        self.task = asyncio.create_task(self.run(), name="room-runtime")

    async def acquire(self) -> None:
        try:
            self.owner = await self.resources.engine.connect()
            acquired = await self.owner.scalar(text(f"SELECT pg_try_advisory_lock({OWNER_KEY})"))
            await self.owner.commit()
            if not acquired:
                await self.release()
                return
            self.owner_locked = True
            async with self.resources.sessions() as db:
                ids = (
                    await db.scalars(select(dbm.Room.id).where(dbm.Room.status == "active"))
                ).all()
            for room_id in ids:
                async with self.resources.sessions.begin() as db:
                    room = await self.rooms.room(db, room_id)
                    await self.playback.recover(db, room)
                    for participant in (
                        await db.scalars(
                            select(dbm.Participant).where(
                                dbm.Participant.room_id == room_id,
                                dbm.Participant.left_at.is_(None),
                            )
                        )
                    ).all():
                        self.manager.offline_since[participant.id] = (room_id, datetime.now(UTC))
            self.ready = True
            if self.jobs.task is None:
                self.jobs.start()
            if self.cleanup.task is None:
                self.cleanup.start()
            self.last_lease_check = time.monotonic()
        except Exception as error:
            self.failed(error)
            await self.release()

    def failed(self, error: Exception) -> None:
        self.ready = False
        self.manager.stop_all(1013)
        logging.getLogger("unison").error(
            "room_runtime_unavailable", extra={"exceptionType": type(error).__name__}
        )

    async def release(self) -> None:
        self.ready = False
        await self.jobs.stop()
        await self.cleanup.stop()
        if self.owner is not None:
            try:
                if self.owner_locked:
                    await self.owner.execute(text(f"SELECT pg_advisory_unlock({OWNER_KEY})"))
                    await self.owner.commit()
            except Exception:
                await self.owner.invalidate()
            finally:
                await self.owner.close()
                self.owner = None
                self.owner_locked = False

    async def stop(self) -> None:
        self.manager.stop_all()
        if self.task is not None:
            self.task.cancel()
            await asyncio.gather(self.task, return_exceptions=True)
        await self.release()

    async def run(self) -> None:
        while True:
            if not self.ready:
                await asyncio.sleep(1)
                await self.acquire()
                continue
            try:
                old_now = self.clock.now_ms()
                if self.clock.reset_if_jumped():
                    await self.recover_clock(old_now)
                await self.advance_due()
                await self.dispatch()
                await self.manager.periodic()
                if time.monotonic() - self.last_lifecycle >= 1:
                    await self.lifecycle()
                    self.last_lifecycle = time.monotonic()
                if time.monotonic() - self.last_lease_check >= 5:
                    assert self.owner is not None
                    await self.owner.execute(text("SELECT 1"))
                    await self.owner.commit()
                    self.last_lease_check = time.monotonic()
            except Exception as error:
                self.failed(error)
                await self.release()
            await asyncio.sleep(0.1)

    async def recover_clock(self, old_now: int) -> None:
        async with self.resources.sessions() as db:
            ids = (await db.scalars(select(dbm.Room.id).where(dbm.Room.status == "active"))).all()
        for room_id in ids:
            async with self.resources.sessions.begin() as db:
                room = await self.rooms.room(db, room_id)
                await self.playback.recover(db, room, old_now)
        for connection in self.manager.connections.values():
            connection.readiness = None
            connection.rtt_ms = None
        logging.getLogger("unison").warning("clock_epoch_reset")

    async def advance_due(self) -> None:
        now_ms = self.clock.now_ms()
        async with self.resources.sessions() as db:
            ids = (
                await db.scalars(
                    select(dbm.PlaybackState.room_id)
                    .join(dbm.Room)
                    .where(
                        dbm.Room.status == "active",
                        or_(
                            and_(
                                dbm.PlaybackState.pending_transition.is_not(None),
                                dbm.PlaybackState.pending_transition[
                                    "effectiveAtServerTimeMs"
                                ].astext.cast(BigInteger)
                                <= now_ms,
                            ),
                            and_(
                                dbm.PlaybackState.status == "playing",
                                dbm.PlaybackState.pending_transition.is_(None),
                                dbm.PlaybackState.anchor_server_time_ms
                                + dbm.PlaybackState.duration_ms
                                - dbm.PlaybackState.position_ms
                                <= now_ms,
                            ),
                        ),
                    )
                )
            ).all()
        for room_id in ids:
            async with self.resources.sessions.begin() as db:
                room = await self.rooms.room(db, room_id)
                state = await db.get(dbm.PlaybackState, room_id)
                assert state is not None
                if room.status == "active":
                    await self.playback.advance(db, room, state, self.clock.now_ms())

    async def dispatch(self) -> None:
        async with self.resources.sessions() as db:
            pending = (
                await db.execute(
                    select(dbm.Outbox.id, dbm.Outbox.room_id)
                    .where(dbm.Outbox.sent_at.is_(None), dbm.Outbox.event_type.in_(EVENTS))
                    .order_by(dbm.Outbox.sequence)
                    .limit(100)
                )
            ).all()
        for event_id, room_id in pending:
            async with self.resources.sessions.begin() as db:
                room = await self.rooms.room(db, room_id)
                record = await db.scalar(
                    select(dbm.Outbox)
                    .where(dbm.Outbox.id == event_id, dbm.Outbox.sent_at.is_(None))
                    .with_for_update(skip_locked=True)
                )
                if record is None:
                    continue
                payload, revision = record.payload, record.revision
                if record.event_type in {"room.snapshot", "presence.changed"}:
                    snapshot = await self.rooms.snapshot(db, room)
                    revision = snapshot.playback_revision
                    payload = (
                        snapshot.model_dump(mode="json", by_alias=True)
                        if (record.event_type == "room.snapshot")
                        else {
                            "presenceSeq": room.presence_seq,
                            "participants": [
                                p.model_dump(mode="json", by_alias=True)
                                for p in snapshot.participants
                            ],
                        }
                    )
                    present = {p.id for p in snapshot.participants}
                    for connection in list(self.manager.connections.values()):
                        if (
                            connection.room_id == room_id
                            and connection.participant_id not in present
                        ):
                            connection.stop(4010)
                self.manager.broadcast(
                    room_id, self.manager.event(record.event_type, revision, payload, record.id)
                )
                record.sent_at = datetime.now(UTC)

    async def lifecycle(self) -> None:
        now = datetime.now(UTC)
        async with self.resources.sessions() as db:
            ids = (await db.scalars(select(dbm.Room.id).where(dbm.Room.status == "active"))).all()
        for room_id in ids:
            async with self.resources.sessions.begin() as db:
                room = await self.rooms.room(db, room_id)
                if room.status != "active":
                    continue
                state = await db.get(dbm.PlaybackState, room.id)
                assert state is not None
                members = (
                    await db.scalars(
                        select(dbm.Participant)
                        .where(
                            dbm.Participant.room_id == room.id, dbm.Participant.left_at.is_(None)
                        )
                        .order_by(dbm.Participant.joined_at, dbm.Participant.id)
                    )
                ).all()
                changed = False
                old_host = room.host_participant_id
                for participant in members:
                    online = self.manager.presence(
                        participant.id, participant.connection_generation
                    )[0]
                    if online == "online":
                        continue
                    offline = self.manager.offline_since.get(participant.id)
                    since = (
                        offline[1]
                        if offline
                        else participant.last_seen_at
                        + timedelta(seconds=self.settings.offline_seconds)
                    )
                    if now - since >= timedelta(seconds=self.settings.host_grace_seconds):
                        participant.left_at = now
                        participant.left_reason = "offlineTimeout"
                        participant.role = "listener"
                        participant.connection_generation += 1
                        if room.host_participant_id == participant.id:
                            room.host_participant_id = None
                        changed = True
                await db.flush()
                online_members = [
                    p
                    for p in members
                    if p.left_at is None
                    and self.manager.presence(p.id, p.connection_generation)[0] == "online"
                ]
                if room.host_participant_id is None and online_members:
                    successor = online_members[0]
                    successor.role = "host"
                    room.host_participant_id = successor.id
                    changed = True
                if online_members:
                    room.empty_since = None
                elif all(p.left_at is not None for p in members) and room.empty_since is None:
                    room.empty_since = now
                if old_host != room.host_participant_id:
                    db.add(
                        dbm.Outbox(
                            room_id=room.id,
                            revision=state.playback_revision,
                            event_type="host.changed",
                            payload={
                                "participantId": str(room.host_participant_id)
                                if room.host_participant_id
                                else None
                            },
                        )
                    )
                reason = (
                    "expired"
                    if room.expires_at <= now
                    else (
                        "emptyTimeout"
                        if room.empty_since
                        and now - room.empty_since
                        >= timedelta(seconds=self.settings.empty_room_ttl_seconds)
                        else None
                    )
                )
                if reason:
                    promote(state, self.clock.now_ms())
                    state.position_ms = position_at(state, self.clock.now_ms())
                    if state.status == "playing":
                        state.status = (
                            "ended" if state.position_ms == state.duration_ms else "paused"
                        )
                    state.pending_transition = None
                    state.anchor_server_time_ms = self.clock.now_ms()
                    state.playback_revision += 1
                    room.status = "expired"
                    room.closed_at = now
                    db.add(
                        dbm.Outbox(
                            room_id=room.id,
                            revision=state.playback_revision,
                            event_type="room.closed",
                            payload={"reason": reason},
                        )
                    )
                    changed = True
                if changed:
                    room.presence_seq += 1
                    await db.flush()
                    await self.rooms.emit_snapshot(db, room)
        async with self.resources.sessions() as db:
            reserved = set(
                (
                    await db.scalars(
                        select(dbm.Participant.id)
                        .join(dbm.Room, dbm.Participant.room_id == dbm.Room.id)
                        .where(
                            dbm.Room.status == "active",
                            dbm.Room.expires_at > now,
                            dbm.Participant.left_at.is_(None),
                        )
                    )
                ).all()
            )
        for participant_id in list(self.manager.offline_since):
            if participant_id not in reserved:
                self.manager.offline_since.pop(participant_id, None)
