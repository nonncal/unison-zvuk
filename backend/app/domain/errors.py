from typing import Any


class DomainError(Exception):
    def __init__(
        self,
        code: str,
        message: str,
        status: int = 409,
        details: dict[str, Any] | None = None,
        retry_after: int | None = None,
    ) -> None:
        super().__init__(code)
        self.code = code
        self.message = message
        self.status = status
        self.details = details
        self.retry_after = retry_after
