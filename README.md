# Wiwitan Monorepo

This repository contains the Wiwitan system recovered from the handoff archives:

- `mobile/` - React Native mobile app.
- `backend/` - Laravel API and microservices.
- `cms/` - React admin/CMS web app.
- `docs/` - handoff notes and project documentation.

## First Setup

1. Copy the required secret files from a secure storage location into the right project folders.
2. Install and run the backend first, because both the mobile app and CMS depend on the API.
3. Run the CMS against the backend API.
4. Run the mobile app with the development Android flavor.

## Common Commands

Backend:

```sh
cd backend
composer install
php artisan serve
```

CMS:

```sh
cd cms
npm install
npm run start
```

Mobile:

```sh
cd mobile
yarn install
yarn start
yarn android:dev:debug
```

Production Android build:

```sh
cd mobile
yarn build:aab:prod
```

## Notes

The original handoff instructions are preserved in `docs/handoff-instruksi-original.txt`.
Do not commit secrets, keystores, service account JSON files, or real `.env` files.
