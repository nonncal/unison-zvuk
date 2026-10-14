import asyncio
import hashlib
import io
import os
import time
import wave
from urllib.parse import parse_qs, urlsplit
from uuid import uuid4

import pytest
from httpx import AsyncClient

from app.config import load_settings

pytestmark = pytest.mark.system


def wav(seconds: int) -> bytes:
    stream = io.BytesIO()
    with wave.open(stream, "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(8000)
        output.writeframes(b"\x00\x00" * (8000 * seconds))
    return stream.getvalue()


async def test_live_worker_pipeline_validates_audio_and_shares_immutable_version() -> None:
    base = os.environ.get("UNISON_SYSTEM_URL")
    if not base:
        pytest.skip("Set UNISON_SYSTEM_URL for an isolated running Compose stack")
    origin = load_settings().app_origin
    async with (
        AsyncClient(base_url=base, timeout=10) as host,
        AsyncClient(base_url=base, timeout=10) as guest,
    ):
        for client in [host, guest]:
            bootstrap = await client.get("/api/v1/bootstrap")
            assert bootstrap.status_code == 200
            client.headers.update({"Origin": origin, "X-CSRF-Token": bootstrap.json()["csrfToken"]})
        created = await host.post(
            "/api/v1/rooms",
            json={"displayName": "Кирилл"},
            headers={"Idempotency-Key": str(uuid4())},
        )
        assert created.status_code == 201
        room_id = created.json()["roomId"]
        token = parse_qs(urlsplit(created.json()["inviteUrl"]).fragment)["invite"][0]
        try:
            joined = await guest.post(
                f"/api/v1/rooms/{room_id}/join", json={"inviteToken": token, "displayName": "Аня"}
            )
            assert joined.status_code == 200
            cases = [
                (wav(2), "audio/wav", "audio.wav", "ready", None),
                (b"not an audio file" * 10, "audio/wav", "corrupt.wav", "failed", "MEDIA_INVALID"),
                (wav(2), "audio/mpeg", "disguised.mp3", "failed", "UNSUPPORTED_MEDIA"),
                (wav(901), "audio/wav", "long.wav", "failed", "DURATION_LIMIT"),
            ]
            for source, content_type, filename, status, error_code in cases:
                reserved = await host.post(
                    f"/api/v1/rooms/{room_id}/uploads",
                    json={
                        "fileName": filename,
                        "contentType": content_type,
                        "sizeBytes": len(source),
                    },
                    headers={"Idempotency-Key": str(uuid4())},
                )
                assert reserved.status_code == 201
                upload = reserved.json()
                async with AsyncClient(timeout=15) as sender:
                    sent = await sender.put(
                        upload["uploadUrl"], content=source, headers=upload["requiredHeaders"]
                    )
                    assert sent.status_code == 200
                complete_path = f"/api/v1/rooms/{room_id}/uploads/{upload['uploadId']}/complete"
                completion = await host.post(complete_path, json={})
                assert completion.status_code == 202
                track_id = completion.json()["trackId"]
                assert (await host.post(complete_path, json={})).json() == completion.json()
                started = time.monotonic()
                while True:
                    result = await host.get(f"/api/v1/rooms/{room_id}/tracks/{track_id}")
                    assert result.status_code == 200
                    assert (await host.get("/health/ready")).status_code == 200
                    if result.json()["status"] in {"ready", "failed"}:
                        break
                    assert time.monotonic() - started < 135
                    await asyncio.sleep(0.2)
                assert result.json()["status"] == status
                if error_code:
                    assert result.json()["errorCode"] == error_code
                else:
                    assert 2000 <= result.json()["durationMs"] <= 2100
                    urls = await asyncio.gather(
                        *[
                            client.post(
                                f"/api/v1/rooms/{room_id}/tracks/{track_id}/playback-url", json={}
                            )
                            for client in [host, guest]
                        ]
                    )
                    assert all(url.status_code == 200 for url in urls)
                    assert urls[0].json()["mediaVersion"] == urls[1].json()["mediaVersion"]
                    assert urls[0].json()["checksum"] == urls[1].json()["checksum"]
                    async with AsyncClient() as downloader:
                        data = await downloader.get(urls[0].json()["url"])
                        assert data.status_code == 200
                        assert (
                            hashlib.sha256(data.content).hexdigest() == urls[0].json()["checksum"]
                        )
        finally:
            snapshot = await host.get(f"/api/v1/rooms/{room_id}")
            await host.post(
                f"/api/v1/rooms/{room_id}/close",
                json={"expectedPlaybackRevision": snapshot.json()["playbackRevision"]},
            )
