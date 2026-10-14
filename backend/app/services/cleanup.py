from __future__ import annotations

import asyncio
import logging
import shutil
from datetime import UTC, datetime, timedelta
from typing import TYPE_CHECKING
from uuid import UUID

if TYPE_CHECKING:
    from mypy_boto3_s3.type_defs import ListObjectsV2RequestTypeDef

from sqlalchemy import delete, or_, select

from app.config import Settings
from app.db import models as dbm
from app.domain.media import Media
from app.domain.rooms import Rooms
from app.resources import Resources
from app.services.processing import LEASE_SECONDS, Processing
from app.services.security import Security
from app.services.storage import Storage


class Cleanup:
    def __init__(self, resources: Resources, settings: Settings) -> None:
        self.resources = resources
        self.settings = settings
        self.media = Media(Rooms(settings, Security(settings)), Storage(resources))
        self.processing = Processing(resources, settings)
        self.task: asyncio.Task[None] | None = None

    async def delete_object(self, key: str) -> None:
        await asyncio.to_thread(
            self.resources.storage.delete_object, Bucket=self.resources.bucket, Key=key
        )

    async def sweep(self, now: datetime | None = None) -> None:
        now = now or datetime.now(UTC)
        await self.processing.recover(now)
        abandoned = now - timedelta(hours=1)
        async with self.resources.sessions() as db:
            ids = (
                await db.scalars(
                    select(dbm.Upload.id).where(
                        dbm.Upload.purged_at.is_(None),
                        dbm.Upload.status != "ready",
                        or_(dbm.Upload.created_at <= abandoned, dbm.Upload.expires_at <= now),
                    )
                )
            ).all()
        for upload_id in ids:
            async with self.resources.sessions.begin() as db:
                upload = await db.get(dbm.Upload, upload_id)
                if upload is None:
                    continue
                await self.media.rooms.room(db, upload.room_id)
                await db.refresh(upload)
                eligible = (
                    upload.status in {"failed", "cancelled"} and upload.expires_at <= now
                ) or (
                    upload.status in {"reserved", "processing"} and upload.created_at <= abandoned
                )
                if not eligible or upload.purged_at is not None:
                    continue
                await self.delete_object(upload.object_key)
                upload.purged_at = now
                if upload.status in {"reserved", "processing"}:
                    upload.status = "failed"
                    track = await db.get(dbm.Track, upload.track_id)
                    assert track is not None
                    track.status = "failed"
                    track.error_code = "UPLOAD_EXPIRED"
                    await db.flush()
                    await self.media.emit_track(db, track)
        cutoff = now - timedelta(hours=24)
        async with self.resources.sessions() as db:
            rooms = (await db.scalars(select(dbm.Room).where(dbm.Room.status != "active"))).all()
            expired = [
                room.id
                for room in rooms
                if min(room.closed_at or room.expires_at, room.expires_at) <= cutoff
            ]
        for room_id in expired:
            async with self.resources.sessions.begin() as db:
                room = await self.media.rooms.room(db, room_id)
                if (
                    room.status == "active"
                    or min(room.closed_at or room.expires_at, room.expires_at) > cutoff
                ):
                    continue
                prefix = f"rooms/{room.id}/"
                protected = set(
                    (
                        await db.scalars(
                            select(dbm.Asset.object_key)
                            .join(
                                dbm.Track,
                                or_(
                                    dbm.Track.source_asset_id == dbm.Asset.id,
                                    dbm.Track.playback_asset_id == dbm.Asset.id,
                                ),
                            )
                            .where(dbm.Track.scope == "catalog")
                        )
                    ).all()
                )
                token: str | None = None
                while True:
                    params: ListObjectsV2RequestTypeDef = {
                        "Bucket": self.resources.bucket,
                        "Prefix": prefix,
                    }
                    if token:
                        params["ContinuationToken"] = token
                    page = await asyncio.to_thread(self.resources.storage.list_objects_v2, **params)
                    for obj in page.get("Contents", []):
                        if obj["Key"] not in protected:
                            await self.delete_object(obj["Key"])
                    token = page.get("NextContinuationToken")
                    if not token:
                        break
                await db.execute(
                    delete(dbm.PlaybackState).where(dbm.PlaybackState.room_id == room.id)
                )
                await db.execute(delete(dbm.Upload).where(dbm.Upload.room_id == room.id))
                await db.execute(delete(dbm.Track).where(dbm.Track.room_id == room.id))
                await db.delete(room)
                await db.flush()
                orphan = (
                    select(dbm.Track.id)
                    .where(
                        or_(
                            dbm.Track.source_asset_id == dbm.Asset.id,
                            dbm.Track.playback_asset_id == dbm.Asset.id,
                        )
                    )
                    .exists()
                )
                await db.execute(
                    delete(dbm.Asset).where(dbm.Asset.object_key.startswith(prefix), ~orphan)
                )
        async with self.resources.sessions.begin() as db:
            await db.execute(delete(dbm.CommandReceipt).where(dbm.CommandReceipt.expires_at <= now))
            await db.execute(delete(dbm.HttpReceipt).where(dbm.HttpReceipt.expires_at <= now))
            referenced = (
                select(dbm.Participant.id)
                .where(dbm.Participant.session_id == dbm.Session.id)
                .exists()
            )
            await db.execute(delete(dbm.Session).where(dbm.Session.expires_at <= now, ~referenced))
        await self.clean_orphan_media(now)

    async def clean_orphan_media(self, now: datetime) -> None:
        cutoff = now - timedelta(hours=1)
        token: str | None = None
        while True:
            params: ListObjectsV2RequestTypeDef = {
                "Bucket": self.resources.bucket,
                "Prefix": "rooms/",
            }
            if token:
                params["ContinuationToken"] = token
            page = await asyncio.to_thread(self.resources.storage.list_objects_v2, **params)
            for obj in page.get("Contents", []):
                parts = obj["Key"].split("/")
                if len(parts) != 5 or parts[2] != "media" or obj["LastModified"] > cutoff:
                    continue
                try:
                    room_id, upload_id = UUID(parts[1]), UUID(parts[3])
                except ValueError:
                    continue
                async with self.resources.sessions.begin() as db:
                    room = await db.scalar(
                        select(dbm.Room).where(dbm.Room.id == room_id).with_for_update()
                    )
                    upload = await db.get(dbm.Upload, upload_id)
                    if (
                        room is not None
                        and upload is not None
                        and upload.room_id == room_id
                        and upload.status == "processing"
                        and upload.processing_started_at is not None
                        and upload.processing_started_at > now - timedelta(seconds=LEASE_SECONDS)
                    ):
                        continue
                    referenced = await db.scalar(
                        select(dbm.Track.id)
                        .join(
                            dbm.Asset,
                            or_(
                                dbm.Track.source_asset_id == dbm.Asset.id,
                                dbm.Track.playback_asset_id == dbm.Asset.id,
                            ),
                        )
                        .where(dbm.Asset.object_key == obj["Key"])
                        .limit(1)
                    )
                    if referenced is not None:
                        continue
                    await self.delete_object(obj["Key"])
                    await db.execute(delete(dbm.Asset).where(dbm.Asset.object_key == obj["Key"]))
            token = page.get("NextContinuationToken")
            if not token:
                break

    def clean_jobs(self) -> None:
        root = self.settings.jobs_dir
        if not root.is_dir():
            return
        cutoff = datetime.now(UTC).timestamp() - 3600
        for directory in root.iterdir():
            if directory.is_symlink() or not directory.is_dir():
                continue
            try:
                UUID(directory.name)
                request = directory / "request.json"
                modified = (
                    (request if request.exists() else directory)
                    .stat(follow_symlinks=False)
                    .st_mtime
                )
            except (ValueError, FileNotFoundError):
                continue
            if modified <= cutoff:
                shutil.rmtree(directory)

    def start(self) -> None:
        self.task = asyncio.create_task(self.run(), name="media-cleanup")

    async def stop(self) -> None:
        if self.task:
            self.task.cancel()
            await asyncio.gather(self.task, return_exceptions=True)
            self.task = None

    async def run(self) -> None:
        while True:
            try:
                await self.sweep()
                await asyncio.to_thread(self.clean_jobs)
            except Exception as error:
                logging.getLogger("unison").warning(
                    "media_cleanup_retry", extra={"exceptionType": type(error).__name__}
                )
            await asyncio.sleep(60)
