import json
from uuid import UUID

from fastapi import APIRouter, Request, Response

from app.api.media import media
from app.api.rooms import Database, actor_session
from app.contracts import models as wire
from app.domain.errors import DomainError
from app.domain.playlist import editor
from app.services.lyrics import dump, parse_lyrics

router = APIRouter(prefix="/api/v1")


@router.get("/rooms/{room_id}/tracks/{track_id}/lyrics", response_model=wire.Lyrics)
async def lyrics(request: Request, db: Database, room_id: UUID, track_id: UUID) -> Response:
    session = await actor_session(request, db)
    service = media(request)
    room = await service.rooms.room(db, room_id)
    await service.rooms.member(db, room, session.id)
    service.rooms.active(room)
    track = await service.track(db, room_id, track_id)
    if not track.lyrics:
        raise DomainError("LYRICS_NOT_FOUND", "У песни нет текста", 404)
    return Response(
        content=json.dumps(json.loads(track.lyrics), ensure_ascii=False),
        media_type="application/json",
        headers={"Cache-Control": "private, max-age=3600", "X-Content-Type-Options": "nosniff"},
    )


@router.put("/rooms/{room_id}/tracks/{track_id}/lyrics", status_code=204)
async def upload_lyrics(request: Request, db: Database, room_id: UUID, track_id: UUID) -> Response:
    session = await actor_session(request, db, mutation=True)
    service = media(request)
    room = await service.rooms.room(db, room_id)
    actor = await service.rooms.member(db, room, session.id)
    editor(room, actor)
    service.rooms.active(room)
    track = await service.track(db, room_id, track_id)
    if track.room_id != room_id:
        raise DomainError("FORBIDDEN", "Текст можно менять только у загруженной песни", 403)
    try:
        raw = (await request.body()).decode("utf-8-sig")
    except UnicodeDecodeError as error:
        raise DomainError(
            "INVALID_LYRICS", "Сохраните файл с текстом в кодировке UTF-8", 422
        ) from error
    track.lyrics = dump(parse_lyrics(raw))
    track.lyrics_version += 1
    await db.flush()
    await service.emit_track(db, track)
    return Response(status_code=204)


@router.delete("/rooms/{room_id}/tracks/{track_id}/lyrics", status_code=204)
async def delete_lyrics(request: Request, db: Database, room_id: UUID, track_id: UUID) -> Response:
    session = await actor_session(request, db, mutation=True)
    service = media(request)
    room = await service.rooms.room(db, room_id)
    actor = await service.rooms.member(db, room, session.id)
    editor(room, actor)
    service.rooms.active(room)
    track = await service.track(db, room_id, track_id)
    if track.room_id != room_id:
        raise DomainError("FORBIDDEN", "Текст можно менять только у загруженной песни", 403)
    if track.lyrics:
        track.lyrics = None
        track.lyrics_version += 1
        await db.flush()
        await service.emit_track(db, track)
    return Response(status_code=204)
