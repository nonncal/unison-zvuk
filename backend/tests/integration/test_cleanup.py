import asyncio
from datetime import UTC, datetime, timedelta

import pytest
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncEngine, async_sessionmaker

from app.config import Settings
from app.db.models import Asset, Room, Track, Upload
from app.services.cleanup import Cleanup
from app.services.storage import Storage
from tests.integration.test_database import seed_room
from tests.integration.test_storage import storage as storage

pytestmark = pytest.mark.integration


async def test_cleanup_keeps_catalog_and_active_assets(
    database: AsyncEngine, storage: Storage, settings: Settings
) -> None:
    resources = storage.resources
    resources.sessions = async_sessionmaker(database, expire_on_commit=False)
    sessions = resources.sessions
    async with sessions.begin() as db:
        closed_id, _, _ = await seed_room(db)
        active_id, _, _ = await seed_room(db)
        closed = await db.get(Room, closed_id)
        assert closed is not None
        closed.status = "closed"
        closed.closed_at = datetime.now(UTC) - timedelta(hours=25)
        keys = [
            "catalog/demo.mp3",
            f"rooms/{closed_id}/media/demo.mp3",
            f"rooms/{active_id}/media/demo.mp3",
        ]
        for index, key in enumerate(keys):
            await asyncio.to_thread(
                resources.storage.put_object,
                Bucket=resources.bucket,
                Key=key,
                Body=b"test",
                ContentType="audio/mpeg",
            )
            asset = Asset(
                object_key=key,
                checksum="a" * 64,
                content_type="audio/mpeg",
                size_bytes=4,
                media_version="v1",
            )
            db.add(asset)
            await db.flush()
            db.add(
                Track(
                    scope="catalog" if index == 0 else "room",
                    room_id=None if index == 0 else (closed_id if index == 1 else active_id),
                    title="Демо",
                    artist="",
                    status="ready",
                    duration_ms=1000,
                    source_asset_id=asset.id,
                    playback_asset_id=asset.id,
                )
            )
    service = Cleanup(resources, settings)
    await service.sweep()
    await service.sweep()
    async with sessions() as db:
        assert await db.get(Room, closed_id) is None
        assert await db.get(Room, active_id) is not None
        assert await db.scalar(select(func.count()).select_from(Asset)) == 2
        assert await db.scalar(select(func.count()).select_from(Track)) == 2
    listing = await asyncio.to_thread(resources.storage.list_objects_v2, Bucket=resources.bucket)
    remaining = {obj["Key"] for obj in listing.get("Contents", [])}
    assert remaining == {"catalog/demo.mp3", f"rooms/{active_id}/media/demo.mp3"}


async def test_abandoned_upload_cleanup_observes_signed_url_expiry(
    database: AsyncEngine, storage: Storage, settings: Settings
) -> None:
    resources = storage.resources
    resources.sessions = async_sessionmaker(database, expire_on_commit=False)
    async with resources.sessions.begin() as db:
        room_id, host_id, _ = await seed_room(db)
        track = Track(
            scope="room",
            room_id=room_id,
            title="Отменён",
            status="failed",
            error_code="UPLOAD_CANCELLED",
            artist="",
        )
        db.add(track)
        await db.flush()
        key = f"rooms/{room_id}/sources/test"
        upload = Upload(
            room_id=room_id,
            owner_participant_id=host_id,
            track_id=track.id,
            object_key=key,
            content_type="audio/wav",
            expected_size=4,
            status="cancelled",
            expires_at=datetime.now(UTC) + timedelta(minutes=10),
        )
        db.add(upload)
        await db.flush()
        upload_id = upload.id
        await asyncio.to_thread(
            resources.storage.put_object,
            Bucket=resources.bucket,
            Key=key,
            Body=b"test",
            ContentType="audio/wav",
        )
    service = Cleanup(resources, settings)
    await service.sweep()
    async with resources.sessions() as db:
        current = await db.get(Upload, upload_id)
        assert current is not None and current.purged_at is None
    await service.sweep(datetime.now(UTC) + timedelta(minutes=11))
    await service.sweep(datetime.now(UTC) + timedelta(minutes=11))
    async with resources.sessions() as db:
        current = await db.get(Upload, upload_id)
        assert current is not None and current.purged_at is not None
        assert await db.get(Room, room_id) is not None
