from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Header, Query, Request, Response

from app.api.rooms import Database, actor_session, limit_request, services
from app.contracts import models as wire
from app.domain.errors import DomainError
from app.domain.media import Media
from app.domain.rooms import milliseconds
from app.services.storage import Storage

router = APIRouter(prefix="/api/v1")


def search_text(query: str) -> str:
    try:
        return wire.plain_text(query)
    except ValueError as error:
        raise DomainError("VALIDATION_ERROR", "Проверьте строку поиска", 422) from error


def media(request: Request) -> Media:
    resources, _, rooms, _ = services(request)
    return Media(rooms, Storage(resources))


@router.get("/tracks", response_model=wire.TrackList)
async def catalog(
    request: Request,
    db: Database,
    query: Annotated[str, Query(max_length=100)] = "",
    cursor: UUID | None = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> wire.TrackList:
    await actor_session(request, db)
    return await media(request).list_tracks(db, None, search_text(query), cursor, limit)


@router.get("/rooms/{room_id}/tracks", response_model=wire.TrackList)
async def room_tracks(
    request: Request,
    db: Database,
    room_id: UUID,
    query: Annotated[str, Query(max_length=100)] = "",
    cursor: UUID | None = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> wire.TrackList:
    session = await actor_session(request, db)
    service = media(request)
    room = await service.rooms.room(db, room_id)
    await service.rooms.member(db, room, session.id)
    service.rooms.active(room)
    return await service.list_tracks(db, room_id, search_text(query), cursor, limit)


@router.post("/rooms/{room_id}/uploads", status_code=201, response_model=wire.ReserveUploadResult)
async def reserve(
    request: Request,
    db: Database,
    room_id: UUID,
    payload: wire.ReserveUpload,
    idempotency_key: Annotated[UUID, Header()],
) -> wire.ReserveUploadResult:
    session = await actor_session(request, db, mutation=True)
    await limit_request(request, "upload", session)
    service = media(request)
    room = await service.rooms.room(db, room_id)
    actor = await service.rooms.member(db, room, session.id, host=True)
    service.rooms.active(room)
    return await service.reserve(db, room, actor, idempotency_key, payload)


@router.post(
    "/rooms/{room_id}/uploads/{upload_id}/complete",
    status_code=202,
    response_model=wire.CompleteUploadResult,
)
async def complete(
    request: Request, db: Database, room_id: UUID, upload_id: UUID, payload: wire.CompleteUpload
) -> wire.CompleteUploadResult:
    session = await actor_session(request, db, mutation=True)
    service = media(request)
    room = await service.rooms.room(db, room_id)
    actor = await service.rooms.member(db, room, session.id, host=True)
    service.rooms.active(room)
    return await service.complete(db, await service.upload(db, room, actor, upload_id), payload)


@router.delete("/rooms/{room_id}/uploads/{upload_id}", status_code=204, response_class=Response)
async def cancel(request: Request, db: Database, room_id: UUID, upload_id: UUID) -> Response:
    session = await actor_session(request, db, mutation=True)
    service = media(request)
    room = await service.rooms.room(db, room_id)
    actor = await service.rooms.member(db, room, session.id, host=True)
    service.rooms.active(room)
    await service.cancel(db, await service.upload(db, room, actor, upload_id))
    return Response(status_code=204)


@router.get("/rooms/{room_id}/tracks/{track_id}", response_model=wire.Track)
async def track_info(request: Request, db: Database, room_id: UUID, track_id: UUID) -> wire.Track:
    session = await actor_session(request, db)
    service = media(request)
    room = await service.rooms.room(db, room_id)
    await service.rooms.member(db, room, session.id)
    service.rooms.active(room)
    return await service.wire_track(db, await service.track(db, room_id, track_id))


@router.post("/rooms/{room_id}/tracks/{track_id}/playback-url", response_model=wire.PlaybackURL)
async def playback_url(
    request: Request, db: Database, room_id: UUID, track_id: UUID, payload: wire.EmptyPayload
) -> wire.PlaybackURL:
    from app.db.models import Asset
    from app.domain.errors import DomainError

    session = await actor_session(request, db, mutation=True)
    service = media(request)
    room = await service.rooms.room(db, room_id)
    await service.rooms.member(db, room, session.id)
    service.rooms.active(room)
    track = await service.track(db, room_id, track_id)
    asset = await db.get(Asset, track.playback_asset_id) if track.playback_asset_id else None
    if track.status != "ready" or asset is None:
        raise DomainError("TRACK_NOT_READY", "Аудио ещё обрабатывается")
    try:
        head = await service.storage.head(asset.object_key)
    except DomainError as error:
        raise DomainError("MEDIA_UNAVAILABLE", "Аудиофайл временно недоступен", 503) from error
    if head["ContentLength"] != asset.size_bytes:
        raise DomainError("MEDIA_UNAVAILABLE", "Аудиофайл временно недоступен", 503)
    url, expires = service.storage.playback_url(asset)
    return wire.PlaybackURL(
        url=url,
        expires_at=milliseconds(expires),
        media_version=asset.media_version,
        checksum=asset.checksum,
        content_type=asset.content_type,
    )
