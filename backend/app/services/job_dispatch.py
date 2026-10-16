import asyncio
import logging
from datetime import UTC, datetime
from typing import Any, cast
from uuid import UUID

from celery import Celery
from sqlalchemy import select

from app.config import Settings
from app.db import models as dbm
from app.resources import Resources


class JobDispatcher:
    def __init__(self, resources: Resources, settings: Settings) -> None:
        self.resources = resources
        self.publisher = Celery("unison-publisher", broker=settings.redis_url)
        self.publisher.conf.update(
            broker_connection_timeout=2,
            broker_transport_options={"socket_connect_timeout": 2, "socket_timeout": 2},
            task_serializer="json",
            task_publish_retry=False,
        )
        self.task: asyncio.Task[None] | None = None

    def start(self) -> None:
        self.task = asyncio.create_task(self.run(), name="upload-dispatch")

    async def stop(self) -> None:
        if self.task is not None:
            self.task.cancel()
            await asyncio.gather(self.task, return_exceptions=True)
            self.task = None
        self.publisher.close()

    def publish(self, payload: dict[str, Any]) -> None:
        self.publisher.send_task(
            "unison.audio.process",
            args=[payload["uploadId"], payload["jobId"]],
            task_id=payload["jobId"],
            queue="audio",
            retry=False,
        )

    async def dispatch_once(self) -> None:
        async with self.resources.sessions() as db:
            rows = (
                await db.execute(
                    select(dbm.Outbox.id, dbm.Outbox.payload)
                    .where(dbm.Outbox.event_type == "upload.process", dbm.Outbox.sent_at.is_(None))
                    .order_by(dbm.Outbox.sequence)
                    .limit(20)
                )
            ).all()
        for event_id, raw_payload in rows:
            payload = cast(dict[str, Any], raw_payload)
            async with self.resources.sessions() as db:
                upload = await db.get(dbm.Upload, UUID(payload["uploadId"]))
                relevant = (
                    upload is not None
                    and upload.status == "processing"
                    and (str(upload.job_id) == payload["jobId"])
                )
            if relevant:
                await asyncio.to_thread(self.publish, payload)
            async with self.resources.sessions.begin() as db:
                record = await db.get(dbm.Outbox, event_id)
                if record is not None:
                    record.sent_at = datetime.now(UTC)

    async def run(self) -> None:
        while True:
            try:
                await self.dispatch_once()
            except Exception as error:
                logging.getLogger("unison").warning(
                    "upload_dispatch_retry", extra={"exceptionType": type(error).__name__}
                )
                await asyncio.sleep(1)
            await asyncio.sleep(0.2)
