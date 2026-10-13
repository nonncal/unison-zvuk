import asyncio
import hashlib
import shutil
from datetime import UTC, datetime
from pathlib import Path
from uuid import NAMESPACE_URL, UUID, uuid5

from botocore.exceptions import BotoCoreError, ClientError
from celery import Task

from app.config import load_settings
from app.db import models as dbm
from app.domain.media import Media
from app.domain.rooms import Rooms
from app.resources import Resources
from app.services.media_jobs import MediaFailed, read_file, submit, wait_for_result
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


async def mark_failed(resources: Resources, upload_id: UUID, code: str) -> None:
    settings = load_settings()
    service = Media(Rooms(settings, Security(settings)), Storage(resources))
    async with resources.sessions.begin() as db:
        upload = await db.get(dbm.Upload, upload_id)
        if upload is None:
            return
        await service.rooms.room(db, upload.room_id)
        await db.refresh(upload)
        if upload.status != "processing":
            return
        track = await db.get(dbm.Track, upload.track_id)
        assert track is not None
        upload.status = "failed"
        track.status = "failed"
        track.error_code = code
        await db.flush()
        await service.emit_track(db, track)


async def process(upload_id: UUID, job_id: UUID, *, final_attempt: bool = False) -> None:
    settings = load_settings()
    resources = Resources(settings)
    service = Media(Rooms(settings, Security(settings)), Storage(resources))
    directory: Path | None = None
    try:
        async with resources.sessions() as db:
            upload = await db.get(dbm.Upload, upload_id)
            if upload is None or upload.status != "processing" or upload.job_id != job_id:
                return
            room = await db.get(dbm.Room, upload.room_id)
            if room is None or room.status != "active" or room.expires_at <= datetime.now(UTC):
                await mark_failed(resources, upload_id, "ROOM_CLOSED")
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
            await mark_failed(resources, upload_id, "CHECKSUM_MISMATCH")
            return
        directory = submit(settings.jobs_dir, job_id, source, content_type)
        result = await asyncio.to_thread(wait_for_result, directory)
        if isinstance(result, MediaFailed):
            await mark_failed(resources, upload_id, result.error_code)
            return
        normalized = read_file(directory / "out" / "normalized.mp3", 100 * 1024 * 1024)
        media_digest = hashlib.sha256(normalized).hexdigest()
        output_key = f"rooms/{upload.room_id}/media/{upload_id}/{media_digest}.mp3"
        await asyncio.to_thread(publish, resources, output_key, normalized)
        async with resources.sessions.begin() as db:
            room = await service.rooms.room(db, upload.room_id)
            current = await db.get(dbm.Upload, upload_id)
            if current is None or current.status != "processing" or current.job_id != job_id:
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
            await db.flush()
            await service.emit_track(db, track)
    except (BotoCoreError, ClientError):
        if final_attempt:
            await mark_failed(resources, upload_id, "MEDIA_UNAVAILABLE")
        else:
            raise
    except ValueError:
        await mark_failed(resources, upload_id, "MEDIA_INVALID")
    finally:
        if directory is not None and (directory / "result.json").exists():
            shutil.rmtree(directory)
        await resources.close()


def process_upload(task: Task, upload_id: str, job_id: str) -> None:
    parsed_upload, parsed_job = UUID(upload_id), UUID(job_id)
    try:
        asyncio.run(process(parsed_upload, parsed_job, final_attempt=task.request.retries >= 2))
    except (BotoCoreError, ClientError) as error:
        raise task.retry(
            exc=RuntimeError("Storage temporarily unavailable"),
            countdown=2 ** (task.request.retries + 1),
            max_retries=2,
        ) from error


process_upload_task = celery_app.task(name="unison.audio.process", bind=True, max_retries=2)(
    process_upload
)
