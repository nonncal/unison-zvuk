import os
import secrets
from collections.abc import AsyncIterator, Awaitable
from datetime import UTC, datetime, timedelta
from typing import cast
from uuid import uuid4

import pytest
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient
from pydantic import SecretStr
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncEngine, async_sessionmaker

from app.config import Settings, load_settings
from app.main import create_app
from app.resources import Resources
from app.services.metrics import Metrics, SyncState

pytestmark = pytest.mark.integration


@pytest.fixture
async def isolated_metrics() -> AsyncIterator[Metrics]:
    if not os.environ.get("UNISON_ENV_FILE"):
        pytest.skip("Set UNISON_ENV_FILE to run Redis integration tests")
    client = Redis.from_url(load_settings().redis_url, socket_timeout=2)
    prefix = "unison:test:" + uuid4().hex + ":diagnostics:"
    metrics = Metrics(client, prefix)
    keys = [
        prefix + (datetime.now(UTC).date() - timedelta(days=index)).isoformat()
        for index in range(30)
    ]
    try:
        yield metrics
    finally:
        await client.delete(*keys)
        await client.aclose()


async def test_aggregate_retention_and_stable_drift_separation(isolated_metrics: Metrics) -> None:
    metrics = isolated_metrics
    states: list[SyncState] = ["buffering", "autoplayBlocked", "notReady"]
    for state in states:
        metrics.telemetry(state, 800000, 500)
    metrics.telemetry("playing", -25, 100)
    metrics.worker_result("failed")
    metrics.participant_readiness("loading")
    await metrics.flush()
    key = metrics.aggregate_prefix + datetime.now(UTC).date().isoformat()
    values = await cast(Awaitable[dict[bytes, bytes]], metrics.redis.hgetall(key))
    assert values[b"stable.count"] == b"1" and values[b"stable.drift_sum"] == b"25"
    assert values[b"samples.autoplayBlocked"] == b"1"
    assert 29 * 86400 <= await metrics.redis.ttl(key) <= 30 * 86400
    output = (await metrics.text()).decode()
    assert "unison_stable_abs_drift_milliseconds_count 1.0" in output
    assert "unison_daily_worker_outcomes_total" in output and 'outcome="failed"' in output
    assert 'state="loading"' in output
    assert "private" not in output


async def test_metrics_endpoint_requires_separate_secret(database: AsyncEngine) -> None:
    token = secrets.token_urlsafe(48)
    config = load_settings().model_copy(update={"metrics_token": SecretStr(token)})

    class TestResources(Resources):
        def __init__(self, settings: Settings) -> None:
            super().__init__(settings)
            self.engine = database
            self.sessions = async_sessionmaker(database, expire_on_commit=False)

    app = create_app(config, TestResources, start_runtime=False)
    async with (
        LifespanManager(app),
        AsyncClient(transport=ASGITransport(app=app), base_url=config.app_origin) as client,
    ):
        assert (await client.get("/internal/metrics")).status_code == 403
        assert (
            await client.get("/internal/metrics", headers={"Authorization": "Bearer wrong"})
        ).status_code == 403
        response = await client.get(
            "/internal/metrics", headers={"Authorization": "Bearer " + token}
        )
        assert response.status_code == 200
        assert token not in response.text and "unison_audio_queue_depth" in response.text
        for _ in range(3):
            await client.get("/unknown/" + uuid4().hex + "?invite=private-secret")
        response = await client.get(
            "/internal/metrics", headers={"Authorization": "Bearer " + token}
        )
        assert "private-secret" not in response.text
        assert 'route="unmatched"' in response.text
