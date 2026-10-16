import asyncio
import os
from urllib.parse import urlsplit
from uuid import uuid4

import pytest
from httpx import AsyncClient

from app.config import load_settings
from app.resources import Resources

pytestmark = pytest.mark.system


async def test_public_proxy_preserves_s3_signatures_range_and_private_access() -> None:
    proxy = os.environ.get("UNISON_PROXY_URL")
    if not proxy:
        pytest.skip("Set UNISON_PROXY_URL for an isolated full stack with Nginx")
    settings = load_settings()
    assert urlsplit(settings.app_origin).hostname in {"localhost", "127.0.0.1", "::1"}
    assert settings.s3_public_endpoint == settings.app_origin == proxy
    resources = Resources(settings)
    key = f"proxy-check/{uuid4()}.wav"
    data = b"0123456789" * 100
    try:
        upload = resources.signer.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": resources.bucket,
                "Key": key,
                "ContentType": "audio/wav",
                "ContentLength": len(data),
                "IfNoneMatch": "*",
            },
            ExpiresIn=60,
        )
        download = resources.signer.generate_presigned_url(
            "get_object", Params={"Bucket": resources.bucket, "Key": key}, ExpiresIn=60
        )
        headers = {"Content-Type": "audio/wav", "If-None-Match": "*", "Origin": settings.app_origin}
        async with AsyncClient() as client:
            sent = await client.put(upload, content=data, headers=headers)
            assert sent.status_code == 200
            assert (await client.put(upload, content=data, headers=headers)).status_code == 412
            response = await client.get(
                download, headers={"Range": "bytes=0-9", "Origin": settings.app_origin}
            )
            assert response.status_code == 206 and response.content == data[:10]
            assert response.headers["access-control-allow-origin"] == settings.app_origin
            unsigned = settings.app_origin + f"/{resources.bucket}/{key}"
            assert (await client.get(unsigned)).status_code == 403
            assert (await client.get(settings.app_origin + "/internal/metrics")).status_code == 404
    finally:
        await asyncio.to_thread(resources.storage.delete_object, Bucket=resources.bucket, Key=key)
        await resources.close()


async def test_proxy_bounds_cover_uploads_separately_from_control_requests() -> None:
    proxy = os.environ.get("UNISON_PROXY_URL")
    if not proxy:
        pytest.skip("Set UNISON_PROXY_URL for an isolated full stack with Nginx")
    assert urlsplit(proxy).hostname in {"localhost", "127.0.0.1", "::1"}
    path = f"/api/v1/rooms/{uuid4()}/tracks/{uuid4()}/cover"
    async with AsyncClient(base_url=proxy, timeout=10) as client:
        # This image-sized body must reach authorization, not hit Nginx's JSON limit.
        response = await client.put(path, content=b"x" * 70_000)
        assert response.status_code == 403
        assert response.headers["content-type"].startswith("application/json")
        too_large = await client.put(path, content=b"x" * (6 * 1024 * 1024))
        assert too_large.status_code == 413
        control = await client.post("/api/v1/rooms", content=b"x" * 70_000)
        assert control.status_code == 413
