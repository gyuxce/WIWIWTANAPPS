# Local Release Candidate Hardening - 2026-08-01

## Decision

Local release-candidate hardening: **PASS for the available QA scope**.

Google Play production release: **BLOCKED** by production environment,
official Sardine/Firebase/payment access, signing credentials, Play Console,
and formal release evidence.

## Hardening Applied

- Mobile Babel now requires an explicit `ENVFILE` for production JavaScript bundling.
- Production env selection validates `STATUS=PRODUCTION`, HTTPS `API_URL`/`URL_CMS`, a non-empty `URL_SCHEME`, and empty auto-login fields.
- Cross-platform Gradle helper passes the selected env file into the Android build process.
- `mobile/.env.production.example` documents the non-secret production env shape; the real `.env.production` remains ignored.
- Production package scripts validate env before starting Gradle.
- Redux logger and FCM/index diagnostics are now development-only; production builds do not log FCM tokens or notification payloads.

## Validation Evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Mobile TypeScript | PASS | `corepack yarn tsc --noEmit --pretty false` |
| Mobile Jest | PASS | 2 suites, 4 tests |
| Env validator, local QA | PASS | `.env` accepted as development env |
| Env validator, production template | PASS | `.env.production.example` accepted as production-shaped template |
| Development QA APK | PASS | `app:assembleDevelopmentQa -PincludeX86ForLocal=true` completed with Gradle exit status 0 |
| APK metadata | PASS | `com.wiwitanbaru.wiwitan.dev`, `developmentQa`, version `25` / `1.2.3-dev` |
| APK checksum | PASS | `CC2E0C42AB650E8C7C4985D247DD4564E33D7A9F38C01402D0F424370799EA97` |
| Emulator install | PASS | `adb install -r` returned `Success` on `emulator-5554` |
| Launch smoke | PASS | MainActivity resumed; app process alive; no `FATAL EXCEPTION` in the post-launch log window |
| Production build guard | PASS-BLOCKED | `yarn build:aab:prod` stopped before Gradle because real `.env.production` is not available |
| Production env validator with template | PASS | Temporary `.env.production` copied from the example passed `STATUS=PRODUCTION`, HTTPS URL, URL scheme, and empty auto-login checks; fixture removed afterward |
| Production debug compile without client DB | PASS | Isolated `app:assembleProductionDebug --no-daemon --max-workers=1 --console=plain --info --stacktrace` completed in 15m 8s with no client database or production credentials; APK `app-production-debug.apk` produced (157,482,504 bytes), SHA-256 `9A8E905DE041254F67823131D4E7DFEF76554CA2144FD9946EBDDB2E55CA09A9`. Cold-build time was dominated by Gradle dependency transforms, Metro cache reset, and native packaging |
| Production log hygiene | PASS | TypeScript, Jest (`2` suites / `4` tests), and targeted ESLint for `index.js` passed after logger/FCM guards |

The APK above is a local QA artifact signed with the debug key. It is not a
Google Play upload artifact.

## Remaining Gates

| Gate | Status | Required action |
| --- | --- | --- |
| Official production env | BLOCKED | Provide API/CMS/Firebase/storage/payment values through a secure channel |
| Sardine production | BLOCKED | Provide endpoint, auth contract, QA folder, and cleanup process; run the probe |
| Release signing | BLOCKED | Provide approved keystore and `MYAPP_UPLOAD_*` values outside Git |
| Production AAB | BLOCKED | Build after env and signing validation pass |
| Formal UAT handoff | OPEN | Attach reviewer, acceptance criteria, evidence, and known-issue approval |
| Play Console | BLOCKED | Obtain owner access and complete store/compliance forms |

## Next Execution

1. When production access arrives, create the local untracked `.env.production`
   from `mobile/.env.production.example` and run its validator.
2. Run the Sardine probe and repeat CMS/student storage readback against the
   approved endpoint.
3. Configure signing, build the production AAB, install it into an internal
   test track, and repeat release smoke tests.

## Gradle Timeout Isolation - 2026-08-02

The earlier timeout was not a Gradle failure. A detached, fully logged build
was allowed to finish and produced the production-flavor debug APK. The build
progressed through dependency/AAR transforms, Metro bundling, React Native
library compilation, NDK native packaging, and APK packaging before reporting
`BUILD SUCCESSFUL` with `650 actionable tasks: 141 executed, 509 up-to-date`.

The generated APK is for local verification only. It uses the debug signing
path and does not prove that production release signing or Google Play upload
is ready. The temporary `.env.production` fixture was removed after the test.
