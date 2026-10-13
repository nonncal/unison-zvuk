from datetime import UTC, datetime, timedelta
from uuid import UUID, uuid4

import pytest
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker

from app.db.models import (
    CommandReceipt,
    HttpReceipt,
    Outbox,
    Participant,
    PlaybackState,
    Room,
    Session,
)

pytestmark = pytest.mark.integration


async def seed_room(db: AsyncSession) -> tuple[UUID, UUID, UUID]:
    room_id, host_id, session_id = uuid4(), uuid4(), uuid4()
    expiry = datetime.now(UTC) + timedelta(hours=24)
    db.add(Session(id=session_id, token_hash=uuid4().hex, csrf_hash="c" * 64, expires_at=expiry))
    await db.flush()
    db.add(
        Room(
            id=room_id,
            title="Вместе",
            host_participant_id=None,
            invite_token_hash=uuid4().hex,
            invite_token_encrypted="encrypted",
            expires_at=expiry,
        )
    )
    await db.flush()
    db.add(
        Participant(
            id=host_id, room_id=room_id, session_id=session_id, display_name="Кирилл", role="host"
        )
    )
    await db.flush()
    room = await db.get(Room, room_id)
    assert room is not None
    room.host_participant_id = host_id
    db.add(PlaybackState(room_id=room_id, anchor_server_time_ms=1000))
    await db.flush()
    return room_id, host_id, session_id


async def add_guest(
    db: AsyncSession, room_id: UUID, session_id: UUID | None = None, role: str = "listener"
) -> UUID:
    if session_id is None:
        session_id = uuid4()
        db.add(
            Session(
                id=session_id,
                token_hash=uuid4().hex,
                csrf_hash="c" * 64,
                expires_at=datetime.now(UTC) + timedelta(hours=24),
            )
        )
        await db.flush()
    db.add(Participant(room_id=room_id, session_id=session_id, display_name="Аня", role=role))
    await db.flush()
    return session_id


async def test_unique_member_host_and_capacity(database: AsyncEngine) -> None:
    sessions = async_sessionmaker(database, expire_on_commit=False)
    async with sessions.begin() as db:
        room_id, host_id, session_id = await seed_room(db)
    with pytest.raises(IntegrityError):
        async with sessions.begin() as db:
            await add_guest(db, room_id, session_id)
    with pytest.raises(IntegrityError):
        async with sessions.begin() as db:
            await add_guest(db, room_id, role="host")
    async with sessions.begin() as db:
        await add_guest(db, room_id)
    with pytest.raises(IntegrityError):
        async with sessions.begin() as db:
            await add_guest(db, room_id)
    with pytest.raises(IntegrityError):
        async with sessions.begin() as db:
            room = await db.get(Room, room_id)
            assert room is not None
            room.host_participant_id = None
    async with sessions() as db:
        assert await db.scalar(select(func.count()).select_from(Participant)) == 2
        room = await db.get(Room, room_id)
        assert room is not None and room.host_participant_id == host_id


async def test_state_receipt_outbox_roll_back_together(database: AsyncEngine) -> None:
    sessions = async_sessionmaker(database, expire_on_commit=False)
    async with sessions.begin() as db:
        room_id, host_id, _ = await seed_room(db)
    request_id = uuid4()
    with pytest.raises(RuntimeError, match="simulated transaction failure"):
        async with sessions.begin() as db:
            state = await db.get(PlaybackState, room_id)
            assert state is not None
            state.playback_revision = 1
            db.add(
                CommandReceipt(
                    room_id=room_id,
                    participant_id=host_id,
                    request_id=request_id,
                    payload_hash="a" * 64,
                    response={"acceptedPlaybackRevision": 1},
                    expires_at=datetime.now(UTC) + timedelta(minutes=10),
                )
            )
            db.add(Outbox(room_id=room_id, revision=1, event_type="playback.state", payload={}))
            await db.flush()
            raise RuntimeError("simulated transaction failure")
    async with sessions() as db:
        state = await db.get(PlaybackState, room_id)
        assert state is not None and state.playback_revision == 0
        assert await db.scalar(select(func.count()).select_from(CommandReceipt)) == 0
        assert await db.scalar(select(func.count()).select_from(Outbox)) == 0


async def test_migrations_reversible_and_match_models(database: AsyncEngine) -> None:
    from alembic import command
    from alembic.config import Config
    from sqlalchemy.engine import Connection

    def validate(connection: Connection) -> None:
        config = Config("alembic.ini")
        config.attributes["connection"] = connection
        command.check(config)
        command.downgrade(config, "base")
        command.upgrade(config, "head")
        command.check(config)

    async with database.begin() as connection:
        await connection.run_sync(validate)
    async with async_sessionmaker(database).begin() as db:
        await seed_room(db)
        assert await db.scalar(select(func.count()).select_from(HttpReceipt)) == 0
