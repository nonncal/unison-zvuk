"""Repair narrowly identifiable malformed tags in one room; dry-run by default."""

import argparse
import asyncio
from uuid import UUID

from sqlalchemy import select

from app.config import load_settings
from app.db import models as dbm
from app.domain.media import Media
from app.domain.rooms import Rooms
from app.resources import Resources
from app.services.metadata import repair_swapped_ascii
from app.services.security import Security
from app.services.storage import Storage


async def repair(room_id: UUID, apply: bool) -> None:
    settings = load_settings()
    resources = Resources(settings)
    media = Media(Rooms(settings, Security(settings)), Storage(resources))
    try:
        async with resources.sessions.begin() as db:
            await media.rooms.room(db, room_id)
            tracks = await db.scalars(select(dbm.Track).where(dbm.Track.room_id == room_id))
            count = 0
            for track in tracks:
                title, artist = (
                    repair_swapped_ascii(track.title),
                    repair_swapped_ascii(track.artist),
                )
                if (title, artist) == (track.title, track.artist):
                    continue
                count += 1
                print(f"{track.id}: {track.title!r} / {track.artist!r} -> {title!r} / {artist!r}")
                if apply:
                    track.title, track.artist = title, artist
                    if track.cover_data is None:
                        track.cover_version += 1
                    await db.flush()
                    await media.emit_track(db, track)
            print(f"{'Updated' if apply else 'Would update'}: {count}")
    finally:
        await resources.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--room", type=UUID, required=True)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    asyncio.run(repair(args.room, args.apply))
