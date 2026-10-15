import argparse
import json
from pathlib import Path
from typing import Any

from app.config import Settings
from app.contracts import models as wire
from app.contracts.ws import command_adapter, event_adapter
from app.main import create_app

MODEL_TYPES: tuple[type[wire.WireModel], ...] = (
    wire.Bootstrap,
    wire.CreateRoom,
    wire.CreateRoomResult,
    wire.PreviewInvite,
    wire.PreviewResult,
    wire.JoinRoom,
    wire.JoinRoomResult,
    wire.CloseRoom,
    wire.Snapshot,
    wire.InviteResult,
    wire.ReserveUpload,
    wire.ReserveUploadResult,
    wire.CompleteUpload,
    wire.CompleteUploadResult,
    wire.Track,
    wire.TrackList,
    wire.PlaybackURL,
    wire.HTTPError,
    wire.RoomSettings,
    wire.EditorPermission,
    wire.PlayerAction,
    wire.AdmissionStatus,
    wire.EntryResult,
    wire.WaitingList,
    wire.AdmissionDecision,
    wire.MyRooms,
    wire.MemberAction,
)
HTTP_MODELS = {model.__name__: model for model in MODEL_TYPES}


def export(path: Path, settings: Settings | None = None) -> None:
    path.mkdir(parents=True, exist_ok=True)
    (path / "client-command-v1.schema.json").write_text(
        json.dumps(
            {
                "$schema": "https://json-schema.org/draft/2020-12/schema",
                **command_adapter.json_schema(by_alias=True),
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n"
    )
    (path / "openapi-v1.json").write_text(
        json.dumps(create_app(settings).openapi(), ensure_ascii=False, indent=2) + "\n"
    )
    (path / "server-event-v1.schema.json").write_text(
        json.dumps(
            {
                "$schema": "https://json-schema.org/draft/2020-12/schema",
                **event_adapter.json_schema(by_alias=True),
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n"
    )
    definitions: dict[str, Any] = {}
    for name, model in HTTP_MODELS.items():
        schema = model.model_json_schema(by_alias=True, ref_template="#/$defs/{model}")
        definitions.update(schema.pop("$defs", {}))
        definitions[name] = schema
    (path / "http-v1.schema.json").write_text(
        json.dumps(
            {
                "$schema": "https://json-schema.org/draft/2020-12/schema",
                "$defs": definitions,
                "anyOf": [{"$ref": f"#/$defs/{name}"} for name in HTTP_MODELS],
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n"
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    export(parser.parse_args().output)
