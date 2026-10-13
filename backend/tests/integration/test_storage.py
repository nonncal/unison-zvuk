import asyncio
import hashlib
import os
from collections.abc import AsyncIterator
from datetime import UTC, datetime, timedelta
from urllib.parse import parse_qs, urlsplit
from uuid import uuid4

import pytest
from httpx import AsyncClient

from app.config import load_settings
from app.db.models import Asset, Upload
from app.resources import Resources
from app.services.storage import Storage

pytestmark = pytest.mark.integration


@pytest.fixture
async def storage() -> AsyncIterator[Storage]:
    if not os.environ.get("UNISON_ENV_FILE"):
        pytest.skip("Set UNISON_ENV_FILE to run S3 integration tests")
    bucket = "unison-test-" + uuid4().hex
    config = load_settings().model_copy(update={"s3_bucket": bucket})
    resources = Resources(config)
    await asyncio.to_thread(resources.storage.create_bucket, Bucket=bucket)
    try:
        yield Storage(resources)
    finally:
        objects = await asyncio.to_thread(resources.storage.list_objects_v2, Bucket=bucket)
        for obj in objects.get("Contents", []):
            await asyncio.to_thread(resources.storage.delete_object, Bucket=bucket, Key=obj["Key"])
        await asyncio.to_thread(resources.storage.delete_bucket, Bucket=bucket)
        await resources.close()


async def test_signed_upload_binds_length_type_and_immutable_key(storage: Storage) -> None:
    upload = Upload(
        id=uuid4(),
        object_key="sources/" + uuid4().hex,
        content_type="audio/wav",
        expected_size=128,
        expires_at=datetime.now(UTC) + timedelta(minutes=10),
    )
    url, headers = storage.upload_url(upload)
    signed_headers = parse_qs(urlsplit(url).query)["X-Amz-SignedHeaders"][0]
    assert set(signed_headers.split(";")) == {
        "content-length",
        "content-type",
        "host",
        "if-none-match",
    }
    async with AsyncClient() as client:
        wrong_size = await client.put(url, content=b"x" * 129, headers=headers)
        assert wrong_size.status_code == 403
        wrong_type = await client.put(
            url, content=b"x" * 128, headers={**headers, "Content-Type": "text/plain"}
        )
        assert wrong_type.status_code == 403
        accepted = await client.put(url, content=b"x" * 128, headers=headers)
        assert accepted.status_code == 200
        duplicate = await client.put(url, content=b"y" * 128, headers=headers)
        assert duplicate.status_code == 412
    metadata = await storage.head(upload.object_key)
    assert metadata["ContentLength"] == 128 and metadata["ContentType"] == "audio/wav"


async def test_private_download_has_range_and_cors_only_for_app(storage: Storage) -> None:
    data = b"0123456789" * 20
    key = "media/" + uuid4().hex
    await asyncio.to_thread(
        storage.resources.storage.put_object,
        Bucket=storage.resources.bucket,
        Key=key,
        Body=data,
        ContentType="audio/mpeg",
        IfNoneMatch="*",
    )
    asset = Asset(
        object_key=key,
        checksum=hashlib.sha256(data).hexdigest(),
        content_type="audio/mpeg",
        size_bytes=len(data),
        media_version="v1",
    )
    url, expires = storage.playback_url(asset)
    assert expires > datetime.now(UTC)
    async with AsyncClient() as client:
        response = await client.get(
            url, headers={"Range": "bytes=0-9", "Origin": "http://localhost:5173"}
        )
        assert response.status_code == 206 and response.content == data[:10]
        assert response.headers["content-range"] == "bytes 0-9/200"
        assert response.headers["content-type"] == "audio/mpeg"
        assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
        other = await client.get(url, headers={"Origin": "https://wrong.test"})
        assert "access-control-allow-origin" not in other.headers
        unsigned = await client.get(url.split("?", 1)[0])
        assert unsigned.status_code == 403
