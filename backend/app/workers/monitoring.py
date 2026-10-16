import logging
import threading
import time
from typing import Any

from celery.signals import setup_logging, worker_ready, worker_shutdown
from redis import Redis
from redis.exceptions import RedisError

from app.config import load_settings
from app.services.logging import configure_logging

stopping = threading.Event()


def configure(**kwargs: Any) -> None:
    configure_logging(load_settings(), "worker")


def heartbeat() -> None:
    settings = load_settings()
    client = Redis.from_url(settings.redis_url, socket_timeout=2, socket_connect_timeout=2)
    try:
        while not stopping.is_set():
            try:
                client.set("unison:audio:heartbeat", int(time.time()), ex=20)
            except (RedisError, OSError):
                logging.getLogger("unison").warning("worker_heartbeat_retry")
            stopping.wait(5)
    finally:
        client.close()


def ready(**kwargs: Any) -> None:
    stopping.clear()
    threading.Thread(target=heartbeat, name="audio-heartbeat", daemon=True).start()


def shutdown(**kwargs: Any) -> None:
    stopping.set()


def install() -> None:
    setup_logging.connect(configure, weak=False)
    worker_ready.connect(ready, weak=False)
    worker_shutdown.connect(shutdown, weak=False)
