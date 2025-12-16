# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview
This repo is a minimal, QA-focused Next.js App Router app for an AG RBB “Buzón de Sugerencias” MVP:
- UI routes live under `app/` (login/register/buzon/logout)
- Backend is implemented as Next.js Route Handlers under `app/api/*`
- Persistence/auth is Supabase (Postgres + RLS)
- QA suite includes Newman (Postman) + Cypress, and CI runs the same pipeline.

## Common commands
All commands assume repo root.

### Install
```bash
npm install
```
CI uses:
```bash
npm ci
```

### Run the app (dev)
```bash
npm run dev
```
App runs at `http://localhost:3000`.

### Build + run production server locally
```bash
npm run build
npm run start
```

### Lint
```bash
npm run lint
```

### QA / tests
Full local pipeline matching CI (lint → build → start dev server → Newman → Cypress):
```bash
npm run test:ci
```

API tests only (Postman/Newman):
```bash
npm run test:api:f3b
```

Cypress (interactive / headless):
```bash
npm run cypress:open
npm run cypress:run
```

Run Cypress against a locally started dev server (starts server + runs e2e):
```bash
npm run test:e2e:local
```

Run a single Cypress spec:
```bash
npx cypress run --e2e --spec cypress/e2e/auth_buzon.cy.ts
```

Run a subset of the Postman collection (example: one folder):
```bash
npx newman run postman/mvp-ag-rbb-buzon.postman_collection.json -e postman/mvp-ag-rbb-local.postman_environment.json --folder "00 – Auth / Tokens"
```

### Formatting
Prettier is configured in `prettier.config.cjs` (no `package.json` script). Typical usage:
```bash
npx prettier -w .
```

## Environment / configuration
Template: `.env.example`.

Supabase variables are used in two ways:
- Server-side (Route Handlers / SSR helpers): `SUPABASE_URL`, `SUPABASE_ANON_KEY` (see `lib/supabaseServerClient.ts`)
- Browser/client-side: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `lib/supabaseClientPublic.ts`)

For local dev, you typically set all four in `.env.local`.

Postman/Newman tests also rely on:
- `API_BASE_URL` (defaults to `http://localhost:3000/api` in `.env.example`; also modeled in `postman/mvp-ag-rbb-local.postman_environment.json`)
- Test credentials (A/B users) as variables in the Postman environment.

## High-level architecture
### Next.js App Router structure
- `app/login/page.tsx`: login via `supabaseBrowserClient.auth.signInWithPassword()` then redirects to `/buzon`.
- `app/register/page.tsx`: signs up in Supabase Auth, then inserts a profile row in `public.socios`.
- `app/buzon/page.tsx`: client page that:
  - checks session via Supabase Auth
  - loads profile from `public.socios`
  - reads/writes suggestions through the internal API (`fetch('/api/sugerencias')`)
- `app/logout/page.tsx`: signs out and redirects to `/login`.

### API: `/api/sugerencias`
Implemented in `app/api/sugerencias/route.ts`:
- `GET`: lists current user’s suggestions (ordered by `created_at DESC`)
- `POST`: validates payload (`titulo`, `contenido`), inserts a suggestion with `socio_id = user.id`
- Auth is required; missing/invalid session returns `401 {"message":"No hay sesión activa."}`

### Supabase integration (SSR + API + browser)
- `lib/supabaseClientPublic.ts` provides `supabaseBrowserClient` for client components.
  - It intentionally avoids failing at build time if env vars are missing; it throws when used.
- `lib/supabaseServerClient.ts` is the main server helper:
  - `supabaseServerClient()` for server components/SSR via cookies
  - `supabaseFromRequest(req)` for Route Handlers; supports cookies and `Authorization: Bearer <token>` (used by Postman/Newman)

### Database schema + RLS
Supabase SQL lives in `supabase/migrations/`:
- `public.socios`: profile table keyed by `auth.users.id` with RLS allowing users to read/insert/update their own row.
- `public.sugerencias`: suggestions table with `socio_id` FK to `socios.id` and RLS restricting select/insert to `auth.uid() = socio_id`.

### QA layout
- Cypress specs live in `cypress/e2e/`.
- Cypress base URL is configured in `cypress.config.ts`.
- Test credentials for Cypress are currently in `cypress/support/credentials.ts`.
- Postman collection + environment live in `postman/` and are executed via the `test:api:f3b` script.
- CI workflow: `.github/workflows/ci-f3b.yml` runs `npm run test:ci` with Supabase secrets provided via env vars.