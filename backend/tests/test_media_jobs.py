from pathlib import Path
from uuid import uuid4

import pytest

from app.services.media_jobs import read_file, submit
from app.workers.transcoder import ProcessingFailure, duration_ms, sandbox, text_metadata


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
