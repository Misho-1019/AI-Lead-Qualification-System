# FIX-08 — Upgrade Next.js to patched version

**Priority:** High (4 high-severity `npm audit` findings in next/sharp/postcss/nanoid)
**Blocked by:** none
**Scope:** client

## Goal

`next@16.2.4` has multiple high-severity advisories; `next@16.3.0` is the patched line.

## Files

- `client/package.json`
- `client/package-lock.json`

## Changes

- `next`: `16.2.4` → `16.3.0`
- `eslint-config-next`: `16.2.4` → `16.3.0`
- `npm install`, then `npm audit fix` for sharp/postcss/nanoid.

## Verification

- `npm audit --omit=dev` → 0 vulnerabilities
- `npx tsc --noEmit`, `npx eslint .`
- `npm run build` succeeds
