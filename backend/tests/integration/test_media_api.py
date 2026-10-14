import asyncio
import secrets
from collections.abc import AsyncIterator
from datetime import UTC, datetime, timedelta
from uuid import UUID, uuid4

import pytest
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient
from pydantic import SecretStr
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncEngine, async_sessionmaker

from app.config import Settings, load_settings
from app.db.models import Asset, Outbox, Room, Track, Upload
from app.main import create_app
from app.resources import Resources

pytestmark = pytest.mark.integration


@pytest.fixture
async def media_clients(database: AsyncEngine) -> AsyncIterator[list[AsyncClient]]:
    bucket = "unison-test-" + uuid4().hex
    config = load_settings().model_copy(
        update={
            "session_secret": SecretStr(secrets.token_urlsafe(48)),
            "s3_bucket": bucket,
            "upload_per_minute": 100,
        }
    )

    class TestResources(Resources):
        def __init__(self, settings: Settings) -> None:
            super().__init__(settings)
            self.engine = database
            self.sessions = async_sessionmaker(database, expire_on_commit=False)

    app = create_app(config, TestResources, start_runtime=False)
    async with LifespanManager(app):
        resources: Resources = app.state.resources
        await asyncio.to_thread(resources.storage.create_bucket, Bucket=bucket)
        clients = [
            AsyncClient(transport=ASGITransport(app=app), base_url=config.app_origin)
            for _ in range(3)
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
            listing = await asyncio.to_thread(resources.storage.list_objects_v2, Bucket=bucket)
            for obj in listing.get("Contents", []):
                await asyncio.to_thread(
                    resources.storage.delete_object, Bucket=bucket, Key=obj["Key"]
                )
            await asyncio.to_thread(resources.storage.delete_bucket, Bucket=bucket)


async def room(host: AsyncClient) -> str:
    response = await host.post(
        "/api/v1/rooms", json={"displayName": "Кирилл"}, headers={"Idempotency-Key": str(uuid4())}
    )
    assert response.status_code == 201
    return str(response.json()["roomId"])


async def reserve(
    host: AsyncClient, room_id: str, size: int = 1024, key: str | None = None
) -> dict[str, object]:
    response = await host.post(
        f"/api/v1/rooms/{room_id}/uploads",
        json={"fileName": "аудио.wav", "contentType": "audio/wav", "sizeBytes": size},
        headers={"Idempotency-Key": key or str(uuid4())},
    )
    assert response.status_code == 201
    result: dict[str, object] = response.json()
    return result


async def test_reservation_completion_are_idempotent_and_outbox_atomic(
    media_clients: list[AsyncClient], database: AsyncEngine
) -> None:
    host = media_clients[0]
    room_id = await room(host)
    key = str(uuid4())
    first = await reserve(host, room_id, key=key)
    repeated = await reserve(host, room_id, key=key)
    assert first["uploadId"] == repeated["uploadId"]
    assert first["expiresAt"] == repeated["expiresAt"]
    upload_id = first["uploadId"]
    path = f"/api/v1/rooms/{room_id}/uploads/{upload_id}/complete"
    missing = await host.post(path, json={})
    assert missing.status_code == 404 and missing.json()["error"]["code"] == "UPLOAD_NOT_FOUND"
    async with AsyncClient() as client:
        url = str(first["uploadUrl"])
        headers = first["requiredHeaders"]
        assert isinstance(headers, dict)
        sent = await client.put(url, content=b"x" * 1024, headers=headers)
        assert sent.status_code == 200
    replies = await asyncio.gather(host.post(path, json={}), host.post(path, json={}))
    assert all(r.status_code == 202 for r in replies)
    assert replies[0].json() == replies[1].json()
    mismatch = await host.post(path, json={"checksum": "a" * 64})
    assert mismatch.status_code == 409
    async with async_sessionmaker(database)() as db:
        assert await db.scalar(select(func.count()).select_from(Upload)) == 1
        assert await db.scalar(select(func.count()).select_from(Track)) == 1
        assert (
            await db.scalar(
                select(func.count())
                .select_from(Outbox)
                .where(Outbox.event_type == "upload.process")
            )
            == 1
        )


async def test_pending_and_source_quotas_are_enforced(
    media_clients: list[AsyncClient], database: AsyncEngine
) -> None:
    host = media_clients[0]
    room_id = await room(host)
    first = await reserve(host, room_id, 50 * 1024 * 1024)
    second = await reserve(host, room_id, 50 * 1024 * 1024)
    payload = {"fileName": "аудио.wav", "contentType": "audio/wav", "sizeBytes": 50 * 1024 * 1024}
    response = await host.post(
        f"/api/v1/rooms/{room_id}/uploads", json=payload, headers={"Idempotency-Key": str(uuid4())}
    )
    assert (
        response.status_code == 409 and response.json()["error"]["code"] == "PENDING_UPLOAD_LIMIT"
    )
    for upload in [first, second]:
        response = await host.delete(f"/api/v1/rooms/{room_id}/uploads/{upload['uploadId']}")
        assert response.status_code == 204
    await reserve(host, room_id, 50 * 1024 * 1024)
    third = await reserve(host, room_id, 50 * 1024 * 1024)
    assert (
        await host.delete(f"/api/v1/rooms/{room_id}/uploads/{third['uploadId']}")
    ).status_code == 204
    response = await host.post(
        f"/api/v1/rooms/{room_id}/uploads", json=payload, headers={"Idempotency-Key": str(uuid4())}
    )
    assert (
        response.status_code == 409 and response.json()["error"]["code"] == "SOURCE_QUOTA_EXCEEDED"
    )


async def test_upload_access_and_bad_file_paths_are_rejected(
    media_clients: list[AsyncClient],
) -> None:
    host, outsider, *_ = media_clients
    room_id = await room(host)
    payload = {"fileName": "аудио.wav", "contentType": "audio/wav", "sizeBytes": 1024}
    denied = await outsider.post(
        f"/api/v1/rooms/{room_id}/uploads", json=payload, headers={"Idempotency-Key": str(uuid4())}
    )
    assert denied.status_code == 403
    for file_name, content_type in [
        ("../secret.wav", "audio/wav"),
        ("x.exe", "audio/wav"),
        ("x.mp3", "audio/wav"),
        ("x.wav", "text/plain"),
    ]:
        response = await host.post(
            f"/api/v1/rooms/{room_id}/uploads",
            json={**payload, "fileName": file_name, "contentType": content_type},
            headers={"Idempotency-Key": str(uuid4())},
        )
        assert response.status_code == 422
    first = await reserve(host, room_id)
    cancelled = await host.delete(f"/api/v1/rooms/{room_id}/uploads/{first['uploadId']}")
    assert cancelled.status_code == 204
    complete = await host.post(
        f"/api/v1/rooms/{room_id}/uploads/{first['uploadId']}/complete", json={}
    )
    assert complete.status_code == 410


async def test_tenth_file_reservation_is_atomic_under_concurrent_requests(
    media_clients: list[AsyncClient], database: AsyncEngine
) -> None:
    host = media_clients[0]
    room_id = await room(host)
    async with async_sessionmaker(database, expire_on_commit=False).begin() as db:
        current_room = await db.get(Room, UUID(room_id))
        assert current_room is not None
        for _ in range(9):
            asset = Asset(
                object_key="test/" + uuid4().hex,
                checksum="a" * 64,
                media_version="a" * 64,
                content_type="audio/mpeg",
                size_bytes=4,
            )
            db.add(asset)
            await db.flush()
            track = Track(
                scope="room",
                room_id=current_room.id,
                title="Готов",
                status="ready",
                duration_ms=1000,
                playback_asset_id=asset.id,
            )
            db.add(track)
            await db.flush()
            db.add(
                Upload(
                    room_id=current_room.id,
                    owner_participant_id=current_room.host_participant_id,
                    track_id=track.id,
                    object_key="sources/" + uuid4().hex,
                    content_type="audio/wav",
                    expected_size=4,
                    actual_size=4,
                    status="ready",
                    expires_at=datetime.now(UTC) + timedelta(minutes=10),
                )
            )
    payload = {"fileName": "аудио.wav", "contentType": "audio/wav", "sizeBytes": 1024}
    replies = await asyncio.gather(
        *[
            host.post(
                f"/api/v1/rooms/{room_id}/uploads",
                json=payload,
                headers={"Idempotency-Key": str(uuid4())},
            )
            for _ in range(2)
        ]
    )
    assert sorted(reply.status_code for reply in replies) == [201, 409]
    rejected = next(reply for reply in replies if reply.status_code == 409)
    assert rejected.json()["error"]["code"] == "FILE_COUNT_LIMIT"
    async with async_sessionmaker(database)() as db:
        assert await db.scalar(select(func.count()).select_from(Upload)) == 10
