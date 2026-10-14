import asyncio
import json
import secrets
from collections.abc import AsyncIterator
from datetime import UTC, datetime, timedelta
from urllib.parse import parse_qs, urlsplit
from uuid import UUID, uuid4

import pytest
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient
from pydantic import SecretStr
from pytest import MonkeyPatch
from redis.asyncio import Redis
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker

from app.config import Settings, load_settings
from app.contracts.models import CreateRoom, CreateRoomResult
from app.db.models import HttpReceipt, Outbox, Participant, Room, Session
from app.domain.rooms import Rooms
from app.main import create_app
from app.resources import Resources
from app.services.metrics import Metrics

pytestmark = pytest.mark.integration


@pytest.fixture
async def clients(database: AsyncEngine) -> AsyncIterator[list[AsyncClient]]:
    config = load_settings().model_copy(
        update={"session_secret": SecretStr(secrets.token_urlsafe(48))}
    )

    class TestResources(Resources):
        def __init__(self, settings: Settings) -> None:
            self.engine = database
            self.sessions = async_sessionmaker(database, expire_on_commit=False)
            self.redis = Redis.from_url(settings.redis_url, socket_timeout=2)
            self.metrics = Metrics(self.redis)

        async def close(self) -> None:
            await self.metrics.stop()
            await self.redis.aclose()

    app = create_app(config, TestResources, start_runtime=False)
    async with LifespanManager(app):
        clients = [
            AsyncClient(
                transport=ASGITransport(app=app, client=("test-" + uuid4().hex, 5000)),
                base_url=config.app_origin,
            )
            for _ in range(4)
        ]
        try:
            for client in clients:
                response = await client.get("/api/v1/bootstrap")
                assert response.status_code == 200
                client.headers.update(
                    {"Origin": config.app_origin, "X-CSRF-Token": response.json()["csrfToken"]}
                )
            yield clients
        finally:
            for client in clients:
                await client.aclose()


async def create(host: AsyncClient) -> tuple[str, str]:
    response = await host.post(
        "/api/v1/rooms", json={"displayName": "Кирилл"}, headers={"Idempotency-Key": str(uuid4())}
    )
    assert response.status_code == 201, response.text
    body = response.json()
    token = parse_qs(urlsplit(body["inviteUrl"]).fragment)["invite"][0]
    return body["roomId"], token


async def test_create_is_idempotent_and_secrets_stay_private(
    clients: list[AsyncClient], database: AsyncEngine
) -> None:
    host, outsider, *_ = clients
    key = str(uuid4())
    responses = await asyncio.gather(
        *[
            host.post(
                "/api/v1/rooms",
                json={"displayName": "  Кирилл  "},
                headers={"Idempotency-Key": key},
            )
            for _ in range(2)
        ]
    )
    assert [response.status_code for response in responses] == [201, 201]
    assert responses[0].json() == responses[1].json()
    body = responses[0].json()
    assert body["snapshot"]["participants"][0]["role"] == "host"
    assert body["snapshot"]["participants"][0]["displayName"] == "Кирилл"
    assert body["snapshot"]["playbackRevision"] == 0
    token = parse_qs(urlsplit(body["inviteUrl"]).fragment)["invite"][0]
    assert len(token) == 43
    snapshot = await host.get(f"/api/v1/rooms/{body['roomId']}")
    assert snapshot.status_code == 200 and token not in snapshot.text
    assert "token" not in snapshot.text.lower() and "objectKey" not in snapshot.text
    assert (await outsider.get(f"/api/v1/rooms/{body['roomId']}")).status_code == 403
    assert (await host.get(f"/api/v1/rooms/{body['roomId']}/invite")).json()["inviteUrl"] == body[
        "inviteUrl"
    ]
    mismatch = await host.post(
        "/api/v1/rooms", json={"displayName": "Аня"}, headers={"Idempotency-Key": key}
    )
    assert mismatch.status_code == 409
    assert mismatch.json()["error"]["code"] == "DUPLICATE_REQUEST_MISMATCH"
    async with async_sessionmaker(database)() as db:
        assert await db.scalar(select(func.count()).select_from(Room)) == 1
        receipt = await db.scalar(select(HttpReceipt))
        room = await db.scalar(select(Room))
        session = await db.scalar(select(Session))
        assert receipt is not None and token not in json.dumps(receipt.response)
        assert room is not None and token not in room.invite_token_encrypted
        assert session is not None and session.token_hash != host.cookies["unison_session"]


async def test_parallel_joins_allocate_only_one_slot(
    clients: list[AsyncClient], database: AsyncEngine
) -> None:
    host, first, second, *_ = clients
    room_id, token = await create(host)
    replies = await asyncio.gather(
        *[
            guest.post(
                f"/api/v1/rooms/{room_id}/join", json={"inviteToken": token, "displayName": name}
            )
            for guest, name in [(first, "Аня"), (second, "Паша")]
        ]
    )
    assert sorted(r.status_code for r in replies) == [200, 409]
    winner = first if replies[0].status_code == 200 else second
    accepted = replies[0] if replies[0].status_code == 200 else replies[1]
    denied = replies[1] if replies[0].status_code == 200 else replies[0]
    assert accepted.json()["role"] == "listener"
    assert denied.json()["error"]["code"] == "ROOM_FULL"
    repeated = await winner.post(
        f"/api/v1/rooms/{room_id}/join", json={"inviteToken": token, "displayName": "Аня"}
    )
    assert repeated.status_code == 200
    assert repeated.json()["participantId"] == accepted.json()["participantId"]
    assert (await winner.get(f"/api/v1/rooms/{room_id}/invite")).status_code == 403
    closed = await winner.post(
        f"/api/v1/rooms/{room_id}/close", json={"expectedPlaybackRevision": 0}
    )
    assert closed.status_code == 403
    async with async_sessionmaker(database)() as db:
        assert await db.scalar(select(func.count()).select_from(Participant)) == 2


async def test_origin_csrf_and_strict_inputs(clients: list[AsyncClient]) -> None:
    host = clients[0]
    cookie = (await host.get("/api/v1/bootstrap")).headers["set-cookie"]
    assert "HttpOnly" in cookie and "SameSite=lax" in cookie and "Path=/" in cookie
    for header, value, code in [
        ("Origin", "https://other.test", "ORIGIN_FORBIDDEN"),
        ("X-CSRF-Token", "invalid", "CSRF_INVALID"),
    ]:
        reply = await host.post(
            "/api/v1/rooms",
            json={"displayName": "Аня"},
            headers={"Idempotency-Key": str(uuid4()), header: value},
        )
        assert reply.status_code == 403 and reply.json()["error"]["code"] == code
    for payload in [
        {"displayName": "Аня", "role": "host"},
        {"display_name": "Аня"},
        {"displayName": "Ан\nя"},
        {"displayName": True},
    ]:
        reply = await host.post(
            "/api/v1/rooms", json=payload, headers={"Idempotency-Key": str(uuid4())}
        )
        assert reply.status_code == 422
    missing_key = await host.post("/api/v1/rooms", json={"displayName": "Аня"})
    assert missing_key.status_code == 422
    too_large = await host.post(
        "/api/v1/rooms", content=b" " * 65_537, headers={"Content-Type": "application/json"}
    )
    assert too_large.status_code == 413
    assert too_large.json()["error"]["code"] == "REQUEST_TOO_LARGE"


async def test_invites_do_not_reveal_members_or_invalid_room_existence(
    clients: list[AsyncClient],
) -> None:
    host, guest, *_ = clients
    room_id, token = await create(host)
    preview = await guest.post("/api/v1/invites/preview", json={"inviteToken": token})
    assert preview.status_code == 200 and preview.json()["participantCount"] == 1
    assert "Кирилл" not in preview.text and token not in preview.text
    wrong_token = secrets.token_urlsafe(32)
    codes = []
    for target in [room_id, str(uuid4())]:
        response = await guest.post(
            f"/api/v1/rooms/{target}/join", json={"inviteToken": wrong_token, "displayName": "Аня"}
        )
        assert response.status_code == 404
        codes.append(response.json()["error"]["code"])
    assert codes == ["INVITE_INVALID", "INVITE_INVALID"]


async def test_leave_transfers_role_and_close_is_authorized(
    clients: list[AsyncClient], database: AsyncEngine
) -> None:
    host, guest, *_ = clients
    room_id, token = await create(host)
    joined = await guest.post(
        f"/api/v1/rooms/{room_id}/join", json={"inviteToken": token, "displayName": "Аня"}
    )
    assert joined.status_code == 200
    assert (await host.post(f"/api/v1/rooms/{room_id}/leave", json={})).status_code == 204
    state = await guest.get(f"/api/v1/rooms/{room_id}")
    assert state.json()["room"]["hostParticipantId"] == joined.json()["participantId"]
    assert state.json()["participants"][0]["role"] == "host"
    assert (await host.get(f"/api/v1/rooms/{room_id}")).status_code == 403
    conflict = await guest.post(
        f"/api/v1/rooms/{room_id}/close", json={"expectedPlaybackRevision": 9}
    )
    assert conflict.status_code == 409 and conflict.json()["error"]["code"] == "CONFLICT"
    closed = await guest.post(
        f"/api/v1/rooms/{room_id}/close", json={"expectedPlaybackRevision": 0}
    )
    assert closed.status_code == 200 and closed.json()["room"]["status"] == "closed"
    denied = await host.post(
        f"/api/v1/rooms/{room_id}/join", json={"inviteToken": token, "displayName": "Кирилл"}
    )
    assert denied.status_code == 410 and denied.json()["error"]["code"] == "ROOM_CLOSED"
    async with async_sessionmaker(database)() as db:
        events = (await db.scalars(select(Outbox))).all()
        assert any(event.event_type == "host.changed" for event in events)
        assert any(event.event_type == "room.closed" for event in events)


async def test_expired_session_and_room_have_distinct_errors(
    clients: list[AsyncClient], database: AsyncEngine
) -> None:
    host, guest, *_ = clients
    room_id, token = await create(host)
    async with async_sessionmaker(database).begin() as db:
        room = await db.scalar(select(Room))
        assert room is not None
        room.expires_at = datetime.now(UTC) - timedelta(seconds=1)
    response = await guest.post(
        f"/api/v1/rooms/{room_id}/join", json={"inviteToken": token, "displayName": "Аня"}
    )
    assert response.status_code == 410 and response.json()["error"]["code"] == "ROOM_EXPIRED"
    async with async_sessionmaker(database).begin() as db:
        for session in (await db.scalars(select(Session))).all():
            session.expires_at = datetime.now(UTC) - timedelta(seconds=1)
    response = await host.get(f"/api/v1/rooms/{room_id}")
    assert response.status_code == 401 and response.json()["error"]["code"] == "SESSION_EXPIRED"


async def test_create_rate_limit_has_retry_after(clients: list[AsyncClient]) -> None:
    host = clients[0]
    for _ in range(5):
        await create(host)
    response = await host.post(
        "/api/v1/rooms", json={"displayName": "Кирилл"}, headers={"Idempotency-Key": str(uuid4())}
    )
    assert response.status_code == 429
    assert response.json()["error"]["code"] == "RATE_LIMITED"
    assert 1 <= int(response.headers["retry-after"]) <= 60


async def test_failed_commit_never_returns_success(
    clients: list[AsyncClient], database: AsyncEngine, monkeypatch: MonkeyPatch
) -> None:
    original = Rooms.create

    async def fail_commit(
        rooms: Rooms, db: AsyncSession, session: Session, request_id: UUID, payload: CreateRoom
    ) -> CreateRoomResult:
        result = await original(rooms, db, session, request_id, payload)
        room = await db.get(Room, result.room_id)
        assert room is not None
        room.host_participant_id = None
        await db.flush()
        return result

    monkeypatch.setattr(Rooms, "create", fail_commit)
    response = await clients[0].post(
        "/api/v1/rooms", json={"displayName": "Кирилл"}, headers={"Idempotency-Key": str(uuid4())}
    )
    assert response.status_code == 500
    assert response.json()["error"]["code"] == "INTERNAL_ERROR"
    async with async_sessionmaker(database)() as db:
        for model in [Room, HttpReceipt, Outbox, Participant]:
            assert await db.scalar(select(func.count()).select_from(model)) == 0
