import asyncio
import time
from collections import deque
from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any
from uuid import UUID, uuid4

from starlette.websockets import WebSocket, WebSocketDisconnect, WebSocketState

from app.contracts.models import Readiness
from app.services.metrics import Metrics


@dataclass
class Bucket:
    rate: float
    capacity: float
    tokens: float = field(init=False)
    updated: float = field(default_factory=time.monotonic)

    def __post_init__(self) -> None:
        self.tokens = self.capacity

    def take(self, now: float | None = None) -> bool:
        now = time.monotonic() if now is None else now
        self.tokens = min(self.capacity, self.tokens + max(0, now - self.updated) * self.rate)
        self.updated = now
        if self.tokens < 1:
            return False
        self.tokens -= 1
        return True


@dataclass
class Frame:
    payload: dict[str, Any]
    close_after: int | None = None


@dataclass
class Connection:
    websocket: WebSocket
    room_id: UUID
    participant_id: UUID
    generation: int
    session_expires_at: datetime
    queue_size: int
    metrics: Metrics | None = None
    now_ms: Callable[[], int] | None = None
    id: UUID = field(default_factory=uuid4)
    frames: deque[Frame] = field(default_factory=deque)
    available: asyncio.Event = field(default_factory=asyncio.Event)
    close_code: int | None = None
    readiness: Readiness | None = None
    last_pong: float = field(default_factory=time.monotonic)
    last_ping: float = field(default_factory=time.monotonic)
    pings: dict[UUID, float] = field(default_factory=dict)
    last_seek: float = float("-inf")
    last_telemetry: float = float("-inf")
    rtt_ms: int | None = None
    controls: Bucket = field(default_factory=lambda: Bucket(5, 10))
    reactions: Bucket = field(default_factory=lambda: Bucket(0.5, 5))
    observations: Bucket = field(default_factory=lambda: Bucket(20, 30))
    readiness_limit: Bucket = field(default_factory=lambda: Bucket(2, 5))

    def put(self, event: dict[str, Any], close_after: int | None = None) -> bool:
        if self.close_code is not None:
            return False
        if event["type"] in {"room.snapshot", "presence.changed"}:
            self.frames = deque(
                frame for frame in self.frames if frame.payload["type"] != event["type"]
            )
        if len(self.frames) >= self.queue_size:
            if self.metrics:
                self.metrics.slow.inc()
            self.stop(4008)
            return False
        self.frames.append(Frame(event, close_after))
        self.available.set()
        return True

    def stop(self, code: int) -> None:
        self.close_code = code
        self.available.set()

    async def send_frame(self, frame: Frame) -> None:
        # Stamp inside the sending coroutine, after all queue/scheduler waits.
        # Queue latency is server processing time, not an asymmetric network delay.
        if frame.payload["type"] == "clock.reply" and self.now_ms is not None:
            sent_at = self.now_ms()
            frame.payload["payload"]["serverSentAtMs"] = sent_at
            frame.payload["serverTimeMs"] = sent_at
        await self.websocket.send_json(frame.payload)

    async def writer(self) -> None:
        try:
            while self.close_code is None:
                if not self.frames:
                    self.available.clear()
                    await self.available.wait()
                    continue
                frame = self.frames.popleft()
                await asyncio.wait_for(self.send_frame(frame), timeout=2)
                if frame.close_after is not None:
                    self.close_code = frame.close_after
        except (TimeoutError, RuntimeError, OSError, WebSocketDisconnect):
            if self.metrics:
                self.metrics.slow.inc()
            self.close_code = 4008
        finally:
            if self.websocket.application_state == WebSocketState.CONNECTED:
                try:
                    await asyncio.wait_for(
                        self.websocket.close(code=self.close_code or 1000), timeout=2
                    )
                except (TimeoutError, RuntimeError, OSError):
                    pass
