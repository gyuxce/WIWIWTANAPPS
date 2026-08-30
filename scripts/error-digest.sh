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
#   ./error-digest.sh --telegram         send to the configured Telegram chat
#   ./error-digest.sh --to a@b.com       send as email instead
#
# Telegram is the default worth reaching for: it needs no SMTP, arrives
# instantly, and gets read -- where an alert mail lands in an inbox beside
# everything else. Put the credentials in ~/.wiwitan-telegram (chmod 600):
#
#   BOT_TOKEN=123456:ABC...
#   CHAT_ID=987654321
#
# Keeping them in a file rather than on the command line keeps the token out
# of crontab and out of `ps` for anyone else on the box.
#
# Meant for cron, once a day:
#   0 8 * * *  /home/deploy/bin/error-digest.sh --telegram
#
# Note the failure mode worth knowing about: it only writes when something is
# wrong, so silence means either "no errors" or "this script stopped running".
# Run it by hand with --dry-run every so often to be sure it still works.

set -euo pipefail

BACKEND_DIR="${BACKEND_DIR:-/srv/wiwitan-prod/backend}"
LOG_DIR="$BACKEND_DIR/storage/logs"
STATE_FILE="${STATE_FILE:-$HOME/.wiwitan-error-digest-state}"
DIGEST_TO="${DIGEST_TO:-}"
DIGEST_FROM="${DIGEST_FROM:-}"
MAX_LINES="${MAX_LINES:-40}"

TELEGRAM_CONF="${TELEGRAM_CONF:-$HOME/.wiwitan-telegram}"
BOT_TOKEN="${BOT_TOKEN:-}"
CHAT_ID="${CHAT_ID:-}"

DRY_RUN=0
USE_TELEGRAM=0
while [ "$#" -gt 0 ]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift ;;
    --telegram) USE_TELEGRAM=1; shift ;;
    --to) DIGEST_TO="${2:-}"; shift 2 ;;
    --from) DIGEST_FROM="${2:-}"; shift 2 ;;
    *) echo "Opsi tidak dikenal: $1"; exit 1 ;;
  esac
done

if [ "$USE_TELEGRAM" -eq 1 ] && [ -f "$TELEGRAM_CONF" ]; then
  # shellcheck disable=SC1090
  . "$TELEGRAM_CONF"
fi

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

if [ "$USE_TELEGRAM" -eq 1 ]; then
  if [ -z "$BOT_TOKEN" ] || [ -z "$CHAT_ID" ]; then
    echo "BOT_TOKEN / CHAT_ID belum diisi di $TELEGRAM_CONF" >&2
    exit 1
  fi

  # Telegram caps a message at 4096 characters and rejects anything longer
  # outright, so a bad morning would otherwise deliver nothing at all.
  #
  # `cut -c` was the wrong tool here and looked right: it trims each *line* to
  # the width given, leaving a message of any total length. head -c bounds the
  # whole thing. Because that can land mid-character in UTF-8, iconv drops any
  # broken sequence left at the tail -- Telegram rejects malformed text too.
  #
  # Only the busiest faults are worth a phone notification; the count in the
  # header still says how many kinds there were in total, and the full list is
  # a --dry-run away.
  # Deliberately no `head` anywhere in here. Under `set -o pipefail`, head
  # closing the pipe once it has read enough makes the command upstream of it
  # fail with SIGPIPE, which fails the whole substitution, which -- under
  # `set -e` -- exits the script. Silently, because the failure happens inside
  # an assignment. That is exactly what happened: the digest stopped just
  # before sending and printed nothing at all, which looks far more like
  # "nothing to report" than like a crash.
  #
  # sed reads its input to the end, and bash slices the result itself, so
  # nothing gets a closed pipe. Slicing in bash also counts characters rather
  # than bytes, which is the same unit Telegram's 4096 limit is measured in.
  MESSAGE="$(
    printf '%s\n\n' "$SUBJECT"
    printf 'Sejak %s.\n\n' "$SINCE"
    printf '%s\n' "$FOUND" | sed -n '1,15p'
    printf '\nSelengkapnya: error-digest.sh --dry-run\n'
  )"
  MESSAGE="${MESSAGE:0:3500}"

  HTTP="$(
    curl -sS -o /tmp/wiwitan-telegram-response -w '%{http_code}' \
      -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
      --data-urlencode "chat_id=${CHAT_ID}" \
      --data-urlencode "text=${MESSAGE}" \
      --data-urlencode "disable_web_page_preview=true"
  )"

  if [ "$HTTP" = "200" ]; then
    echo "terkirim ke Telegram (chat $CHAT_ID)"
    exit 0
  fi

  echo "GAGAL kirim ke Telegram (HTTP $HTTP):" >&2
  cat /tmp/wiwitan-telegram-response >&2
  echo >&2
  exit 1
fi

if [ -z "$DIGEST_TO" ]; then
  echo "Tidak ada tujuan. Pakai --telegram, atau --to alamat@email." >&2
  exit 1
fi

# Send through the application's own mailer rather than a system MTA, which may
# not be installed or configured -- this is the transport already proven to
# work by the pra-test result emails.
# The sender has to be set explicitly: mail.from.address is empty on this
# server -- the application's own mails set their sender themselves -- so
# leaving it to config throws "An email must have a From or a Sender header".
#
# Every value is handed over through files rather than the environment.
# Exported variables did not survive `sudo -u www-data`, so getenv() returned
# nothing inside tinker and the sender was silently never set, which is what
# that From error was actually reporting. Files have no such gap, and nothing
# to quote wrongly either.
cd "$BACKEND_DIR"

MAILDIR="$(mktemp -d /tmp/wiwitan-digest.XXXXXX)"
trap 'rm -rf "$MAILDIR"' EXIT

printf '%s' "$BODY" > "$MAILDIR/body"
printf '%s' "$SUBJECT" > "$MAILDIR/subject"
printf '%s' "$DIGEST_TO" > "$MAILDIR/to"
printf '%s' "${DIGEST_FROM:-$DIGEST_TO}" > "$MAILDIR/from"
chmod 755 "$MAILDIR"
chmod 644 "$MAILDIR"/body "$MAILDIR"/subject "$MAILDIR"/to "$MAILDIR"/from

sudo -u www-data env HOME=/tmp php artisan tinker --execute="
    \$d = '$MAILDIR';
    \$body = file_get_contents(\$d . '/body');
    \$subject = trim(file_get_contents(\$d . '/subject'));
    \$to = trim(file_get_contents(\$d . '/to'));
    \$from = trim(file_get_contents(\$d . '/from'));

    Illuminate\\Support\\Facades\\Mail::raw(\$body, function (\$m) use (\$from, \$to, \$subject) {
        \$m->from(\$from, 'Wiwitan Monitor')->to(\$to)->subject(\$subject);
    });

    echo 'terkirim ke ' . \$to . PHP_EOL;
"
