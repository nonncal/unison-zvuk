import asyncio
import json
from datetime import UTC, datetime, timedelta
from uuid import UUID, uuid4

import pytest
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker

from app.config import Settings
from app.contracts import ws
from app.db.models import Asset, CommandReceipt, Outbox, Participant, PlaybackState, Session, Track
from app.domain.errors import DomainError
from app.domain.playback import Playback, position_at
from app.domain.rooms import Rooms
from app.services.clock import Clock
from app.services.security import Security
from tests.integration.test_database import seed_room

pytestmark = pytest.mark.integration


class FixedClock(Clock):
    def __init__(self) -> None:
        super().__init__()
        self.value = 1_000_000

    def now_ms(self) -> int:
        return self.value


async def track(db: AsyncSession, room_id: UUID | None = None) -> UUID:
    asset = Asset(
        object_key="test/" + uuid4().hex,
        checksum="a" * 64,
        content_type="audio/mpeg",
        size_bytes=1024,
        media_version="test-v1",
    )
    db.add(asset)
    await db.flush()
    track = Track(
        scope="room" if room_id else "catalog",
        room_id=room_id,
        title="Звуки",
        artist="",
        duration_ms=30_000,
        playback_asset_id=asset.id,
        status="ready",
    )
    db.add(track)
    await db.flush()
    return track.id


def command(
    kind: str, revision: int, payload: dict[str, object], request_id: UUID | None = None
) -> ws.SelectTrack | ws.Play | ws.Pause | ws.Seek:
    parsed = ws.parse_command(
        json.dumps(
            {
                "v": 1,
                "type": "playback." + kind,
                "requestId": str(request_id or uuid4()),
                "expectedPlaybackRevision": revision,
                "payload": payload,
            }
        )
    )
    assert isinstance(parsed, ws.SelectTrack | ws.Play | ws.Pause | ws.Seek)
    return parsed


async def test_receipts_conflicts_and_atomic_events(
    database: AsyncEngine, settings: Settings
) -> None:
    sessions = async_sessionmaker(database, expire_on_commit=False)
    clock = FixedClock()
    service = Playback(Rooms(settings, Security(settings)), clock)
    async with sessions.begin() as db:
        room_id, host_id, _ = await seed_room(db)
        track_id = await track(db)
    selected = command("select", 0, {"trackId": str(track_id)})
    async with sessions.begin() as db:
        response = await service.mutate(db, room_id, host_id, 0, selected, True, [])
    async with sessions.begin() as db:
        assert await service.mutate(db, room_id, host_id, 0, selected, True, []) == response
    with pytest.raises(DomainError, match="DUPLICATE_REQUEST_MISMATCH"):
        async with sessions.begin() as db:
            await service.mutate(
                db,
                room_id,
                host_id,
                0,
                command("select", 0, {"trackId": str(uuid4())}, selected.request_id),
                True,
                [],
            )
    async with sessions() as db:
        state = await db.get(PlaybackState, room_id)
        assert state is not None and state.playback_revision == 1 and state.status == "paused"
        assert await db.scalar(select(func.count()).select_from(CommandReceipt)) == 1
        assert await db.scalar(select(func.count()).select_from(Outbox)) == 1

    async def select_again() -> str:
        try:
            async with sessions.begin() as db:
                await service.mutate(
                    db,
                    room_id,
                    host_id,
                    0,
                    command("select", 1, {"trackId": str(track_id)}),
                    True,
                    [],
                )
                return "accepted"
        except DomainError as error:
            return error.code

    assert sorted(await asyncio.gather(select_again(), select_again())) == ["CONFLICT", "accepted"]


async def test_pending_play_seek_pause_end_and_restart(
    database: AsyncEngine, settings: Settings
) -> None:
    sessions = async_sessionmaker(database, expire_on_commit=False)
    clock = FixedClock()
    service = Playback(Rooms(settings, Security(settings)), clock)
    async with sessions.begin() as db:
        room_id, host_id, _ = await seed_room(db)
        track_id = await track(db)
        await service.mutate(
            db, room_id, host_id, 0, command("select", 0, {"trackId": str(track_id)}), True, []
        )
    with pytest.raises(DomainError, match="NOT_ALL_READY"):
        async with sessions.begin() as db:
            await service.mutate(db, room_id, host_id, 0, command("play", 1, {}), False, [])
    async with sessions.begin() as db:
        reply = await service.mutate(db, room_id, host_id, 0, command("play", 1, {}), True, [])
        assert reply["effectiveAtServerTimeMs"] == clock.value + 750
        state = await db.get(PlaybackState, room_id)
        assert state is not None and state.status == "paused" and state.pending_transition
    with pytest.raises(DomainError, match="PENDING_TRANSITION"):
        async with sessions.begin() as db:
            await service.mutate(db, room_id, host_id, 0, command("pause", 2, {}), True, [])
    clock.value += 1000
    async with sessions.begin() as db:
        room = await service.rooms.room(db, room_id)
        state = await db.get(PlaybackState, room_id)
        assert state is not None
        await service.advance(db, room, state, clock.value)
        assert state.status == "playing" and state.playback_revision == 2
        assert position_at(state, clock.value) == 250
        await service.mutate(
            db, room_id, host_id, 0, command("seek", 2, {"positionMs": 20_000}), True, [500]
        )
    clock.value += 1500
    async with sessions.begin() as db:
        room = await service.rooms.room(db, room_id)
        state = await db.get(PlaybackState, room_id)
        assert state is not None
        await service.advance(db, room, state, clock.value)
        assert state.playback_revision == 3 and position_at(state, clock.value) == 20_250
        await service.mutate(db, room_id, host_id, 0, command("pause", 3, {}), True, [])
    clock.value += 1000
    async with sessions.begin() as db:
        room = await service.rooms.room(db, room_id)
        state = await db.get(PlaybackState, room_id)
        assert state is not None
        await service.advance(db, room, state, clock.value)
        assert state.status == "paused" and state.position_ms == 21_000
        await service.mutate(
            db, room_id, host_id, 0, command("seek", 4, {"positionMs": 30_000}), True, []
        )
    clock.value += 1000
    async with sessions.begin() as db:
        room = await service.rooms.room(db, room_id)
        state = await db.get(PlaybackState, room_id)
        assert state is not None
        await service.advance(db, room, state, clock.value)
        assert state.status == "ended" and state.position_ms == 30_000
        await service.mutate(db, room_id, host_id, 0, command("play", 5, {}), True, [])
    clock.value += 1000
    async with sessions.begin() as db:
        room = await service.rooms.room(db, room_id)
        state = await db.get(PlaybackState, room_id)
        assert state is not None
        await service.recover(db, room)
        assert state.status == "paused" and state.position_ms == 250
        assert state.epoch == clock.epoch and state.pending_transition is None


async def test_private_tracks_roles_and_old_generation_are_rejected(
    database: AsyncEngine, settings: Settings
) -> None:
    sessions = async_sessionmaker(database, expire_on_commit=False)
    service = Playback(Rooms(settings, Security(settings)), FixedClock())
    async with sessions.begin() as db:
        room_id, host_id, _ = await seed_room(db)
        other_room, _, _ = await seed_room(db)
        private_track = await track(db, other_room)
        session = Session(
            token_hash=uuid4().hex,
            csrf_hash="c" * 64,
            expires_at=datetime.now(UTC) + timedelta(hours=24),
        )
        db.add(session)
        await db.flush()
        guest = Participant(
            room_id=room_id, session_id=session.id, display_name="Аня", role="listener"
        )
        db.add(guest)
        await db.flush()
        guest_id = guest.id
    for actor_id, generation, code in [
        (host_id, 0, "TRACK_NOT_FOUND"),
        (host_id, 1, "FORBIDDEN"),
        (guest_id, 0, "FORBIDDEN"),
    ]:
        with pytest.raises(DomainError, match=code):
            async with sessions.begin() as db:
                await service.mutate(
                    db,
                    room_id,
                    actor_id,
                    generation,
                    command("select", 0, {"trackId": str(private_track)}),
                    True,
                    [],
                )
