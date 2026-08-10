# FIX-09 — Explicit JSON body size limit

**Priority:** Low (security hardening)
**Blocked by:** none
**Scope:** server

## Goal

Cap request bodies to prevent oversized-payload abuse.

## Files

- `server/src/index.ts`

## Changes

- `app.use(express.json({ limit: '100kb' }))`.

## Verification

- `npx tsc --noEmit`
- Boot server; oversized body → 413.
