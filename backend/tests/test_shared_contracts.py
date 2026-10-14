import json
from pathlib import Path
from typing import Any

import pytest

from app.config import Settings
from app.contracts.export import HTTP_MODELS, export
from app.contracts.ws import event_adapter, parse_command, strict_json
from app.main import create_app

FIXTURES: list[dict[str, Any]] = json.loads(
    (Path(__file__).parents[1] / "contracts" / "fixtures-v1.json").read_text()
)


@pytest.mark.parametrize("fixture", FIXTURES, ids=[f["name"] for f in FIXTURES])
def test_shared_fixture(fixture: dict[str, Any]) -> None:
    def validate() -> None:
        if fixture["kind"] == "command":
            parse_command(fixture["json"])
        elif fixture["kind"] == "event":
            event_adapter.validate_python(
                strict_json(fixture["json"]), by_alias=True, by_name=False
            )
        else:
            HTTP_MODELS[fixture["schema"]].model_validate(
                strict_json(fixture["json"]), by_alias=True, by_name=False
            )

    if fixture["valid"]:
        validate()
    else:
        with pytest.raises(ValueError):
            validate()


def test_openapi_describes_cookie_csrf_origin_and_safe_errors(settings: Settings) -> None:
    app = create_app(settings, start_runtime=False)
    schema = app.openapi()
    assert app.openapi() == schema
    create = schema["paths"]["/api/v1/rooms"]["post"]
    assert create["security"] == [{"SessionCookie": [], "CSRFToken": []}]
    assert sum(p["name"] == "Origin" for p in create["parameters"]) == 1
    assert create["responses"]["422"]["content"]["application/json"]["schema"]["$ref"].endswith(
        "/HTTPError"
    )
    assert create["responses"]["201"]["headers"]["X-Request-ID"]["schema"]["format"] == "uuid"
    assert schema["paths"]["/health/ready"]["get"]["responses"]["503"]["content"][
        "application/json"
    ]["schema"]["$ref"].endswith("/Health")


def test_schema_export_is_repeatable_and_matches_committed_contracts(
    tmp_path: Path, settings: Settings
) -> None:
    export(tmp_path, settings)
    committed = Path(__file__).parents[1] / "contracts"
    for schema in tmp_path.glob("*.json"):
        assert json.loads(schema.read_text()) == json.loads(
            (committed / schema.name).read_text()
        ), schema.name
