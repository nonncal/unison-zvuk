from datetime import UTC, datetime, timedelta
from pathlib import PurePath
from uuid import UUID, uuid4

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.contracts import models as wire
from app.db import models as dbm
from app.domain.errors import DomainError
from app.domain.rooms import Rooms, milliseconds
from app.services.security import payload_hash
from app.services.storage import Storage


class Media:
    def __init__(self, rooms: Rooms, storage: Storage) -> None:
        self.rooms = rooms
        self.storage = storage
        self.settings = rooms.settings

    async def track(self, db: AsyncSession, room_id: UUID, track_id: UUID) -> dbm.Track:
        track = await db.scalar(
            select(dbm.Track).where(
                dbm.Track.id == track_id,
                or_(dbm.Track.scope == "catalog", dbm.Track.room_id == room_id),
            )
        )
        if track is None:
            raise DomainError("TRACK_NOT_FOUND", "Трек недоступен", 404)
        return track

    async def wire_track(self, db: AsyncSession, track: dbm.Track) -> wire.Track:
        asset = (
            await db.get(dbm.Asset, track.playback_asset_id) if track.playback_asset_id else None
        )
        return wire.Track.model_validate(
            {
                "id": track.id,
                "title": track.title,
                "artist": track.artist,
                "duration_ms": track.duration_ms,
                "status": track.status,
                "error_code": track.error_code,
                "media_version": asset.media_version if asset else None,
                "source_uri": track.source_uri,
                "license_id": track.license_id,
                "license_uri": track.license_uri,
            }
        )

    async def emit_track(self, db: AsyncSession, track: dbm.Track) -> None:
        if track.room_id is None:
            return
        state = await db.get(dbm.PlaybackState, track.room_id)
        assert state is not None
        db.add(
            dbm.Outbox(
                room_id=track.room_id,
                revision=state.playback_revision,
                event_type="track.updated",
                payload={
                    "track": (await self.wire_track(db, track)).model_dump(
                        mode="json", by_alias=True
                    )
                },
            )
        )

    async def reserve(
        self,
        db: AsyncSession,
        room: dbm.Room,
        actor: dbm.Participant,
        request_id: UUID,
        payload: wire.ReserveUpload,
    ) -> wire.ReserveUploadResult:
        now = datetime.now(UTC)
        operation = "upload.reserve:" + str(room.id)
        fingerprint = payload_hash(payload.model_dump(mode="json", by_alias=True))
        receipt = await db.get(dbm.HttpReceipt, (actor.session_id, operation, request_id))
        if receipt is not None and receipt.expires_at > now:
            if receipt.payload_hash != fingerprint:
                raise DomainError(
                    "DUPLICATE_REQUEST_MISMATCH", "Ключ уже использован для другого файла"
                )
            return wire.ReserveUploadResult.model_validate(
                self.rooms.security.unseal_response(receipt.response)
            )
        if receipt is not None:
            await db.delete(receipt)
            await db.flush()
        if payload.size_bytes > self.settings.upload_max_bytes:
            raise DomainError("FILE_TOO_LARGE", "Файл превышает допустимый размер", 413)
        uploads = (await db.scalars(select(dbm.Upload).where(dbm.Upload.room_id == room.id))).all()
        pending = sum(u.status in {"reserved", "processing"} for u in uploads)
        ready = sum(u.status == "ready" for u in uploads)
        total = sum(u.actual_size or u.expected_size for u in uploads if u.purged_at is None)
        if pending >= self.settings.room_max_pending_uploads:
            raise DomainError("PENDING_UPLOAD_LIMIT", "Одновременно можно обрабатывать два файла")
        if ready + pending >= self.settings.room_max_files:
            raise DomainError("FILE_COUNT_LIMIT", "Достигнут лимит файлов комнаты")
        if total + payload.size_bytes > self.settings.room_max_source_bytes:
            raise DomainError("SOURCE_QUOTA_EXCEEDED", "Достигнут лимит объёма файлов комнаты")
        upload_id, track_id = uuid4(), uuid4()
        track = dbm.Track(
            id=track_id,
            room_id=room.id,
            scope="room",
            title=PurePath(payload.file_name).stem[:200],
            artist="",
            status="uploading",
            source_uri="user-upload",
        )
        db.add(track)
        await db.flush()
        upload = dbm.Upload(
            id=upload_id,
            room_id=room.id,
            owner_participant_id=actor.id,
            track_id=track_id,
            object_key=f"rooms/{room.id}/sources/{upload_id}",
            content_type=payload.content_type,
            expected_size=payload.size_bytes,
            expires_at=now + timedelta(minutes=10),
        )
        db.add(upload)
        await db.flush()
        url, headers = self.storage.upload_url(upload)
        result = wire.ReserveUploadResult(
            upload_id=upload.id,
            upload_url=url,
            required_headers=headers,
            expires_at=milliseconds(upload.expires_at),
        )
        db.add(
            dbm.HttpReceipt(
                session_id=actor.session_id,
                operation=operation,
                request_id=request_id,
                payload_hash=fingerprint,
                status_code=201,
                response=self.rooms.security.seal_response(
                    result.model_dump(mode="json", by_alias=True)
                ),
                expires_at=now + timedelta(seconds=self.settings.receipt_ttl_seconds),
            )
        )
        await self.emit_track(db, track)
        return result

    async def upload(
        self, db: AsyncSession, room: dbm.Room, actor: dbm.Participant, upload_id: UUID
    ) -> dbm.Upload:
        upload = await db.scalar(
            select(dbm.Upload).where(
                dbm.Upload.id == upload_id,
                dbm.Upload.room_id == room.id,
                dbm.Upload.owner_participant_id == actor.id,
            )
        )
        if upload is None:
            raise DomainError("UPLOAD_NOT_FOUND", "Загрузка недоступна", 404)
        return upload

    async def complete(
        self, db: AsyncSession, upload: dbm.Upload, payload: wire.CompleteUpload
    ) -> wire.CompleteUploadResult:
        if upload.status in {"processing", "ready"}:
            if upload.complete_checksum != payload.checksum:
                raise DomainError(
                    "DUPLICATE_REQUEST_MISMATCH", "Завершение уже принято с другим checksum"
                )
            return wire.CompleteUploadResult(track_id=upload.track_id)
        if upload.status != "reserved" or upload.expires_at <= datetime.now(UTC):
            raise DomainError("UPLOAD_EXPIRED", "Создайте новую загрузку", 410)
        head = await self.storage.head(upload.object_key)
        size = head["ContentLength"]
        if size != upload.expected_size or size > self.settings.upload_max_bytes:
            raise DomainError("UPLOAD_SIZE_MISMATCH", "Размер загруженного файла отличается", 413)
        if head.get("ContentType") != upload.content_type:
            raise DomainError("UPLOAD_TYPE_MISMATCH", "Тип загруженного файла отличается", 415)
        upload.actual_size = size
        upload.complete_checksum = payload.checksum
        upload.status = "processing"
        upload.job_id = uuid4()
        track = await db.get(dbm.Track, upload.track_id)
        assert track is not None
        track.status = "processing"
        db.add(
            dbm.Outbox(
                room_id=upload.room_id,
                revision=0,
                event_type="upload.process",
                payload={"uploadId": str(upload.id), "jobId": str(upload.job_id)},
            )
        )
        await db.flush()
        await self.emit_track(db, track)
        return wire.CompleteUploadResult(track_id=track.id)

    async def cancel(self, db: AsyncSession, upload: dbm.Upload) -> None:
        if upload.status == "cancelled":
            return
        if upload.status != "reserved":
            raise DomainError("UPLOAD_ALREADY_COMPLETED", "Обработка файла уже началась")
        upload.status = "cancelled"
        track = await db.get(dbm.Track, upload.track_id)
        assert track is not None
        track.status = "failed"
        track.error_code = "UPLOAD_CANCELLED"
        await db.flush()
        await self.emit_track(db, track)

    async def list_tracks(
        self, db: AsyncSession, room_id: UUID | None, query: str, cursor: UUID | None, limit: int
    ) -> wire.TrackList:
        scope = (
            dbm.Track.scope == "catalog"
            if room_id is None
            else or_(dbm.Track.scope == "catalog", dbm.Track.room_id == room_id)
        )
        statement = select(dbm.Track).where(scope)
        if room_id is None:
            statement = statement.where(dbm.Track.status == "ready")
        if query:
            statement = statement.where(
                or_(
                    dbm.Track.title.icontains(query, autoescape=True),
                    dbm.Track.artist.icontains(query, autoescape=True),
                )
            )
        if cursor is not None:
            statement = statement.where(dbm.Track.id > cursor)
        rows = (await db.scalars(statement.order_by(dbm.Track.id).limit(limit + 1))).all()
        items = [await self.wire_track(db, track) for track in rows[:limit]]
        return wire.TrackList(
            items=items, next_cursor=rows[limit - 1].id if len(rows) > limit else None
        )
