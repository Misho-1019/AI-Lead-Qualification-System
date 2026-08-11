# FIX-14 — Stitch UI/UX redesign (screen by screen)

**Priority:** Medium (visual overhaul)
**Scope:** client

## Approach

Redesign all three screens with Stitch-generated designs, one at a time, converting each winner via `stitch-to-react` and integrating it into the existing Next.js app (preserving data flow, server/client split, auto-refresh, toasts).

Stitch project: `16152113392600487045` · Design system: `assets/6886002204632021388` (Apex Dark — Fluid Insight)

## Screen 1 — Dashboard ✅ DONE

**Winner variant:** Fluid Insight Grid (masonry glass cards + conic score rings, indigo #6366f1, dark #07080e, Public Sans/Inter).

**Design tokens:** `client/src/app/globals.css` (surface #07080e, surface-container #10121e, primary #6366f1, secondary #818cf8, tertiary #22d3ee, gradient-text, gradient-primary, glass-card, masonry, scrollbar) · `client/src/app/layout.tsx` (Public Sans + Inter via next/font, dark toast styling).

**Files:** `page.tsx` (server — Live Feed badge, "Lead Intelligence" gradient headline, + New Lead, KPI strip from `/stats`), `leads-dashboard.tsx` (client — search, status filter chips, sort select, masonry LeadCard with score ring / status pill / priority treatment / AI insight / budget / company size / pain point / View Details link).

**Verified:** `tsc` ✅ · `eslint` ✅ · `next build` ✅ · browser QA (search filter ✅, status chip ✅, sort present ✅, card → details navigation ✅, KPIs ✅). Seeded 4 demo leads directly into Neon (no n8n cost).

## Screen 2 — Lead Details ✅ DONE

**Source:** Stitch "Lead Details: Sarah Mitchell". **Palette normalized to dashboard tokens** (indigo `#6366f1`, glass `#10121e`, gradient-primary, Public Sans/Inter).

**Files:** `leads/[id]/page.tsx` (server — gradient-text name, status pill select + Re-run button in header, KPI row with conic score ring / priority chip / company size / budget, bento grid: Pain Point / AI Summary (AI Insight badge) / Qualification Reason / Recommended Next Step / Outreach Email w/ subject + `whitespace-pre-line` body + Copy email), `status-select.tsx` (pill w/ pulsing dot), `reanalyze-button.tsx` (gradient pill), new `copy-email-button.tsx` (clipboard).

**Verified:** `tsc` ✅ · `eslint` ✅ · `next build` ✅ · browser QA (all sections, KPIs, email content render).

## Screen 3 — New Lead (pending)
