import argparse
import asyncio
import io
import json
import os
import platform
import re
import resource
import statistics
import subprocess
import time
import wave
from dataclasses import dataclass, field
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlsplit
from uuid import uuid4

import httpx
from websockets.asyncio.client import ClientConnection, connect
from websockets.typing import Origin


def percentiles(values: list[float]) -> dict[str, float | int]:
    ordered = sorted(values)
    if not ordered:
        return {"count": 0}
    return {
        "count": len(values),
        "p50": round(statistics.median(ordered), 2),
        "p95": round(ordered[min(len(ordered) - 1, int(len(ordered) * 0.95))], 2),
        "max": round(ordered[-1], 2),
    }


@dataclass
class Room:
    id: str
    host_cookie: str
    guest_cookie: str
    csrf: str


@dataclass
class Samples:
    http_ms: list[float] = field(default_factory=list)
    clock_ms: list[float] = field(default_factory=list)
    command_ms: list[float] = field(default_factory=list)
    errors: dict[str, int] = field(default_factory=dict)
    active: int = 0
    peak: int = 0
    uploads_ready: int = 0
    system: list[dict[str, Any]] = field(default_factory=list)

    def error(self, category: str) -> None:
        self.errors[category] = self.errors.get(category, 0) + 1


class Socket:
    def __init__(self, websocket: ClientConnection, samples: Samples) -> None:
        self.websocket = websocket
        self.samples = samples
        self.revision = 0
        self.status = "empty"
        self.waiting: dict[str, asyncio.Future[dict[str, Any]]] = {}
        self.writer = asyncio.Lock()
        self.reader: asyncio.Task[None] | None = None

    async def send(self, message: dict[str, Any]) -> None:
        async with self.writer:
            await self.websocket.send(json.dumps(message))

    async def request(self, kind: str, payload: dict[str, Any]) -> None:
        request_id = str(uuid4())
        future: asyncio.Future[dict[str, Any]] = asyncio.get_running_loop().create_future()
        self.waiting[request_id] = future
        data: dict[str, Any] = {"v": 1, "type": kind, "requestId": request_id, "payload": payload}
        if kind.startswith("playback."):
            data["expectedPlaybackRevision"] = self.revision
        if kind == "clock.probe":
            payload["probeId"] = request_id
            payload["clientSentAtMs"] = int(time.monotonic() * 1000)
        started = time.perf_counter()
        try:
            await self.send(data)
            response = await asyncio.wait_for(future, 10)
            elapsed = (time.perf_counter() - started) * 1000
            if response["type"] == "command.error":
                self.samples.error(response["payload"]["code"])
            elif kind == "clock.probe":
                self.samples.clock_ms.append(elapsed)
            else:
                self.samples.command_ms.append(elapsed)
        finally:
            self.waiting.pop(request_id, None)

    async def receive(self) -> None:
        self.samples.active += 1
        self.samples.peak = max(self.samples.peak, self.samples.active)
        try:
            async for raw in self.websocket:
                event = json.loads(raw)
                self.revision = max(self.revision, event["playbackRevision"])
                if event["type"] == "playback.state":
                    self.status = event["payload"]["status"]
                if event["type"] in {"hello", "room.snapshot"}:
                    snapshot = event["payload"].get("snapshot", event["payload"])
                    self.status = snapshot["playback"]["status"]
                if event["type"] == "heartbeat.ping":
                    await self.send(
                        {
                            "v": 1,
                            "type": "heartbeat.pong",
                            "requestId": str(uuid4()),
                            "payload": event["payload"],
                        }
                    )
                payload = event["payload"]
                identifier = payload.get("requestId") or payload.get("probeId")
                future = self.waiting.get(identifier)
                if future is not None and not future.done():
                    future.set_result(event)
        except Exception as error:
            self.samples.error(type(error).__name__)
        finally:
            self.samples.active -= 1
            for future in self.waiting.values():
                if not future.done():
                    future.set_exception(RuntimeError("Connection closed"))

    async def close(self) -> None:
        await self.websocket.close()
        if self.reader:
            await self.reader


async def provision(base: str, origin: str) -> Room:
    async with (
        httpx.AsyncClient(base_url=base, timeout=20) as host,
        httpx.AsyncClient(base_url=base, timeout=20) as guest,
    ):
        tokens = []
        for client in [host, guest]:
            reply = await client.get("/api/v1/bootstrap")
            if reply.status_code != 200:
                raise RuntimeError("Bootstrap failed")
            tokens.append(reply.json()["csrfToken"])
        response = await host.post(
            "/api/v1/rooms",
            json={"displayName": "Ведущий"},
            headers={"Origin": origin, "X-CSRF-Token": tokens[0], "Idempotency-Key": str(uuid4())},
        )
        if response.status_code != 201:
            raise RuntimeError("Room creation failed")
        body = response.json()
        token = parse_qs(urlsplit(body["inviteUrl"]).fragment)["invite"][0]
        joined = await guest.post(
            f"/api/v1/rooms/{body['roomId']}/join",
            json={"inviteToken": token, "displayName": "Слушатель"},
            headers={"Origin": origin, "X-CSRF-Token": tokens[1]},
        )
        if joined.status_code != 200:
            raise RuntimeError("Room join failed")
        return Room(
            body["roomId"],
            "; ".join(f"{k}={v}" for k, v in host.cookies.items()),
            "; ".join(f"{k}={v}" for k, v in guest.cookies.items()),
            tokens[0],
        )


async def upload_pair(client: httpx.AsyncClient, room: Room, origin: str, samples: Samples) -> None:
    stream = io.BytesIO()
    with wave.open(stream, "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(8000)
        output.writeframes(b"\x00\x00" * (8000 * 840))
    source = stream.getvalue()
    headers = {"Cookie": room.host_cookie, "Origin": origin, "X-CSRF-Token": room.csrf}

    async def upload() -> None:
        reserved = await client.post(
            f"/api/v1/rooms/{room.id}/uploads",
            json={
                "fileName": "benchmark.wav",
                "contentType": "audio/wav",
                "sizeBytes": len(source),
            },
            headers={**headers, "Idempotency-Key": str(uuid4())},
        )
        if reserved.status_code != 201:
            raise RuntimeError("Upload reservation failed")
        data = reserved.json()
        sent = await client.put(
            data["uploadUrl"], content=source, headers=data["requiredHeaders"], timeout=30
        )
        if sent.status_code != 200:
            raise RuntimeError("Source upload failed")
        completion = await client.post(
            f"/api/v1/rooms/{room.id}/uploads/{data['uploadId']}/complete", json={}, headers=headers
        )
        if completion.status_code != 202:
            raise RuntimeError("Upload completion failed")
        deadline = time.monotonic() + 260
        while time.monotonic() < deadline:
            result = await client.get(
                f"/api/v1/rooms/{room.id}/tracks/{completion.json()['trackId']}", headers=headers
            )
            if result.status_code != 200:
                raise RuntimeError("Upload status failed")
            if result.json()["status"] == "ready":
                samples.uploads_ready += 1
                return
            if result.json()["status"] == "failed":
                samples.error("upload_failed")
                return
            await asyncio.sleep(0.5)
        samples.error("upload_timeout")

    await asyncio.gather(upload(), upload())


async def run(
    base: str, origin: str, count: int, seconds: int, report: Path, project: str | None = None
) -> None:
    samples = Samples()
    rooms: list[Room] = []
    sockets: list[Socket] = []
    tasks: list[asyncio.Task[None]] = []
    started = time.monotonic()
    hardware: dict[str, Any] = {"hostCpuCount": os.cpu_count()}
    if project:
        info = await asyncio.to_thread(
            subprocess.run,
            ["docker", "info", "--format", '{"cpus":{{.NCPU}},"memoryBytes":{{.MemTotal}}}'],
            capture_output=True,
            text=True,
            check=False,
        )
        if info.returncode == 0:
            hardware["dockerVM"] = json.loads(info.stdout)
    async with httpx.AsyncClient(base_url=base, timeout=20) as client:
        try:
            for _ in range(count):
                rooms.append(await provision(base, origin))
            catalog = await client.get("/api/v1/tracks", headers={"Cookie": rooms[0].host_cookie})
            if catalog.status_code != 200 or not catalog.json()["items"]:
                raise RuntimeError("Prepared catalog required")
            track_id = catalog.json()["items"][0]["id"]
            endpoint = base.replace("http://", "ws://").replace("https://", "wss://")

            async def probes(socket: Socket, delay: float) -> None:
                await asyncio.sleep(delay)
                while True:
                    await socket.request("clock.probe", {})
                    await asyncio.sleep(5)

            async def controls(socket: Socket, delay: float) -> None:
                await asyncio.sleep(delay)
                await socket.request("playback.select", {"trackId": track_id})
                await socket.request("playback.play", {"allowNotReady": True})
                step = 0
                while True:
                    await asyncio.sleep(15)
                    step += 1
                    if step % 2:
                        await socket.request("playback.seek", {"positionMs": (step * 7000) % 55000})
                    elif socket.status == "playing":
                        await socket.request("playback.pause", {})
                    else:
                        await socket.request("playback.play", {"allowNotReady": True})

            for index, room in enumerate(rooms):
                for cookie in [room.host_cookie, room.guest_cookie]:
                    websocket = await connect(
                        f"{endpoint}/ws/v1/rooms/{room.id}",
                        origin=Origin(origin),
                        additional_headers={"Cookie": cookie},
                        ping_interval=None,
                    )
                    socket = Socket(websocket, samples)
                    socket.reader = asyncio.create_task(socket.receive())
                    sockets.append(socket)
                    tasks.append(asyncio.create_task(probes(socket, (index % 10) / 2)))
                tasks.append(asyncio.create_task(controls(sockets[-2], (index % 10) / 2)))
            await asyncio.sleep(1)
            uploads = asyncio.create_task(upload_pair(client, rooms[0], origin, samples))
            tasks.append(uploads)
            measured = time.monotonic()
            next_progress = measured
            while time.monotonic() - measured < seconds:
                room = rooms[int(time.monotonic()) % len(rooms)]
                probe_started = time.perf_counter()
                response = await client.get(
                    f"/api/v1/rooms/{room.id}", headers={"Cookie": room.host_cookie}
                )
                samples.http_ms.append((time.perf_counter() - probe_started) * 1000)
                if response.status_code != 200:
                    samples.error("http_" + str(response.status_code))
                for task in tasks:
                    if task.done() and not task.cancelled() and task.exception() is not None:
                        raise RuntimeError("Load task failed") from None
                if time.monotonic() >= next_progress:
                    if project:
                        command = ["docker", "stats", "--no-stream", "--format", "{{json .}}"] + [
                            project + "-" + service + "-1"
                            for service in ["api", "worker", "transcoder"]
                        ]
                        stats = await asyncio.to_thread(
                            subprocess.run, command, capture_output=True, text=True, check=False
                        )
                        if stats.returncode == 0:
                            samples.system.append(
                                {
                                    "elapsedSeconds": round(time.monotonic() - measured),
                                    "containers": [
                                        json.loads(line) for line in stats.stdout.splitlines()
                                    ],
                                }
                            )
                    print(
                        json.dumps(
                            {
                                "elapsedSeconds": round(time.monotonic() - measured),
                                "connections": samples.active,
                                "httpMs": percentiles(samples.http_ms),
                                "errors": samples.errors,
                            }
                        ),
                        flush=True,
                    )
                    next_progress += 30
                await asyncio.sleep(0.2)
        finally:
            for task in tasks:
                task.cancel()
            await asyncio.gather(*tasks, return_exceptions=True)
            await asyncio.gather(*(socket.close() for socket in sockets), return_exceptions=True)
            for room in rooms:
                snapshot = await client.get(
                    f"/api/v1/rooms/{room.id}", headers={"Cookie": room.host_cookie}
                )
                if snapshot.status_code == 200:
                    await client.post(
                        f"/api/v1/rooms/{room.id}/close",
                        json={"expectedPlaybackRevision": snapshot.json()["playbackRevision"]},
                        headers={
                            "Cookie": room.host_cookie,
                            "Origin": origin,
                            "X-CSRF-Token": room.csrf,
                        },
                    )
            result = {
                "time": datetime.now(UTC).isoformat(),
                "rooms": len(rooms),
                "uploadsReady": samples.uploads_ready,
                "hardware": hardware,
                "containerSamples": samples.system,
                "network": "localhost via Docker bridge",
                "peakConnections": samples.peak,
                "remainingConnections": samples.active,
                "requestedDurationSeconds": seconds,
                "elapsedIncludingSetupSeconds": round(time.monotonic() - started, 2),
                "httpMs": percentiles(samples.http_ms),
                "clockRTTMs": percentiles(samples.clock_ms),
                "commandAckMs": percentiles(samples.command_ms),
                "errors": samples.errors,
                "platform": platform.system(),
                "architecture": platform.machine(),
                "scope": (
                    "HTTP/WS server load with two uploads; acoustic synchronization not measured"
                ),
            }
            report.parent.mkdir(parents=True, exist_ok=True)
            await asyncio.to_thread(
                report.write_text, json.dumps(result, ensure_ascii=False, indent=2) + "\n"
            )
            print(json.dumps(result, ensure_ascii=False), flush=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", required=True)
    parser.add_argument("--origin", default="http://localhost:5173")
    parser.add_argument("--rooms", type=int, default=100)
    parser.add_argument("--seconds", type=int, default=1800)
    parser.add_argument("--report", type=Path, required=True)
    parser.add_argument("--project", help="Isolated Docker Compose project for CPU/RAM sampling")
    args = parser.parse_args()
    if not 1 <= args.rooms <= 100 or not 10 <= args.seconds <= 1800:
        parser.error("rooms must be 1..100 and seconds 10..1800")
    if urlsplit(args.base_url).hostname not in {"localhost", "127.0.0.1", "::1"}:
        parser.error("Use a localhost endpoint in an isolated load environment")
    if args.project and not re.fullmatch(r"unison-load(?:-[a-z0-9-]+)?", args.project):
        parser.error("Use an isolated unison-load Docker project")
    if args.report.resolve().is_relative_to(Path(__file__).resolve().parents[2]):
        parser.error("Store load reports outside the repository")
    soft, hard = resource.getrlimit(resource.RLIMIT_NOFILE)
    resource.setrlimit(resource.RLIMIT_NOFILE, (max(soft, min(1024, hard)), hard))
    try:
        asyncio.run(
            run(args.base_url, args.origin, args.rooms, args.seconds, args.report, args.project)
        )
    except Exception as error:
        print(json.dumps({"fatalErrorType": type(error).__name__}), flush=True)
        raise SystemExit(1) from None


if __name__ == "__main__":
    main()
