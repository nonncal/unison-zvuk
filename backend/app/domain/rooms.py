import hmac
import secrets
from collections.abc import Callable
from datetime import UTC, datetime, timedelta
from uuid import UUID, uuid4

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import Settings
from app.contracts import models as wire
from app.db import models as dbm
from app.domain.errors import DomainError
from app.services.clock import Clock
from app.services.security import Security, payload_hash


def milliseconds(value: datetime) -> int:
    return int(value.timestamp() * 1000)


class Rooms:
    def __init__(
        self,
        settings: Settings,
        security: Security,
        clock: Clock | None = None,
        presence: Callable[[UUID, int], tuple[str, wire.Readiness | None]] | None = None,
    ) -> None:
        self.settings = settings
        self.security = security
        self.clock = clock
        self.presence = presence

    def invite_url(self, room: dbm.Room) -> str:
        token = self.security.decrypt(room.invite_token_encrypted)
        return f"{self.settings.app_origin.rstrip('/')}/join/{room.id}#invite={token}"

    async def room(self, db: AsyncSession, room_id: UUID, lock: bool = True) -> dbm.Room:
        query = select(dbm.Room).where(dbm.Room.id == room_id)
        if lock:
            query = query.with_for_update()
        room = await db.scalar(query)
        if room is None:
            raise DomainError("NOT_FOUND", "Комната недоступна", 404)
        return room

    def active(self, room: dbm.Room) -> None:
        if room.status == "expired" or room.expires_at <= datetime.now(UTC):
            raise DomainError("ROOM_EXPIRED", "Срок комнаты истёк", 410)
        if room.status == "closed":
            raise DomainError("ROOM_CLOSED", "Комната закрыта", 410)

    async def member(
        self, db: AsyncSession, room: dbm.Room, session_id: UUID, host: bool = False
    ) -> dbm.Participant:
        actor = await db.scalar(
            select(dbm.Participant).where(
                dbm.Participant.room_id == room.id,
                dbm.Participant.session_id == session_id,
                dbm.Participant.left_at.is_(None),
            )
        )
        if actor is None or (
            host and (actor.role != "host" or room.host_participant_id != actor.id)
        ):
            raise DomainError("FORBIDDEN", "Нет доступа к этому действию", 403)
        return actor

    async def snapshot(self, db: AsyncSession, room: dbm.Room) -> wire.Snapshot:
        state = await db.get(dbm.PlaybackState, room.id)
        assert state is not None
        if self.clock is not None:
            from app.domain.playback import promote

            if promote(state, self.clock.now_ms()):
                await db.flush()
        participants = (
            await db.scalars(
                select(dbm.Participant)
                .where(dbm.Participant.room_id == room.id, dbm.Participant.left_at.is_(None))
                .order_by(dbm.Participant.joined_at, dbm.Participant.id)
            )
        ).all()
        return wire.Snapshot.model_validate(
            {
                "room": {
                    "id": room.id,
                    "title": room.title,
                    "status": room.status,
                    "capacity": room.capacity,
                    "moderated": room.moderated,
                    "expires_at": milliseconds(room.expires_at),
                    "host_participant_id": room.host_participant_id,
                },
                "participants": [
                    {
                        "id": p.id,
                        "display_name": p.display_name,
                        "role": p.role,
                        "can_edit": p.can_edit or p.id == room.host_participant_id,
                        "connection_state": self.presence(p.id, p.connection_generation)[0]
                        if self.presence
                        else "offline",
                        "readiness": self.presence(p.id, p.connection_generation)[1]
                        if self.presence
                        else None,
                    }
                    for p in participants
                ],
                "playback": {
                    "room_id": room.id,
                    "epoch": state.epoch,
                    "track_id": state.track_id,
                    "media_version": state.media_version,
                    "status": state.status,
                    "position_ms": state.position_ms,
                    "duration_ms": state.duration_ms,
                    "anchor_server_time_ms": state.anchor_server_time_ms,
                    "pending_transition": state.pending_transition,
                },
                "playlist": {
                    k: v
                    for k, v in (room.playlist or {}).items()
                    if k in {"trackIds", "repeat", "shuffle", "skippedTrackIds"}
                },
                "presence_seq": room.presence_seq,
                "playback_revision": state.playback_revision,
            }
        )

    async def create(
        self, db: AsyncSession, session: dbm.Session, request_id: UUID, payload: wire.CreateRoom
    ) -> wire.CreateRoomResult:
        fingerprint = payload_hash(payload.model_dump(mode="json", by_alias=True))
        receipt = await db.get(dbm.HttpReceipt, (session.id, "room.create", request_id))
        now = datetime.now(UTC)
        if receipt is not None and receipt.expires_at > now:
            if receipt.payload_hash != fingerprint:
                raise DomainError(
                    "DUPLICATE_REQUEST_MISMATCH", "Ключ уже использован для другого запроса"
                )
            return wire.CreateRoomResult.model_validate(
                self.security.unseal_response(receipt.response)
            )
        if receipt is not None:
            await db.delete(receipt)
            await db.flush()
        token = secrets.token_urlsafe(32)
        room = dbm.Room(
            id=uuid4(),
            title=payload.title,
            capacity=payload.capacity,
            moderated=payload.moderated,
            playlist={
                "trackIds": [
                    str(i)
                    for i in (
                        await db.scalars(
                            select(dbm.Track.id)
                            .where(dbm.Track.scope == "catalog", dbm.Track.status == "ready")
                            .order_by(dbm.Track.title)
                            .limit(100)
                        )
                    ).all()
                ]
            },
            host_participant_id=None,
            invite_token_hash=self.security.digest("invite", token),
            invite_token_encrypted=self.security.encrypt(token),
            expires_at=now + timedelta(seconds=self.settings.room_ttl_seconds),
        )
        db.add(room)
        await db.flush()
        host = dbm.Participant(
            id=uuid4(),
            room_id=room.id,
            session_id=session.id,
            display_name=payload.display_name,
            role="host",
        )
        db.add(host)
        await db.flush()
        room.host_participant_id = host.id
        db.add(
            dbm.PlaybackState(
                room_id=room.id,
                anchor_server_time_ms=self.clock.now_ms() if self.clock else milliseconds(now),
                epoch=self.clock.epoch if self.clock else uuid4(),
            )
        )
        await db.flush()
        snapshot = await self.snapshot(db, room)
        result = wire.CreateRoomResult(
            room_id=room.id,
            participant_id=host.id,
            invite_url=self.invite_url(room),
            expires_at=milliseconds(room.expires_at),
            snapshot=snapshot,
        )
        await self.emit_snapshot(db, room)
        db.add(
            dbm.HttpReceipt(
                session_id=session.id,
                operation="room.create",
                request_id=request_id,
                payload_hash=fingerprint,
                status_code=201,
                response=self.security.seal_response(result.model_dump(mode="json", by_alias=True)),
                expires_at=now + timedelta(seconds=self.settings.receipt_ttl_seconds),
            )
        )
        return result

    async def preview(self, db: AsyncSession, token: str) -> wire.PreviewResult:
        room = await db.scalar(
            select(dbm.Room).where(
                dbm.Room.invite_token_hash == self.security.digest("invite", token)
            )
        )
        if room is None:
            raise DomainError("INVITE_INVALID", "Приглашение недействительно", 404)
        count = await db.scalar(
            select(func.count())
            .select_from(dbm.Participant)
            .where(dbm.Participant.room_id == room.id, dbm.Participant.left_at.is_(None))
        )
        return wire.PreviewResult.model_validate(
            {
                "room_id": room.id,
                "title": room.title,
                "status": "expired" if room.expires_at <= datetime.now(UTC) else room.status,
                "participant_count": count,
                "moderated": room.moderated,
                "capacity": room.capacity,
                "expires_at": milliseconds(room.expires_at),
            }
        )

    async def join(
        self, db: AsyncSession, session: dbm.Session, room_id: UUID, payload: wire.JoinRoom
    ) -> wire.JoinRoomResult:
        room = await db.scalar(select(dbm.Room).where(dbm.Room.id == room_id).with_for_update())
        if room is None or not hmac.compare_digest(
            room.invite_token_hash, self.security.digest("invite", payload.invite_token)
        ):
            raise DomainError("INVITE_INVALID", "Приглашение недействительно", 404)
        self.active(room)
        actor = await db.scalar(
            select(dbm.Participant).where(
                dbm.Participant.room_id == room.id, dbm.Participant.session_id == session.id
            )
        )
        if actor is not None and actor.left_reason == "removed":
            raise DomainError("FORBIDDEN", "Ведущий удалил вас из этой комнаты", 403)
        if (actor is None or actor.left_at is not None) and room.moderated:
            admission = await db.scalar(
                select(dbm.Admission).where(
                    dbm.Admission.room_id == room.id, dbm.Admission.session_id == session.id
                )
            )
            if (
                admission is None
                or admission.status != "approved"
                or admission.expires_at <= datetime.now(UTC)
            ):
                raise DomainError("JOIN_PENDING", "Дождитесь допуска ведущего", 403)
            admission.status = "admitted"
        if actor is None or actor.left_at is not None:
            count = await db.scalar(
                select(func.count())
                .select_from(dbm.Participant)
                .where(dbm.Participant.room_id == room.id, dbm.Participant.left_at.is_(None))
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
            role = "listener"
            if actor is None:
                actor = dbm.Participant(
                    id=uuid4(),
                    room_id=room.id,
                    session_id=session.id,
                    display_name=payload.display_name,
                    role=role,
                )
                db.add(actor)
            else:
                actor.left_at = None
                actor.left_reason = None
                actor.role = role
                actor.display_name = payload.display_name
                actor.joined_at = datetime.now(UTC)
            await db.flush()
            room.empty_since = None
            room.presence_seq += 1
            await db.flush()
            await self.emit_snapshot(db, room)
        return wire.JoinRoomResult.model_validate(
            {
                "participant_id": actor.id,
                "role": actor.role,
                "snapshot": await self.snapshot(db, room),
            }
        )

    async def emit_snapshot(self, db: AsyncSession, room: dbm.Room) -> None:
        snapshot = await self.snapshot(db, room)
        db.add(
            dbm.Outbox(
                room_id=room.id,
                revision=snapshot.playback_revision,
                event_type="room.snapshot",
                payload=snapshot.model_dump(mode="json", by_alias=True),
            )
        )

    async def leave(self, db: AsyncSession, room: dbm.Room, actor: dbm.Participant) -> None:
        actor.left_at = datetime.now(UTC)
        actor.left_reason = "left"
        actor.connection_generation += 1
        actor.role = "listener"
        await db.flush()
        if room.host_participant_id == actor.id:
            candidates = (
                await db.scalars(
                    select(dbm.Participant)
                    .where(dbm.Participant.room_id == room.id, dbm.Participant.left_at.is_(None))
                    .order_by(dbm.Participant.joined_at, dbm.Participant.id)
                )
            ).all()
            successor = next(
                (
                    p
                    for p in candidates
                    if not self.presence
                    or self.presence(p.id, p.connection_generation)[0] == "online"
                ),
                None,
            )
            room.host_participant_id = successor.id if successor else None
            if successor:
                successor.role = "host"
            else:
                room.empty_since = datetime.now(UTC) if not candidates else None
            db.add(
                dbm.Outbox(
                    room_id=room.id,
                    revision=0,
                    event_type="host.changed",
                    payload={"participantId": str(successor.id) if successor else None},
                )
            )
        room.presence_seq += 1
        await db.flush()
        await self.emit_snapshot(db, room)

    async def close(
        self, db: AsyncSession, room: dbm.Room, expected_revision: int
    ) -> wire.Snapshot:
        state = await db.get(dbm.PlaybackState, room.id)
        assert state is not None
        if room.status == "closed":
            return await self.snapshot(db, room)
        self.active(room)
        if state.playback_revision != expected_revision:
            raise DomainError(
                "CONFLICT",
                "Состояние комнаты изменилось",
                details={
                    "snapshot": (await self.snapshot(db, room)).model_dump(
                        mode="json", by_alias=True
                    )
                },
            )
        from app.domain.playback import position_at, promote

        now = datetime.now(UTC)
        now_ms = self.clock.now_ms() if self.clock else milliseconds(now)
        promote(state, now_ms)
        if state.status == "playing":
            state.position_ms = position_at(state, now_ms)
            state.status = "paused" if state.position_ms < state.duration_ms else "ended"
        state.anchor_server_time_ms = now_ms
        state.pending_transition = None
        state.playback_revision += 1
        room.status = "closed"
        room.closed_at = now
        await db.flush()
        await self.emit_snapshot(db, room)
        db.add(
            dbm.Outbox(
                room_id=room.id,
                revision=state.playback_revision,
                event_type="room.closed",
                payload={"reason": "closedByHost"},
            )
        )
        return await self.snapshot(db, room)
