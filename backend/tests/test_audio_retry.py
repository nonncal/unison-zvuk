from types import SimpleNamespace
from typing import Any, cast
from uuid import UUID, uuid4

import pytest
from celery import Task
from celery.exceptions import SoftTimeLimitExceeded
from sqlalchemy.exc import OperationalError

from app.workers import audio


def test_transient_retry_is_bounded_and_does_not_expose_database_input(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    retries: list[dict[str, Any]] = []

    async def unavailable(upload_id: UUID, job_id: UUID, *, final_attempt: bool) -> None:
        raise OperationalError(
            "private query", {"token": "private token"}, ConnectionError("private address")
        )

    def retry(**kwargs: Any) -> Exception:
        retries.append(kwargs)
        return RuntimeError("retry scheduled")

    task = cast(Task, SimpleNamespace(request=SimpleNamespace(retries=1), retry=retry))
    monkeypatch.setattr(audio, "process", unavailable)
    with pytest.raises(RuntimeError, match="retry scheduled") as caught:
        audio.process_upload(task, str(uuid4()), str(uuid4()))
    assert caught.value.__suppress_context__
    assert retries[0]["max_retries"] == 2 and retries[0]["countdown"] == 4
    assert str(retries[0]["exc"]) == "Media processing temporarily unavailable"


def test_soft_timeout_outside_async_task_records_terminal_failure(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    upload_id, job_id = uuid4(), uuid4()
    recorded: list[tuple[UUID, UUID]] = []

    async def timeout(upload: UUID, job: UUID, *, final_attempt: bool) -> None:
        raise SoftTimeLimitExceeded()

    async def interrupted(upload: UUID, job: UUID) -> None:
        recorded.append((upload, job))

    monkeypatch.setattr(audio, "process", timeout)
    monkeypatch.setattr(audio, "interrupted", interrupted)
    task = cast(Task, SimpleNamespace(request=SimpleNamespace(retries=0)))
    audio.process_upload(task, str(upload_id), str(job_id))
    assert recorded == [(upload_id, job_id)]
