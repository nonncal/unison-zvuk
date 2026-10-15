import asyncio
import hashlib
import html
from io import BytesIO
from uuid import UUID

from fastapi import APIRouter, Request, Response
from PIL import Image, ImageOps, UnidentifiedImageError

from app.api.media import media
from app.api.rooms import Database, actor_session
from app.domain.errors import DomainError
from app.domain.playlist import editor

router = APIRouter(prefix="/api/v1")


def normalize_cover(raw: bytes) -> bytes:
    try:
        with Image.open(BytesIO(raw)) as image:
            if (
                image.format not in {"PNG", "JPEG", "WEBP"}
                or image.width * image.height > 16_777_216
            ):
                raise ValueError("Unsupported cover")
            image.load()
            normalized = ImageOps.exif_transpose(image).convert("RGB")
            normalized.thumbnail((512, 512))
            output = BytesIO()
            normalized.save(output, format="WEBP", quality=85)
            return output.getvalue()
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError) as error:
        raise DomainError(
            "INVALID_COVER", "Выберите PNG, JPEG или WebP до 5 МБ и 16 мегапикселей", 422
        ) from error


@router.get("/rooms/{room_id}/tracks/{track_id}/cover")
async def cover(request: Request, db: Database, room_id: UUID, track_id: UUID) -> Response:
    session = await actor_session(request, db)
    service = media(request)
    room = await service.rooms.room(db, room_id)
    await service.rooms.member(db, room, session.id)
    service.rooms.active(room)
    track = await service.track(db, room_id, track_id)
    headers = {"Cache-Control": "private, max-age=3600", "X-Content-Type-Options": "nosniff"}
    if track.cover_data:
        return Response(content=track.cover_data, media_type="image/webp", headers=headers)
    seed = int(hashlib.sha256(str(track.id).encode()).hexdigest()[:6], 16)
    hue = seed % 360
    title = html.escape(track.title[:34])
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"
    viewBox="0 0 512 512"><defs><linearGradient id="g" x2="1" y2="1">
    <stop stop-color="hsl({hue},50%,72%)"/>
    <stop offset="1" stop-color="hsl({(hue + 55) % 360},40%,28%)"/>
    </linearGradient></defs><rect width="512" height="512" fill="url(#g)"/>
    <g fill="none" stroke="#ffffff" stroke-opacity=".25">
    <circle cx="256" cy="245" r="170"/><circle cx="256" cy="245" r="130"/>
    <circle cx="256" cy="245" r="88"/></g>
    <text x="48" y="130" fill="white" font-family="sans-serif"
    font-size="80" font-weight="700">u.</text>
    <text x="42" y="455" fill="white" font-family="sans-serif"
    font-size="22">{title}</text></svg>"""
    return Response(content=svg, media_type="image/svg+xml", headers=headers)


@router.put("/rooms/{room_id}/tracks/{track_id}/cover", status_code=204)
async def upload_cover(request: Request, db: Database, room_id: UUID, track_id: UUID) -> Response:
    session = await actor_session(request, db, mutation=True)
    service = media(request)
    room = await service.rooms.room(db, room_id)
    actor = await service.rooms.member(db, room, session.id)
    editor(room, actor)
    service.rooms.active(room)
    track = await service.track(db, room_id, track_id)
    if track.room_id != room_id:
        raise DomainError(
            "FORBIDDEN", "Обложку можно менять только у загруженной в комнату композиции", 403
        )
    track.cover_data = await asyncio.to_thread(normalize_cover, await request.body())
    track.cover_version += 1
    await db.flush()
    await service.emit_track(db, track)
    return Response(status_code=204)
