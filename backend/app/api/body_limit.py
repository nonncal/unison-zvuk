import asyncio
import re
import time
from uuid import uuid4

from starlette.responses import JSONResponse
from starlette.types import ASGIApp, Message, Receive, Scope, Send


class RequestBodyLimit:
    def __init__(self, app: ASGIApp, max_bytes: int = 65_536) -> None:
        self.app = app
        self.max_bytes = max_bytes

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http" or scope["method"] in {"GET", "HEAD", "OPTIONS"}:
            await self.app(scope, receive, send)
            return
        max_bytes = self.max_bytes
        if scope["method"] == "PUT":
            if re.fullmatch(
                r"/api/v1/rooms/[0-9a-f-]{36}/tracks/[0-9a-f-]{36}/cover", scope["path"]
            ):
                max_bytes = 5 * 1024 * 1024
            elif re.fullmatch(
                r"/api/v1/rooms/[0-9a-f-]{36}/tracks/[0-9a-f-]{36}/lyrics", scope["path"]
            ):
                max_bytes = 131_072
        body = bytearray()
        deadline = time.monotonic() + 10
        while True:
            try:
                message = await asyncio.wait_for(
                    receive(), timeout=max(0.001, deadline - time.monotonic())
                )
            except TimeoutError:
                await self.reject(scope, receive, send, "REQUEST_TIMEOUT", 408)
                return
            if message["type"] == "http.disconnect":
                return
            chunk = message.get("body", b"")
            if len(body) + len(chunk) > max_bytes:
                await self.reject(scope, receive, send, "REQUEST_TOO_LARGE", 413)
                return
            body.extend(chunk)
            if not message.get("more_body", False):
                break
        delivered = False

        async def replay() -> Message:
            nonlocal delivered
            if delivered:
                return await receive()
            delivered = True
            return {"type": "http.request", "body": bytes(body), "more_body": False}

        await self.app(scope, replay, send)

    async def reject(
        self, scope: Scope, receive: Receive, send: Send, code: str, status: int
    ) -> None:
        response = JSONResponse(
            status_code=status,
            content={
                "error": {
                    "code": code,
                    "message": "Запрос не может быть обработан",
                    "requestId": scope.get("state", {}).get("request_id", str(uuid4())),
                }
            },
        )
        await response(scope, receive, send)
