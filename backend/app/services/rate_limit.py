import math
from collections.abc import Awaitable
from typing import cast

from redis.asyncio import Redis
from redis.exceptions import RedisError

from app.domain.errors import DomainError
from app.services.security import Security

SCRIPT = """
local count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
return {count, redis.call('PTTL', KEYS[1])}
"""


class RateLimiter:
    def __init__(self, redis: Redis, security: Security) -> None:
        self.redis = redis
        self.security = security

    async def check(self, operation: str, identity: str, limit: int, window: int = 60) -> None:
        key = "unison:limit:" + operation + ":" + self.security.digest("rate", identity)
        try:
            result = await cast(
                Awaitable[list[int]], self.redis.eval(SCRIPT, 1, key, str(window * 1000))
            )
            count, ttl = result
        except RedisError as error:
            raise DomainError("UNAVAILABLE", "Сервис временно недоступен", 503) from error
        if count > limit:
            raise DomainError(
                "RATE_LIMITED",
                "Слишком много попыток, попробуйте позже",
                429,
                retry_after=max(1, math.ceil(ttl / 1000)),
            )
