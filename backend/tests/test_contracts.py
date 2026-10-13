import json
from uuid import uuid4

import pytest
from pydantic import ValidationError

from app.contracts.models import CreateRoom
from app.contracts.ws import Seek, parse_command


def seek(position: object = 65_000) -> dict[str, object]:
    return {
        "v": 1,
        "type": "playback.seek",
        "requestId": str(uuid4()),
        "expectedPlaybackRevision": 12,
        "payload": {"positionMs": position},
    }


def test_wire_aliases_and_millisecond_units_round_trip() -> None:
    data = seek()
    command = parse_command(json.dumps(data))
    assert isinstance(command, Seek)
    assert command.payload.position_ms == 65_000
    assert command.model_dump(mode="json", by_alias=True) == data


@pytest.mark.parametrize("position", [-1, 900_001, True, "65000", 65.5, float("nan"), float("inf")])
def test_positions_reject_coercion_and_non_finite_numbers(position: object) -> None:
    with pytest.raises(ValidationError):
        parse_command(json.dumps(seek(position)))


@pytest.mark.parametrize("version", [True, 1.0, "1", 0, 2])
def test_version_is_exactly_integer_one(version: object) -> None:
    data = seek()
    data["v"] = version
    with pytest.raises(ValidationError):
        parse_command(json.dumps(data))


def test_sender_cannot_inject_authority_or_unknown_fields() -> None:
    data = seek()
    data["role"] = "host"
    with pytest.raises(ValidationError):
        parse_command(json.dumps(data))
    data = seek()
    data["payload"] = {"positionMs": 10, "actorId": str(uuid4())}
    with pytest.raises(ValidationError):
        parse_command(json.dumps(data))


def test_message_size_and_invalid_json_are_bounded() -> None:
    with pytest.raises(ValueError, match="limit"):
        parse_command(" " * 16_385)
    with pytest.raises(ValidationError):
        parse_command("{broken")


def test_version_is_required_and_only_wire_aliases_are_accepted() -> None:
    data = seek()
    del data["v"]
    with pytest.raises(ValidationError):
        parse_command(json.dumps(data))
    data = seek()
    data["expected_playback_revision"] = data.pop("expectedPlaybackRevision")
    with pytest.raises(ValidationError):
        parse_command(json.dumps(data))


@pytest.mark.parametrize("name", ["", " " * 3, "x" * 33, "Ан\nя", "К\u202eирилл"])
def test_display_names_are_plain_bounded_text(name: str) -> None:
    with pytest.raises(ValidationError):
        CreateRoom.model_validate({"displayName": name})


def test_names_are_trimmed_without_ascii_only_restriction() -> None:
    assert CreateRoom.model_validate({"displayName": "  Аня  "}).display_name == "Аня"
