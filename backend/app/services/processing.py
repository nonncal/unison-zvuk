from datetime import UTC, datetime, timedelta
from uuid import UUID, uuid4

from sqlalchemy import or_, select

from app.config import Settings
from app.db import models as dbm
from app.domain.media import Media
from app.domain.rooms import Rooms
from app.resources import Resources
from app.services.security import Security
from app.services.storage import Storage

LEASE_SECONDS = 180
MAX_ATTEMPTS = 3


class Processing:
    def __init__(self, resources: Resources, settings: Settings) -> None:
        self.resources = resources
        self.media = Media(Rooms(settings, Security(settings)), Storage(resources))

    async def fail(self, upload_id: UUID, attempt_id: UUID, code: str) -> None:
        async with self.resources.sessions.begin() as db:
            upload = await db.get(dbm.Upload, upload_id)
            if upload is None:
                return
            await self.media.rooms.room(db, upload.room_id)
            await db.refresh(upload)
            if upload.status != "processing" or upload.processing_attempt_id != attempt_id:
                return
            track = await db.get(dbm.Track, upload.track_id)
            assert track is not None
            upload.status = "failed"
            upload.processing_started_at = None
            upload.processing_attempt_id = None
            track.status = "failed"
            track.error_code = code
            await db.flush()
            await self.media.emit_track(db, track)
        self.resources.metrics.worker_result("failed")

    async def claim(self, upload_id: UUID, job_id: UUID) -> tuple[dbm.Upload, UUID] | None:
        now = datetime.now(UTC)
        async with self.resources.sessions.begin() as db:
            upload = await db.get(dbm.Upload, upload_id)
            if upload is None:
                return None
            await self.media.rooms.room(db, upload.room_id)
            await db.refresh(upload)
            if upload.status != "processing" or upload.job_id != job_id:
                return None
            if (
                upload.processing_attempt_id is not None
                or upload.processing_attempts >= MAX_ATTEMPTS
            ):
                return None
            attempt_id = uuid4()
            upload.processing_attempt_id = attempt_id
            upload.processing_started_at = now
            upload.processing_attempts += 1
            await db.flush()
            return upload, attempt_id

    async def release(self, upload_id: UUID, attempt_id: UUID) -> None:
        async with self.resources.sessions.begin() as db:
            upload = await db.get(dbm.Upload, upload_id)
            if upload is None:
                return
            await self.media.rooms.room(db, upload.room_id)
            await db.refresh(upload)
            if upload.status == "processing" and upload.processing_attempt_id == attempt_id:
                upload.processing_attempt_id = None

    async def recover(self, now: datetime) -> None:
        cutoff = now - timedelta(seconds=LEASE_SECONDS)
        async with self.resources.sessions() as db:
            ids = (
                await db.scalars(
                    select(dbm.Upload.id).where(
                        dbm.Upload.status == "processing",
                        or_(
                            dbm.Upload.processing_started_at <= cutoff,
                            (dbm.Upload.processing_started_at.is_(None))
                            & (dbm.Upload.created_at <= cutoff),
                        ),
                    )
                )
            ).all()
        for upload_id in ids:
            async with self.resources.sessions.begin() as db:
                upload = await db.get(dbm.Upload, upload_id)
                if upload is None:
                    continue
                room = await self.media.rooms.room(db, upload.room_id)
                await db.refresh(upload)
                if upload.status != "processing" or (
                    upload.processing_started_at is not None
                    and upload.processing_started_at > cutoff
                ):
                    continue
                if upload.processing_started_at is None:
                    latest = await db.scalar(
                        select(dbm.Outbox)
                        .where(
                            dbm.Outbox.event_type == "upload.process",
                            dbm.Outbox.payload["uploadId"].astext == str(upload.id),
                        )
                        .order_by(dbm.Outbox.sequence.desc())
                        .limit(1)
                    )
                    if latest is not None and (
                        latest.sent_at is None or latest.created_at > cutoff
                    ):
                        continue
                upload.processing_started_at = None
                upload.processing_attempt_id = None
                if (
                    upload.processing_attempts >= MAX_ATTEMPTS
                    or room.status != "active"
                    or room.expires_at <= now
                ):
                    upload.status = "failed"
                    track = await db.get(dbm.Track, upload.track_id)
                    assert track is not None
                    track.status = "failed"
                    track.error_code = (
                        "PROCESSING_UNAVAILABLE"
                        if room.status == "active" and room.expires_at > now
                        else "ROOM_CLOSED"
                    )
                    await db.flush()
                    await self.media.emit_track(db, track)
                else:
                    db.add(
                        dbm.Outbox(
                            room_id=room.id,
                            revision=0,
                            event_type="upload.process",
                            payload={"uploadId": str(upload.id), "jobId": str(upload.job_id)},
                        )
                    )
