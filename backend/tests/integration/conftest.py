import os
from collections.abc import AsyncIterator
from uuid import uuid4

import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import text
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

from app.config import load_settings


@pytest.fixture
async def database() -> AsyncIterator[AsyncEngine]:
    if not os.environ.get("UNISON_ENV_FILE"):
        pytest.skip("Set UNISON_ENV_FILE to run PostgreSQL integration tests")
    schema = "unison_test_" + uuid4().hex
    engine = create_async_engine(
        load_settings().database_url,
        connect_args={"server_settings": {"search_path": schema}},
    )

    def upgrade(connection: Connection) -> None:
        config = Config("alembic.ini")
        config.attributes["connection"] = connection
        command.upgrade(config, "head")

    async with engine.begin() as connection:
        await connection.execute(text(f'CREATE SCHEMA "{schema}"'))
        await connection.run_sync(upgrade)
    try:
        yield engine
    finally:
        async with engine.begin() as connection:
            await connection.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
        await engine.dispose()
