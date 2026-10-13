import logging
from collections.abc import AsyncIterator, Callable
from contextlib import asynccontextmanager
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pythonjsonlogger.json import JsonFormatter
from sqlalchemy.exc import DBAPIError, IntegrityError
from sqlalchemy.exc import TimeoutError as DatabaseTimeout
from starlette.exceptions import HTTPException
from starlette.middleware.base import RequestResponseEndpoint
from starlette.responses import Response

from app.api.body_limit import RequestBodyLimit
from app.api.rooms import error_body, router
from app.config import Settings, load_settings
from app.domain.errors import DomainError
from app.resources import Resources, health_result
from app.services.runtime import Runtime
from app.services.security import Security
from app.ws.router import router as ws_router


def create_app(
    settings: Settings | None = None,
    resource_factory: Callable[[Settings], Resources] = Resources,
    start_runtime: bool = True,
) -> FastAPI:
    config = settings or load_settings()

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        handler = logging.StreamHandler()
        handler.setFormatter(JsonFormatter("%(levelname)s %(name)s %(message)s"))
        logger = logging.getLogger("unison")
        logger.handlers = [handler]
        logger.setLevel(config.log_level)
        app.state.resources = resource_factory(config)
        app.state.settings = config
        try:
            if start_runtime:
                app.state.runtime = Runtime(app.state.resources, Security(config))
                await app.state.runtime.start()
            yield
        finally:
            if start_runtime:
                await app.state.runtime.stop()
            await app.state.resources.close()

    app = FastAPI(
        title="Unison API",
        version="1.0.0",
        lifespan=lifespan,
        docs_url="/api/reference",
        redoc_url=None,
        openapi_url="/api/v1/openapi.json",
    )
    app.state.settings = config
    app.include_router(router)
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
        try:
            response = await call_next(request)
        except Exception as error:
            response = await internal_error(request, error)
        response.headers["X-Request-ID"] = request.state.request_id
        response.headers["Referrer-Policy"] = "no-referrer"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Cache-Control"] = "no-store"
        return response

    @app.exception_handler(RequestValidationError)
    async def validation_error(request: Request, error: RequestValidationError) -> JSONResponse:
        return JSONResponse(
            status_code=422,
            content={
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Проверьте поля запроса",
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

    @app.get("/health/live")
    async def live() -> dict[str, str]:
        return {"status": "alive"}

    @app.get("/health/ready")
    async def ready(request: Request) -> JSONResponse:
        checks = await request.app.state.resources.readiness()
        if start_runtime:
            checks["rooms"] = request.app.state.runtime.ready
        status, body = health_result(checks)
        return JSONResponse(status_code=status, content=body)

    return app
