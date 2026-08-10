# FIX-06 — Move `prisma` CLI to devDependencies

**Priority:** Low (security hygiene)
**Blocked by:** none
**Scope:** server

## Goal

`prisma` is a CLI/dev tool. Shipping it as a production dependency drags `hono`, `fast-uri`, `valibot`, `@hono/node-server` into prod installs (source of most server `npm audit` hits).

## Files

- `server/package.json`

## Changes

- Move `prisma` from `dependencies` → `devDependencies`.

## Verification

- `npm ls prisma --depth=0`
- `npx tsc --noEmit`
