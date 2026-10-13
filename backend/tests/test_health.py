from typing import NoReturn

from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient
from pytest import LogCaptureFixture

from app.config import Settings
from app.main import create_app
from app.resources import Resources


class FakeResources(Resources):
    def __init__(self, settings: Settings) -> None:
        self.closed = False
        self.checks = {"database": True, "queue": True, "storage": True}

    async def readiness(self) -> dict[str, bool]:
        return self.checks

    async def close(self) -> None:
        self.closed = True


async def test_liveness_and_readiness_have_different_meanings(settings: Settings) -> None:
    app = create_app(settings, FakeResources)
    async with (
        LifespanManager(app),
        AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client,
    ):
        resources = app.state.resources
        assert (await client.get("/health/live")).status_code == 200
        assert (await client.get("/health/ready")).status_code == 200
        resources.checks["storage"] = False
        assert (await client.get("/health/live")).status_code == 200
        response = await client.get("/health/ready")
        assert response.status_code == 503
        assert response.json()["checks"]["storage"] is False
        assert response.headers["referrer-policy"] == "no-referrer"
        assert response.headers["x-request-id"]
    assert resources.closed


async def test_errors_do_not_expose_private_values(
    settings: Settings, caplog: LogCaptureFixture
) -> None:
    app = create_app(settings, FakeResources)

    @app.get("/failure", response_model=None)
    async def failure() -> NoReturn:
        raise RuntimeError("private-secret")

    async with (
        LifespanManager(app),
        AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client,
    ):
        missing = await client.get("/missing")
        assert missing.status_code == 404
        assert missing.json()["error"]["code"] == "NOT_FOUND"
        response = await client.get("/failure")
        assert response.status_code == 500
        assert response.json()["error"]["code"] == "INTERNAL_ERROR"
        assert response.headers["x-request-id"] == response.json()["error"]["requestId"]
        assert "private-secret" not in response.text + caplog.text
