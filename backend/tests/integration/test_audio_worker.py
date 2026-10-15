import asyncio
from datetime import UTC, datetime, timedelta
from pathlib import Path
from uuid import UUID, uuid4

import pytest
from celery.exceptions import SoftTimeLimitExceeded
from sqlalchemy import func, select
from sqlalchemy.exc import OperationalError
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker

from app.config import Settings
from app.db.models import Asset, Outbox, Track, Upload
from app.domain.media import Media
from app.services.media_jobs import MediaReady, atomic_json
from app.services.processing import Processing
from app.services.storage import Storage
from app.workers import audio
from tests.integration.test_database import seed_room
from tests.integration.test_storage import storage as storage

pytestmark = pytest.mark.integration


async def seed_processing(database: AsyncEngine, storage: Storage) -> tuple[UUID, UUID]:
    resources = storage.resources
    resources.sessions = async_sessionmaker(database, expire_on_commit=False)
    async with resources.sessions.begin() as db:
        room_id, host_id, _ = await seed_room(db)
        track = Track(scope="room", room_id=room_id, title="Тест", artist="", status="processing")
        db.add(track)
        await db.flush()
        upload_id, job_id = uuid4(), uuid4()
        upload = Upload(
            id=upload_id,
            job_id=job_id,
            room_id=room_id,
            owner_participant_id=host_id,
            track_id=track.id,
            status="processing",
            object_key=f"rooms/{room_id}/sources/{upload_id}",
            expected_size=4,
            actual_size=4,
            content_type="audio/wav",
            expires_at=datetime.now(UTC) + timedelta(minutes=10),
        )
        db.add(upload)
        await asyncio.to_thread(
            resources.storage.put_object,
            Bucket=resources.bucket,
            Key=upload.object_key,
            Body=b"wave",
            ContentType="audio/wav",
        )
    return upload_id, job_id


async def test_database_failure_after_publish_reuses_one_asset(
    database: AsyncEngine,
    storage: Storage,
    settings: Settings,
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    upload_id, job_id = await seed_processing(database, storage)
    resources = storage.resources
    config = settings.model_copy(update={"jobs_dir": tmp_path})

    async def ready(directory: Path) -> MediaReady:
        await asyncio.to_thread(
            (directory / "out" / "normalized.mp3").write_bytes, b"normalized audio"
        )
        result = MediaReady(duration_ms=2000, title="Название из тегов", artist="Автор")
        atomic_json(directory / "result.json", result.model_dump(mode="json", by_alias=True))
        return result

    original_emit = Media.emit_track
    failures = 0

    async def faulty_emit(self: Media, db: AsyncSession, track: Track) -> None:
        nonlocal failures
        if failures == 0:
            failures += 1
            raise OperationalError("", {}, ConnectionError("database unavailable"))
        await original_emit(self, db, track)

    monkeypatch.setattr(audio, "wait_for_result_async", ready)
    monkeypatch.setattr(Media, "emit_track", faulty_emit)
    with pytest.raises(OperationalError):
        await audio.process_with_resources(resources, config, upload_id, job_id)
    async with resources.sessions() as db:
        upload = await db.get(Upload, upload_id)
        assert (
            upload is not None and upload.status == "processing" and upload.processing_attempts == 1
        )
        assert await db.scalar(select(func.count()).select_from(Asset)) == 0
        assert await db.scalar(select(func.count()).select_from(Outbox)) == 0
    assert (tmp_path / str(job_id) / "result.json").exists()
    await audio.process_with_resources(resources, config, upload_id, job_id)
    await audio.process_with_resources(resources, config, upload_id, job_id)
    async with resources.sessions() as db:
        upload = await db.get(Upload, upload_id)
        assert upload is not None and upload.status == "ready" and upload.processing_attempts == 2
        track = await db.get(Track, upload.track_id)
        assert track is not None and (track.title, track.artist) == ("Название из тегов", "Автор")
        # A retry and duplicate job must not keep invalidating the generated cover.
        assert track.cover_version == 1
        assert await db.scalar(select(func.count()).select_from(Asset)) == 2
        assert await db.scalar(select(func.count()).select_from(Outbox)) == 1
    listing = await asyncio.to_thread(resources.storage.list_objects_v2, Bucket=resources.bucket)
    assert len(listing.get("Contents", [])) == 2


async def test_timeout_marks_failed_and_duplicate_does_not_restart(
    database: AsyncEngine,
    storage: Storage,
    settings: Settings,
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    upload_id, job_id = await seed_processing(database, storage)

    async def timeout(directory: Path) -> MediaReady:
        raise SoftTimeLimitExceeded()

    monkeypatch.setattr(audio, "wait_for_result_async", timeout)
    config = settings.model_copy(update={"jobs_dir": tmp_path})
    await audio.process_with_resources(storage.resources, config, upload_id, job_id)
    await audio.process_with_resources(storage.resources, config, upload_id, job_id)
    async with storage.resources.sessions() as db:
        upload = await db.get(Upload, upload_id)
        assert upload is not None and upload.status == "failed" and upload.processing_attempts == 1
        track = await db.get(Track, upload.track_id)
        assert track is not None and track.error_code == "PROCESSING_TIMEOUT"
        assert await db.scalar(select(func.count()).select_from(Asset)) == 0


async def test_crashed_worker_is_requeued_twice_and_old_attempt_is_fenced(
    database: AsyncEngine, storage: Storage, settings: Settings
) -> None:
    upload_id, job_id = await seed_processing(database, storage)
    service = Processing(storage.resources, settings)
    claims = await asyncio.gather(
        service.claim(upload_id, job_id), service.claim(upload_id, job_id)
    )
    assert sum(c is not None for c in claims) == 1
    claimed = next(c for c in claims if c is not None)
    old_attempt = claimed[1]
    for index in range(3):
        async with storage.resources.sessions.begin() as db:
            upload = await db.get(Upload, upload_id)
            assert upload is not None
            upload.processing_started_at = datetime.now(UTC) - timedelta(seconds=181)
        await service.recover(datetime.now(UTC))
        await service.recover(datetime.now(UTC))
        if index < 2:
            assert await service.claim(upload_id, job_id) is not None
            await service.fail(upload_id, old_attempt, "MEDIA_INVALID")
    async with storage.resources.sessions() as db:
        upload = await db.get(Upload, upload_id)
        assert upload is not None and upload.status == "failed" and upload.processing_attempts == 3
        track = await db.get(Track, upload.track_id)
        assert track is not None and track.error_code == "PROCESSING_UNAVAILABLE"
        retries = await db.scalar(
            select(func.count()).select_from(Outbox).where(Outbox.event_type == "upload.process")
        )
        assert retries == 2
    assert await service.claim(upload_id, job_id) is None
