import argparse
import json
from pathlib import Path

from app.contracts.ws import command_adapter, event_adapter
from app.main import create_app


def export(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)
    (path / "client-command-v1.schema.json").write_text(
        json.dumps(command_adapter.json_schema(by_alias=True), ensure_ascii=False, indent=2) + "\n"
    )
    (path / "openapi-v1.json").write_text(
        json.dumps(create_app().openapi(), ensure_ascii=False, indent=2) + "\n"
    )
    (path / "server-event-v1.schema.json").write_text(
        json.dumps(event_adapter.json_schema(by_alias=True), ensure_ascii=False, indent=2) + "\n"
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    export(parser.parse_args().output)
