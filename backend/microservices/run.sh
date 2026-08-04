#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

bash "$ROOT/ops/staging/check-microservices.sh"

restart_service() {
    local name="$1"
    local directory="$2"

    pm2 delete "$name" >/dev/null 2>&1 || true
    pm2 start "$ROOT/microservices/$directory/bin/start.json"
}

restart_service 62dolphin Dolphin
restart_service 62sailfish Sailfish
restart_service 62sardine Sardine

# Goldfish is referenced by the legacy script but is not registered by the
# Laravel application. Start it only when its executable is handed over.
if [[ -x "$ROOT/microservices/Goldfish/bin/62goldfish" ]]; then
    restart_service 62goldfish Goldfish
fi

pm2 save
