import json
import logging
import os
from datetime import UTC, datetime, timedelta
from pathlib import Path
from uuid import uuid4

from app.services.logging import RetainedFileHandler, SafeFormatter, purge_logs


def test_structured_formatter_never_serializes_message_arguments_or_tracebacks() -> None:
    record = logging.LogRecord(
        "celery",
        logging.ERROR,
        __file__,
        1,
        "cookie=%s url=%s audio=%s",
        ("private-cookie", "https://private-url", "private-audio"),
        (RuntimeError, RuntimeError("private-exception"), None),
    )
    record.displayName = "private-name"
    record.fileName = "private-file.mp3"
    output = SafeFormatter("worker").format(record)
    assert "private-" not in output
    assert json.loads(output)["exceptionType"] == "RuntimeError"
    record.msg = "request_failed"
    request_id = str(uuid4())
    record.requestId = request_id
    output = SafeFormatter("api").format(record)
    assert json.loads(output)["requestId"] == request_id


def test_log_retention_deletes_only_owned_old_files(tmp_path: Path) -> None:
    now = datetime.now(UTC)
    old = tmp_path / "api.jsonl.2026-01-01"
    recent = tmp_path / "worker.jsonl.2026-10-14"
    unrelated = tmp_path / "other.log"
    for file in [old, recent, unrelated]:
        file.write_text("example")
    timestamp = (now - timedelta(days=8)).timestamp()
    os.utime(old, (timestamp, timestamp))
    purge_logs(tmp_path, now)
    assert not old.exists() and recent.exists() and unrelated.exists()


def test_daily_log_file_is_bounded_and_formatted(tmp_path: Path) -> None:
    handler = RetainedFileHandler(tmp_path, "api")
    handler.setFormatter(SafeFormatter("api"))
    record = logging.LogRecord("unison", logging.INFO, __file__, 1, "request_failed", (), None)
    handler.emit(record)
    handler.close()
    target = tmp_path / "api.jsonl"
    assert json.loads(target.read_text())["event"] == "request_failed"
    with target.open("wb") as file:
        file.truncate(10 * 1024 * 1024)
    handler = RetainedFileHandler(tmp_path, "api")
    handler.setFormatter(SafeFormatter("api"))
    handler.emit(record)
    handler.close()
    assert target.stat().st_size == 10 * 1024 * 1024


def test_two_workers_do_not_overwrite_the_same_daily_rotation(tmp_path: Path) -> None:
    target = tmp_path / "worker.jsonl"
    target.write_text("previous day\n")
    previous = (datetime.now(UTC) - timedelta(days=1)).timestamp()
    os.utime(target, (previous, previous))
    first = RetainedFileHandler(tmp_path, "worker")
    second = RetainedFileHandler(tmp_path, "worker")
    for handler in [first, second]:
        handler.setFormatter(SafeFormatter("worker"))
        record = logging.LogRecord("unison", logging.INFO, __file__, 1, "request_failed", (), None)
        handler.emit(record)
        handler.close()
    assert len(target.read_text().splitlines()) == 2
    previous_files = list(tmp_path.glob("worker.jsonl.*"))
    assert len([f for f in previous_files if f.suffix != ".lock"]) == 1
