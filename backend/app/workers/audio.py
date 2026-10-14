import asyncio
import hashlib
import shutil
from datetime import UTC, datetime
from pathlib import Path
from uuid import NAMESPACE_URL, UUID, uuid5

from botocore.exceptions import BotoCoreError, ClientError
from celery import Task
from celery.exceptions import SoftTimeLimitExceeded
from sqlalchemy.exc import DBAPIError, OperationalError
from sqlalchemy.exc import TimeoutError as DatabaseTimeout

from app.config import Settings, load_settings
from app.db import models as dbm
from app.domain.media import Media
from app.domain.rooms import Rooms
from app.resources import Resources
from app.services.media_jobs import MediaFailed, read_file, submit, wait_for_result
from app.services.processing import Processing
from app.services.security import Security
from app.services.storage import Storage
from app.workers.celery_app import celery_app


def download(resources: Resources, key: str, expected: int) -> bytes:
    response = resources.storage.get_object(Bucket=resources.bucket, Key=key)
    stream = response["Body"]
    result = bytearray()
    try:
        while chunk := stream.read(1024 * 1024):
            if len(result) + len(chunk) > min(expected, 50 * 1024 * 1024):
                raise ValueError("Source size mismatch")
            result.extend(chunk)
    finally:
        stream.close()
    if len(result) != expected:
        raise ValueError("Source size mismatch")
    return bytes(result)


def publish(resources: Resources, key: str, data: bytes) -> None:
    try:
        resources.storage.put_object(
            Bucket=resources.bucket,
            Key=key,
            Body=data,
            ContentType="audio/mpeg",
            IfNoneMatch="*",
            CacheControl="private, max-age=300",
        )
    except ClientError as error:
        if error.response.get("ResponseMetadata", {}).get("HTTPStatusCode") != 412:
            raise
        old = download(resources, key, len(data))
        if hashlib.sha256(old).digest() != hashlib.sha256(data).digest():
            raise ValueError("Immutable asset mismatch") from error


async def process(upload_id: UUID, job_id: UUID, *, final_attempt: bool = False) -> None:
    settings = load_settings()
    resources = Resources(settings)
    try:
        await process_with_resources(
            resources, settings, upload_id, job_id, final_attempt=final_attempt
        )
    finally:
        await resources.close()


async def process_with_resources(
    resources: Resources,
    settings: Settings,
    upload_id: UUID,
    job_id: UUID,
    *,
    final_attempt: bool = False,
) -> None:
    service = Media(Rooms(settings, Security(settings)), Storage(resources))
    processing = Processing(resources, settings)
    claimed = await processing.claim(upload_id, job_id)
    if claimed is None:
        resources.metrics.worker_result("duplicate")
        return
    upload, attempt_id = claimed
    directory: Path | None = None
    retain_job = False
    try:
        async with resources.sessions() as db:
            room = await db.get(dbm.Room, upload.room_id)
            if room is None or room.status != "active" or room.expires_at <= datetime.now(UTC):
                await processing.fail(upload_id, attempt_id, "ROOM_CLOSED")
                return
            key, size, checksum, content_type = (
                upload.object_key,
                upload.actual_size,
                upload.complete_checksum,
                upload.content_type,
            )
        assert size is not None
        source = await asyncio.to_thread(download, resources, key, size)
        source_digest = hashlib.sha256(source).hexdigest()
        if checksum and checksum != source_digest:
            await processing.fail(upload_id, attempt_id, "CHECKSUM_MISMATCH")
            return
        directory = submit(settings.jobs_dir, job_id, source, content_type)
        result = await asyncio.to_thread(wait_for_result, directory)
        if isinstance(result, MediaFailed):
            await processing.fail(upload_id, attempt_id, result.error_code)
            return
        normalized = read_file(directory / "out" / "normalized.mp3", 100 * 1024 * 1024)
        media_digest = hashlib.sha256(normalized).hexdigest()
        output_key = f"rooms/{upload.room_id}/media/{upload_id}/{media_digest}.mp3"
        await asyncio.to_thread(publish, resources, output_key, normalized)
        async with resources.sessions.begin() as db:
            room = await service.rooms.room(db, upload.room_id)
            current = await db.get(dbm.Upload, upload_id)
            if (
                current is None
                or current.status != "processing"
                or current.job_id != job_id
                or current.processing_attempt_id != attempt_id
            ):
                return
            track = await db.get(dbm.Track, current.track_id)
            assert track is not None
            if room.status != "active" or room.expires_at <= datetime.now(UTC):
                current.status = "failed"
                track.status = "failed"
                track.error_code = "ROOM_CLOSED"
                await db.flush()
                await service.emit_track(db, track)
                return
            source_id = uuid5(NAMESPACE_URL, f"unison:source:{upload_id}")
            media_id = uuid5(NAMESPACE_URL, f"unison:playback:{upload_id}:{media_digest}")
            source_asset = await db.get(dbm.Asset, source_id)
            if source_asset is None:
                db.add(
                    dbm.Asset(
                        id=source_id,
                        object_key=key,
                        checksum=source_digest,
                        content_type=content_type,
                        size_bytes=len(source),
                        media_version=source_digest,
                    )
                )
            media_asset = await db.get(dbm.Asset, media_id)
            if media_asset is None:
                db.add(
                    dbm.Asset(
                        id=media_id,
                        object_key=output_key,
                        checksum=media_digest,
                        content_type="audio/mpeg",
                        size_bytes=len(normalized),
                        media_version=media_digest,
                    )
                )
            await db.flush()
            track.source_asset_id = source_id
            track.playback_asset_id = media_id
            track.duration_ms = result.duration_ms
            track.title = result.title or track.title
            track.artist = result.artist
            track.status = "ready"
            track.error_code = None
            current.status = "ready"
            current.processing_started_at = None
            current.processing_attempt_id = None
            await db.flush()
            await service.emit_track(db, track)
        resources.metrics.worker_result("ready")
    except (
        BotoCoreError,
        ClientError,
        DBAPIError,
        DatabaseTimeout,
        TimeoutError,
        ConnectionError,
    ) as error:
        resources.metrics.worker_result("retry")
        retain_job = True
        if isinstance(error, DBAPIError) and not transient_database_error(error):
            await processing.fail(upload_id, attempt_id, "PROCESSING_UNAVAILABLE")
            raise RuntimeError("Media database operation failed") from None
        if final_attempt or upload.processing_attempts >= 3:
            await processing.fail(upload_id, attempt_id, "PROCESSING_UNAVAILABLE")
            retain_job = False
        else:
            try:
                await processing.release(upload_id, attempt_id)
            except (DBAPIError, DatabaseTimeout, TimeoutError, ConnectionError):
                pass
            raise
    except SoftTimeLimitExceeded:
        resources.metrics.worker_result("interrupted")
        await processing.fail(upload_id, attempt_id, "PROCESSING_TIMEOUT")
    except ValueError:
        await processing.fail(upload_id, attempt_id, "MEDIA_INVALID")
    finally:
        if not retain_job and directory is not None and (directory / "result.json").exists():
            shutil.rmtree(directory)


def transient_database_error(error: DBAPIError) -> bool:
    return (
        isinstance(error, OperationalError)
        or error.connection_invalidated
        or getattr(error.orig, "sqlstate", None)
        in {"40001", "40P01", "57P01", "57P02", "57P03", "53300"}
    )


async def interrupted(upload_id: UUID, job_id: UUID) -> None:
    settings = load_settings()
    resources = Resources(settings)
    try:
        async with resources.sessions() as db:
            upload = await db.get(dbm.Upload, upload_id)
            attempt_id = (
                upload.processing_attempt_id if upload and upload.job_id == job_id else None
            )
        if attempt_id:
            await Processing(resources, settings).fail(upload_id, attempt_id, "PROCESSING_TIMEOUT")
    finally:
        await resources.close()


def process_upload(task: Task, upload_id: str, job_id: str) -> None:
    parsed_upload, parsed_job = UUID(upload_id), UUID(job_id)
    try:
        asyncio.run(process(parsed_upload, parsed_job, final_attempt=task.request.retries >= 2))
    except SoftTimeLimitExceeded:
        try:
            asyncio.run(interrupted(parsed_upload, parsed_job))
        except (DBAPIError, DatabaseTimeout, TimeoutError, ConnectionError):
            pass
    except (
        BotoCoreError,
        ClientError,
        DBAPIError,
        DatabaseTimeout,
        TimeoutError,
        ConnectionError,
    ) as error:
        if isinstance(error, DBAPIError) and not transient_database_error(error):
            raise RuntimeError("Media database operation failed") from None
        raise task.retry(
            exc=RuntimeError("Media processing temporarily unavailable"),
            countdown=2 ** (task.request.retries + 1),
            max_retries=2,
        ) from None


process_upload_task = celery_app.task(name="unison.audio.process", bind=True, max_retries=2)(
    process_upload
)
