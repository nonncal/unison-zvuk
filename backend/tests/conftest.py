import pytest
from cryptography.fernet import Fernet

from app.config import Settings


@pytest.fixture
def settings() -> Settings:
    return Settings(
        _env_file=None,
        environment="test",
        session_secret="s" * 48,
        invite_encryption_key=Fernet.generate_key().decode(),
        s3_access_key="test",
        s3_secret_key="test",
        app_origin="http://localhost:5173",
    )
