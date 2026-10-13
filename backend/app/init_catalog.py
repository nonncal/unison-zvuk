import asyncio
import hashlib
import shutil
from uuid import NAMESPACE_URL, uuid5

from sqlalchemy import text

from app.config import load_settings
from app.db.models import Asset, Track
from app.resources import Resources
from app.services.catalog import RECIPES, synthesize
from app.services.media_jobs import MediaFailed, read_file, submit, wait_for_result
from app.workers.audio import publish


async def seed() -> None:
    settings = load_settings()
    resources = Resources(settings)
    try:
        async with resources.engine.connect() as owner:
            locked = await owner.scalar(text("SELECT pg_try_advisory_lock(984105311)"))
            await owner.commit()
            if not locked:
                raise RuntimeError("Catalog initialization already running")
            try:
                for slug, title, frequencies, pulse in RECIPES:
                    track_id = uuid5(NAMESPACE_URL, f"unison:catalog:v1:{slug}")
                    async with resources.sessions() as db:
                        current = await db.get(Track, track_id)
                        if current is not None and current.status == "ready":
                            continue
                    source = await asyncio.to_thread(synthesize, frequencies, pulse)
                    job_id = uuid5(NAMESPACE_URL, f"unison:catalog-job:v1:{slug}")
                    directory = submit(settings.jobs_dir, job_id, source, "audio/wav")
                    result = await asyncio.to_thread(wait_for_result, directory)
                    if isinstance(result, MediaFailed):
                        raise RuntimeError("Catalog normalization failed: " + result.error_code)
                    normalized = read_file(directory / "out" / "normalized.mp3", 100 * 1024 * 1024)
                    digest = hashlib.sha256(normalized).hexdigest()
                    key = f"catalog/v1/{slug}/{digest}.mp3"
                    await asyncio.to_thread(publish, resources, key, normalized)
                    asset_id = uuid5(NAMESPACE_URL, "unison:catalog-asset:" + digest)
                    async with resources.sessions.begin() as db:
                        if await db.get(Asset, asset_id) is None:
                            db.add(
                                Asset(
                                    id=asset_id,
                                    object_key=key,
                                    checksum=digest,
                                    content_type="audio/mpeg",
                                    size_bytes=len(normalized),
                                    media_version=digest,
                                )
                            )
                            await db.flush()
                        track = await db.get(Track, track_id)
                        if track is None:
                            track = Track(
                                id=track_id,
                                scope="catalog",
                                room_id=None,
                                title=title,
                                artist="Unison Studio",
                            )
                            db.add(track)
                        track.status = "ready"
                        track.source_asset_id = asset_id
                        track.playback_asset_id = asset_id
                        track.duration_ms = result.duration_ms
                        track.source_uri = f"unison:synthesis:v1:{slug}"
                        track.license_id = "CC0-1.0"
                        track.license_uri = "https://creativecommons.org/publicdomain/zero/1.0/"
                    shutil.rmtree(directory)
            finally:
                await owner.execute(text("SELECT pg_advisory_unlock(984105311)"))
                await owner.commit()
    finally:
        await resources.close()


if __name__ == "__main__":
    asyncio.run(seed())
