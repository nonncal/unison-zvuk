import argparse
import hashlib
import json
import os
import resource
import shutil
import signal
import stat
import subprocess
import time
from decimal import ROUND_CEILING, Decimal, InvalidOperation
from pathlib import Path
from typing import Any, Literal
from uuid import UUID

from app.services.media_jobs import (
    MediaFailed,
    MediaReady,
    MediaRequest,
    atomic_json,
    read_file,
    read_prefix,
)
from app.services.metadata import text_metadata


class ProcessingFailure(Exception):
    def __init__(self, code: str) -> None:
        self.code = code


def sandbox(directory: Path, command: list[str]) -> list[str]:
    temporary = directory / "out" / "tmp"
    if temporary.is_symlink() or temporary.resolve(strict=True).parent != directory / "out":
        raise ProcessingFailure("MEDIA_INVALID")
    args = [
        "/usr/bin/bwrap",
        "--unshare-user",
        "--unshare-pid",
        "--unshare-ipc",
        "--unshare-uts",
        "--new-session",
        "--die-with-parent",
        "--clearenv",
        "--cap-drop",
        "ALL",
        "--ro-bind",
        "/usr",
        "/usr",
        "--ro-bind",
        "/lib",
        "/lib",
    ]
    if Path("/lib64").exists():
        args += ["--ro-bind", "/lib64", "/lib64"]
    args += [
        "--ro-bind",
        "/etc",
        "/etc",
        "--dev",
        "/dev",
        "--ro-bind",
        str(directory / "source.bin"),
        "/input",
        "--bind",
        str(directory / "out"),
        "/work",
        "--bind",
        str(directory / "out" / "tmp"),
        "/tmp",
        "--chdir",
        "/work",
        "--setenv",
        "PATH",
        "/usr/bin",
        "--setenv",
        "HOME",
        "/tmp",
        "--setenv",
        "TMPDIR",
        "/tmp",
        "--setenv",
        "OPENBLAS_NUM_THREADS",
        "1",
        "--setenv",
        "OMP_NUM_THREADS",
        "1",
    ]
    return args + command


def execute(
    directory: Path,
    command: list[str],
    output: str,
    seconds: int,
    max_file_bytes: int,
    *,
    watch_request: bool = False,
) -> None:
    def limits() -> None:
        resource.setrlimit(resource.RLIMIT_CPU, (seconds, seconds))
        resource.setrlimit(resource.RLIMIT_AS, (1024 * 1024 * 1024, 1024 * 1024 * 1024))
        resource.setrlimit(resource.RLIMIT_FSIZE, (max_file_bytes, max_file_bytes))
        resource.setrlimit(resource.RLIMIT_NOFILE, (64, 64))
        os.umask(0o077)

    stdout_fd = os.open(
        directory / "out" / output, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600
    )
    stderr_fd = os.open(
        directory / "out" / (output + ".stderr"),
        os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW,
        0o600,
    )
    try:
        with (
            os.fdopen(stdout_fd, "wb", closefd=False) as stdout,
            os.fdopen(stderr_fd, "wb", closefd=False) as stderr,
        ):
            process = subprocess.Popen(
                sandbox(directory, command),
                stdin=subprocess.DEVNULL,
                stdout=stdout,
                stderr=stderr,
                shell=False,
                start_new_session=True,
                close_fds=True,
                preexec_fn=limits,
            )
            deadline = time.monotonic() + seconds
            while True:
                if time.monotonic() >= deadline or (
                    watch_request and not (directory / "request.json").exists()
                ):
                    os.killpg(process.pid, signal.SIGKILL)
                    process.wait()
                    raise ProcessingFailure("PROCESSING_TIMEOUT")
                try:
                    code = process.wait(timeout=min(0.2, max(0.001, deadline - time.monotonic())))
                    break
                except subprocess.TimeoutExpired:
                    continue
        if code != 0:
            diagnostic = read_prefix(directory / "out" / (output + ".stderr"))
            if b"bwrap:" in diagnostic:
                raise ProcessingFailure("PROCESSING_UNAVAILABLE")
            if any(word in diagnostic.lower() for word in [b"encrypted", b"decrypt", b"drm"]):
                raise ProcessingFailure("DRM_UNSUPPORTED")
            if code in {-signal.SIGXFSZ, 128 + signal.SIGXFSZ} or b"File too large" in diagnostic:
                raise ProcessingFailure("OUTPUT_LIMIT")
            if code in {-signal.SIGXCPU, 128 + signal.SIGXCPU}:
                raise ProcessingFailure("PROCESSING_TIMEOUT")
            raise ProcessingFailure("MEDIA_INVALID")
    finally:
        os.close(stdout_fd)
        os.close(stderr_fd)


def probe(directory: Path, path: str, output: str) -> dict[str, Any]:
    execute(
        directory,
        [
            "/usr/bin/ffprobe",
            "-v",
            "error",
            "-protocol_whitelist",
            "file,pipe",
            "-show_streams",
            "-show_format",
            "-of",
            "json",
            path,
        ],
        output,
        8,
        1024 * 1024,
        watch_request=True,
    )
    parsed: dict[str, Any] = json.loads(read_file(directory / "out" / output, 1024 * 1024))
    return parsed


def duration_ms(data: dict[str, Any]) -> int:
    try:
        duration = Decimal(str(data.get("format", {}).get("duration", "NaN")))
    except InvalidOperation as error:
        raise ProcessingFailure("MEDIA_INVALID") from error
    if not duration.is_finite() or duration <= 0:
        raise ProcessingFailure("MEDIA_INVALID")
    result = int((duration * 1000).to_integral_value(rounding=ROUND_CEILING))
    if result > 900_000:
        raise ProcessingFailure("DURATION_LIMIT")
    return result


# 48 kHz sources keep their rate (most browsers and DACs run at 48 kHz, so a second
# resample would only add error); everything else is resampled once to 44.1 kHz.
def output_rate(audio_stream: dict[str, Any]) -> Literal[44100, 48000]:
    return 48_000 if str(audio_stream.get("sample_rate")) == "48000" else 44_100


# The lossy encoder overshoots hot masters by up to ~0.5 dB, which clips in the
# browser's 16-bit output. Leave headroom, then catch only the rare residual peak.
AUDIO_FILTER = (
    "aresample=resampler=soxr:precision=28,"
    "volume=-1.5dB,"
    "alimiter=limit=0.98:attack=5:release=50:level=disabled"
)


def extract_cover(directory: Path, streams: list[dict[str, Any]]) -> bool:
    """Artwork is optional: a malformed image must never discard valid audio."""
    stream = next(
        (
            s
            for s in streams
            if s.get("disposition", {}).get("attached_pic") and s.get("codec_type") == "video"
        ),
        None,
    )
    if stream is None:
        return False
    try:
        width, height = int(stream.get("width", 0)), int(stream.get("height", 0))
        if not 0 < width * height <= 16_777_216:
            return False
        index = int(stream["index"])
        execute(
            directory,
            [
                "/usr/bin/ffmpeg",
                "-nostdin",
                "-v",
                "error",
                "-n",
                "-protocol_whitelist",
                "file,pipe",
                "-threads",
                "1",
                "-i",
                "/input",
                "-map",
                f"0:{index}",
                "-frames:v",
                "1",
                "-an",
                "-sn",
                "-dn",
                "-map_metadata",
                "-1",
                "-vf",
                "scale=512:512:force_original_aspect_ratio=decrease",
                "-filter_threads",
                "1",
                "-threads",
                "1",
                "-c:v",
                "libwebp",
                "/work/cover.webp",
            ],
            "cover.log",
            8,
            5 * 1024 * 1024,
            watch_request=True,
        )
        return bool(read_file(directory / "out" / "cover.webp", 5 * 1024 * 1024))
    except (ProcessingFailure, OSError, ValueError, KeyError, TypeError):
        (directory / "out" / "cover.webp").unlink(missing_ok=True)
        return False


def normalize(directory: Path, request: MediaRequest) -> MediaReady:
    source = read_file(directory / "source.bin", 50 * 1024 * 1024)
    if not source:
        raise ProcessingFailure("MEDIA_INVALID")
    if hashlib.sha256(source).hexdigest() != request.source_checksum:
        raise ProcessingFailure("MEDIA_INVALID")
    original = probe(directory, "/input", "probe.json")
    formats = set(original.get("format", {}).get("format_name", "").split(","))
    accepted = {
        "audio/mpeg": {"mp3"},
        "audio/wav": {"wav"},
        "audio/x-wav": {"wav"},
        "audio/mp4": {"mov", "mp4", "m4a"},
        "audio/x-m4a": {"mov", "mp4", "m4a"},
    }
    if not formats.intersection(accepted[request.content_type]):
        raise ProcessingFailure("UNSUPPORTED_MEDIA")
    streams = original.get("streams", [])
    audio = [stream for stream in streams if stream.get("codec_type") == "audio"]
    video = [
        stream
        for stream in streams
        if stream.get("codec_type") == "video"
        and not stream.get("disposition", {}).get("attached_pic")
    ]
    if not audio or video:
        raise ProcessingFailure("UNSUPPORTED_MEDIA")
    sample_rate = output_rate(audio[0])
    source_duration = duration_ms(original)
    clip_seconds = min(Decimal(source_duration) / 1000, Decimal("899.95"))
    execute(
        directory,
        [
            "/usr/bin/ffmpeg",
            "-nostdin",
            "-v",
            "error",
            "-n",
            "-protocol_whitelist",
            "file,pipe",
            "-threads",
            "1",
            "-i",
            "/input",
            "-map",
            "0:a:0",
            "-vn",
            "-sn",
            "-dn",
            "-map_metadata",
            "-1",
            "-filter_threads",
            "1",
            "-threads",
            "1",
            "-af",
            AUDIO_FILTER,
            "-ar",
            str(sample_rate),
            "-ac",
            "2",
            "-c:a",
            "libmp3lame",
            "-b:a",
            "256k",
            "-t",
            str(clip_seconds),
            "-f",
            "mp3",
            "/work/normalized.mp3",
        ],
        "encode.log",
        90,
        100 * 1024 * 1024,
        watch_request=True,
    )
    normalized = directory / "out" / "normalized.mp3"
    info = normalized.stat(follow_symlinks=False)
    if not stat.S_ISREG(info.st_mode) or not 0 < info.st_size <= 100 * 1024 * 1024:
        raise ProcessingFailure("OUTPUT_LIMIT")
    output = probe(directory, "/work/normalized.mp3", "output-probe.json")
    output_audio = [s for s in output.get("streams", []) if s.get("codec_type") == "audio"]
    if (
        not output_audio
        or output_audio[0].get("codec_name") != "mp3"
        or int(output_audio[0].get("sample_rate", 0)) != sample_rate
        or (output_audio[0].get("channels") != 2)
    ):
        raise ProcessingFailure("MEDIA_INVALID")
    tags = original.get("format", {}).get("tags", {})
    return MediaReady(
        duration_ms=duration_ms(output),
        sample_rate=sample_rate,
        title=text_metadata(tags.get("title", "")),
        artist=text_metadata(tags.get("artist", "")),
        has_cover=extract_cover(directory, streams),
    )


def clear_output(directory: Path) -> None:
    output = directory / "out"
    if output.is_symlink() or output.resolve(strict=True).parent != directory:
        raise ProcessingFailure("MEDIA_INVALID")
    for path in output.iterdir():
        if path.is_symlink() or not path.is_dir():
            path.unlink(missing_ok=True)
        else:
            shutil.rmtree(path)
    (output / "tmp").mkdir(mode=0o700, exist_ok=True)


def process_directory(directory: Path, root: Path) -> None:
    try:
        job_id = UUID(directory.name)
        if (
            directory.is_symlink()
            or directory.resolve(strict=True).parent != root
            or (directory / "result.json").exists()
        ):
            return
        request = MediaRequest.model_validate_json(read_file(directory / "request.json", 4096))
        if request.job_id != job_id:
            raise ValueError("Job ID mismatch")
        clear_output(directory)
        (directory / "result.json.tmp").unlink(missing_ok=True)
        result: MediaReady | MediaFailed = normalize(directory, request)
    except FileNotFoundError:
        return
    except ProcessingFailure as error:
        result = MediaFailed.model_validate({"errorCode": error.code})
    except ValueError:
        result = MediaFailed(error_code="MEDIA_INVALID")
    except OSError:
        result = MediaFailed(error_code="PROCESSING_UNAVAILABLE")
    except Exception:
        result = MediaFailed(error_code="MEDIA_INVALID")
    try:
        if isinstance(result, MediaFailed):
            clear_output(directory)
        (directory / "result.json.tmp").unlink(missing_ok=True)
        atomic_json(directory / "result.json", result.model_dump(mode="json", by_alias=True))
    except (OSError, ProcessingFailure):
        # A cancelled job may already have been removed by its owner.
        return


def run(root: Path) -> None:
    root = root.resolve(strict=True)
    while True:
        Path("/tmp/transcoder-live").write_text(str(time.time()))
        for directory in sorted(root.iterdir()):
            if directory.is_dir() and not directory.is_symlink():
                process_directory(directory, root)
        time.sleep(0.1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--jobs-dir", type=Path, default=Path("/jobs"))
    run(parser.parse_args().jobs_dir)
