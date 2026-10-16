import hashlib
import hmac
import json
import re
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

from cryptography.fernet import Fernet
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import Settings
from app.db.models import Session
from app.domain.errors import DomainError

TOKEN_PATTERN = re.compile(r"^[A-Za-z0-9_-]{43}$")


class Security:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.secret = settings.session_secret.get_secret_value().encode()
        self.cipher = Fernet(settings.invite_encryption_key.get_secret_value().encode())

    def digest(self, purpose: str, value: str) -> str:
        return hmac.new(self.secret, (purpose + ":" + value).encode(), hashlib.sha256).hexdigest()

    def csrf(self, cookie: str) -> str:
        return self.digest("csrf-token", cookie)

    async def session(self, db: AsyncSession, cookie: str | None, lock: bool = False) -> Session:
        if not cookie or not TOKEN_PATTERN.fullmatch(cookie):
            raise DomainError("SESSION_EXPIRED", "Обновите страницу для входа", 401)
        query = select(Session).where(
            Session.token_hash == self.digest("session", cookie),
            Session.expires_at > datetime.now(UTC),
        )
        if lock:
            query = query.with_for_update()
        session = await db.scalar(query)
        if session is None:
            raise DomainError("SESSION_EXPIRED", "Обновите страницу для входа", 401)
        return session

    async def new_session(self, db: AsyncSession) -> tuple[Session, str]:
        cookie = secrets.token_urlsafe(32)
        session = Session(
            token_hash=self.digest("session", cookie),
            csrf_hash=self.digest("csrf", self.csrf(cookie)),
            expires_at=datetime.now(UTC) + timedelta(seconds=self.settings.session_ttl_seconds),
        )
        db.add(session)
        await db.flush()
        return session, cookie

    def check_origin(self, origin: str | None) -> None:
        if origin != self.settings.app_origin.rstrip("/"):
            raise DomainError("ORIGIN_FORBIDDEN", "Источник запроса не разрешён", 403)

    def check_csrf(self, session: Session, csrf: str | None) -> None:
        if (
            csrf is None
            or len(csrf) != 64
            or not hmac.compare_digest(session.csrf_hash, self.digest("csrf", csrf))
        ):
            raise DomainError("CSRF_INVALID", "Обновите страницу и повторите действие", 403)

    def encrypt(self, value: str) -> str:
        return self.cipher.encrypt(value.encode()).decode()

    def decrypt(self, value: str) -> str:
        return self.cipher.decrypt(value.encode()).decode()

    def seal_response(self, response: dict[str, Any]) -> dict[str, Any]:
        return {"sealed": self.encrypt(json.dumps(response, ensure_ascii=False))}

    def unseal_response(self, response: dict[str, Any]) -> dict[str, Any]:
        result: dict[str, Any] = json.loads(self.decrypt(response["sealed"]))
        return result


def payload_hash(value: dict[str, Any]) -> str:
    return hashlib.sha256(
        json.dumps(
            value, sort_keys=True, separators=(",", ":"), ensure_ascii=False, allow_nan=False
        ).encode()
    ).hexdigest()
