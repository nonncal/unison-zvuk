FROM public.ecr.aws/docker/library/python:3.13.16-slim-bookworm AS media-tools
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg bubblewrap \
    && rm -rf /var/lib/apt/lists/* && chmod u-s /usr/bin/bwrap

FROM public.ecr.aws/docker/library/python:3.13.16-slim-bookworm AS base
COPY --from=ghcr.io/astral-sh/uv:0.13.0 /uv /uvx /bin/
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 UV_COMPILE_BYTECODE=1
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project
COPY app ./app
COPY alembic.ini ./
COPY migrations ./migrations
COPY catalog ./catalog
RUN useradd --uid 10001 --create-home unison && mkdir /jobs /logs && chown unison:unison /jobs /logs && chmod 700 /jobs /logs
USER 10001
EXPOSE 8000

FROM base AS api
CMD ["uv", "run", "--no-sync", "uvicorn", "app.main:create_app", "--factory", "--host", "0.0.0.0", "--port", "8000", "--workers", "1", "--ws", "websockets-sansio", "--ws-max-size", "16384", "--ws-max-queue", "16", "--no-access-log"]

FROM media-tools AS transcoder
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY --from=base /app /app
RUN useradd --uid 10001 --create-home unison && mkdir /jobs && chown unison:unison /jobs
USER 10001
ENV OPENBLAS_NUM_THREADS=1 OMP_NUM_THREADS=1
CMD ["/app/.venv/bin/python", "-m", "app.workers.transcoder"]

