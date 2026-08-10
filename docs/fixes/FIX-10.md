# FIX-10 — Rate limiting on public endpoints

**Priority:** Medium (security)
**Blocked by:** none
**Scope:** server

## Goal

Prevent lead spam / webhook amplification via unbounded POST endpoints.

## Files

- `server/src/middleware/rateLimiter.ts` (new)
- `server/src/routes/lead.route.ts`
- `server/src/routes/internal.route.ts`

## Changes

1. `npm i express-rate-limit` (batched in Phase 1 install).

2. Create `src/middleware/rateLimiter.ts`:
   - `publicLimiter` — ~100 req / 15 min for lead create + reanalyze.
   - `internalLimiter` — ~60 req / 5 min for the callback.

3. Apply:
   - `POST /api/leads` and `POST /:id/reanalyze` → `publicLimiter`
   - `POST /api/internal/lead-analysis-callback` → `internalLimiter`

## Verification

- `npx tsc --noEmit`
- Boot server; `curl` a POST a few times → still 201; status limits return 429 if exceeded.
