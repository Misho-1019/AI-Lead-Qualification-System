# FIX-11 — Timing-safe internal API key comparison

**Priority:** Low (security hardening)
**Blocked by:** none
**Scope:** server

## Goal

Avoid timing attacks on the internal callback key check.

## Files

- `server/src/middleware/verifyInternalApiKey.ts`

## Changes

- Compare with `crypto.timingSafeEqual` after a length guard (fall back to plain `!==` result when lengths differ).

## Verification

- `npx tsc --noEmit`
- Callback without/with wrong key → 401; with correct key → passes to validation.
