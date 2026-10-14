import asyncio
import os
import subprocess
import time
from urllib.parse import urlsplit
from uuid import uuid4

import pytest
from httpx import AsyncClient, HTTPError

from app.config import load_settings

pytestmark = pytest.mark.system


async def docker(action: str, container: str) -> None:
    command = ["docker", action]
    if action == "stop":
        command += ["--time", "2"]
    result = await asyncio.to_thread(
        subprocess.run, command + [container], capture_output=True, timeout=20, check=False
    )
    assert result.returncode == 0


async def test_database_outage_rejects_writes_and_recovers_existing_sessions() -> None:
    base = os.environ.get("UNISON_SYSTEM_URL")
    container = os.environ.get("UNISON_DATABASE_CONTAINER")
    if not base or not container:
        pytest.skip("Set an isolated API URL and UNISON_DATABASE_CONTAINER to test outage")
    assert container.startswith(("unison-load-", "unison-ci-"))
    assert container.endswith("-postgres-1")
    assert urlsplit(base).hostname in {"localhost", "127.0.0.1", "::1"}
    async with AsyncClient(base_url=base, timeout=10) as client:
        bootstrap = await client.get("/api/v1/bootstrap")
        assert bootstrap.status_code == 200
        client.headers.update(
            {"Origin": load_settings().app_origin, "X-CSRF-Token": bootstrap.json()["csrfToken"]}
        )
        key = str(uuid4())
        rooms: set[str] = set()
        try:
            await docker("stop", container)
            assert (await client.get("/health/live")).status_code == 200
            ready = await client.get("/health/ready")
            assert ready.status_code == 503 and ready.json()["checks"]["database"] is False
            rejected = await client.post(
                "/api/v1/rooms",
                json={"displayName": "Кирилл"},
                headers={"Idempotency-Key": key},
            )
            assert rejected.status_code == 503
            assert rejected.json()["error"]["code"] == "UNAVAILABLE"
        finally:
            await docker("start", container)
            deadline = time.monotonic() + 40
            while True:
                try:
                    ready = await client.get("/health/ready")
                    if ready.status_code == 200:
                        break
                except HTTPError:
                    pass
                assert time.monotonic() < deadline
                await asyncio.sleep(0.3)
        try:
            for _ in range(2):
                created = await client.post(
                    "/api/v1/rooms",
                    json={"displayName": "Кирилл"},
                    headers={"Idempotency-Key": key},
                )
                assert created.status_code == 201
                rooms.add(created.json()["roomId"])
            assert len(rooms) == 1
        finally:
            for room_id in rooms:
                state = await client.get(f"/api/v1/rooms/{room_id}")
                assert state.status_code == 200
                assert len(state.json()["participants"]) == 1
                await client.post(
                    f"/api/v1/rooms/{room_id}/close",
                    json={"expectedPlaybackRevision": state.json()["playbackRevision"]},
                )
