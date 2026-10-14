import fcntl
import json
import logging
import os
import re
import time
from datetime import UTC, datetime, timedelta
from logging.handlers import TimedRotatingFileHandler
from pathlib import Path
from uuid import UUID

from app.config import Settings

EVENTS = {
    "request_failed",
    "ws_handshake_failed",
    "ws_request_failed",
    "ws_disconnect_failed",
    "room_runtime_unavailable",
    "clock_epoch_reset",
    "upload_dispatch_retry",
    "media_cleanup_retry",
    "diagnostics_retry",
    "worker_heartbeat_retry",
}


class SafeFormatter(logging.Formatter):
    def __init__(self, service: str) -> None:
        super().__init__()
        self.service = service

    def format(self, record: logging.LogRecord) -> str:
        data: dict[str, object] = {
            "time": datetime.fromtimestamp(record.created, UTC).isoformat(),
            "level": record.levelname,
            "service": self.service,
            "event": record.msg
            if isinstance(record.msg, str) and record.msg in EVENTS
            else "service_event",
        }
        request_id = getattr(record, "requestId", None)
        if isinstance(request_id, str):
            try:
                data["requestId"] = str(UUID(request_id))
            except ValueError:
                pass
        exception_type = getattr(record, "exceptionType", None)
        if exception_type is None and record.exc_info and record.exc_info[0]:
            exception_type = record.exc_info[0].__name__
        if isinstance(exception_type, str) and re.fullmatch(
            r"[A-Za-z][A-Za-z0-9_]{0,79}", exception_type
        ):
            data["exceptionType"] = exception_type
        return json.dumps(data, ensure_ascii=False)


def purge_logs(directory: Path, now: datetime | None = None) -> None:
    cutoff = ((now or datetime.now(UTC)) - timedelta(days=7)).timestamp()
    for path in directory.glob("*.jsonl.*"):
        if path.is_symlink() or not path.is_file():
            continue
        if path.name.startswith(("api.jsonl.", "worker.jsonl.")) and path.stat().st_mtime <= cutoff:
            path.unlink(missing_ok=True)


class RetainedFileHandler(TimedRotatingFileHandler):
    def __init__(self, directory: Path, service: str) -> None:
        directory.mkdir(mode=0o700, parents=True, exist_ok=True)
        self.directory = directory
        self.last_purge = 0.0
        super().__init__(
            directory / f"{service}.jsonl",
            when="midnight",
            backupCount=6,
            utc=True,
            encoding="utf-8",
            delay=True,
        )

    def emit(self, record: logging.LogRecord) -> None:
        fd: int | None = None
        try:
            fd = os.open(
                self.directory / (Path(self.baseFilename).name + ".lock"),
                os.O_CREAT | os.O_RDWR | os.O_NOFOLLOW,
                0o600,
            )
            fcntl.flock(fd, fcntl.LOCK_EX)
            path = Path(self.baseFilename)
            if self.stream is not None and (
                not path.exists() or os.fstat(self.stream.fileno()).st_ino != path.stat().st_ino
            ):
                self.stream.close()
                self.stream = None
            if self.shouldRollover(record):
                if (
                    path.exists()
                    and datetime.fromtimestamp(path.stat().st_mtime, UTC).date()
                    == datetime.now(UTC).date()
                ):
                    self.rolloverAt = self.computeRollover(int(time.time()))
                else:
                    self.doRollover()
            if time.monotonic() - self.last_purge > 3600:
                purge_logs(self.directory)
                self.last_purge = time.monotonic()
            if (
                path.exists()
                and path.stat().st_size + len(self.format(record).encode()) + 1 > 10 * 1024 * 1024
            ):
                return
            logging.FileHandler.emit(self, record)
        except OSError:
            pass
        finally:
            if fd is not None:
                os.close(fd)


def configure_logging(settings: Settings, service: str) -> None:
    formatter = SafeFormatter(service)
    handlers: list[logging.Handler] = [logging.StreamHandler()]
    if settings.log_dir is not None:
        handlers.append(RetainedFileHandler(settings.log_dir, service))
    for handler in handlers:
        handler.setFormatter(formatter)
    root = logging.getLogger()
    for handler in root.handlers:
        handler.close()
    root.handlers = handlers
    root.setLevel(settings.log_level)
    for name in ["unison", "celery", "celery.task", "celery.worker", "uvicorn", "uvicorn.error"]:
        logger = logging.getLogger(name)
        for handler in logger.handlers:
            handler.close()
        logger.handlers = []
        logger.propagate = True
