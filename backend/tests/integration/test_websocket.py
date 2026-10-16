import asyncio
import json
import secrets
import socket
import time
from collections.abc import AsyncIterator
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Any
from urllib.parse import parse_qs, urlsplit
from uuid import UUID, uuid4

import pytest
import uvicorn
from fastapi import FastAPI
from httpx import AsyncClient
from pydantic import SecretStr
from redis.asyncio import Redis
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncEngine, async_sessionmaker
from websockets.asyncio.client import ClientConnection, connect
from websockets.exceptions import ConnectionClosed, InvalidStatus
from websockets.typing import Origin

from app.config import Settings, load_settings
from app.contracts.ws import event_adapter
from app.db.models import Outbox, Participant, PlaybackState, Room
from app.main import create_app
from app.resources import Resources
from app.services.metrics import Metrics
from app.services.runtime import Runtime
from tests.integration.test_playback import track

pytestmark = pytest.mark.integration


@dataclass
class Server:
    app: FastAPI
    url: str
    origin: str
    clients: list[AsyncClient]

    @property
    def runtime(self) -> Runtime:
        runtime: Runtime = self.app.state.runtime
        return runtime

    def ws(self, room_id: str, client: AsyncClient, origin: str | None = None) -> connect:
        return connect(
            self.url.replace("http:", "ws:") + "/ws/v1/rooms/" + room_id,
            origin=Origin(origin or self.origin),
            proxy=None,
            additional_headers={"Cookie": "unison_session=" + client.cookies["unison_session"]},
            ping_interval=None,
            close_timeout=1,
        )


@pytest.fixture
async def server(database: AsyncEngine) -> AsyncIterator[Server]:
    config = load_settings().model_copy(
        update={
            "session_secret": SecretStr(secrets.token_urlsafe(48)),
            "heartbeat_seconds": 1,
            "offline_seconds": 3,
            "host_grace_seconds": 1,
            "readiness_wait_seconds": 0.3,
        }
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

    app = create_app(config, TestResources)
    listener = socket.socket()
    listener.bind(("127.0.0.1", 0))
    listener.listen()
    port = listener.getsockname()[1]
    http_server = uvicorn.Server(
        uvicorn.Config(
            app,
            host="127.0.0.1",
            port=port,
            ws="websockets-sansio",
            ws_max_size=16_384,
            ws_max_queue=16,
            log_level="error",
            access_log=False,
        )
    )
    task = asyncio.create_task(http_server.serve(sockets=[listener]))
    deadline = time.monotonic() + 5
    while not http_server.started:
        if task.done():
            task.result()
        if time.monotonic() > deadline:
            raise RuntimeError("Local test server did not start")
        await asyncio.sleep(0.01)
    assert app.state.runtime.ready
    url = f"http://127.0.0.1:{port}"
    clients = [AsyncClient(base_url=url) for _ in range(3)]
    try:
        for client in clients:
            response = await client.get("/api/v1/bootstrap")
            assert response.status_code == 200, response.text
            client.headers.update(
                {"Origin": config.app_origin, "X-CSRF-Token": response.json()["csrfToken"]}
            )
        yield Server(app, url, config.app_origin, clients)
    finally:
        for client in clients:
            await client.aclose()
        http_server.should_exit = True
        await asyncio.wait_for(task, timeout=6)
        listener.close()


async def create_room(server: Server) -> tuple[str, str]:
    response = await server.clients[0].post(
        "/api/v1/rooms", json={"displayName": "Кирилл"}, headers={"Idempotency-Key": str(uuid4())}
    )
    assert response.status_code == 201, response.text
    body = response.json()
    return body["roomId"], parse_qs(urlsplit(body["inviteUrl"]).fragment)["invite"][0]


async def send(
    client: ClientConnection,
    kind: str,
    payload: dict[str, Any],
    revision: int | None = None,
    request_id: str | None = None,
) -> str:
    request_id = request_id or str(uuid4())
    await client.send(
        json.dumps(
            {
                "v": 1,
                "type": kind,
                "requestId": request_id,
                "expectedPlaybackRevision": revision,
                "payload": payload,
            }
        )
    )
    return request_id


async def receive(client: ClientConnection, kind: str) -> dict[str, Any]:
    async with asyncio.timeout(3):
        while True:
            raw = await client.recv()
            parsed = event_adapter.validate_json(raw).model_dump(mode="json", by_alias=True)
            if parsed["type"] == "heartbeat.ping":
                await send(client, "heartbeat.pong", parsed["payload"])
            if parsed["type"] == kind:
                return parsed


async def join_guest(server: Server, room_id: str, token: str) -> None:
    response = await server.clients[1].post(
        f"/api/v1/rooms/{room_id}/join", json={"inviteToken": token, "displayName": "Аня"}
    )
    assert response.status_code == 200, response.text


async def test_handshake_clock_and_replacement_keep_new_presence(server: Server) -> None:
    room_id, _ = await create_room(server)
    with pytest.raises(InvalidStatus):
        async with server.ws(room_id, server.clients[2]):
            pass
    with pytest.raises(InvalidStatus):
        async with server.ws(room_id, server.clients[0], origin="https://wrong.test"):
            pass
    async with server.ws(room_id, server.clients[0]) as old:
        hello = await receive(old, "hello")
        assert hello["payload"]["snapshot"]["participants"][0]["connectionState"] == "online"
        probe = str(uuid4())
        await send(old, "clock.probe", {"probeId": probe, "clientSentAtMs": 123_000})
        reply = await receive(old, "clock.reply")
        assert reply["payload"]["probeId"] == probe
        assert reply["payload"]["clientSentAtMs"] == 123_000
        assert reply["payload"]["serverSentAtMs"] >= reply["payload"]["serverReceivedAtMs"]
        async with server.ws(room_id, server.clients[0]) as new:
            replacement = await receive(new, "hello")
            assert replacement["payload"]["connectionId"] != hello["payload"]["connectionId"]
            with pytest.raises(ConnectionClosed) as closed:
                while True:
                    await old.recv()
            assert closed.value.rcvd is not None and closed.value.rcvd.code == 4001
            await send(new, "room.snapshot.request", {})
            snapshot = await receive(new, "room.snapshot")
            assert snapshot["payload"]["participants"][0]["connectionState"] == "online"
            assert len(server.runtime.manager.connections) == 1


async def test_playback_readiness_pending_and_listener_authority(
    server: Server, database: AsyncEngine
) -> None:
    room_id, token = await create_room(server)
    await join_guest(server, room_id, token)
    async with async_sessionmaker(database).begin() as db:
        track_id = await track(db)
    async with (
        server.ws(room_id, server.clients[0]) as host,
        server.ws(room_id, server.clients[1]) as guest,
    ):
        await receive(host, "hello")
        await receive(guest, "hello")
        await send(host, "playback.select", {"trackId": str(track_id)}, 0)
        ack = await receive(host, "command.ack")
        assert ack["payload"]["acceptedPlaybackRevision"] == 1
        await receive(guest, "playback.state")
        await send(guest, "playback.play", {"allowNotReady": True}, 1)
        denied = await receive(guest, "command.error")
        assert denied["payload"]["code"] == "FORBIDDEN"
        readiness = {
            "trackId": str(track_id),
            "mediaVersion": "test-v1",
            "state": "ready",
            "bufferedAheadMs": 5000,
            "autoplayAllowed": True,
        }
        await send(host, "participant.readiness", readiness)
        await send(guest, "participant.readiness", {**readiness, "autoplayAllowed": False})
        await receive(guest, "presence.changed")
        await send(host, "playback.play", {}, 1)
        blocked = await receive(host, "command.error")
        assert blocked["payload"]["code"] == "NOT_ALL_READY"
        await send(guest, "participant.readiness", {**readiness, "mediaVersion": "old"})
        assert (await receive(guest, "command.error"))["payload"]["code"] == "CONFLICT"
        await send(guest, "participant.readiness", readiness)
        await asyncio.sleep(0.1)
        play_id = await send(host, "playback.play", {}, 1)
        ack = await receive(host, "command.ack")
        effective = ack["payload"]["effectiveAtServerTimeMs"]
        assert ack["payload"]["acceptedPlaybackRevision"] == 2
        event = await receive(guest, "playback.state")
        assert event["payload"]["status"] == "paused"
        assert event["payload"]["pendingTransition"]["effectiveAtServerTimeMs"] == effective
        await send(host, "playback.play", {}, 1, play_id)
        assert (await receive(host, "command.ack"))["payload"] == ack["payload"]
        await send(host, "playback.pause", {}, 2)
        assert (await receive(host, "command.error"))["payload"]["code"] == "PENDING_TRANSITION"
        await asyncio.sleep(0.85)
        await send(host, "room.snapshot.request", {})
        snapshot = await receive(host, "room.snapshot")
        while snapshot["payload"]["playback"]["pendingTransition"] is not None:
            snapshot = await receive(host, "room.snapshot")
        assert snapshot["payload"]["playback"]["status"] == "playing"
        assert snapshot["payload"]["playbackRevision"] == 2
        response = await server.clients[0].post(
            f"/api/v1/rooms/{room_id}/close", json={"expectedPlaybackRevision": 2}
        )
        assert response.status_code == 200
        assert (await receive(guest, "room.closed"))["payload"]["reason"] == "closedByHost"


async def test_malformed_protocol_is_reported_then_closed(server: Server) -> None:
    room_id, _ = await create_room(server)
    async with server.ws(room_id, server.clients[0]) as client:
        await receive(client, "hello")
        await client.send('{"v":2,"type":"playback.play"}')
        error = await receive(client, "command.error")
        assert error["payload"]["code"] == "PROTOCOL_MISMATCH"
        with pytest.raises(ConnectionClosed) as closed:
            while True:
                await client.recv()
        assert closed.value.rcvd is not None and closed.value.rcvd.code == 1002


async def test_runtime_lease_is_exclusive_and_released(server: Server) -> None:
    first = server.runtime
    second = Runtime(first.resources, first.manager.security)
    await second.acquire()
    assert not second.ready
    await first.stop()
    await second.acquire()
    assert second.ready
    await second.stop()


async def test_scheduler_ends_committed_timeline_with_sql_null(
    server: Server, database: AsyncEngine
) -> None:
    room_id, _ = await create_room(server)
    async with async_sessionmaker(database).begin() as db:
        track_id = await track(db)
        state = await db.get(PlaybackState, UUID(room_id))
        assert state is not None
        state.status = "playing"
        state.track_id = track_id
        state.media_version = "test-v1"
        state.duration_ms = 30_000
        state.position_ms = 0
        state.anchor_server_time_ms = server.runtime.clock.now_ms() - 31_000
        state.pending_transition = None
    await server.runtime.advance_due()
    async with async_sessionmaker(database)() as db:
        state = await db.get(PlaybackState, UUID(room_id))
        assert state is not None and state.status == "ended" and state.position_ms == 30_000
        assert state.playback_revision == 1


async def test_explicit_leave_transfers_online_host_and_return_is_listener(
    server: Server, database: AsyncEngine
) -> None:
    room_id, token = await create_room(server)
    await join_guest(server, room_id, token)
    async with (
        server.ws(room_id, server.clients[0]) as host,
        server.ws(room_id, server.clients[1]) as guest,
    ):
        await receive(host, "hello")
        guest_hello = await receive(guest, "hello")
        guest_id = next(
            p["id"]
            for p in guest_hello["payload"]["snapshot"]["participants"]
            if p["role"] == "listener"
        )
        reply = await server.clients[0].post(f"/api/v1/rooms/{room_id}/leave", json={})
        assert reply.status_code == 204
        changed = await receive(guest, "host.changed")
        assert changed["payload"]["participantId"] == guest_id
        with pytest.raises(InvalidStatus):
            async with server.ws(room_id, server.clients[0]):
                pass
        rejoined = await server.clients[0].post(
            f"/api/v1/rooms/{room_id}/join", json={"inviteToken": token, "displayName": "Кирилл"}
        )
        assert rejoined.status_code == 200 and rejoined.json()["role"] == "listener"
        async with server.ws(room_id, server.clients[0]) as returned:
            hello = await receive(returned, "hello")
            snapshot = hello["payload"]["snapshot"]
            assert snapshot["room"]["hostParticipantId"] == guest_id
            assert sum(p["role"] == "host" for p in snapshot["participants"]) == 1
    async with async_sessionmaker(database)() as db:
        members = (await db.scalars(select(Participant))).all()
        assert len(members) == 2


async def test_offline_grace_transfers_host_and_reconnect_restores_membership(
    server: Server,
) -> None:
    room_id, token = await create_room(server)
    await join_guest(server, room_id, token)
    async with (
        server.ws(room_id, server.clients[0]) as host,
        server.ws(room_id, server.clients[1]) as guest,
    ):
        await receive(host, "hello")
        hello = await receive(guest, "hello")
        guest_id = next(
            p["id"] for p in hello["payload"]["snapshot"]["participants"] if p["role"] == "listener"
        )
        await host.close()
        changed = await receive(guest, "host.changed")
        assert changed["payload"]["participantId"] == guest_id
        async with server.ws(room_id, server.clients[0]) as returned:
            snapshot = (await receive(returned, "hello"))["payload"]["snapshot"]
            assert snapshot["room"]["hostParticipantId"] == guest_id
            assert len(snapshot["participants"]) == 2
            host_member = next(p for p in snapshot["participants"] if p["displayName"] == "Кирилл")
            assert host_member["role"] == "listener" and host_member["connectionState"] == "online"


async def test_room_ttl_closes_with_event_and_timestamp(
    server: Server, database: AsyncEngine
) -> None:
    room_id, _ = await create_room(server)
    async with async_sessionmaker(database).begin() as db:
        room = await db.get(Room, UUID(room_id))
        assert room is not None
        room.expires_at = datetime.now(UTC) - timedelta(seconds=1)
    await server.runtime.lifecycle()
    async with async_sessionmaker(database)() as db:
        room = await db.get(Room, UUID(room_id))
        assert room is not None and room.status == "expired" and room.closed_at is not None
        events = (await db.scalars(select(Outbox).where(Outbox.event_type == "room.closed"))).all()
        assert len(events) == 1 and events[0].payload["reason"] == "expired"


async def test_closed_rooms_do_not_accumulate_offline_reservations(server: Server) -> None:
    for _ in range(3):
        room_id, _ = await create_room(server)
        async with server.ws(room_id, server.clients[0]) as host:
            hello = await receive(host, "hello")
            revision = hello["playbackRevision"]
            closed = await server.clients[0].post(
                f"/api/v1/rooms/{room_id}/close", json={"expectedPlaybackRevision": revision}
            )
            assert closed.status_code == 200
            assert (await receive(host, "room.closed"))["payload"]["reason"] == "closedByHost"
        await server.runtime.lifecycle()
        assert not server.runtime.manager.offline_since
        assert not server.runtime.manager.connections


async def test_reconnect_cannot_take_an_approved_guests_reserved_seat(
    server: Server, database: AsyncEngine
) -> None:
    room_id, token = await create_room(server)
    await join_guest(server, room_id, token)
    base = f"/api/v1/rooms/{room_id}"
    host, returning, waiting = server.clients
    async with async_sessionmaker(database).begin() as db:
        member = await db.scalar(
            select(Participant).where(
                Participant.room_id == UUID(room_id), Participant.role == "listener"
            )
        )
        assert member is not None
        member.left_at = datetime.now(UTC)
        member.left_reason = "offlineTimeout"
    configured = await host.patch(base + "/settings", json={"capacity": 2, "moderated": True})
    assert configured.status_code == 200
    pending = await waiting.post(
        base + "/entry", json={"inviteToken": token, "displayName": "Ожидающий"}
    )
    assert pending.json()["status"] == "pending"
    items = (await host.get(base + "/waiting")).json()["items"]
    approved = await host.post(base + f"/waiting/{items[0]['id']}", json={"admit": True})
    assert approved.status_code == 200
    assert (await returning.post(base + "/resume", json={})).status_code == 409
    with pytest.raises(InvalidStatus):
        async with server.ws(room_id, returning):
            pass
    admitted = await waiting.post(
        base + "/entry", json={"inviteToken": token, "displayName": "Ожидающий"}
    )
    assert admitted.json()["status"] == "admitted"
