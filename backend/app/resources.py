import asyncio
from typing import Any

import boto3
from botocore.config import Config
from redis.asyncio import Redis
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, async_sessionmaker, create_async_engine

from app.config import Settings


class Resources:
    def __init__(self, settings: Settings) -> None:
        self.engine: AsyncEngine = create_async_engine(
            settings.database_url,
            pool_pre_ping=True,
            connect_args={"timeout": 3, "server_settings": {"statement_timeout": "5000"}},
        )
        self.sessions = async_sessionmaker(self.engine, expire_on_commit=False)
        self.redis: Redis = Redis.from_url(settings.redis_url, socket_timeout=2)
        self.storage = boto3.client(
            "s3",
            endpoint_url=settings.s3_endpoint,
            region_name=settings.s3_region,
            aws_access_key_id=settings.s3_access_key.get_secret_value(),
            aws_secret_access_key=settings.s3_secret_key.get_secret_value(),
            config=Config(
                signature_version="s3v4",
                connect_timeout=2,
                read_timeout=2,
                retries={"max_attempts": 0},
                s3={"addressing_style": "path"},
            ),
        )
        self.bucket = settings.s3_bucket

    async def readiness(self) -> dict[str, bool]:
        async def database() -> None:
            async with self.engine.connect() as connection:
                await connection.execute(text("SELECT 1"))

        checks = await asyncio.gather(
            asyncio.wait_for(database(), timeout=3),
            self.redis.ping(),
            asyncio.to_thread(self.storage.head_bucket, Bucket=self.bucket),
            return_exceptions=True,
        )
        return dict(
            zip(
                ("database", "queue", "storage"),
                (not isinstance(check, BaseException) for check in checks),
                strict=True,
            )
        )

    async def close(self) -> None:
        await self.redis.aclose()
        await self.engine.dispose()
        self.storage.close()


def health_result(checks: dict[str, bool]) -> tuple[int, dict[str, Any]]:
    ready = all(checks.values())
    return (200 if ready else 503), {
        "status": "ready" if ready else "unavailable",
        "checks": checks,
    }
