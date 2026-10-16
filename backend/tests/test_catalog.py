import json
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock
from uuid import NAMESPACE_URL, UUID, uuid5

import pytest
from pydantic import ValidationError

from app import init_catalog
from app.db.models import Asset, Track
from app.services.catalog import CATALOG_DIR, load_catalog, read_audio


def test_catalog_has_nine_full_recordings_and_preserves_existing_slots() -> None:
    tracks = load_catalog()
    legacy_slugs = (
        "quiet-pulse",
        "after-rain",
        "northern-light",
        "evening-orbit",
        "warm-air",
        "slow-tide",
    )
    assert len(tracks) == 9
    assert {uuid5(NAMESPACE_URL, f"unison:catalog:v1:{slug}") for slug in legacy_slugs} <= {
        track.id for track in tracks
    }
    for track in tracks:
        assert track.duration_ms > 30000
        assert track.source_revision_uri.startswith("https://commons.wikimedia.org/")
        assert track.performer and track.recording_rights
        assert read_audio(track).startswith(b"ID3")


def test_catalog_rejects_corrupted_recording(tmp_path: Path) -> None:
    track = load_catalog()[0]
    (tmp_path / "audio").mkdir()
    (tmp_path / "audio" / track.file).write_bytes(b"wrong recording")
    with pytest.raises(ValueError, match="checksum mismatch"):
        read_audio(track, tmp_path)


def test_catalog_rejects_duplicate_slots_and_attribution_license(tmp_path: Path) -> None:
    manifest = json.loads((CATALOG_DIR / "manifest.json").read_text())
    manifest["tracks"][1]["id"] = manifest["tracks"][0]["id"]
    path = tmp_path / "manifest.json"
    path.write_text(json.dumps(manifest))
    with pytest.raises(ValueError, match="Duplicate catalog id"):
        load_catalog(tmp_path)
    manifest["tracks"][0]["licenseId"] = "CC-BY-4.0"
    path.write_text(json.dumps(manifest))
    with pytest.raises(ValidationError):
        load_catalog(tmp_path)


@pytest.mark.asyncio
async def test_seed_replaces_ready_synthesis_and_is_repeatable(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    entries = load_catalog()
    records: dict[tuple[type[Asset] | type[Track], UUID], Asset | Track] = {
        (Track, entry.id): Track(
            id=entry.id,
            scope="catalog",
            title="Old synthesis",
            artist="Unison Studio",
            status="ready",
            duration_ms=60000,
        )
        for entry in entries
    }

    async def get(model: type[Asset] | type[Track], key: UUID) -> Asset | Track | None:
        return records.get((model, key))

    def add(record: Asset | Track) -> None:
        records[(type(record), record.id)] = record

    db = AsyncMock()
    db.get.side_effect = get
    db.add = MagicMock(side_effect=add)
    resources = MagicMock()
    resources.sessions.begin.return_value.__aenter__.return_value = db
    owner = AsyncMock()
    owner.scalar.return_value = True
    resources.engine.connect.return_value.__aenter__.return_value = owner
    resources.close = AsyncMock()
    publisher = MagicMock()
    monkeypatch.setattr(init_catalog, "load_settings", MagicMock())
    monkeypatch.setattr(init_catalog, "Resources", MagicMock(return_value=resources))
    monkeypatch.setattr(init_catalog, "publish", publisher)

    await init_catalog.seed()
    await init_catalog.seed()

    assert len(records) == 18  # Nine slots, nine immutable audio assets.
    for entry in entries:
        track = records[(Track, entry.id)]
        assert isinstance(track, Track)
        assert (track.title, track.artist) == (entry.title, entry.artist)
        assert track.playback_asset_id == entry.asset_id
        assert track.duration_ms == entry.duration_ms
        assert track.source_uri == entry.source_uri
        assert track.license_id == entry.license_id
    assert publisher.call_count == 18
