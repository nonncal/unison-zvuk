"""Check a running full stack, including monitoring and private routes."""

import argparse
import base64
import json
import time
import urllib.error
import urllib.request
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--origin", default="http://localhost:8080")
    parser.add_argument("--prometheus", default="http://localhost:9090")
    parser.add_argument("--grafana", default="http://localhost:3000")
    parser.add_argument("--grafana-user", default="admin")
    parser.add_argument("--bucket", default="unison-audio")
    parser.add_argument("--grafana-password-file", type=Path, required=True)
    args = parser.parse_args()

    def get(url: str, headers: dict | None = None) -> tuple[int, bytes]:
        request = urllib.request.Request(url, headers=headers or {})
        try:
            with urllib.request.urlopen(request, timeout=10) as response:
                return response.status, response.read()
        except urllib.error.HTTPError as error:
            return error.code, error.read()

    for path in ["/", "/room/00000000-0000-0000-0000-000000000000"]:
        status, body = get(args.origin + path)
        assert status == 200 and b'id="root"' in body, f"Frontend failed: {path}"
    status, body = get(args.origin + "/health/ready")
    assert status == 200 and json.loads(body)["status"] == "ready", "API is not ready"
    for path in ["/internal/metrics", "/grafana/", "/prometheus/", "/minio/health/live", "/.env"]:
        assert get(args.origin + path)[0] == 404, f"Private route is exposed: {path}"
    assert get(args.origin + f"/{args.bucket}/catalog/private.mp3")[0] == 403
    for attempt in range(7):
        _, body = get(args.prometheus + "/api/v1/targets")
        targets = json.loads(body)["data"]["activeTargets"]
        if len(targets) == 2 and all(t["health"] == "up" for t in targets):
            break
        if attempt == 6:
            raise AssertionError("Prometheus targets are not all up")
        time.sleep(5)
    _, body = get(args.prometheus + "/api/v1/query?query=unison_audio_worker_online")
    assert json.loads(body)["data"]["result"][0]["value"][1] == "1", "Worker metric missing"
    _, body = get(args.prometheus + "/api/v1/rules")
    assert len(json.loads(body)["data"]["groups"][0]["rules"]) >= 6, "Alert rules missing"
    password = args.grafana_password_file.read_text().strip()
    auth = base64.b64encode(f"{args.grafana_user}:{password}".encode()).decode()
    headers = {"Authorization": "Basic " + auth}
    for path in ["/api/datasources/uid/unison-prometheus", "/api/dashboards/uid/unison-overview"]:
        assert get(args.grafana + path, headers)[0] == 200, "Grafana provisioning failed"
    print("Frontend, SPA, API, private routes, Prometheus targets/rules and Grafana passed")


if __name__ == "__main__":
    main()
