import asyncio
import json
import os
import subprocess
import time
from urllib.parse import parse_qs, urlsplit
from uuid import uuid4

import pytest
from httpx import URL, AsyncClient
from websockets.asyncio.client import ClientConnection, connect
from websockets.typing import Origin

from app.config import load_settings

pytestmark = pytest.mark.system


async def event(socket: ClientConnection, kind: str) -> dict[str, object]:
    async with asyncio.timeout(15):
        while True:
            value: dict[str, object] = json.loads(await socket.recv())
            assert value["type"] != "command.error", value
            if value["type"] == kind:
                return value


async def published_url(base: str, container: str) -> str:
    inspected = await asyncio.to_thread(
        subprocess.run,
        ["docker", "inspect", "--format", "{{json .NetworkSettings.Ports}}", container],
        capture_output=True,
        text=True,
        timeout=10,
        check=True,
    )
    bindings = json.loads(inspected.stdout)["8000/tcp"]
    assert bindings and all(b["HostIp"] in {"127.0.0.1", "::1"} for b in bindings)
    return str(URL(base).copy_with(port=int(bindings[0]["HostPort"]))).rstrip("/")


@pytest.mark.parametrize("pending_seek", [False, True], ids=["playing", "pending"])
async def test_api_restart_pauses_timeline_and_restores_sessions_without_duplicate_members(
    pending_seek: bool,
) -> None:
    base, container = (
        os.environ.get("UNISON_SYSTEM_URL"),
        os.environ.get("UNISON_RESTART_CONTAINER"),
    )
    if not base or not container:
        pytest.skip("Set an isolated API URL and UNISON_RESTART_CONTAINER to test restart")
    assert container.startswith(("unison-load-", "unison-ci-")) and container.endswith("-api-1")
    assert urlsplit(base).hostname in {"localhost", "127.0.0.1", "::1"}
    base = await published_url(base, container)
    origin = load_settings().app_origin
    async with (
        AsyncClient(base_url=base, timeout=10) as host,
        AsyncClient(base_url=base, timeout=10) as guest,
    ):
        sockets: list[ClientConnection] = []
        room_id: str | None = None
        try:
            for client in [host, guest]:
                bootstrap = await client.get("/api/v1/bootstrap")
                assert bootstrap.status_code == 200
                client.headers.update(
                    {"Origin": origin, "X-CSRF-Token": bootstrap.json()["csrfToken"]}
                )
            created = await host.post(
                "/api/v1/rooms",
                json={"displayName": "Кирилл"},
                headers={"Idempotency-Key": str(uuid4())},
            )
            assert created.status_code == 201
            data = created.json()
            room_id = str(data["roomId"])
            invite = parse_qs(urlsplit(data["inviteUrl"]).fragment)["invite"][0]
            joined = await guest.post(
                f"/api/v1/rooms/{room_id}/join", json={"inviteToken": invite, "displayName": "Аня"}
            )
            assert joined.status_code == 200
            tracks = await host.get("/api/v1/tracks")
            assert tracks.status_code == 200 and tracks.json()["items"]
            track_id = tracks.json()["items"][0]["id"]
            ws = (
                base.replace("http://", "ws://").replace("https://", "wss://")
                + f"/ws/v1/rooms/{room_id}"
            )
            initial = []
            for client in [host, guest]:
                socket = await connect(
                    ws,
                    origin=Origin(origin),
                    additional_headers={
                        "Cookie": "; ".join(f"{k}={v}" for k, v in client.cookies.items())
                    },
                    ping_interval=None,
                )
                sockets.append(socket)
                initial.append(await event(socket, "hello"))
            initial_payload = initial[0]["payload"]
            assert isinstance(initial_payload, dict)
            old_epoch = initial_payload["epoch"]
            revision = initial[0]["playbackRevision"]
            host_socket = sockets[0]

            async def control(kind: str, payload: dict[str, object]) -> None:
                nonlocal revision
                await host_socket.send(
                    json.dumps(
                        {
                            "v": 1,
                            "type": kind,
                            "requestId": str(uuid4()),
                            "expectedPlaybackRevision": revision,
                            "payload": payload,
                        }
                    )
                )
                ack = await event(host_socket, "command.ack")
                revision = ack["playbackRevision"]

            for kind, payload in [
                ("playback.select", {"trackId": track_id}),
                ("playback.seek", {"positionMs": 10_000}),
            ]:
                await control(kind, payload)
            await asyncio.sleep(1.6)
            await control("playback.play", {"allowNotReady": True})
            await asyncio.sleep(1.6)
            before = await host.get(f"/api/v1/rooms/{room_id}")
            assert before.json()["playback"]["status"] == "playing"
            if pending_seek:
                await control("playback.seek", {"positionMs": 20_000})
                before = await host.get(f"/api/v1/rooms/{room_id}")
                assert before.json()["playback"]["pendingTransition"] is not None
            restarted = await asyncio.to_thread(
                subprocess.run,
                ["docker", "restart", "--time", "3", container],
                capture_output=True,
                text=True,
                timeout=20,
                check=False,
            )
            assert restarted.returncode == 0
            base = await published_url(base, container)
            host.base_url = URL(base)
            guest.base_url = URL(base)
            ws = (
                base.replace("http://", "ws://").replace("https://", "wss://")
                + f"/ws/v1/rooms/{room_id}"
            )
            deadline = time.monotonic() + 30
            while True:
                try:
                    ready = await host.get("/health/ready")
                    if ready.status_code == 200:
                        break
                except Exception:
                    pass
                assert time.monotonic() < deadline
                await asyncio.sleep(0.2)
            snapshot = await host.get(f"/api/v1/rooms/{room_id}")
            assert snapshot.status_code == 200
            state = snapshot.json()
            assert len(state["participants"]) == 2
            assert {p["id"] for p in state["participants"]} == {
                data["participantId"],
                joined.json()["participantId"],
            }
            assert state["playback"]["epoch"] != old_epoch
            assert state["playback"]["status"] == "paused"
            assert state["playback"]["pendingTransition"] is None
            assert state["playback"]["trackId"] == track_id
            saved_position = state["playback"]["positionMs"]
            assert 10_000 <= saved_position < 40_000
            assert state["playbackRevision"] > int(str(revision))
            revision = state["playbackRevision"]
            for client in [host, guest]:
                socket = await connect(
                    ws,
                    origin=Origin(origin),
                    additional_headers={
                        "Cookie": "; ".join(f"{k}={v}" for k, v in client.cookies.items())
                    },
                    ping_interval=None,
                )
                sockets.append(socket)
                hello = await event(socket, "hello")
                assert isinstance(hello["payload"], dict)
                assert hello["payload"]["snapshot"]["playback"]["status"] == "paused"
            host_socket = sockets[-2]
            await control("playback.play", {"allowNotReady": True})
            await asyncio.sleep(1.6)
            resumed = await host.get(f"/api/v1/rooms/{room_id}")
            assert resumed.json()["playback"]["status"] == "playing"
            assert (
                saved_position <= resumed.json()["playback"]["positionMs"] < saved_position + 5000
            )
        finally:
            await asyncio.gather(*(socket.close() for socket in sockets), return_exceptions=True)
            if room_id:
                snapshot = await host.get(f"/api/v1/rooms/{room_id}")
                if snapshot.status_code == 200:
                    await host.post(
                        f"/api/v1/rooms/{room_id}/close",
                        json={"expectedPlaybackRevision": snapshot.json()["playbackRevision"]},
                    )
