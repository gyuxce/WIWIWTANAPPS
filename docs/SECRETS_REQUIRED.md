# Required Local Secrets

These files were present in the handoff package and must be stored outside Git.

## Backend

- `backend/.env` - based on `backend/.env.example`.
- Firebase Admin service account JSON files referenced by `FIREBASE_CREDENTIALS`.
- Payment/API credentials, including Xendit and Pivot values.
- Database credentials and any staging/production database dumps.

## Backend Microservices

- `backend/microservices/Dolphin/bin/.env` - based on the Dolphin example/env from handoff.
- `backend/microservices/Sardine/bin/config.json` - service account/config JSON.
- `backend/microservices/Sailfish/bin/service.json` - service account/config JSON.

## CMS

- `cms/.env` - based on `cms/.env.example`.

## Mobile

- `mobile/.env` - based on `mobile/.env.example`.
- `mobile/android/app/wiwitan.keystore` - Android release signing key.
- `mobile/android/app/google-services.json` - Firebase Android config.
- `mobile/ios/GoogleService-Info.plist` - Firebase iOS config, if iOS is maintained.
- Android release signing values `MYAPP_UPLOAD_STORE_FILE`, `MYAPP_UPLOAD_STORE_PASSWORD`, `MYAPP_UPLOAD_KEY_ALIAS`, and `MYAPP_UPLOAD_KEY_PASSWORD` - store them in environment variables or local `~/.gradle/gradle.properties`, not in repo files.

## Security Follow-Up

Rotate any API tokens, service account keys, keystore passwords, and release tokens that were shared through zip files or chat.
