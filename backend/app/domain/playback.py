from datetime import UTC, datetime, timedelta
from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.contracts import ws
from app.db import models as dbm
from app.domain.errors import DomainError
from app.domain.playlist import contents, editor, step
from app.domain.rooms import Rooms
from app.services.clock import Clock
from app.services.security import payload_hash


def position_at(state: dbm.PlaybackState, now_ms: int) -> int:
    elapsed = max(0, now_ms - state.anchor_server_time_ms) if state.status == "playing" else 0
    return min(state.duration_ms, max(0, state.position_ms + elapsed))


def promote(state: dbm.PlaybackState, now_ms: int) -> bool:
    pending = state.pending_transition
    if pending is None or pending["effectiveAtServerTimeMs"] > now_ms:
        return False
    state.status = pending["nextStatus"]
    state.position_ms = pending["positionMs"]
    state.anchor_server_time_ms = pending["effectiveAtServerTimeMs"]
    state.pending_transition = None
    return True


def lead_time(recent_rtts: list[int]) -> int:
    return min(1500, max(500, 2 * max(recent_rtts) + 250)) if recent_rtts else 750


class Playback:
    def __init__(self, rooms: Rooms, clock: Clock) -> None:
        self.rooms = rooms
        self.clock = clock

    async def event(self, db: AsyncSession, room: dbm.Room, state: dbm.PlaybackState) -> None:
        snapshot = await self.rooms.snapshot(db, room)
        db.add(
            dbm.Outbox(
                room_id=room.id,
                revision=state.playback_revision,
                event_type="playback.state",
                payload=snapshot.playback.model_dump(mode="json", by_alias=True),
            )
        )

    async def advance(
        self, db: AsyncSession, room: dbm.Room, state: dbm.PlaybackState, now_ms: int
    ) -> None:
        changed = promote(state, now_ms)
        if (
            state.status == "playing"
            and state.pending_transition is None
            and position_at(state, now_ms) >= state.duration_ms
        ):
            if not await step(db, room, state, now_ms, automatic=True):
                state.anchor_server_time_ms += max(0, state.duration_ms - state.position_ms)
                state.position_ms = state.duration_ms
                state.status = "ended"
            state.playback_revision += 1
            changed = True
        if changed:
            await db.flush()
            await self.event(db, room, state)
            await self.rooms.emit_snapshot(db, room)

    async def mutate(
        self,
        db: AsyncSession,
        room_id: UUID,
        actor_id: UUID,
        generation: int,
        command: ws.SelectTrack | ws.Play | ws.Pause | ws.Seek,
        ready: bool,
        recent_rtts: list[int],
    ) -> dict[str, Any]:
        room = await self.rooms.room(db, room_id)
        actor = await db.get(dbm.Participant, actor_id)
        if (
            actor is None
            or actor.room_id != room.id
            or actor.left_at is not None
            or (actor.connection_generation != generation)
        ):
            raise DomainError("FORBIDDEN", "Подключение больше не действует", 403)
        state = await db.get(dbm.PlaybackState, room.id)
        assert state is not None
        fingerprint = payload_hash(command.model_dump(mode="json", by_alias=True))
        key = (room.id, actor.id, command.request_id)
        receipt = await db.get(dbm.CommandReceipt, key)
        now = datetime.now(UTC)
        if receipt is not None and receipt.expires_at > now:
            if receipt.payload_hash != fingerprint:
                raise DomainError(
                    "DUPLICATE_REQUEST_MISMATCH", "ID уже использован для другой команды"
                )
            return receipt.response
        if receipt is not None:
            await db.delete(receipt)
            await db.flush()
        self.rooms.active(room)
        editor(room, actor)
        now_ms = self.clock.now_ms()
        await self.advance(db, room, state, now_ms)
        if command.expected_playback_revision != state.playback_revision:
            raise DomainError(
                "CONFLICT",
                "Состояние плеера изменилось",
                details={
                    "snapshot": (await self.rooms.snapshot(db, room)).model_dump(
                        mode="json", by_alias=True
                    )
                },
            )
        if state.pending_transition is not None:
            raise DomainError("PENDING_TRANSITION", "Дождитесь применения предыдущей команды")
        effective: int | None = None
        if isinstance(command, ws.SelectTrack):
            track = await db.scalar(
                select(dbm.Track).where(
                    dbm.Track.id == command.payload.track_id,
                    (dbm.Track.scope == "catalog") | (dbm.Track.room_id == room.id),
                )
            )
            if track is None:
                raise DomainError("TRACK_NOT_FOUND", "Трек недоступен", 404)
            asset = (
                await db.get(dbm.Asset, track.playback_asset_id)
                if track.playback_asset_id
                else None
            )
            if track.status != "ready" or asset is None or not track.duration_ms:
                raise DomainError("TRACK_NOT_READY", "Трек ещё не готов")
            state.track_id = track.id
            state.media_version = asset.media_version
            state.duration_ms = track.duration_ms
            state.status = "paused"
            state.position_ms = 0
            state.anchor_server_time_ms = now_ms
            data = contents(room)
            if str(track.id) not in data["trackIds"]:
                data["trackIds"] = (data["trackIds"] + [str(track.id)])[-100:]
                room.playlist = data
        else:
            if state.status == "empty":
                raise DomainError("TRACK_NOT_READY", "Сначала выберите трек")
            effective = now_ms + lead_time(recent_rtts)
            position = position_at(state, effective)
            next_status = state.status
            if isinstance(command, ws.Play):
                if not ready and not command.payload.allow_not_ready:
                    raise DomainError("NOT_ALL_READY", "Участники ещё не готовы к запуску")
                position = 0 if state.status == "ended" else position_at(state, effective)
                next_status = "playing"
            elif isinstance(command, ws.Pause):
                next_status = "ended" if position == state.duration_ms else "paused"
            elif isinstance(command, ws.Seek):
                position = command.payload.position_ms
                if position > state.duration_ms:
                    raise DomainError(
                        "INVALID_POSITION", "Позиция выходит за длительность трека", 422
                    )
                next_status = (
                    "ended"
                    if position == state.duration_ms
                    else ("playing" if state.status == "playing" else "paused")
                )
            state.pending_transition = {
                "type": command.type.removeprefix("playback."),
                "nextStatus": next_status,
                "positionMs": position,
                "effectiveAtServerTimeMs": effective,
                "trackId": str(state.track_id),
                "mediaVersion": state.media_version,
            }
        state.playback_revision += 1
        await db.flush()
        response = ws.AckPayload(
            request_id=command.request_id,
            accepted_playback_revision=state.playback_revision,
            effective_at_server_time_ms=effective,
        ).model_dump(mode="json", by_alias=True)
        db.add(
            dbm.CommandReceipt(
                room_id=room.id,
                participant_id=actor.id,
                request_id=command.request_id,
                payload_hash=fingerprint,
                response=response,
                expires_at=now + timedelta(seconds=self.rooms.settings.receipt_ttl_seconds),
            )
        )
        await self.event(db, room, state)
        return response

    async def recover(
        self, db: AsyncSession, room: dbm.Room, old_now_ms: int | None = None
    ) -> None:
        state = await db.get(dbm.PlaybackState, room.id)
        assert state is not None
        now_ms = self.clock.now_ms()
        timeline_now = now_ms if old_now_ms is None else old_now_ms
        promote(state, timeline_now)
        state.position_ms = position_at(state, timeline_now)
        if state.status == "playing":
            state.status = "paused" if state.position_ms < state.duration_ms else "ended"
        state.pending_transition = None
        state.anchor_server_time_ms = now_ms
        state.epoch = self.clock.epoch
        state.playback_revision += 1
        await db.flush()
        await self.rooms.emit_snapshot(db, room)
