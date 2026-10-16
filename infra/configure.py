"""Create deployment credentials outside the checkout; Python standard library only."""

import argparse
import base64
import os
import re
import secrets
from pathlib import Path
from urllib.parse import urlsplit


def configure(directory: Path, origin: str) -> None:
    directory = directory.expanduser().resolve()
    repository = Path(__file__).resolve().parents[1]
    if directory.is_relative_to(repository):
        raise ValueError("Runtime configuration must be outside the repository")
    address = urlsplit(origin)
    local = address.hostname in {"localhost", "127.0.0.1"}
    if (
        address.scheme not in {"http", "https"}
        or not address.hostname
        or address.path
        or address.query
        or address.fragment
        or address.username
        or address.password
        or not re.fullmatch(r"[A-Za-z0-9.-]+", address.hostname)
        or (not local and (address.scheme != "https" or address.port is not None))
        or any(c in str(directory) for c in "\n\r'$#")
    ):
        raise ValueError("Use http://localhost:8080 locally or https://your-domain on a server")
    # Never overwrite credentials: rotating these keys invalidates existing sessions/invites.
    directory.mkdir(mode=0o700, parents=True, exist_ok=False)
    password = secrets.token_hex(24)
    token = secrets.token_urlsafe(48)
    values = {
        "ENVIRONMENT": "development" if local else "production",
        "APP_ORIGIN": origin,
        "APP_HOST": address.hostname,
        "HTTP_PORT": str(address.port or (443 if address.scheme == "https" else 80)),
        "POSTGRES_USER": "unison",
        "POSTGRES_DB": "unison",
        "POSTGRES_PASSWORD": password,
        "DATABASE_URL": f"postgresql+asyncpg://unison:{password}@localhost:5432/unison",
        "REDIS_URL": "redis://localhost:6379/0",
        "SESSION_SECRET": secrets.token_urlsafe(48),
        "INVITE_ENCRYPTION_KEY": base64.urlsafe_b64encode(secrets.token_bytes(32)).decode(),
        "S3_ENDPOINT": "http://localhost:9000",
        "S3_PUBLIC_ENDPOINT": origin,
        "S3_BUCKET": "unison-audio",
        "S3_REGION": "us-east-1",
        "S3_ACCESS_KEY": secrets.token_hex(12),
        "S3_SECRET_KEY": secrets.token_urlsafe(48),
        "METRICS_TOKEN": token,
        "METRICS_TOKEN_FILE": str(directory / "metrics.token"),
        "GRAFANA_PASSWORD_FILE": str(directory / "grafana.password"),
        "TLS_CERT_DIR": str(directory / "tls"),
    }
    with (directory / "compose.env").open("x") as file:
        os.chmod(file.name, 0o600)
        file.write("".join(f"{key}='{value}'\n" for key, value in values.items()))
    for name, value in [("metrics.token", token), ("grafana.password", secrets.token_urlsafe(32))]:
        with (directory / name).open("x") as file:
            # File secrets are bind-mounted, so container UIDs need read permission.
            # The host's parent directory is private (0700).
            os.chmod(file.name, 0o644)
            file.write(value + "\n")
    (directory / "tls").mkdir(mode=0o700)
    print(f"Created {directory / 'compose.env'} (credentials are not displayed)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--origin", default="http://localhost:8080")
    args = parser.parse_args()
    try:
        configure(args.output, args.origin)
    except (ValueError, OSError) as error:
        parser.exit(1, f"Configuration failed: {error}\n")
