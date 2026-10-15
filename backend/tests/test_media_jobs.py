from pathlib import Path
from uuid import uuid4

import pytest

from app.services.media_jobs import MediaReady, MediaRequest, read_file, submit
from app.services.metadata import text_metadata
from app.workers import transcoder
from app.workers.transcoder import ProcessingFailure, duration_ms, sandbox


def test_media_submission_is_idempotent_but_rejects_mismatched_input(tmp_path: Path) -> None:
    job_id = uuid4()
    directory = submit(tmp_path, job_id, b"wave", "audio/wav")
    assert submit(tmp_path, job_id, b"wave", "audio/wav") == directory
    with pytest.raises(ValueError, match="different input"):
        submit(tmp_path, job_id, b"changed", "audio/wav")
    with pytest.raises(ValueError, match="different input"):
        submit(tmp_path, job_id, b"wave", "audio/mpeg")


def test_media_files_cannot_use_symlinks_or_exceed_bounds(tmp_path: Path) -> None:
    data = tmp_path / "data"
    data.write_bytes(b"12345")
    symlink = tmp_path / "link"
    symlink.symlink_to(data)
    with pytest.raises(OSError):
        read_file(symlink, 10)
    with pytest.raises(ValueError, match="Invalid"):
        read_file(data, 4)
    with pytest.raises(ValueError):
        read_file(tmp_path, 10)


@pytest.mark.parametrize("duration", ["NaN", "Infinity", "-1", "0", "corrupt"])
def test_probe_duration_must_be_finite_positive(duration: str) -> None:
    with pytest.raises(ProcessingFailure):
        duration_ms({"format": {"duration": duration}})


def test_probe_duration_enforces_fifteen_minute_boundary() -> None:
    assert duration_ms({"format": {"duration": "900.000"}}) == 900_000
    assert duration_ms({"format": {"duration": "2.0001"}}) == 2001
    with pytest.raises(ProcessingFailure) as failure:
        duration_ms({"format": {"duration": "900.0001"}})
    assert failure.value.code == "DURATION_LIMIT"


def test_metadata_cannot_smuggle_controls_and_is_bounded() -> None:
    assert text_metadata("  А\nн\u202eя  ") == "Аня"
    assert text_metadata(None) == ""
    assert len(text_metadata("a" * 300)) == 200


def test_submission_recovers_partial_files_before_request_is_visible(tmp_path: Path) -> None:
    job_id = uuid4()
    directory = tmp_path / str(job_id)
    directory.mkdir()
    (directory / "source.bin").write_bytes(b"partial")
    (directory / "request.json.tmp").write_bytes(b"partial json")
    submit(tmp_path, job_id, b"wave", "audio/wav")
    assert (directory / "source.bin").read_bytes() == b"wave"
    assert (directory / "request.json").is_file()


def test_transcoder_cannot_bind_a_replaced_temporary_directory(tmp_path: Path) -> None:
    directory = submit(tmp_path, uuid4(), b"wave", "audio/wav")
    temporary = directory / "out" / "tmp"
    temporary.rmdir()
    temporary.symlink_to(tmp_path, target_is_directory=True)
    with pytest.raises(ProcessingFailure) as failed:
        sandbox(directory, ["/usr/bin/true"])
    assert failed.value.code == "MEDIA_INVALID"


def test_failed_transcoding_frees_output_before_publishing_error(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    directory = submit(tmp_path, uuid4(), b"wave", "audio/wav")

    def fail(directory: Path, request: MediaRequest) -> MediaReady:
        (directory / "out" / "large.log").write_bytes(b"x" * 1024 * 1024)
        raise ProcessingFailure("OUTPUT_LIMIT")

    monkeypatch.setattr(transcoder, "normalize", fail)
    transcoder.process_directory(directory, tmp_path)
    assert not (directory / "out" / "large.log").exists()
    assert b"OUTPUT_LIMIT" in read_file(directory / "result.json", 16384)


def test_removed_job_does_not_crash_transcoder_loop(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    import shutil

    directory = submit(tmp_path, uuid4(), b"wave", "audio/wav")

    def disappear(directory: Path, request: MediaRequest) -> MediaReady:
        shutil.rmtree(directory)
        return MediaReady(duration_ms=1000)

    monkeypatch.setattr(transcoder, "normalize", disappear)
    transcoder.process_directory(directory, tmp_path)
    assert not directory.exists()


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        ("挀甀琀\u2000栀愀渀搀猀", "cut hands"),
        ("䐀攀昀琀漀渀攀猀", "Deftones"),
        ("После дождя", "После дождя"),
        ("宇多田ヒカル", "宇多田ヒカル"),
        ("周杰倫 — 夜曲", "周杰倫 — 夜曲"),
        ("Beyoncé 🎶", "Beyoncé 🎶"),
        ("挀甀琀 mixed", "挀甀琀 mixed"),
    ],
)
def test_metadata_repairs_only_unambiguous_swapped_ascii(raw: str, expected: str) -> None:
    assert text_metadata(raw) == expected


@pytest.mark.parametrize("failure", [True, False])
def test_optional_artwork_is_bounded_and_failure_is_nonfatal(tmp_path, monkeypatch, failure):
    directory = submit(tmp_path, uuid4(), b"wave", "audio/mpeg")
    calls = []

    def execute(directory, command, output, seconds, max_file_bytes, **kwargs):
        calls.append(command)
        assert seconds == 8 and max_file_bytes == 5 * 1024 * 1024
        if failure:
            raise ProcessingFailure("MEDIA_INVALID")
        (directory / "out" / "cover.webp").write_bytes(b"image")

    monkeypatch.setattr(transcoder, "execute", execute)
    assert not transcoder.extract_cover(directory, [])
    stream = {
        "index": 2,
        "codec_type": "video",
        "width": 600,
        "height": 600,
        "disposition": {"attached_pic": 1},
    }
    assert transcoder.extract_cover(directory, [stream]) is not failure
    assert calls[0][calls[0].index("-map") + 1] == "0:2"
    assert not transcoder.extract_cover(directory, [{**stream, "width": 100_000}])
    assert len(calls) == 1
