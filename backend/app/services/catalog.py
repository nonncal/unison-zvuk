"""Prepared catalog audio and its recording-specific public-domain provenance."""

import hashlib
from pathlib import Path
from typing import Literal
from uuid import NAMESPACE_URL, UUID, uuid5

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

CATALOG_DIR = Path(__file__).resolve().parents[2] / "catalog"


class CatalogTrack(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, extra="forbid", frozen=True)

    id: UUID
    slug: str = Field(pattern=r"^[a-z0-9-]+$")
    title: str = Field(min_length=1, max_length=200)
    artist: str = Field(min_length=1, max_length=200)
    performer: str = Field(min_length=1)
    composer_death_year: int = Field(le=1925)
    file: str = Field(pattern=r"^[a-z0-9-]+\.mp3$")
    duration_ms: int = Field(gt=0, le=900000)
    size_bytes: int = Field(gt=0, le=100 * 1024 * 1024)
    sha256: str = Field(pattern=r"^[a-f0-9]{64}$")
    source_uri: str = Field(min_length=1, max_length=512)
    source_revision_uri: str
    source_download_uri: str
    source_sha1: str = Field(pattern=r"^[a-f0-9]{40}$")
    recording_rights: str = Field(min_length=1)
    license_id: Literal["CC0-1.0", "LicenseRef-Public-Domain"]
    license_uri: str
    cover: str

    @property
    def asset_id(self) -> UUID:
        return uuid5(NAMESPACE_URL, "unison:catalog-asset:" + self.sha256)


class CatalogManifest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    version: Literal[2]
    tracks: list[CatalogTrack] = Field(min_length=6)


def load_catalog(directory: Path = CATALOG_DIR) -> tuple[CatalogTrack, ...]:
    manifest = CatalogManifest.model_validate_json((directory / "manifest.json").read_bytes())
    tracks = tuple(manifest.tracks)
    for field in ("id", "slug", "file"):
        if len({getattr(track, field) for track in tracks}) != len(tracks):
            raise ValueError(f"Duplicate catalog {field}")
    return tracks


def read_audio(track: CatalogTrack, directory: Path = CATALOG_DIR) -> bytes:
    with (directory / "audio" / track.file).open("rb") as stream:
        audio = stream.read(track.size_bytes + 1)
    if len(audio) != track.size_bytes or hashlib.sha256(audio).hexdigest() != track.sha256:
        raise ValueError(f"Catalog audio checksum mismatch: {track.slug}")
    return audio
