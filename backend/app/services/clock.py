import time
from uuid import uuid4


class Clock:
    def __init__(self) -> None:
        self.epoch = uuid4()
        self.wall_ms = time.time_ns() // 1_000_000
        self.monotonic_ns = time.monotonic_ns()

    def now_ms(self) -> int:
        return self.wall_ms + (time.monotonic_ns() - self.monotonic_ns) // 1_000_000

    def reset_if_jumped(self) -> bool:
        if abs(time.time_ns() // 1_000_000 - self.now_ms()) <= 100:
            return False
        self.epoch = uuid4()
        self.wall_ms = time.time_ns() // 1_000_000
        self.monotonic_ns = time.monotonic_ns()
        return True
