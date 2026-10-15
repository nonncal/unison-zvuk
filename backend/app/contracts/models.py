import unicodedata
from pathlib import PurePath
from typing import Annotated, Literal, Self
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    StrictBool,
    StrictInt,
    StrictStr,
    field_validator,
    model_validator,
)
from pydantic.alias_generators import to_camel

Milliseconds = Annotated[StrictInt, Field(ge=0, le=9_007_199_254_740_991)]
Revision = Annotated[StrictInt, Field(ge=0, le=9_007_199_254_740_991)]
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
    capacity: Annotated[StrictInt, Field(ge=2, le=10)] = 2
    moderated: StrictBool = False

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
    can_edit: StrictBool = False


class Room(WireModel):
    id: UUID
    title: StrictStr
    status: Literal["active", "closed", "expired"]
    capacity: Annotated[StrictInt, Field(ge=2, le=10)]
    expires_at: Milliseconds
    host_participant_id: UUID | None
    moderated: StrictBool = False


class Playlist(WireModel):
    track_ids: Annotated[list[UUID], Field(max_length=100)] = Field(default_factory=list)
    skipped_track_ids: Annotated[list[UUID], Field(max_length=100)] = Field(default_factory=list)
    repeat: Literal["off", "all", "one"] = "off"
    shuffle: StrictBool = False


class Snapshot(WireModel):
    room: Room
    participants: list[Participant]
    playback: Playback
    presence_seq: Revision
    playback_revision: Revision
    playlist: Playlist = Field(default_factory=Playlist)


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
    moderated: StrictBool = False
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
            if PurePath(value).suffix.lower() not in {".mp3", ".wav", ".m4a"}:
                raise ValueError("Only MP3, WAV and M4A files are supported")
        return value

    @model_validator(mode="after")
    def match_extension(self) -> Self:
        allowed = {
            ".mp3": {"audio/mpeg"},
            ".wav": {"audio/wav", "audio/x-wav"},
            ".m4a": {"audio/mp4", "audio/x-m4a"},
        }
        if self.content_type not in allowed[PurePath(self.file_name).suffix.lower()]:
            raise ValueError("File extension and content type disagree")
        return self


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
    source_uri: StrictStr | None = None
    license_id: StrictStr | None = None
    license_uri: StrictStr | None = None


class Bootstrap(WireModel):
    csrf_token: StrictStr
    protocol_version: Literal[1] = 1
    limits: dict[str, StrictInt]


class TrackList(WireModel):
    items: list[Track]
    next_cursor: UUID | None = None


class ReserveUploadResult(WireModel):
    upload_id: UUID
    upload_url: StrictStr
    required_headers: dict[str, StrictStr]
    expires_at: Milliseconds


class CompleteUploadResult(WireModel):
    track_id: UUID
    status: Literal["processing"] = "processing"


class PlaybackURL(WireModel):
    url: StrictStr
    expires_at: Milliseconds
    media_version: StrictStr
    checksum: StrictStr
    content_type: StrictStr


class ValidationDetail(WireModel):
    field: StrictStr
    code: StrictStr


class ConflictDetail(WireModel):
    snapshot: Snapshot


class ErrorBody(WireModel):
    code: StrictStr
    message: StrictStr
    request_id: UUID
    details: list[ValidationDetail] | ConflictDetail | None = None


class HTTPError(WireModel):
    error: ErrorBody


class Health(WireModel):
    status: Literal["alive", "ready", "unavailable"]
    checks: dict[str, StrictBool] | None = None


class RoomSettings(InputModel):
    capacity: Annotated[StrictInt, Field(ge=2, le=10)]
    moderated: StrictBool


class EditorPermission(InputModel):
    can_edit: StrictBool


class PlayerAction(InputModel):
    expected_playback_revision: Revision
    action: Literal["next", "previous", "add", "remove", "move", "options"]
    track_id: UUID | None = None
    to_index: Annotated[StrictInt, Field(ge=0, le=99)] | None = None
    repeat: Literal["off", "all", "one"] | None = None
    shuffle: StrictBool | None = None


class AdmissionStatus(WireModel):
    status: Literal["pending", "approved", "admitted", "rejected", "cancelled", "expired", "none"]


class EntryResult(AdmissionStatus):
    membership: JoinRoomResult | None = None


class WaitingGuest(WireModel):
    id: UUID
    display_name: StrictStr
    requested_at: Milliseconds


class WaitingList(WireModel):
    items: list[WaitingGuest]


class AdmissionDecision(InputModel):
    admit: StrictBool


class MyRoom(WireModel):
    id: UUID
    title: StrictStr
    capacity: Annotated[StrictInt, Field(ge=2, le=10)]
    role: Literal["host", "listener"]


class MyRooms(WireModel):
    items: list[MyRoom]


class MemberAction(InputModel):
    action: Literal["transfer", "remove"]
