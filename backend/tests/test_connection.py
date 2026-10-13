from datetime import UTC, datetime, timedelta
from typing import Any
from uuid import uuid4

from starlette.types import Message
from starlette.websockets import WebSocket

from app.ws.connection import Bucket, Connection


def connection(size: int = 3) -> Connection:
    async def receive() -> Message:
        return {"type": "websocket.disconnect", "code": 1000}

    async def send(message: Message) -> None:
        pass

    return Connection(
        WebSocket({"type": "websocket"}, receive, send),
        uuid4(),
        uuid4(),
        1,
        datetime.now(UTC) + timedelta(hours=24),
        size,
    )


def event(kind: str, sequence: int) -> dict[str, Any]:
    return {"type": kind, "sequence": sequence}


def test_snapshot_coalescing_preserves_commands_and_newest_snapshot() -> None:
    conn = connection()
    assert conn.put(event("room.snapshot", 1))
    assert conn.put(event("command.ack", 2))
    assert conn.put(event("room.snapshot", 3))
    assert [frame.payload["sequence"] for frame in conn.frames] == [2, 3]
    assert conn.put(event("playback.state", 4))
    assert not conn.put(event("command.ack", 5))
    assert conn.close_code == 4008
    assert not conn.put(event("room.snapshot", 6))


def test_rate_limit_refills_at_rate_without_unbounded_burst() -> None:
    bucket = Bucket(5, 10, updated=0)
    assert all(bucket.take(0) for _ in range(10))
    assert not bucket.take(0)
    assert bucket.take(0.2)
    assert not bucket.take(0.2)
    assert all(bucket.take(100) for _ in range(10))
    assert not bucket.take(100)
