# Staging Deployment Runbook

This runbook records the safe order for the Wiwitan staging server. Secrets and
service-account JSON files must never be committed to Git or pasted into chat.

## Current State

- VPS bootstrap, SSH hardening, UFW, swap, PHP, Composer, Node, Yarn, Redis,
  and Nginx are complete.
- Backend and CMS repositories are cloned on the staging VPS.
- Backend Composer dependencies and CMS Yarn dependencies are installed.
- The Firebase staging service-account file is stored outside the repository at
  `/etc/wiwitan/secrets/firebase-staging.json` with mode `600`.
- The `.env` file has not been created because database, domain, mail, storage,
  payment, and microservice values are still environment-specific.
- The `62dolphin` and `62sardine` executables are still required before the
  complete backend can be started.

## Secret Rules

1. Copy service-account JSON files to `/etc/wiwitan/secrets/` on the VPS.
2. Set ownership to the runtime user and mode `600`.
3. Set `FIREBASE_CREDENTIALS` in the untracked backend `.env` file to the
   absolute secret path.
4. Never copy the JSON into the repository or its `microservices/*/bin`
   directories.
5. Rotate any Firebase key that was previously committed before production use.

Example VPS commands:

```bash
sudo install -d -o deploy -g deploy -m 750 /etc/wiwitan/secrets
sudo install -o deploy -g deploy -m 600 /tmp/firebase.json \
  /etc/wiwitan/secrets/firebase-staging.json
rm -f /tmp/firebase.json
```

## Backend Environment

Start from the example only after the staging values are known:

```bash
cd /srv/wiwitan/backend
cp .env.example .env
```

At minimum, replace the database, application URL, mail, payment, storage,
and microservice values. Keep this file untracked. Set:

```dotenv
FIREBASE_CREDENTIALS="/etc/wiwitan/secrets/firebase-staging.json"
```

Do not run migrations against a client or production database until the target,
backup, and rollback procedure are confirmed.

## Microservice Gate

Do not create systemd services or run the complete backend until these files
are received and verified as Linux x86-64 executables:

```text
microservices/Dolphin/bin/62dolphin
microservices/Sardine/bin/62sardine
```

Required handover details:

- staging or production target;
- executable architecture and version;
- checksum for each file;
- required configuration and start command;
- health-check endpoint and expected port.

After receipt, verify without exposing secrets:

```bash
file microservices/Dolphin/bin/62dolphin
file microservices/Sardine/bin/62sardine
sha256sum microservices/Dolphin/bin/62dolphin
sha256sum microservices/Sardine/bin/62sardine
```
