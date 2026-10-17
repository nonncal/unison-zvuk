#!/usr/bin/env bash
# Roll the checked-out version out on a server: ./infra/deploy.sh [git-ref]
# Reads the runtime directory from UNISON_RUNTIME (default /srv/unison-runtime) and the
# compose project from UNISON_PROJECT (default unison). Never runs `down -v`.
set -euo pipefail
cd "$(dirname "$0")/.."
RUNTIME="${UNISON_RUNTIME:-/srv/unison-runtime}"
PROJECT="${UNISON_PROJECT:-unison}"
COMPOSE=(docker compose --env-file "$RUNTIME/compose.env" -p "$PROJECT"
  -f compose.yaml -f compose.app.yaml -f compose.production.yaml)

if [ -n "${1:-}" ]; then
  git fetch --all --tags --quiet
  git checkout --quiet "$1"
fi
git pull --ff-only --quiet 2>/dev/null || true
echo "Deploying $(git rev-parse --short HEAD): $(git log -1 --format=%s)"

"${COMPOSE[@]}" config --quiet
"${COMPOSE[@]}" up --build -d --wait
curl --fail --silent --show-error "$(grep -E '^APP_ORIGIN=' "$RUNTIME/compose.env" | cut -d= -f2-)/health/ready" && echo
