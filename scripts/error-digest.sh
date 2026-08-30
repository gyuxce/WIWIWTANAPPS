#!/usr/bin/env bash
#
# Report backend errors that have appeared since the last run.
#
# Every bug found in this app so far was found by someone trying the app and
# noticing. QRIS was broken in production for days; PDFs failed for a week.
# Laravel had been writing all of it to storage/logs the whole time and nobody
# was reading it. Students do not report faults -- they just stop using the
# thing -- so "we will hear about it" is not a monitoring strategy.
#
# This reads the log Laravel already writes, groups what it finds, and mails a
# digest. It adds no dependency to the application: mail goes out through the
# same configuration that already sends the pra-test result emails.
#
# Usage:
#   ./error-digest.sh --dry-run          print the digest, send nothing
#   ./error-digest.sh --to a@b.com       send to a specific address
#   ./error-digest.sh                    send to DIGEST_TO
#
# Meant for cron, once a day:
#   0 8 * * *  /home/deploy/bin/error-digest.sh --to you@example.com
#
# Note the failure mode worth knowing about: it only writes when something is
# wrong, so silence means either "no errors" or "this script stopped running".
# Run it by hand with --dry-run every so often to be sure it still works.

set -euo pipefail

BACKEND_DIR="${BACKEND_DIR:-/srv/wiwitan-prod/backend}"
LOG_DIR="$BACKEND_DIR/storage/logs"
STATE_FILE="${STATE_FILE:-$HOME/.wiwitan-error-digest-state}"
DIGEST_TO="${DIGEST_TO:-}"
MAX_LINES="${MAX_LINES:-40}"

DRY_RUN=0
while [ "$#" -gt 0 ]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift ;;
    --to) DIGEST_TO="${2:-}"; shift 2 ;;
    *) echo "Opsi tidak dikenal: $1"; exit 1 ;;
  esac
done

if [ ! -d "$LOG_DIR" ]; then
  echo "Folder log tidak ditemukan: $LOG_DIR" >&2
  exit 1
fi

# Where to start reading. On a first run, look back a day rather than dumping
# the entire history of the log into someone's inbox.
if [ -s "$STATE_FILE" ]; then
  SINCE="$(cat "$STATE_FILE")"
else
  SINCE="$(date -d '1 day ago' '+%Y-%m-%d %H:%M:%S')"
fi
NOW="$(date '+%Y-%m-%d %H:%M:%S')"

# Laravel opens each entry with "[YYYY-MM-DD HH:MM:SS] env.LEVEL: message" and
# then indents the stack trace beneath it. Only the opening lines matter here:
# the traces are noise in a digest, and the message is what identifies a fault.
FOUND="$(
  cat "$LOG_DIR"/laravel*.log 2>/dev/null |
  awk -v since="$SINCE" '
    # Spelled out rather than using {n} intervals, which older awk builds do
    # not enable by default.
    /^\[[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9]\]/ {
      stamp = substr($0, 2, 19)
      if (stamp > since && $0 ~ /\.(ERROR|CRITICAL|ALERT|EMERGENCY):/) {
        # Drop the timestamp so the same fault occurring twenty times groups
        # into one line with a count, instead of twenty near-identical ones.
        sub(/^\[[^]]*\] /, "")
        print
      }
    }
  ' |
  cut -c1-300 |
  sort | uniq -c | sort -rn
)"

TOTAL="$(printf '%s' "$FOUND" | grep -c . || true)"

echo "$NOW" > "$STATE_FILE"

if [ -z "$FOUND" ]; then
  [ "$DRY_RUN" -eq 1 ] && echo "Tidak ada error sejak $SINCE."
  exit 0
fi

SUBJECT="[Wiwitan] $TOTAL jenis error sejak $SINCE"
BODY="$(
  printf 'Error backend sejak %s hingga %s.\n\n' "$SINCE" "$NOW"
  printf 'Angka di depan = berapa kali terjadi.\n\n'
  printf '%s\n' "$FOUND" | head -n "$MAX_LINES"
  printf '\nLog lengkap: %s\n' "$LOG_DIR"
)"

if [ "$DRY_RUN" -eq 1 ]; then
  echo "SUBJECT: $SUBJECT"
  echo
  echo "$BODY"
  exit 0
fi

if [ -z "$DIGEST_TO" ]; then
  echo "Tidak ada tujuan. Pakai --to alamat@email, atau set DIGEST_TO." >&2
  exit 1
fi

# Send through the application's own mailer rather than a system MTA, which may
# not be installed or configured -- this is the transport already proven to
# work by the pra-test result emails.
cd "$BACKEND_DIR"
SUBJECT="$SUBJECT" BODY="$BODY" TO="$DIGEST_TO" \
  sudo -u www-data --preserve-env=SUBJECT,BODY,TO env HOME=/tmp \
  php artisan tinker --execute='
    Illuminate\Support\Facades\Mail::raw(getenv("BODY"), function ($m) {
        $m->to(getenv("TO"))->subject(getenv("SUBJECT"));
    });
    echo "terkirim\n";
  '
