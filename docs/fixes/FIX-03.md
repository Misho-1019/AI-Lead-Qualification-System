# FIX-03 — Include AI analysis in lead list response

**Priority:** Critical (dashboard never shows AI data)
**Blocked by:** none
**Scope:** server

## Goal

`GET /api/leads` must include each lead's `analysis` so the dashboard KPIs and lead cards render real data instead of "Analyzing…"/0.

## Files

- `server/src/services/lead.service.ts`

## Changes

- In `getAllLeads`, add `include: { analysis: true }` to `prisma.lead.findMany`.

## Verification

- `npx tsc --noEmit`
- `curl http://localhost:3030/api/leads` → `data.leads[].analysis` present.
