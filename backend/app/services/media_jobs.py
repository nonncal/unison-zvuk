import asyncio
import hashlib
import json
import os
import shutil
import stat
import time
from pathlib import Path
from typing import Annotated, Literal, cast
from uuid import UUID

from pydantic import Field, StrictBool, StrictInt, StrictStr, TypeAdapter

from app.contracts.models import WireModel


class MediaRequest(WireModel):
    job_id: UUID
    source_checksum: Annotated[StrictStr, Field(pattern=r"^[a-f0-9]{64}$")]
    content_type: Literal["audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/x-m4a"]


class MediaReady(WireModel):
    status: Literal["ready"] = "ready"
    duration_ms: Annotated[StrictInt, Field(gt=0, le=900_000)]
    title: Annotated[StrictStr, Field(max_length=200)] = ""
    artist: Annotated[StrictStr, Field(max_length=200)] = ""
    has_cover: StrictBool = False
    sample_rate: Literal[44100] = 44100
    channels: Literal[2] = 2


class MediaFailed(WireModel):
    status: Literal["failed"] = "failed"
    error_code: Literal[
        "MEDIA_INVALID",
        "UNSUPPORTED_MEDIA",
        "DRM_UNSUPPORTED",
        "DURATION_LIMIT",
        "PROCESSING_TIMEOUT",
        "OUTPUT_LIMIT",
        "PROCESSING_UNAVAILABLE",
    ]


MediaResult = Annotated[MediaReady | MediaFailed, Field(discriminator="status")]
result_adapter = TypeAdapter(cast(type[MediaReady | MediaFailed], MediaResult))


def read_file(path: Path, limit: int) -> bytes:
    fd = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    try:
        info = os.fstat(fd)
        if not stat.S_ISREG(info.st_mode) or info.st_size > limit:
            raise ValueError("Invalid media job file")
        with os.fdopen(fd, "rb", closefd=False) as file:
            result = file.read(limit + 1)
        if len(result) > limit:
            raise ValueError("Media job file exceeds limit")
        return result
    finally:
        os.close(fd)


def atomic_json(path: Path, value: dict[str, object]) -> None:
    temporary = path.with_name(path.name + ".tmp")
    fd = os.open(temporary, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600)
    try:
        with os.fdopen(fd, "w", closefd=False) as file:
            json.dump(value, file, ensure_ascii=False, allow_nan=False)
            file.flush()
            os.fsync(fd)
        os.replace(temporary, path)
    finally:
        os.close(fd)
        temporary.unlink(missing_ok=True)


def read_prefix(path: Path, limit: int = 65_536) -> bytes:
    fd = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    try:
        if not stat.S_ISREG(os.fstat(fd).st_mode):
            raise ValueError("Invalid diagnostic file")
        with os.fdopen(fd, "rb", closefd=False) as file:
            return file.read(limit)
    finally:
        os.close(fd)


def job_directory(root: Path, job_id: UUID) -> Path:
    root = root.resolve(strict=True)
    directory = root / str(job_id)
    directory.mkdir(mode=0o700, exist_ok=True)
    if directory.is_symlink() or directory.resolve(strict=True).parent != root:
        raise ValueError("Invalid media job directory")
    return directory


def submit(root: Path, job_id: UUID, source: bytes, content_type: str) -> Path:
    if not 0 < len(source) <= 50 * 1024 * 1024:
        raise ValueError("Source size exceeds limit")
    request = MediaRequest.model_validate(
        {
            "jobId": job_id,
            "contentType": content_type,
            "sourceChecksum": hashlib.sha256(source).hexdigest(),
        }
    )
    directory = job_directory(root, job_id)
    if (directory / "request.json").exists():
        existing = MediaRequest.model_validate_json(read_file(directory / "request.json", 4096))
        if existing != request:
            raise ValueError("Media job ID reused with different input")
    else:
        for partial in [directory / "source.bin", directory / "request.json.tmp"]:
            if partial.exists() or partial.is_symlink():
                read_file(partial, 50 * 1024 * 1024)
                partial.unlink()
        fd = os.open(
            directory / "source.bin", os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600
        )
        with os.fdopen(fd, "wb") as file:
            file.write(source)
        (directory / "out").mkdir(mode=0o700, exist_ok=True)
        (directory / "out" / "tmp").mkdir(mode=0o700, exist_ok=True)
        atomic_json(directory / "request.json", request.model_dump(mode="json", by_alias=True))
    return directory


def wait_for_result(directory: Path, seconds: float = 110) -> MediaReady | MediaFailed:
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        try:
            return result_adapter.validate_json(read_file(directory / "result.json", 16_384))
        except FileNotFoundError:
            time.sleep(0.1)
    return MediaFailed(error_code="PROCESSING_TIMEOUT")


async def wait_for_result_async(directory: Path, seconds: float = 110) -> MediaReady | MediaFailed:
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        try:
            return result_adapter.validate_json(read_file(directory / "result.json", 16_384))
        except FileNotFoundError:
            await asyncio.sleep(0.1)
    return MediaFailed(error_code="PROCESSING_TIMEOUT")


def cancel_request(directory: Path) -> bool:
    if not directory.is_dir() or directory.is_symlink():
        return False
    (directory / "request.json").unlink(missing_ok=True)
    return True


async def abort_job(directory: Path) -> None:
    if not await asyncio.to_thread(cancel_request, directory):
        return
    await wait_for_result_async(directory, 2)
    await asyncio.to_thread(shutil.rmtree, directory, ignore_errors=True)
