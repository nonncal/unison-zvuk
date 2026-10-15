import logging
import secrets
import time
from collections.abc import AsyncIterator, Callable
from contextlib import asynccontextmanager
from datetime import UTC, datetime
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy import func, select
from sqlalchemy.exc import DBAPIError, IntegrityError
from sqlalchemy.exc import TimeoutError as DatabaseTimeout
from starlette.exceptions import HTTPException
from starlette.middleware.base import RequestResponseEndpoint
from starlette.responses import Response

from app.api.body_limit import RequestBodyLimit
from app.api.covers import router as covers_router
from app.api.media import router as media_router
from app.api.rooms import error_body, router
from app.api.social import router as social_router
from app.config import Settings, load_settings
from app.contracts.models import Health, HTTPError
from app.db.models import Upload
from app.domain.errors import DomainError
from app.resources import Resources, health_result
from app.services.logging import configure_logging
from app.services.runtime import Runtime
from app.services.security import Security
from app.ws.router import router as ws_router


class UnisonAPI(FastAPI):
    def openapi(self) -> dict[str, Any]:
        config: Settings = self.state.settings
        schema = super().openapi()
        if "SessionCookie" in schema.get("components", {}).get("securitySchemes", {}):
            return schema
        schema.setdefault("components", {})["securitySchemes"] = {
            "SessionCookie": {"type": "apiKey", "in": "cookie", "name": config.session_cookie},
            "CSRFToken": {"type": "apiKey", "in": "header", "name": "X-CSRF-Token"},
        }
        for path, methods in schema["paths"].items():
            for method, operation in methods.items():
                if path.startswith("/api/v1/") and path != "/api/v1/bootstrap":
                    mutation = method in {"post", "delete", "put", "patch"}
                    operation["security"] = [
                        {"SessionCookie": [], **({"CSRFToken": []} if mutation else {})}
                    ]
                    if mutation:
                        operation.setdefault("parameters", []).append(
                            {
                                "name": "Origin",
                                "in": "header",
                                "required": True,
                                "schema": {"type": "string", "enum": [config.app_origin]},
                            }
                        )
                for response in operation.get("responses", {}).values():
                    response.setdefault("headers", {})["X-Request-ID"] = {
                        "schema": {"type": "string", "format": "uuid"}
                    }
        return schema


def create_app(
    settings: Settings | None = None,
    resource_factory: Callable[[Settings], Resources] = Resources,
    start_runtime: bool = True,
) -> FastAPI:
    config = settings or load_settings()

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        configure_logging(config, "api")
        app.state.resources = resource_factory(config)
        app.state.settings = config
        app.state.resources.metrics.start()
        try:
            if start_runtime:
                app.state.runtime = Runtime(app.state.resources, Security(config))
                await app.state.runtime.start()
            yield
        finally:
            if start_runtime:
                await app.state.runtime.stop()
            await app.state.resources.close()

    app = UnisonAPI(
        title="Unison API",
        version="1.0.0",
        lifespan=lifespan,
        docs_url="/api/reference",
        redoc_url=None,
        openapi_url="/api/v1/openapi.json",
        responses={
            code: {"model": HTTPError}
            for code in [400, 401, 403, 404, 409, 410, 413, 415, 422, 429, 500, 503]
        },
    )
    app.state.settings = config
    app.include_router(router)
    app.include_router(media_router)
    app.include_router(covers_router)
    app.include_router(social_router)
    app.include_router(ws_router)
    app.add_middleware(RequestBodyLimit)

    @app.exception_handler(DomainError)
    async def domain_error(request: Request, error: DomainError) -> JSONResponse:
        return JSONResponse(
            status_code=error.status,
            content=error_body(request, error),
            headers={"Retry-After": str(error.retry_after)}
            if error.retry_after is not None
            else None,
        )

    @app.middleware("http")
    async def request_context(request: Request, call_next: RequestResponseEndpoint) -> Response:
        request.state.request_id = str(uuid4())
        started = time.perf_counter()
        try:
            response = await call_next(request)
        except Exception as error:
            response = await internal_error(request, error)
        response.headers["X-Request-ID"] = request.state.request_id
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Cache-Control"] = "no-store"
        resources: Resources | None = getattr(request.app.state, "resources", None)
        if resources is not None:
            method = (
                request.method
                if request.method in {"GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS", "HEAD"}
                else "OTHER"
            )
            route = getattr(request.scope.get("route"), "path", "unmatched")
            resources.metrics.http.labels(
                method, route, str(response.status_code // 100) + "xx"
            ).observe(time.perf_counter() - started)
        return response

    @app.exception_handler(RequestValidationError)
    async def validation_error(request: Request, error: RequestValidationError) -> JSONResponse:
        oversized = any(
            e["loc"] == ("body", "sizeBytes") and e["type"] == "less_than_equal"
            for e in error.errors()
        )
        return JSONResponse(
            status_code=413 if oversized else 422,
            content={
                "error": {
                    "code": "FILE_TOO_LARGE" if oversized else "VALIDATION_ERROR",
                    "message": "Файл превышает допустимый размер"
                    if oversized
                    else "Проверьте поля запроса",
                    "requestId": request.state.request_id,
                    "details": [
                        {"field": ".".join(str(x) for x in e["loc"]), "code": e["type"]}
                        for e in error.errors()
                    ],
                }
            },
        )

    @app.exception_handler(HTTPException)
    async def http_error(request: Request, error: HTTPException) -> JSONResponse:
        return JSONResponse(
            status_code=error.status_code,
            content={
                "error": {
                    "code": "NOT_FOUND" if error.status_code == 404 else "HTTP_ERROR",
                    "message": "Ресурс недоступен",
                    "requestId": request.state.request_id,
                }
            },
        )

    @app.exception_handler(Exception)
    async def internal_error(request: Request, error: Exception) -> JSONResponse:
        request_id = getattr(request.state, "request_id", str(uuid4()))
        logging.getLogger("unison").error(
            "request_failed", extra={"requestId": request_id, "exceptionType": type(error).__name__}
        )
        unavailable = isinstance(error, (OSError, DatabaseTimeout)) or (
            isinstance(error, DBAPIError) and not isinstance(error, IntegrityError)
        )
        return JSONResponse(
            status_code=503 if unavailable else 500,
            content={
                "error": {
                    "code": "UNAVAILABLE" if unavailable else "INTERNAL_ERROR",
                    "message": "Попробуйте ещё раз",
                    "requestId": request_id,
                }
            },
            headers={
                "X-Request-ID": request_id,
                "Referrer-Policy": "no-referrer",
                "X-Content-Type-Options": "nosniff",
                "Cache-Control": "no-store",
            },
        )

    @app.get("/health/live", response_model=Health, response_model_exclude_none=True)
    async def live() -> dict[str, str]:
        return {"status": "alive"}

    @app.get("/health/ready", response_model=Health, responses={503: {"model": Health}})
    async def ready(request: Request) -> JSONResponse:
        checks = await request.app.state.resources.readiness()
        if start_runtime:
            checks["rooms"] = request.app.state.runtime.ready
        status, body = health_result(checks)
        return JSONResponse(status_code=status, content=body)

    @app.get("/internal/metrics", include_in_schema=False)
    async def metrics(request: Request) -> Response:
        token = config.metrics_token
        if token is None:
            raise DomainError("NOT_FOUND", "Ресурс недоступен", 404)
        if not secrets.compare_digest(
            request.headers.get("authorization", "").encode(),
            ("Bearer " + token.get_secret_value()).encode(),
        ):
            raise DomainError("FORBIDDEN", "Ресурс недоступен", 403)
        resources: Resources = request.app.state.resources
        runtime: Runtime | None = getattr(request.app.state, "runtime", None)
        if runtime:
            connections = [c for c in runtime.manager.connections.values() if c.close_code is None]
            resources.metrics.connections.set(len(connections))
            resources.metrics.offline.set(len(runtime.manager.offline_since))
            resources.metrics.rooms.set(len({c.room_id for c in connections}))
        async with resources.sessions() as db:
            count, oldest = (
                await db.execute(
                    select(func.count(), func.min(Upload.created_at)).where(
                        Upload.status == "processing"
                    )
                )
            ).one()
            resources.metrics.processing.set(count)
            resources.metrics.processing_age.set(
                max(0, (datetime.now(UTC) - oldest).total_seconds()) if oldest else 0
            )
        return Response(
            await resources.metrics.text(),
            headers={"Content-Type": "text/plain; version=0.0.4; charset=utf-8"},
        )

    return app
