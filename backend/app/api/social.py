"""Room collaboration, admission and playlist endpoints."""

from datetime import UTC, datetime, timedelta
from uuid import UUID, uuid4

from fastapi import APIRouter, Request, Response
from sqlalchemy import func, or_, select

from app.api.rooms import Database, actor_session, limit_request, services
from app.contracts import models as wire
from app.db import models as dbm
from app.domain.errors import DomainError
from app.domain.playlist import contents, edit, ready_track
from app.domain.rooms import milliseconds

router = APIRouter(prefix="/api/v1")


@router.get("/rooms", response_model=wire.MyRooms)
async def my_rooms(request: Request, db: Database) -> wire.MyRooms:
    session = await actor_session(request, db)
    rows = await db.execute(
        select(dbm.Room, dbm.Participant)
        .join(dbm.Participant, dbm.Participant.room_id == dbm.Room.id)
        .where(
            dbm.Participant.session_id == session.id,
            or_(dbm.Participant.left_at.is_(None), dbm.Participant.left_reason == "offlineTimeout"),
            dbm.Room.status == "active",
            dbm.Room.expires_at > datetime.now(UTC),
        )
        .order_by(dbm.Room.created_at.desc())
        .limit(100)
    )
    return wire.MyRooms(
        items=[
            wire.MyRoom(id=r.id, title=r.title, capacity=r.capacity, role=p.role) for r, p in rows
        ]
    )


@router.post("/rooms/{room_id}/resume", response_model=wire.JoinRoomResult)
async def resume(
    request: Request, db: Database, room_id: UUID, payload: wire.EmptyPayload
) -> wire.JoinRoomResult:
    session = await actor_session(request, db, mutation=True)
    _, _, rooms, _ = services(request)
    room = await rooms.room(db, room_id)
    rooms.active(room)
    actor = await db.scalar(
        select(dbm.Participant).where(
            dbm.Participant.room_id == room.id, dbm.Participant.session_id == session.id
        )
    )
    if actor is None or (actor.left_at is not None and actor.left_reason != "offlineTimeout"):
        raise DomainError("FORBIDDEN", "Откройте приглашение в эту комнату", 403)
    if actor.left_at is not None:
        count = await db.scalar(
            select(func.count())
            .select_from(dbm.Participant)
            .where(dbm.Participant.room_id == room.id, dbm.Participant.left_at.is_(None))
        )
        reserved = await db.scalar(
            select(func.count())
            .select_from(dbm.Admission)
            .where(
                dbm.Admission.room_id == room.id,
                dbm.Admission.session_id != session.id,
                dbm.Admission.status == "approved",
                dbm.Admission.expires_at > datetime.now(UTC),
            )
        )
        if (count or 0) + (reserved or 0) >= room.capacity:
            raise DomainError("ROOM_FULL", "В комнате нет свободных мест", 409)
        actor.left_at = None
        actor.left_reason = None
        if room.host_participant_id is None:
            room.host_participant_id = actor.id
            actor.role = "host"
        room.empty_since = None
        room.presence_seq += 1
        await db.flush()
        await rooms.emit_snapshot(db, room)
    return wire.JoinRoomResult(
        participant_id=actor.id, role=actor.role, snapshot=await rooms.snapshot(db, room)
    )


@router.patch("/rooms/{room_id}/settings", response_model=wire.Snapshot)
async def settings(
    request: Request, db: Database, room_id: UUID, payload: wire.RoomSettings
) -> wire.Snapshot:
    session = await actor_session(request, db, mutation=True)
    _, _, rooms, _ = services(request)
    room = await rooms.room(db, room_id)
    await rooms.member(db, room, session.id, host=True)
    rooms.active(room)
    members = await db.scalar(
        select(func.count())
        .select_from(dbm.Participant)
        .where(dbm.Participant.room_id == room.id, dbm.Participant.left_at.is_(None))
    )
    reserved = await db.scalar(
        select(func.count())
        .select_from(dbm.Admission)
        .where(
            dbm.Admission.room_id == room.id,
            dbm.Admission.status == "approved",
            dbm.Admission.expires_at > datetime.now(UTC),
        )
    )
    if (members or 0) + (reserved or 0) > payload.capacity:
        raise DomainError("ROOM_FULL", "Сначала освободите места в комнате", 409)
    room.capacity = payload.capacity
    room.moderated = payload.moderated
    room.presence_seq += 1
    await db.flush()
    await rooms.emit_snapshot(db, room)
    return await rooms.snapshot(db, room)


@router.patch(
    "/rooms/{room_id}/participants/{participant_id}/permission", response_model=wire.Snapshot
)
async def permission(
    request: Request,
    db: Database,
    room_id: UUID,
    participant_id: UUID,
    payload: wire.EditorPermission,
) -> wire.Snapshot:
    session = await actor_session(request, db, mutation=True)
    _, _, rooms, _ = services(request)
    room = await rooms.room(db, room_id)
    await rooms.member(db, room, session.id, host=True)
    rooms.active(room)
    actor = await db.get(dbm.Participant, participant_id)
    if (
        actor is None
        or actor.room_id != room.id
        or actor.left_at is not None
        or actor.id == room.host_participant_id
    ):
        raise DomainError("NOT_FOUND", "Участник недоступен", 404)
    actor.can_edit = payload.can_edit
    room.presence_seq += 1
    await db.flush()
    await rooms.emit_snapshot(db, room)
    return await rooms.snapshot(db, room)


@router.post("/rooms/{room_id}/player", response_model=wire.Snapshot)
async def player(
    request: Request, db: Database, room_id: UUID, payload: wire.PlayerAction
) -> wire.Snapshot:
    session = await actor_session(request, db, mutation=True)
    _, _, rooms, _ = services(request)
    room = await rooms.room(db, room_id)
    rooms.active(room)
    actor = await rooms.member(db, room, session.id)
    state = await db.get(dbm.PlaybackState, room.id)
    assert state is not None
    now = rooms.clock.now_ms() if rooms.clock else milliseconds(datetime.now(UTC))
    from app.domain.playback import promote

    promote(state, now)
    await edit(db, room, actor, state, payload, now, lead_ms=rooms.start_delay(room.id))
    await rooms.emit_snapshot(db, room)
    return await rooms.snapshot(db, room)


@router.post("/rooms/{room_id}/entry", response_model=wire.EntryResult)
async def entry(
    request: Request, db: Database, room_id: UUID, payload: wire.JoinRoom
) -> wire.EntryResult:
    session = await actor_session(request, db, mutation=True)
    await limit_request(request, "join", session)
    _, _, rooms, _ = services(request)
    preview = await rooms.preview(db, payload.invite_token)
    if preview.room_id != room_id:
        raise DomainError("INVITE_INVALID", "Приглашение недействительно", 404)
    room = await rooms.room(db, room_id)
    rooms.active(room)
    actor = await db.scalar(
        select(dbm.Participant).where(
            dbm.Participant.room_id == room.id,
            dbm.Participant.session_id == session.id,
        )
    )
    if actor and actor.left_reason == "removed":
        raise DomainError("FORBIDDEN", "Ведущий удалил вас из этой комнаты", 403)
    if (actor and actor.left_at is None) or not room.moderated:
        return wire.EntryResult(
            status="admitted", membership=await rooms.join(db, session, room_id, payload)
        )
    admission = await db.scalar(
        select(dbm.Admission).where(
            dbm.Admission.room_id == room.id, dbm.Admission.session_id == session.id
        )
    )
    now = datetime.now(UTC)
    if admission and admission.status == "approved" and admission.expires_at > now:
        return wire.EntryResult(
            status="admitted", membership=await rooms.join(db, session, room_id, payload)
        )
    if admission and admission.status == "rejected":
        return wire.EntryResult(status="rejected")
    if (
        admission is None
        or admission.expires_at <= now
        or admission.status in {"cancelled", "admitted"}
    ):
        count = await db.scalar(
            select(func.count())
            .select_from(dbm.Admission)
            .where(
                dbm.Admission.room_id == room.id,
                dbm.Admission.status == "pending",
                dbm.Admission.expires_at > now,
            )
        )
        if (count or 0) >= 50:
            raise DomainError("WAITING_FULL", "Зал ожидания заполнен. Попробуйте позже.", 429)
        if admission is None:
            admission = dbm.Admission(
                id=uuid4(),
                room_id=room.id,
                session_id=session.id,
                display_name=payload.display_name,
                expires_at=now + timedelta(minutes=15),
            )
            db.add(admission)
        admission.status = "pending"
        admission.display_name = payload.display_name
        admission.created_at = now
        admission.expires_at = now + timedelta(minutes=15)
    return wire.EntryResult(status="pending")


@router.get("/rooms/{room_id}/admission", response_model=wire.AdmissionStatus)
async def admission_status(request: Request, db: Database, room_id: UUID) -> wire.AdmissionStatus:
    session = await actor_session(request, db)
    admission = await db.scalar(
        select(dbm.Admission).where(
            dbm.Admission.room_id == room_id, dbm.Admission.session_id == session.id
        )
    )
    if admission is None:
        return wire.AdmissionStatus(status="none")
    return wire.AdmissionStatus(
        status="expired" if admission.expires_at <= datetime.now(UTC) else admission.status
    )


@router.delete("/rooms/{room_id}/admission", status_code=204)
async def cancel_admission(request: Request, db: Database, room_id: UUID) -> Response:
    session = await actor_session(request, db, mutation=True)
    _, _, rooms, _ = services(request)
    await rooms.room(db, room_id)
    admission = await db.scalar(
        select(dbm.Admission).where(
            dbm.Admission.room_id == room_id, dbm.Admission.session_id == session.id
        )
    )
    if admission and admission.status in {"pending", "approved"}:
        admission.status = "cancelled"
    return Response(status_code=204)


@router.get("/rooms/{room_id}/waiting", response_model=wire.WaitingList)
async def waiting(request: Request, db: Database, room_id: UUID) -> wire.WaitingList:
    session = await actor_session(request, db)
    _, _, rooms, _ = services(request)
    room = await rooms.room(db, room_id)
    await rooms.member(db, room, session.id, host=True)
    rooms.active(room)
    rows = (
        await db.scalars(
            select(dbm.Admission)
            .where(
                dbm.Admission.room_id == room_id,
                dbm.Admission.status == "pending",
                dbm.Admission.expires_at > datetime.now(UTC),
            )
            .order_by(dbm.Admission.created_at)
            .limit(50)
        )
    ).all()
    return wire.WaitingList(
        items=[
            wire.WaitingGuest(
                id=a.id, display_name=a.display_name, requested_at=milliseconds(a.created_at)
            )
            for a in rows
        ]
    )


@router.post("/rooms/{room_id}/waiting/{admission_id}", response_model=wire.WaitingList)
async def decide(
    request: Request,
    db: Database,
    room_id: UUID,
    admission_id: UUID,
    payload: wire.AdmissionDecision,
) -> wire.WaitingList:
    session = await actor_session(request, db, mutation=True)
    _, _, rooms, _ = services(request)
    room = await rooms.room(db, room_id)
    await rooms.member(db, room, session.id, host=True)
    rooms.active(room)
    admission = await db.get(dbm.Admission, admission_id)
    now = datetime.now(UTC)
    if (
        admission is None
        or admission.room_id != room_id
        or admission.status != "pending"
        or admission.expires_at <= now
    ):
        raise DomainError("NOT_FOUND", "Заявка уже обработана или истекла", 404)
    if payload.admit:
        members = await db.scalar(
            select(func.count())
            .select_from(dbm.Participant)
            .where(dbm.Participant.room_id == room_id, dbm.Participant.left_at.is_(None))
        )
        reserved = await db.scalar(
            select(func.count())
            .select_from(dbm.Admission)
            .where(
                dbm.Admission.room_id == room_id,
                dbm.Admission.status == "approved",
                dbm.Admission.expires_at > now,
            )
        )
        if (members or 0) + (reserved or 0) >= room.capacity:
            raise DomainError("ROOM_FULL", "В комнате нет свободных мест", 409)
    admission.status = "approved" if payload.admit else "rejected"
    await db.flush()
    return await waiting(request, db, room_id)


@router.post("/rooms/{room_id}/invite/rotate", response_model=wire.InviteResult)
async def rotate_invite(
    request: Request, db: Database, room_id: UUID, payload: wire.EmptyPayload
) -> wire.InviteResult:
    import secrets

    session = await actor_session(request, db, mutation=True)
    _, security, rooms, _ = services(request)
    room = await rooms.room(db, room_id)
    await rooms.member(db, room, session.id, host=True)
    rooms.active(room)
    token = secrets.token_urlsafe(32)
    room.invite_token_hash = security.digest("invite", token)
    room.invite_token_encrypted = security.encrypt(token)
    rows = (
        await db.scalars(
            select(dbm.Admission).where(
                dbm.Admission.room_id == room_id, dbm.Admission.status.in_(["pending", "approved"])
            )
        )
    ).all()
    for item in rows:
        item.status = "rejected"
    return wire.InviteResult(
        invite_url=rooms.invite_url(room), expires_at=milliseconds(room.expires_at)
    )


@router.post("/rooms/{room_id}/participants/{participant_id}/action", response_model=wire.Snapshot)
async def member_action(
    request: Request, db: Database, room_id: UUID, participant_id: UUID, payload: wire.MemberAction
) -> wire.Snapshot:
    session = await actor_session(request, db, mutation=True)
    _, _, rooms, _ = services(request)
    room = await rooms.room(db, room_id)
    host = await rooms.member(db, room, session.id, host=True)
    rooms.active(room)
    target = await db.get(dbm.Participant, participant_id)
    if (
        target is None
        or target.room_id != room_id
        or target.left_at is not None
        or target.id == host.id
    ):
        raise DomainError("NOT_FOUND", "Участник недоступен", 404)
    if payload.action == "transfer":
        host.role = "listener"
        await db.flush()
        target.role = "host"
        room.host_participant_id = target.id
        db.add(
            dbm.Outbox(
                room_id=room.id,
                revision=0,
                event_type="host.changed",
                payload={"participantId": str(target.id)},
            )
        )
    else:
        target.role = "listener"
        target.can_edit = False
        target.left_at = datetime.now(UTC)
        target.left_reason = "removed"
        target.connection_generation += 1
    room.presence_seq += 1
    await db.flush()
    await rooms.emit_snapshot(db, room)
    return await rooms.snapshot(db, room)


@router.post("/rooms/{room_id}/suggestions", response_model=wire.Snapshot)
async def suggest_track(
    request: Request, db: Database, room_id: UUID, payload: wire.SuggestTrack
) -> wire.Snapshot:
    session = await actor_session(request, db, mutation=True)
    _, _, rooms, _ = services(request)
    room = await rooms.room(db, room_id)
    rooms.active(room)
    actor = await rooms.member(db, room, session.id)
    await ready_track(db, room, payload.track_id)
    data = contents(room)
    pending = data.get("suggestions", [])
    if str(payload.track_id) in data["trackIds"]:
        raise DomainError("ALREADY_QUEUED", "Эта песня уже в очереди", 409)
    if any(i["trackId"] == str(payload.track_id) for i in pending):
        return await rooms.snapshot(db, room)
    if len(pending) >= 20 or sum(i["participantId"] == str(actor.id) for i in pending) >= 3:
        raise DomainError("SUGGESTION_LIMIT", "Дождитесь решения по предыдущим предложениям", 409)
    pending.append(
        {
            "id": str(uuid4()),
            "trackId": str(payload.track_id),
            "participantId": str(actor.id),
            "displayName": actor.display_name,
        }
    )
    data["suggestions"] = pending
    room.playlist = data
    await db.flush()
    await rooms.emit_snapshot(db, room)
    return await rooms.snapshot(db, room)


@router.post("/rooms/{room_id}/suggestions/{suggestion_id}", response_model=wire.Snapshot)
async def decide_suggestion(
    request: Request,
    db: Database,
    room_id: UUID,
    suggestion_id: UUID,
    payload: wire.DecideSuggestion,
) -> wire.Snapshot:
    session = await actor_session(request, db, mutation=True)
    _, _, rooms, _ = services(request)
    room = await rooms.room(db, room_id)
    rooms.active(room)
    await rooms.member(db, room, session.id, host=True)
    data = contents(room)
    pending = data.get("suggestions", [])
    item = next((i for i in pending if i["id"] == str(suggestion_id)), None)
    if item is None:
        return await rooms.snapshot(db, room)  # Repeated decision is harmless.
    if payload.accept:
        await ready_track(db, room, UUID(item["trackId"]))
        if item["trackId"] not in data["trackIds"]:
            if len(data["trackIds"]) >= 100:
                raise DomainError("QUEUE_FULL", "Освободите место в очереди", 409)
            data["trackIds"].append(item["trackId"])
            data["bag"] = []
            data["shuffleStarted"] = False
            state = await db.get(dbm.PlaybackState, room.id)
            assert state is not None
            state.playback_revision += 1
    data["suggestions"] = [i for i in pending if i["id"] != str(suggestion_id)]
    room.playlist = data
    await db.flush()
    await rooms.emit_snapshot(db, room)
    return await rooms.snapshot(db, room)
