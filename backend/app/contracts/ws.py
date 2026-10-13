from typing import Annotated, Literal, cast
from uuid import UUID

from pydantic import Field, StrictBool, StrictInt, StrictStr, TypeAdapter, field_validator

from app.contracts.models import (
    EmptyPayload,
    Milliseconds,
    Playback,
    Position,
    Readiness,
    Revision,
    Snapshot,
    WireModel,
)


class Envelope(WireModel):
    v: Literal[1] = 1

    @field_validator("v", mode="before")
    @classmethod
    def exact_version(cls, value: object) -> object:
        if type(value) is not int:
            raise ValueError("Protocol version must be an integer")
        return value


class Command(Envelope):
    v: Literal[1]
    request_id: UUID


class Observation(Command):
    expected_playback_revision: None = None


class Mutation(Command):
    expected_playback_revision: Revision


class ProbePayload(WireModel):
    client_sent_at_ms: Milliseconds
    probe_id: UUID


class PingPayload(WireModel):
    ping_id: UUID


class SelectPayload(WireModel):
    track_id: UUID


class PlayPayload(WireModel):
    allow_not_ready: StrictBool = False


class SeekPayload(WireModel):
    position_ms: Position


class TelemetryPayload(WireModel):
    track_id: UUID
    media_version: Annotated[StrictStr, Field(min_length=1, max_length=128)]
    drift_ms: Annotated[StrictInt, Field(ge=-900_000, le=900_000)]
    rtt_ms: Annotated[StrictInt, Field(ge=0, le=60_000)]
    local_state: Literal["playing", "paused", "buffering", "autoplayBlocked", "error"]


class ClockProbe(Observation):
    type: Literal["clock.probe"]
    payload: ProbePayload


class HeartbeatPong(Observation):
    type: Literal["heartbeat.pong"]
    payload: PingPayload


class SnapshotRequest(Observation):
    type: Literal["room.snapshot.request"]
    payload: EmptyPayload


class ParticipantReadiness(Observation):
    type: Literal["participant.readiness"]
    payload: Readiness


class SelectTrack(Mutation):
    type: Literal["playback.select"]
    payload: SelectPayload


class Play(Mutation):
    type: Literal["playback.play"]
    payload: PlayPayload


class Pause(Mutation):
    type: Literal["playback.pause"]
    payload: EmptyPayload


class Seek(Mutation):
    type: Literal["playback.seek"]
    payload: SeekPayload


class Telemetry(Observation):
    type: Literal["sync.telemetry"]
    payload: TelemetryPayload


ClientCommand = Annotated[
    ClockProbe
    | HeartbeatPong
    | SnapshotRequest
    | ParticipantReadiness
    | SelectTrack
    | Play
    | Pause
    | Seek
    | Telemetry,
    Field(discriminator="type"),
]
command_adapter = TypeAdapter(cast(type[ClientCommand], ClientCommand))


class Event(Envelope):
    event_id: UUID
    server_time_ms: Milliseconds
    playback_revision: Revision


class HelloPayload(WireModel):
    connection_id: UUID
    epoch: UUID
    protocol_version: Literal[1] = 1
    snapshot: Snapshot


class Hello(Event):
    type: Literal["hello"]
    payload: HelloPayload


class RoomSnapshot(Event):
    type: Literal["room.snapshot"]
    payload: Snapshot


class PlaybackState(Event):
    type: Literal["playback.state"]
    payload: Playback


def parse_command(raw: str | bytes, max_bytes: int = 16_384) -> ClientCommand:
    if len(raw.encode() if isinstance(raw, str) else raw) > max_bytes:
        raise ValueError("Message exceeds the protocol limit")
    return command_adapter.validate_json(raw, by_alias=True, by_name=False)
