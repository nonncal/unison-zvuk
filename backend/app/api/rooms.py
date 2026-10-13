from collections.abc import AsyncIterator
from datetime import UTC, datetime
from typing import Annotated, Any
from uuid import UUID

from fastapi import APIRouter, Depends, Header, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.contracts import models as wire
from app.db.models import Session
from app.domain.errors import DomainError
from app.domain.rooms import Rooms
from app.resources import Resources
from app.services.rate_limit import RateLimiter
from app.services.runtime import Runtime
from app.services.security import Security

router = APIRouter(prefix="/api/v1")


def services(request: Request) -> tuple[Resources, Security, Rooms, RateLimiter]:
    resources: Resources = request.app.state.resources
    security = Security(request.app.state.settings)
    runtime: Runtime | None = getattr(request.app.state, "runtime", None)
    if runtime is not None and not runtime.ready:
        raise DomainError("UNAVAILABLE", "Сервис комнат временно недоступен", 503)
    return (
        resources,
        security,
        runtime.rooms if runtime is not None else Rooms(security.settings, security),
        RateLimiter(resources.redis, security),
    )


async def transaction(request: Request) -> AsyncIterator[AsyncSession]:
    resources: Resources = request.app.state.resources
    async with resources.sessions.begin() as db:
        yield db


Database = Annotated[AsyncSession, Depends(transaction, scope="function")]


async def actor_session(request: Request, db: AsyncSession, mutation: bool = False) -> Session:
    _, security, _, _ = services(request)
    if mutation:
        security.check_origin(request.headers.get("origin"))
    session = await security.session(
        db, request.cookies.get(security.settings.session_cookie), lock=mutation
    )
    if mutation:
        security.check_csrf(session, request.headers.get("x-csrf-token"))
    return session


async def limit_request(request: Request, operation: str, session: Session | None = None) -> None:
    _, security, _, limiter = services(request)
    limit = {
        "create": security.settings.create_per_minute,
        "join": security.settings.join_per_minute,
        "preview": security.settings.join_per_minute,
        "bootstrap": security.settings.bootstrap_per_minute,
        "upload": security.settings.upload_per_minute,
    }[operation]
    ip = request.client.host if request.client else "unknown"
    await limiter.check(operation + ":ip", ip, limit)
    if session is not None:
        await limiter.check(operation + ":session", str(session.id), limit)


@router.get("/bootstrap", response_model=wire.Bootstrap)
async def bootstrap(request: Request, response: Response, db: Database) -> wire.Bootstrap:
    _, security, _, _ = services(request)
    if request.headers.get("origin") is not None:
        security.check_origin(request.headers["origin"])
    await limit_request(request, "bootstrap")
    cookie = request.cookies.get(security.settings.session_cookie)
    try:
        session = await security.session(db, cookie)
    except DomainError as error:
        if error.code != "SESSION_EXPIRED":
            raise
        session, cookie = await security.new_session(db)
    assert cookie is not None
    response.set_cookie(
        security.settings.session_cookie,
        cookie,
        httponly=True,
        secure=security.settings.cookie_secure,
        samesite="lax",
        path="/",
        expires=session.expires_at,
        max_age=max(0, int((session.expires_at - datetime.now(UTC)).total_seconds())),
    )
    return wire.Bootstrap(
        csrf_token=security.csrf(cookie),
        limits={
            "capacity": 2,
            "maxUploadBytes": security.settings.upload_max_bytes,
            "maxDurationMs": security.settings.audio_max_duration_ms,
            "maxRoomFiles": security.settings.room_max_files,
            "maxRoomSourceBytes": security.settings.room_max_source_bytes,
            "maxPendingUploads": security.settings.room_max_pending_uploads,
        },
    )


@router.post("/rooms", status_code=201, response_model=wire.CreateRoomResult)
async def create_room(
    request: Request,
    db: Database,
    payload: wire.CreateRoom,
    idempotency_key: Annotated[UUID, Header()],
) -> wire.CreateRoomResult:
    session = await actor_session(request, db, mutation=True)
    await limit_request(request, "create", session)
    _, _, rooms, _ = services(request)
    return await rooms.create(db, session, idempotency_key, payload)


@router.post("/invites/preview", response_model=wire.PreviewResult)
async def preview(
    request: Request, db: Database, payload: wire.PreviewInvite
) -> wire.PreviewResult:
    session = await actor_session(request, db, mutation=True)
    await limit_request(request, "preview", session)
    _, _, rooms, _ = services(request)
    return await rooms.preview(db, payload.invite_token)


@router.post("/rooms/{room_id}/join", response_model=wire.JoinRoomResult)
async def join(
    request: Request, db: Database, room_id: UUID, payload: wire.JoinRoom
) -> wire.JoinRoomResult:
    session = await actor_session(request, db, mutation=True)
    await limit_request(request, "join", session)
    _, _, rooms, _ = services(request)
    return await rooms.join(db, session, room_id, payload)


@router.get("/rooms/{room_id}", response_model=wire.Snapshot)
async def snapshot(request: Request, db: Database, room_id: UUID) -> wire.Snapshot:
    session = await actor_session(request, db)
    _, _, rooms, _ = services(request)
    room = await rooms.room(db, room_id)
    await rooms.member(db, room, session.id)
    rooms.active(room)
    return await rooms.snapshot(db, room)


@router.get("/rooms/{room_id}/invite", response_model=wire.InviteResult)
async def invitation(request: Request, db: Database, room_id: UUID) -> wire.InviteResult:
    from app.domain.rooms import milliseconds

    session = await actor_session(request, db)
    _, _, rooms, _ = services(request)
    room = await rooms.room(db, room_id)
    await rooms.member(db, room, session.id, host=True)
    rooms.active(room)
    return wire.InviteResult(
        invite_url=rooms.invite_url(room), expires_at=milliseconds(room.expires_at)
    )


@router.post("/rooms/{room_id}/leave", status_code=204, response_class=Response)
async def leave(
    request: Request, db: Database, room_id: UUID, payload: wire.EmptyPayload
) -> Response:
    session = await actor_session(request, db, mutation=True)
    _, _, rooms, _ = services(request)
    room = await rooms.room(db, room_id)
    actor = await rooms.member(db, room, session.id)
    rooms.active(room)
    await rooms.leave(db, room, actor)
    return Response(status_code=204)


@router.post("/rooms/{room_id}/close", response_model=wire.Snapshot)
async def close(
    request: Request, db: Database, room_id: UUID, payload: wire.CloseRoom
) -> wire.Snapshot:
    session = await actor_session(request, db, mutation=True)
    _, _, rooms, _ = services(request)
    room = await rooms.room(db, room_id)
    await rooms.member(db, room, session.id, host=True)
    return await rooms.close(db, room, payload.expected_playback_revision)


def error_body(request: Request, error: DomainError) -> dict[str, Any]:
    body: dict[str, Any] = {
        "code": error.code,
        "message": error.message,
        "requestId": request.state.request_id,
    }
    if error.details is not None:
        body["details"] = error.details
    return {"error": body}
