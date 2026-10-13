import argparse
import os
import secrets
from pathlib import Path
from typing import Literal, Self
from urllib.parse import urlsplit

from cryptography.fernet import Fernet
from pydantic import Field, SecretStr, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore", hide_input_in_errors=True)

    environment: Literal["development", "test", "production"] = "development"
    app_origin: str = "http://localhost:5173"
    database_url: str = "postgresql+asyncpg://unison:unison@localhost:5432/unison"
    redis_url: str = "redis://localhost:6379/0"
    session_secret: SecretStr
    invite_encryption_key: SecretStr
    s3_endpoint: str = "http://localhost:9000"
    s3_bucket: str = "unison-audio"
    s3_region: str = "us-east-1"
    s3_access_key: SecretStr
    s3_secret_key: SecretStr
    session_cookie: str = "unison_session"
    session_ttl_seconds: int = Field(default=86400, ge=60)
    room_ttl_seconds: int = Field(default=86400, ge=60)
    empty_room_ttl_seconds: int = Field(default=1800, ge=60)
    host_grace_seconds: int = Field(default=30, ge=1)
    receipt_ttl_seconds: int = Field(default=600, ge=1)
    upload_max_bytes: int = Field(default=50 * 1024 * 1024, ge=1)
    audio_max_duration_ms: int = Field(default=900_000, ge=1)
    ws_max_message_bytes: int = Field(default=16 * 1024, ge=1)
    ws_queue_size: int = Field(default=100, ge=2)
    heartbeat_seconds: int = Field(default=5, ge=1)
    offline_seconds: int = Field(default=15, ge=2)
    create_per_minute: int = Field(default=5, ge=1)
    join_per_minute: int = Field(default=20, ge=1)
    bootstrap_per_minute: int = Field(default=60, ge=1)
    log_level: str = "INFO"

    @model_validator(mode="after")
    def validate_security(self) -> Self:
        origin = urlsplit(self.app_origin)
        local = origin.hostname in {"localhost", "127.0.0.1", "::1"}
        if origin.scheme not in {"http", "https"} or not origin.hostname:
            raise ValueError("APP_ORIGIN must be an HTTP origin")
        if origin.path not in {"", "/"} or origin.query or origin.fragment or origin.username:
            raise ValueError("APP_ORIGIN must not include a path, credentials or query")
        if origin.scheme != "https" and not local:
            raise ValueError("HTTPS is required outside localhost")
        if len(self.session_secret.get_secret_value()) < 32:
            raise ValueError("SESSION_SECRET must have at least 32 characters")
        Fernet(self.invite_encryption_key.get_secret_value().encode())
        return self

    @property
    def cookie_secure(self) -> bool:
        return self.app_origin.startswith("https://")


def load_settings() -> Settings:
    return Settings(_env_file=os.environ.get("UNISON_ENV_FILE", ".env"))


def write_development_env(path: Path) -> None:
    password = secrets.token_urlsafe(24)
    access = secrets.token_hex(12)
    storage_secret = secrets.token_urlsafe(32)
    lines = [
        "ENVIRONMENT=development",
        "APP_ORIGIN=http://localhost:5173",
        "POSTGRES_USER=unison",
        "POSTGRES_DB=unison",
        f"POSTGRES_PASSWORD={password}",
        f"DATABASE_URL=postgresql+asyncpg://unison:{password}@localhost:5432/unison",
        "REDIS_URL=redis://localhost:6379/0",
        f"SESSION_SECRET={secrets.token_urlsafe(48)}",
        f"INVITE_ENCRYPTION_KEY={Fernet.generate_key().decode()}",
        "S3_ENDPOINT=http://localhost:9000",
        "S3_BUCKET=unison-audio",
        "S3_REGION=us-east-1",
        f"S3_ACCESS_KEY={access}",
        f"S3_SECRET_KEY={storage_secret}",
    ]
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, "w") as file:
        file.write("\n".join(lines) + "\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--write-env", type=Path, required=True)
    write_development_env(parser.parse_args().write_env)
