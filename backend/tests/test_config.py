from pathlib import Path

import pytest
from pydantic import ValidationError

from app.config import Settings, write_development_env


def test_external_env_creation_is_private_and_never_overwrites(tmp_path: Path) -> None:
    path = tmp_path / "local.env"
    write_development_env(path)
    assert path.stat().st_mode & 0o777 == 0o600
    settings = Settings(_env_file=path)
    assert len(settings.session_secret.get_secret_value()) >= 32
    with pytest.raises(FileExistsError):
        write_development_env(path)


def test_remote_http_is_rejected(settings: Settings) -> None:
    values = settings.model_dump()
    values["app_origin"] = "http://example.com"
    with pytest.raises(ValidationError):
        Settings(_env_file=None, **values)
