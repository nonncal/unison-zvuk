import asyncio
import logging
from uuid import UUID

from fastapi import APIRouter, WebSocket
from starlette.websockets import WebSocketDisconnect

from app.contracts.ws import parse_command
from app.domain.errors import DomainError
from app.services.runtime import Runtime
from app.ws.connection import Connection
from app.ws.manager import Manager

router = APIRouter()


async def read(manager: Manager, connection: Connection) -> None:
    while connection.close_code is None:
        try:
            message = await connection.websocket.receive()
        except WebSocketDisconnect:
            return
        if message["type"] == "websocket.disconnect":
            return
        raw = message.get("text") or message.get("bytes") or ""
        try:
            command = parse_command(raw, manager.settings.ws_max_message_bytes)
        except ValueError:
            await manager.report_error(
                connection,
                None,
                DomainError("PROTOCOL_MISMATCH", "Некорректное сообщение протокола", 400),
                close_after=1002,
            )
            return
        try:
            await manager.handle(connection, command)
        except DomainError as error:
            terminal = (
                1008
                if error.code == "SESSION_EXPIRED"
                or (error.details and error.details.get("terminal"))
                else (4004 if error.code in {"ROOM_CLOSED", "ROOM_EXPIRED"} else None)
            )
            await manager.report_error(connection, command.request_id, error, terminal)
            if terminal:
                return


@router.websocket("/ws/v1/rooms/{room_id}")
async def socket(websocket: WebSocket, room_id: UUID) -> None:
    runtime: Runtime | None = getattr(websocket.app.state, "runtime", None)
    if runtime is None or not runtime.ready:
        await websocket.close(code=1013)
        return
    if websocket.query_params:
        await websocket.close(code=1008)
        return
    manager = runtime.manager
    try:
        connection = await manager.open(websocket, room_id)
    except DomainError:
        await websocket.close(code=1008)
        return
    except Exception as error:
        logging.getLogger("unison").error(
            "ws_handshake_failed", extra={"exceptionType": type(error).__name__}
        )
        await websocket.close(code=1013)
        return
    writer = asyncio.create_task(connection.writer())
    reader = asyncio.create_task(read(manager, connection))
    try:
        completed, _ = await asyncio.wait({reader, writer}, return_when=asyncio.FIRST_COMPLETED)
        for task in completed:
            task.result()
    except Exception as error:
        logging.getLogger("unison").error(
            "ws_request_failed", extra={"exceptionType": type(error).__name__}
        )
        connection.put(
            manager.event(
                "command.error",
                0,
                {
                    "requestId": None,
                    "code": "UNAVAILABLE",
                    "message": "Переподключитесь к комнате",
                    "snapshot": None,
                },
            ),
            close_after=1013,
        )
    finally:
        if not reader.done():
            reader.cancel()
        if not writer.done():
            if not any(frame.close_after is not None for frame in connection.frames):
                connection.stop(connection.close_code or 1000)
            try:
                await asyncio.wait_for(writer, timeout=3)
            except (TimeoutError, WebSocketDisconnect, RuntimeError):
                writer.cancel()
        await asyncio.gather(reader, writer, return_exceptions=True)
        try:
            await manager.disconnect(connection)
        except Exception as error:
            logging.getLogger("unison").error(
                "ws_disconnect_failed", extra={"exceptionType": type(error).__name__}
            )
