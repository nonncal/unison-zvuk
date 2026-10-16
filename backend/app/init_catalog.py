import asyncio

from sqlalchemy import text

from app.config import load_settings
from app.db.models import Asset, Track
from app.resources import Resources
from app.services.catalog import load_catalog, lyrics_document, read_audio
from app.workers.audio import publish


async def seed() -> None:
    tracks = load_catalog()
    # Validate the complete bundle before publishing or changing catalog rows.
    audio_files = [await asyncio.to_thread(read_audio, track) for track in tracks]
    lyrics = [
        lyrics_document(entry, audio) for entry, audio in zip(tracks, audio_files, strict=True)
    ]
    settings = load_settings()
    resources = Resources(settings)
    try:
        async with resources.engine.connect() as owner:
            locked = await owner.scalar(text("SELECT pg_try_advisory_lock(984105311)"))
            await owner.commit()
            if not locked:
                raise RuntimeError("Catalog initialization already running")
            try:
                for entry, normalized, entry_lyrics in zip(
                    tracks, audio_files, lyrics, strict=True
                ):
                    key = f"catalog/v2/{entry.slug}/{entry.sha256}.mp3"
                    await asyncio.to_thread(publish, resources, key, normalized)
                    asset_id = entry.asset_id
                    async with resources.sessions.begin() as db:
                        if await db.get(Asset, asset_id) is None:
                            db.add(
                                Asset(
                                    id=asset_id,
                                    object_key=key,
                                    checksum=entry.sha256,
                                    content_type="audio/mpeg",
                                    size_bytes=len(normalized),
                                    media_version=entry.sha256,
                                )
                            )
                            await db.flush()
                        track = await db.get(Track, entry.id)
                        if track is None:
                            track = Track(
                                id=entry.id,
                                scope="catalog",
                                room_id=None,
                                title=entry.title,
                                artist=entry.artist,
                            )
                            db.add(track)
                        track.title = entry.title
                        track.artist = entry.artist
                        track.status = "ready"
                        track.error_code = None
                        track.source_asset_id = asset_id
                        track.playback_asset_id = asset_id
                        track.duration_ms = entry.duration_ms
                        track.source_uri = entry.source_uri
                        track.license_id = entry.license_id
                        track.license_uri = entry.license_uri
                        if track.lyrics != entry_lyrics:
                            track.lyrics = entry_lyrics
                            track.lyrics_version = (track.lyrics_version or 0) + 1
            finally:
                await owner.execute(text("SELECT pg_advisory_unlock(984105311)"))
                await owner.commit()
    finally:
        await resources.close()


if __name__ == "__main__":
    asyncio.run(seed())
