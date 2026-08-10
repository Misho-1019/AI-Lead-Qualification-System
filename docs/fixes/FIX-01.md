# FIX-01 — Prisma migrations & tooling

**Priority:** High (prerequisite for Neon migration + fixes fresh-clone build failure)
**Blocked by:** none
**Scope:** server

## Goal

- Commit a versioned initial migration so the schema no longer relies on `db push`.
- Fix the fresh-clone build failure (missing generated client) via `postinstall: prisma generate`.
- Add DB scripts and a Node version floor.

## Files

- `server/prisma/migrations/0_init/migration.sql` (new)
- `server/prisma/migrations/migration_lock.toml` (new)
- `server/package.json`

## Changes

1. Generate the initial migration offline (no DB needed):
   ```
   npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script
   ```
   Save output to `prisma/migrations/0_init/migration.sql`.

2. Create `prisma/migrations/migration_lock.toml`:
   ```toml
   provider = "postgresql"
   ```

3. `server/package.json`:
   - `scripts.postinstall`: `prisma generate`
   - `scripts` additions: `db:push`, `db:deploy`, `typecheck`
   - `engines`: `{ "node": ">=18.18" }`

## Verification

- `npx tsc --noEmit`
- `Test-Path prisma\migrations\0_init\migration.sql`
- `npx prisma validate`
