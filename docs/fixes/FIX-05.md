# FIX-05 — 404 handling on lead details page

**Priority:** Medium (UX)
**Blocked by:** none
**Scope:** client

## Goal

A non-existent lead should show a proper 404 page, not a crashing error page.

## Files

- `client/src/lib/api.ts`
- `client/src/app/leads/[id]/page.tsx`

## Changes

1. `getLead` returns `null` on HTTP 404 instead of throwing.
2. In the details page: `if (!lead) notFound();` (import from `next/navigation`).

## Verification

- `npx tsc --noEmit`, `npx eslint .`
- Visit `/leads/<random-uuid>` → Next 404 page.
