import unicodedata
from typing import Annotated, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, StrictBool, StrictInt, StrictStr, field_validator
from pydantic.alias_generators import to_camel

Milliseconds = Annotated[StrictInt, Field(ge=0, le=9_007_199_254_740_991)]
Revision = Annotated[StrictInt, Field(ge=0, le=9_223_372_036_854_775_807)]
Position = Annotated[StrictInt, Field(ge=0, le=900_000)]


class WireModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel, populate_by_name=True, extra="forbid", allow_inf_nan=False
    )


class InputModel(WireModel):
    model_config = ConfigDict(validate_by_alias=True, validate_by_name=False)


def plain_text(value: str) -> str:
    if any(unicodedata.category(char) in {"Cc", "Cf", "Cs"} for char in value):
        raise ValueError("Control characters are not allowed")
    return value.strip()


class CreateRoom(InputModel):
    display_name: Annotated[StrictStr, Field(min_length=1, max_length=32)]
    title: Annotated[StrictStr, Field(min_length=1, max_length=64)] = "Музыкальная комната"

    @field_validator("display_name", "title", mode="before")
    @classmethod
    def normalize_text(cls, value: object) -> object:
        return plain_text(value) if isinstance(value, str) else value


class PreviewInvite(InputModel):
    invite_token: Annotated[
        StrictStr, Field(min_length=43, max_length=43, pattern=r"^[A-Za-z0-9_-]+$")
    ]


class JoinRoom(PreviewInvite):
    display_name: Annotated[StrictStr, Field(min_length=1, max_length=32)]

    @field_validator("display_name", mode="before")
    @classmethod
    def normalize_text(cls, value: object) -> object:
        return plain_text(value) if isinstance(value, str) else value


class CloseRoom(InputModel):
    expected_playback_revision: Revision


class EmptyPayload(WireModel):
    pass


class PendingTransition(WireModel):
    type: Literal["play", "pause", "seek"]
    next_status: Literal["paused", "playing", "ended"]
    position_ms: Position
    effective_at_server_time_ms: Milliseconds
    track_id: UUID | None = None
    media_version: StrictStr | None = None


class Playback(WireModel):
    room_id: UUID
    epoch: UUID
    track_id: UUID | None
    media_version: StrictStr | None
    status: Literal["empty", "paused", "playing", "ended"]
    position_ms: Position
    anchor_server_time_ms: Milliseconds
    duration_ms: Position
    pending_transition: PendingTransition | None


class Readiness(WireModel):
    track_id: UUID
    media_version: Annotated[StrictStr, Field(min_length=1, max_length=128)]
    state: Literal["loading", "ready", "buffering", "autoplayBlocked", "error"]
    buffered_ahead_ms: Position
    autoplay_allowed: StrictBool


class Participant(WireModel):
    id: UUID
    display_name: StrictStr
    role: Literal["host", "listener"]
    connection_state: Literal["online", "offline", "connecting"]
    readiness: Readiness | None


class Room(WireModel):
    id: UUID
    title: StrictStr
    status: Literal["active", "closed", "expired"]
    capacity: Annotated[StrictInt, Field(ge=2, le=10)]
    expires_at: Milliseconds
    host_participant_id: UUID | None


class Snapshot(WireModel):
    room: Room
    participants: list[Participant]
    playback: Playback
    presence_seq: Revision
    playback_revision: Revision


class CreateRoomResult(WireModel):
    room_id: UUID
    participant_id: UUID
    invite_url: StrictStr
    expires_at: Milliseconds
    snapshot: Snapshot


class JoinRoomResult(WireModel):
    participant_id: UUID
    role: Literal["host", "listener"]
    snapshot: Snapshot


class PreviewResult(WireModel):
    room_id: UUID
    title: StrictStr
    status: Literal["active", "closed", "expired"]
    participant_count: Annotated[StrictInt, Field(ge=0, le=10)]
    capacity: Annotated[StrictInt, Field(ge=2, le=10)]
    expires_at: Milliseconds


class InviteResult(WireModel):
    invite_url: StrictStr
    expires_at: Milliseconds


class ReserveUpload(InputModel):
    file_name: Annotated[StrictStr, Field(min_length=1, max_length=200)]
    content_type: Literal["audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/x-m4a"]
    size_bytes: Annotated[StrictInt, Field(gt=0, le=50 * 1024 * 1024)]

    @field_validator("file_name", mode="before")
    @classmethod
    def safe_file_name(cls, value: object) -> object:
        if isinstance(value, str):
            value = plain_text(value)
            if "/" in value or "\\" in value:
                raise ValueError("Only a file name is allowed")
        return value


class CompleteUpload(InputModel):
    checksum: Annotated[StrictStr, Field(pattern=r"^[a-f0-9]{64}$")] | None = None


class Track(WireModel):
    id: UUID
    title: StrictStr
    artist: StrictStr
    duration_ms: Position | None
    status: Literal["uploading", "processing", "ready", "failed"]
    error_code: StrictStr | None = None
    media_version: StrictStr | None = None
    cover_url: StrictStr | None = None


class Bootstrap(WireModel):
    csrf_token: StrictStr
    protocol_version: Literal[1] = 1
    limits: dict[str, StrictInt]
