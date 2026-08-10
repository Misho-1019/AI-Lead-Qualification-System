# FIX-02 — Migrate database to Neon

**Priority:** Critical (app was down — Supabase paused)
**Blocked by:** user provided Neon connection strings (`server/.env`, lines 23–24)
**Scope:** server

## Goal

Point the app at Neon Postgres and load the schema there.

## Files

- `server/.env`
- `server/src/utils/prisma.ts`
- `server/prisma.config.ts`
- `server/package.json`

## Changes

1. Activate Neon strings in `server/.env`:
   - `DATABASE_URL` = pooled string (`-pooler` host)
   - `DIRECT_URL` = direct string (no `-pooler`)

2. `npm i @prisma/adapter-neon` (bundles the Neon WebSocket driver).

3. `src/utils/prisma.ts`: replace `PrismaPg` with `PrismaNeon`:
   ```ts
   import { PrismaNeon } from '@prisma/adapter-neon';
   const adapter = new PrismaNeon({ connectionString });
   ```

4. `prisma.config.ts`: `url: env("DIRECT_URL")` (CLI migrations use the direct connection).

5. Apply schema: `npm run db:deploy` (uses committed FIX-01 migration).

6. Remove now-unused `pg` + `@prisma/adapter-pg` from `dependencies`.

7. USER ACTION (Render, deployed backend): update the `DATABASE_URL` env var to the Neon pooled string in the Render dashboard. `DIRECT_URL` is only needed locally for CLI.

## Verification

- `npx tsc --noEmit`
- `npx prisma migrate status` → all applied
- `npm run dev` boots; `curl http://localhost:3030/` → "API is running"
