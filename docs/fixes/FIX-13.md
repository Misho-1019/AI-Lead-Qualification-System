# FIX-13 — Environment example files + README docs

**Priority:** Low (onboarding)
**Blocked by:** none
**Scope:** both

## Goal

New contributors can copy `.env.example` → `.env` and know exactly what to fill in (incl. the Neon `DATABASE_URL`/`DIRECT_URL` split).

## Files

- `server/.env.example` (new)
- `client/.env.example` (new)
- `client/.gitignore` (add `!.env.example` — `.env*` would otherwise exclude it)
- `Readme.md` (backend env block: add `DIRECT_URL`, point at `.env.example` files)

## Changes

1. `server/.env.example`:
   ```
   DATABASE_URL=   # Neon pooled connection string
   DIRECT_URL=     # Neon direct connection string (Prisma CLI)
   PORT=3030
   N8N_WEBHOOK_URL=
   INTERNAL_API_KEY=
   FRONTEND_URL=
   ```
2. `client/.env.example`:
   ```
   NEXT_PUBLIC_API_URL=
   ```
3. Ensure `git check-ignore client/.env.example` is false.
4. Update `Readme.md` env section.

## Verification

- `git status` shows both `.env.example` files as tracked (untracked, ready to add).
