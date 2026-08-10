# FIX-04 — Pagination metadata + lead stats endpoint (server)

**Priority:** High (KPIs were computed on page-1 only)
**Blocked by:** FIX-03 (same function)
**Scope:** server

## Goal

- Return a `total` count so the client knows the real dataset size.
- Add `GET /api/leads/stats` returning aggregate KPIs across ALL leads (analyzed, high priority, average score).

## Files

- `server/src/services/lead.service.ts`
- `server/src/controllers/lead.controller.ts`
- `server/src/routes/lead.route.ts`

## Changes

1. `getAllLeads` returns `{ leads, total }` via `Promise.all([findMany(includes analysis), count()])`.
2. New `getLeadStats()` service: `Promise.all([lead.count(), leadAnalysis.count(), leadAnalysis.count({where:{priority:'high'}}), leadAnalysis.aggregate({_avg:{score:true}})])` → `{ total, analyzed, highPriority, averageScore }`.
3. New `getLeadStatsController`.
4. Route: register `GET /stats` **before** `GET /:id` (else "stats" hits the UUID guard).
5. `getAllLeadsController` responds `data: { leads, total }`.

## Verification

- `npx tsc --noEmit`
- `curl http://localhost:3030/api/leads/stats` → KPI object
- `curl http://localhost:3030/api/leads` → `data.leads` + `data.total`
