import asyncio
import logging
from collections import Counter
from collections.abc import Awaitable, Iterable
from datetime import UTC, date, datetime, timedelta
from typing import Literal, cast

from prometheus_client import (
    CollectorRegistry,
    Gauge,
    Histogram,
    generate_latest,
)
from prometheus_client import (
    Counter as MetricCounter,
)
from prometheus_client.core import CounterMetricFamily, GaugeMetricFamily, HistogramMetricFamily
from prometheus_client.metrics_core import Metric
from prometheus_client.process_collector import ProcessCollector
from redis.asyncio import Redis
from redis.exceptions import RedisError

SyncState = Literal["playing", "paused", "buffering", "autoplayBlocked", "error", "notReady"]
WorkerOutcome = Literal["ready", "failed", "retry", "duplicate", "interrupted"]
ReadinessState = Literal["loading", "ready", "buffering", "autoplayBlocked", "error"]
READINESS_STATES = ("loading", "ready", "buffering", "autoplayBlocked", "error")
STATES = ("playing", "paused", "buffering", "autoplayBlocked", "error", "notReady")
OUTCOMES = ("ready", "failed", "retry", "duplicate", "interrupted")
DRIFT_BUCKETS = (25, 50, 100, 150, 300, 500, 1000, 3000, 900000)
FLUSH_SCRIPT = """
for i=2,#ARGV,2 do redis.call('HINCRBY',KEYS[1],ARGV[i],ARGV[i+1]) end
redis.call('EXPIREAT',KEYS[1],ARGV[1])
return 1
"""


class Metrics:
    def __init__(self, redis: Redis, aggregate_prefix: str = "unison:diagnostics:") -> None:
        self.redis = redis
        self.aggregate_prefix = aggregate_prefix
        self.registry = CollectorRegistry()
        ProcessCollector(registry=self.registry)
        self.http = Histogram(
            "unison_http_duration_seconds",
            "HTTP processing latency",
            ["method", "route", "status_class"],
            registry=self.registry,
            buckets=(0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5),
        )
        self.commands = MetricCounter(
            "unison_ws_commands", "Accepted WS messages", ["type"], registry=self.registry
        )
        self.errors = MetricCounter(
            "unison_ws_errors", "WS errors by category", ["category"], registry=self.registry
        )
        self.readiness = MetricCounter(
            "unison_readiness", "Readiness observations", ["state"], registry=self.registry
        )
        self.samples = MetricCounter(
            "unison_sync_samples", "Synchronization observations", ["state"], registry=self.registry
        )
        self.drift = Histogram(
            "unison_stable_abs_drift_milliseconds",
            "Absolute drift during stable playback only",
            registry=self.registry,
            buckets=DRIFT_BUCKETS,
        )
        self.rtt = Histogram(
            "unison_sync_rtt_milliseconds",
            "Round-trip latency by playback state",
            ["state"],
            registry=self.registry,
            buckets=(25, 50, 100, 150, 300, 500, 1000, 3000, 60000),
        )
        self.connections = Gauge(
            "unison_ws_connections", "Current WS connections", registry=self.registry
        )
        self.rooms = Gauge(
            "unison_active_rooms", "Rooms with connected participants", registry=self.registry
        )
        self.queue = Gauge("unison_audio_queue_depth", "Waiting audio jobs", registry=self.registry)
        self.worker = Gauge(
            "unison_audio_worker_online", "Audio worker heartbeat is fresh", registry=self.registry
        )
        self.processing = Gauge(
            "unison_audio_processing",
            "Uploads awaiting processing completion",
            registry=self.registry,
        )
        self.processing_age = Gauge(
            "unison_oldest_processing_seconds",
            "Age of oldest processing upload",
            registry=self.registry,
        )
        self.slow = MetricCounter(
            "unison_ws_slow_clients",
            "Connections closed due to bounded writer limits",
            registry=self.registry,
        )
        self.pending: dict[date, Counter[str]] = {}
        self.task: asyncio.Task[None] | None = None
        self.flush_lock = asyncio.Lock()

    def add(self, field: str, value: int = 1) -> None:
        self.pending.setdefault(datetime.now(UTC).date(), Counter())[field] += value

    def telemetry(self, state: SyncState, drift_ms: int, rtt_ms: int) -> None:
        self.samples.labels(state).inc()
        self.rtt.labels(state).observe(rtt_ms)
        self.add("samples." + state)
        self.add("rtt_sum." + state, rtt_ms)
        if state == "playing":
            self.drift.observe(abs(drift_ms))
            self.add("stable.count")
            self.add("stable.drift_sum", abs(drift_ms))
            for bound in DRIFT_BUCKETS:
                if abs(drift_ms) <= bound:
                    self.add("stable.le." + str(bound))

    def worker_result(self, outcome: WorkerOutcome) -> None:
        self.add("worker." + outcome)

    def participant_readiness(self, state: ReadinessState) -> None:
        self.readiness.labels(state).inc()
        self.add("readiness." + state)

    async def flush(self) -> None:
        async with self.flush_lock:
            snapshot, self.pending = self.pending, {}
            for day, values in snapshot.items():
                expires = datetime.combine(day + timedelta(days=30), datetime.min.time(), UTC)
                if expires <= datetime.now(UTC):
                    continue
                arguments: list[str] = [str(int(expires.timestamp()))]
                for field, count in values.items():
                    arguments.extend([field, str(count)])
                try:
                    await cast(
                        Awaitable[object],
                        self.redis.eval(
                            FLUSH_SCRIPT, 1, self.aggregate_prefix + day.isoformat(), *arguments
                        ),
                    )
                except (RedisError, OSError, TimeoutError):
                    self.pending.setdefault(day, Counter()).update(values)
                    logging.getLogger("unison").warning("diagnostics_retry")

    async def text(self) -> bytes:
        await self.flush()
        self.queue.set(await cast(Awaitable[int], self.redis.llen("audio")))
        self.worker.set(
            bool(await cast(Awaitable[int], self.redis.exists("unison:audio:heartbeat")))
        )
        days = [datetime.now(UTC).date() - timedelta(days=index) for index in range(30)]
        pipe = self.redis.pipeline(transaction=False)
        for day in days:
            pipe.hgetall(self.aggregate_prefix + day.isoformat())
        daily = await pipe.execute()
        samples = CounterMetricFamily(
            "unison_daily_sync_samples",
            "Anonymous daily synchronization sample counts retained for 30 days",
            labels=["day", "state"],
        )
        drift = GaugeMetricFamily(
            "unison_daily_stable_mean_abs_drift_milliseconds",
            "Anonymous daily average stable playback drift",
            labels=["day"],
        )
        outcomes = CounterMetricFamily(
            "unison_daily_worker_outcomes",
            "Anonymous daily audio worker outcomes retained for 30 days",
            labels=["day", "outcome"],
        )
        rtt = GaugeMetricFamily(
            "unison_daily_mean_rtt_milliseconds",
            "Anonymous daily mean RTT by playback state",
            labels=["day", "state"],
        )
        distribution = HistogramMetricFamily(
            "unison_daily_stable_abs_drift_milliseconds",
            "Anonymous daily stable playback drift distribution",
            labels=["day"],
        )
        ready = CounterMetricFamily(
            "unison_daily_readiness",
            "Anonymous daily readiness observations retained for 30 days",
            labels=["day", "state"],
        )
        for day, fields in zip(days, daily, strict=True):
            values = {k.decode(): int(v) for k, v in fields.items()}
            for state in STATES:
                if "samples." + state in values:
                    samples.add_metric([day.isoformat(), state], values["samples." + state])
                    rtt.add_metric(
                        [day.isoformat(), state],
                        values.get("rtt_sum." + state, 0) / values["samples." + state],
                    )
            if values.get("stable.count"):
                drift.add_metric(
                    [day.isoformat()], values.get("stable.drift_sum", 0) / values["stable.count"]
                )
                buckets = [
                    (str(bound), values.get("stable.le." + str(bound), 0))
                    for bound in DRIFT_BUCKETS
                ]
                buckets.append(("+Inf", values["stable.count"]))
                distribution.add_metric(
                    [day.isoformat()], buckets, values.get("stable.drift_sum", 0)
                )
            for outcome in OUTCOMES:
                if "worker." + outcome in values:
                    outcomes.add_metric([day.isoformat(), outcome], values["worker." + outcome])
            for state in READINESS_STATES:
                if "readiness." + state in values:
                    ready.add_metric([day.isoformat(), state], values["readiness." + state])
        registry = CollectorRegistry()

        class Daily:
            def collect(self) -> Iterable[Metric]:
                yield from [samples, drift, outcomes, ready, rtt, distribution]

        registry.register(Daily())
        return generate_latest(self.registry) + generate_latest(registry)

    def start(self) -> None:
        self.task = asyncio.create_task(self.run(), name="diagnostics-flush")

    async def stop(self) -> None:
        if self.task:
            self.task.cancel()
            await asyncio.gather(self.task, return_exceptions=True)
        await self.flush()

    async def run(self) -> None:
        while True:
            await asyncio.sleep(5)
            await self.flush()
