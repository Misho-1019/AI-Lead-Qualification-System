# FIX-12 — Enforce score range in callback validator

**Priority:** Low (validation consistency)
**Blocked by:** none
**Scope:** server

## Goal

The internal callback validator checks types only; enforce the same 0–100 score range as `validate-lead-analysis.ts`.

## Files

- `server/src/middleware/validateLeadAnalysisCallback.ts`

## Changes

- After the type check, reject `score` outside `0..100` with 400.

## Verification

- `npx tsc --noEmit`
- Callback with score 150 → 400.
