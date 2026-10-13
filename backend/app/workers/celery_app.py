from celery import Celery

from app.config import load_settings

settings = load_settings()
celery_app = Celery("unison", broker=settings.redis_url)
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_time_limit=125,
    task_soft_time_limit=120,
    broker_connection_retry_on_startup=True,
    imports=["app.workers.audio"],
    task_routes={"unison.audio.process": {"queue": "audio"}},
)
