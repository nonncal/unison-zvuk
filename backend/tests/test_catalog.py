import io
import json
import wave
from pathlib import Path

from app.services.catalog import RECIPES, synthesize


def test_catalog_has_six_original_licensed_recipes() -> None:
    manifest = json.loads(Path("catalog/manifest.json").read_text())
    assert len(RECIPES) >= 6
    assert {r[0] for r in RECIPES} == {r["slug"] for r in manifest["tracks"]}
    assert manifest["licenseId"] == "CC0-1.0" and manifest["source"]


def test_synthesis_is_reproducible_and_has_audio_samples() -> None:
    data = synthesize((110, 130.81, 164.81), 0.4, 2)
    assert data == synthesize((110, 130.81, 164.81), 0.4, 2)
    with wave.open(io.BytesIO(data), "rb") as stream:
        assert stream.getnframes() == 16000
        assert stream.getframerate() == 8000
        assert stream.getsampwidth() == 2
        assert any(stream.readframes(16000))
