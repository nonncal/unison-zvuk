import asyncio
import hashlib
import os
import time
from urllib.parse import parse_qs, urlsplit
from uuid import uuid4

import pytest
from httpx import AsyncClient

from app.config import load_settings
from tests.system.test_database_outage import docker
from tests.system.test_restart import published_url

pytestmark = pytest.mark.system


async def test_storage_outage_rejects_urls_and_recovers_same_immutable_audio() -> None:
    base, container = (
        os.environ.get("UNISON_SYSTEM_URL"),
        os.environ.get("UNISON_STORAGE_CONTAINER"),
    )
    if not base or not container:
        pytest.skip("Set an isolated API URL and UNISON_STORAGE_CONTAINER to test storage outage")
    assert container.startswith(("unison-load-", "unison-ci-")) and container.endswith("-storage-1")
    assert urlsplit(base).hostname in {"localhost", "127.0.0.1", "::1"}
    api = os.environ.get("UNISON_RESTART_CONTAINER")
    if api:
        assert api.startswith(("unison-load-", "unison-ci-")) and api.endswith("-api-1")
        base = await published_url(base, api)
    async with (
        AsyncClient(base_url=base, timeout=10) as host,
        AsyncClient(base_url=base, timeout=10) as guest,
    ):
        for client in [host, guest]:
            bootstrap = await client.get("/api/v1/bootstrap")
            assert bootstrap.status_code == 200
            client.headers.update(
                {
                    "Origin": load_settings().app_origin,
                    "X-CSRF-Token": bootstrap.json()["csrfToken"],
                }
            )
        created = await host.post(
            "/api/v1/rooms",
            json={"displayName": "Кирилл"},
            headers={"Idempotency-Key": str(uuid4())},
        )
        assert created.status_code == 201
        data = created.json()
        room_id = data["roomId"]
        paused = False
        try:
            token = parse_qs(urlsplit(data["inviteUrl"]).fragment)["invite"][0]
            joined = await guest.post(
                f"/api/v1/rooms/{room_id}/join", json={"inviteToken": token, "displayName": "Аня"}
            )
            assert joined.status_code == 200
            tracks = await host.get("/api/v1/tracks")
            assert tracks.status_code == 200 and tracks.json()["items"]
            track_id = tracks.json()["items"][0]["id"]
            path = f"/api/v1/rooms/{room_id}/tracks/{track_id}/playback-url"
            original = await host.post(path, json={})
            assert original.status_code == 200
            await docker("pause", container)
            paused = True
            ready = await host.get("/health/ready")
            assert ready.status_code == 503 and ready.json()["checks"]["storage"] is False
            assert (await host.get("/health/live")).status_code == 200
            assert (await host.get(f"/api/v1/rooms/{room_id}")).status_code == 200
            unavailable = await host.post(path, json={})
            assert unavailable.status_code == 503
            assert unavailable.json()["error"]["code"] == "MEDIA_UNAVAILABLE"
            assert "url" not in unavailable.json()
            await docker("unpause", container)
            paused = False
            deadline = time.monotonic() + 20
            while (await host.get("/health/ready")).status_code != 200:
                assert time.monotonic() < deadline
                await asyncio.sleep(0.2)
            for client in [host, guest]:
                restored = await client.post(path, json={})
                assert restored.status_code == 200
                assert restored.json()["mediaVersion"] == original.json()["mediaVersion"]
                assert restored.json()["checksum"] == original.json()["checksum"]
                async with AsyncClient(timeout=10) as downloader:
                    audio = await downloader.get(restored.json()["url"])
                    assert audio.status_code == 200
                    assert hashlib.sha256(audio.content).hexdigest() == original.json()["checksum"]
        finally:
            if paused:
                await docker("unpause", container)
            state = await host.get(f"/api/v1/rooms/{room_id}")
            if state.status_code == 200:
                await host.post(
                    f"/api/v1/rooms/{room_id}/close",
                    json={"expectedPlaybackRevision": state.json()["playbackRevision"]},
                )
