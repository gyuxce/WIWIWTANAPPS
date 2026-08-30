#!/usr/bin/env bash
#
# Install backend PHP files onto the production server from a pushed git ref.
#
# Written after a night where deploying by hand went wrong twice in two hours,
# both times silently:
#
#   * Files under the app directory do not share an owner -- some belong to
#     www-data, some to deploy -- so a plain `cp` succeeds for one file and is
#     refused for the next. Nothing in the output makes that obvious when
#     several files are copied in one go.
#   * `class_exists` came back OK on a file that had not actually been
#     replaced, because the *old* version still compiles perfectly well. A
#     smoke test that cannot tell the versions apart is worse than none.
#
# So: every file is syntax-checked before *any* file is touched, each is
# written as whoever already owns it, and success is judged by comparing
# checksums rather than by asking whether something loads.
#
# Usage:
#   ./deploy-backend.sh <git-ref> <path> [path...]
#
#   ./deploy-backend.sh main app/Http/Controllers/Api/V1/Base/UserController.php
#
# Paths are relative to the backend root.

set -euo pipefail

RAW_BASE="https://raw.githubusercontent.com/gyuxce/WIWIWTANAPPS"
BACKEND_DIR="${BACKEND_DIR:-/srv/wiwitan-prod/backend}"
BACKUP_ROOT="${BACKUP_ROOT:-/srv/wiwitan-prod/backups}"

red()   { printf '\033[31m%s\033[0m\n' "$*"; }
green() { printf '\033[32m%s\033[0m\n' "$*"; }
bold()  { printf '\033[1m%s\033[0m\n' "$*"; }

if [ "$#" -lt 2 ]; then
  red "Usage: $0 <git-ref> <path> [path...]"
  echo "  contoh: $0 main app/Http/Controllers/Api/V1/Base/UserController.php"
  exit 1
fi

REF="$1"
shift
FILES=("$@")

cd "$BACKEND_DIR"

STAGING="$(mktemp -d)"
trap 'rm -rf "$STAGING"' EXIT

bold "1/4  Mengunduh dari ref '$REF'"
for path in "${FILES[@]}"; do
  if [ ! -f "$path" ]; then
    red "  GAGAL  $path tidak ada di server."
    echo "         Skrip ini hanya mengganti berkas yang sudah ada, supaya"
    echo "         salah ketik tidak membuat berkas liar. Batal."
    exit 1
  fi

  dest="$STAGING/$path"
  mkdir -p "$(dirname "$dest")"

  if ! curl -fsSL "$RAW_BASE/$REF/backend/$path" -o "$dest"; then
    red "  GAGAL  tidak bisa mengunduh $path"
    echo "         Cek nama ref-nya, dan pastikan commit-nya sudah di-push."
    exit 1
  fi
  echo "  ok     $path"
done

bold "2/4  Memeriksa sintaks — semua berkas, sebelum satu pun dipasang"
for path in "${FILES[@]}"; do
  if ! php -l "$STAGING/$path" > /dev/null 2>&1; then
    red "  GAGAL  $path"
    php -l "$STAGING/$path" || true
    echo
    red "         Tidak ada yang dipasang. Server tidak tersentuh."
    exit 1
  fi
  echo "  ok     $path"
done

STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$BACKUP_ROOT/deploy-$STAMP"
mkdir -p "$BACKUP_DIR"

bold "3/4  Mencadangkan lalu memasang"
for path in "${FILES[@]}"; do
  mkdir -p "$BACKUP_DIR/$(dirname "$path")"
  cp -p "$path" "$BACKUP_DIR/$path"

  # Write as whoever owns the file. This is the failure that bit us twice by
  # hand: ownership is mixed across the tree, so one fixed user is wrong
  # somewhere.
  owner="$(stat -c '%U' "$path")"

  if [ "$owner" = "$(id -un)" ]; then
    cp "$STAGING/$path" "$path"
  else
    # Redirect rather than `sudo -u "$owner" cp`. mktemp -d creates the staging
    # directory 0700 owned by whoever runs this, so the other user cannot read
    # from it and the copy fails -- the same class of ownership trap this script
    # exists to prevent, which it duly walked into on its first real use.
    #
    # The redirection is opened by this shell, which can read staging; only the
    # write runs as the owner. Nothing has to be loosened, and tee writes
    # through the existing file so its ownership and mode survive.
    sudo -u "$owner" tee "$path" < "$STAGING/$path" > /dev/null
  fi

  echo "  ok     $path  (pemilik: $owner)"
done

bold "4/4  Memverifikasi isi yang terpasang"
failed=0
for path in "${FILES[@]}"; do
  want="$(sha256sum < "$STAGING/$path" | awk '{print $1}')"
  got="$(sha256sum < "$path" | awk '{print $1}')"

  if [ "$want" = "$got" ]; then
    echo "  ok     $path"
  else
    red "  GAGAL  $path — isinya tidak sama dengan yang diunduh"
    failed=1
  fi
done

# A restore script beside the backup, so rolling back is one command that
# needs no memory of what was deployed or which user owned what.
cat > "$BACKUP_DIR/restore.sh" <<'RESTORE'
#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${BACKEND_DIR:-/srv/wiwitan-prod/backend}"
cd "$HERE"
find . -name '*.php' | sed 's|^\./||' | while read -r path; do
  target="$BACKEND_DIR/$path"
  owner="$(stat -c '%U' "$target")"
  if [ "$owner" = "$(id -un)" ]; then
    cp "$HERE/$path" "$target"
  else
    # Redirected for the same reason as the deploy path: only the write needs
    # to run as the owner, so nothing has to be made readable to them.
    sudo -u "$owner" tee "$target" < "$HERE/$path" > /dev/null
  fi
  echo "dikembalikan: $path"
done
RESTORE
chmod +x "$BACKUP_DIR/restore.sh"

echo
if [ "$failed" -eq 0 ]; then
  green "Selesai. ${#FILES[@]} berkas terpasang dari '$REF'."
else
  red "Sebagian berkas TIDAK terpasang dengan benar. Lihat di atas."
fi

echo "Cadangan : $BACKUP_DIR"
echo "Rollback : $BACKUP_DIR/restore.sh"

exit "$failed"
