from typing import Any
from uuid import UUID

import pytest
from sqlalchemy import event, select
from sqlalchemy.exc import OperationalError
from sqlalchemy.ext.asyncio import AsyncEngine

from app.config import Settings
from app.db.models import Outbox, Upload
from app.services.job_dispatch import JobDispatcher
from app.services.storage import Storage
from tests.integration.test_audio_worker import seed_processing
from tests.integration.test_storage import storage as storage

pytestmark = pytest.mark.integration


async def seed_job(database: AsyncEngine, storage: Storage) -> UUID:
    upload_id, job_id = await seed_processing(database, storage)
    async with storage.resources.sessions.begin() as db:
        upload = await db.get(Upload, upload_id)
        assert upload is not None
        row = Outbox(
            room_id=upload.room_id,
            revision=0,
            event_type="upload.process",
            payload={"uploadId": str(upload_id), "jobId": str(job_id)},
        )
        db.add(row)
        await db.flush()
        return row.id


async def test_broker_failure_does_not_mark_job_delivered(
    database: AsyncEngine, storage: Storage, settings: Settings, monkeypatch: pytest.MonkeyPatch
) -> None:
    event_id = await seed_job(database, storage)
    dispatcher = JobDispatcher(storage.resources, settings)
    calls: list[dict[str, Any]] = []

    def publish(payload: dict[str, Any]) -> None:
        calls.append(payload)
        if len(calls) == 1:
            raise OSError("Temporary broker failure")

    monkeypatch.setattr(dispatcher, "publish", publish)
    try:
        with pytest.raises(OSError):
            await dispatcher.dispatch_once()
        async with storage.resources.sessions() as db:
            record = await db.get(Outbox, event_id)
            assert record is not None and record.sent_at is None
        await dispatcher.dispatch_once()
        await dispatcher.dispatch_once()
        assert len(calls) == 2 and calls[0] == calls[1]
        async with storage.resources.sessions() as db:
            record = await db.get(Outbox, event_id)
            assert record is not None and record.sent_at is not None
    finally:
        await dispatcher.stop()


async def test_commit_failure_after_publish_redelivers_same_job(
    database: AsyncEngine, storage: Storage, settings: Settings, monkeypatch: pytest.MonkeyPatch
) -> None:
    event_id = await seed_job(database, storage)
    dispatcher = JobDispatcher(storage.resources, settings)
    calls: list[dict[str, Any]] = []
    monkeypatch.setattr(dispatcher, "publish", calls.append)
    session_class = storage.resources.sessions.class_.sync_session_class

    def fail_commit(db: object) -> None:
        raise OperationalError("", {}, ConnectionError("Temporary database failure"))

    event.listen(session_class, "before_commit", fail_commit, once=True)
    try:
        with pytest.raises(OperationalError):
            await dispatcher.dispatch_once()
        async with storage.resources.sessions() as db:
            record = await db.get(Outbox, event_id)
            assert record is not None and record.sent_at is None
        await dispatcher.dispatch_once()
        assert len(calls) == 2 and calls[0] == calls[1]
        async with storage.resources.sessions() as db:
            pending = (await db.scalars(select(Outbox).where(Outbox.sent_at.is_(None)))).all()
            assert not pending
    finally:
        event.remove(session_class, "before_commit", fail_commit)
        await dispatcher.stop()
