#!/usr/bin/env bash
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
missing=0

check_required() {
    local service="$1"
    local binary="$2"
    local path="$ROOT/microservices/$service/bin/$binary"

    if [[ ! -f "$path" ]]; then
        printf 'MISSING required: %s\n' "$path"
        missing=1
        return
    fi

    if [[ ! -x "$path" ]]; then
        printf 'NOT EXECUTABLE: %s\n' "$path"
        missing=1
        return
    fi

    printf 'READY required: %s\n' "$path"
    file "$path" 2>/dev/null || true
    sha256sum "$path"
}

check_optional() {
    local service="$1"
    local binary="$2"
    local path="$ROOT/microservices/$service/bin/$binary"

    if [[ ! -f "$path" ]]; then
        printf 'OPTIONAL pending: %s\n' "$path"
        return
    fi

    if [[ ! -x "$path" ]]; then
        printf 'OPTIONAL not executable: %s\n' "$path"
        return
    fi

    printf 'READY optional: %s\n' "$path"
    file "$path" 2>/dev/null || true
    sha256sum "$path"
}

printf '%s\n' 'Wiwitan microservice preflight'
printf 'Backend root: %s\n\n' "$ROOT"

check_required Dolphin 62dolphin
check_required Sailfish 62sailfish
check_required Sardine 62sardine
check_optional Goldfish 62goldfish

printf '\n%s\n' 'Expected local ports'
for port in 7001 7002 7003; do
    if ss -ltn 2>/dev/null | awk '{print $4}' | grep -Eq ":${port}$"; then
        printf 'LISTENING: %s\n' "$port"
    else
        printf 'NOT LISTENING: %s\n' "$port"
    fi
done

if [[ "$missing" -ne 0 ]]; then
    printf '\nRequired executable handover is incomplete.\n'
    exit 1
fi

printf '\nRequired executable preflight passed.\n'
