# AI Lead Qualification System — Full Audit

Audit date: 2026-08-11
Branch: `main` (clean tree)
Commit audited: `3240715` (plus local working state)

---

## 1. Project overview

| Layer | Stack | Path |
|---|---|---|
| Frontend | Next.js 16.2.4 (App Router), React 19, TypeScript, Tailwind v4, react-hot-toast | `client/` |
| Backend | Node 22, Express 5.2.1, TypeScript, Prisma 7.7 (`pg` adapter) | `server/` |
| Data | PostgreSQL (was Supabase — now migrating to Neon) | `server/prisma/schema.prisma` |
| Workflow | n8n cloud webhook → OpenAI analysis → secure internal callback | `server/src/services/n8n.service.ts` |

56 commits, all on `main`. Architecture is clean and layered (routes → controllers → services → Prisma) with real async AI integration via n8n.

## 2. Verification results (read-only)

- `tsc --noEmit` — server: **PASS**, client: **PASS**
- `eslint .` (client) — **PASS**
- `.env` files — **correctly gitignored, NOT tracked in git** ✅

## 3. Infrastructure finding (critical — app down)

- **Supabase free-plan project is PAUSED** and cannot be resumed (free tier allows only 2 live projects).
- Since `DATABASE_URL` pointed at Supabase, the backend could not connect → **the whole app was effectively down**.
- **Resolution:** migrate to **Neon** (permanent free tier: $0/month, no card, up to 100 projects, no live-project cap, scale-to-zero after 5 min idle = $0 compute, 0.5 GB storage, official Prisma support).
  - Adapter: `@prisma/adapter-neon` (WebSocket driver, official path).
  - Two connection strings: `DATABASE_URL` (pooled, for the app) and `DIRECT_URL` (direct, for Prisma CLI migrations).
  - Data starts fresh (no migration of existing lead data — portfolio demo).
- Frontend (Vercel) and n8n webhook are **unaffected** by the DB change (they talk to the API, not the DB).

## 4. Functional bugs (highest priority)

### BUG-1 — Dashboard AI data never loads (critical)
`getAllLeads()` (`server/src/services/lead.service.ts:27`) does **not** `include: { analysis }`, and never has (verified across all commits touching that file). The dashboard depends on `lead.analysis` for:
- KPI cards "Analyzed Leads", "High Priority", "Average AI Score" → **always 0** (`client/src/app/page.tsx:11-23`)
- Card AI Score / Priority / Summary → **always "Analyzing..."** (`leads-dashboard.tsx:181,195,223`)

The details endpoint (`getLeadById`) includes analysis, so the detail page works but the main dashboard does not. The compiled `dist/services/lead.service.js:29` confirms the same bug in the deployed build.

### BUG-2 — KPI stats computed on a paginated slice
Server paginates to 10 leads (`limit` default) and returns `data`/`page`/`limit` but **no total count**. `getLeads()` ignores pagination, so "Total Leads" and all KPIs are computed over page 1 only. Server pagination is effectively dead code from the client's perspective.

### BUG-3 — Details page has no 404 handling
`getLead(id)` throws a generic error on a non-existent lead; the server component has no error boundary → full error page instead of a friendly "Lead not found".

## 5. Security findings

- **SA-1 (med)** — No rate limiting on public endpoints (create-lead, reanalyze) → lead spam / webhook amplification.
- **SA-2 (low)** — No explicit request body size limit on `express.json()`.
- **SA-3 (low)** — Timing-unsafe internal API key comparison (`verifyInternalApiKey.ts:16`, string `!==`).
- **SA-4 (low)** — `prisma` CLI shipped as a production dependency, pulling `hono`, `fast-uri`, `valibot` into prod installs (source of most server audit hits).
- **SA-5 (info)** — Static internal API key + public demo URLs; acceptable for a portfolio but shared across all environments.
- **SA-6 (info)** — Callback validator checks types but **not** the 0–100 score range (inconsistent with `validate-lead-analysis.ts`).

Done well: CORS single-origin, Helmet, env-var guard at boot, UUID param validation, duplicate-analysis prevention, graceful shutdown, secrets not committed.

## 6. Dependency vulnerabilities

**Client — 4 high (runtime, matters):**
- `next@16.2.4` — multiple high-severity advisories (DoS, SSRF, cache poisoning, XSS); fix is `next@16.3.0` (`npm audit fix --force`).
- `sharp`, `postcss`, `nanoid` — transitively via next.

**Server — 8 (1 low, 5 mod, 2 high):**
- `body-parser@2.2.2` (via Express 5) — **moderate DoS**, runtime-relevant; `npm audit fix` available.
- `fast-uri` / `hono` / `valibot` / `@hono/node-server` (2 high, rest moderate) — **dev-tooling only** via `prisma` CLI.

Also behind on: prisma 7.7→7.9.1, pg, helmet, tailwind, react, etc.

## 7. Data layer / migrations

- **No `prisma/migrations` folder exists** though `prisma.config.ts:9` declares the path. Schema relied on `db push`.
- **No `postinstall: prisma generate`** — `server/src/generated/prisma` is gitignored, so a fresh `git clone && npm run build` **fails** until `npx prisma generate` is run manually.
- No `engines` field in `package.json` (Prisma 7 requires Node ≥18.18; Neon requires ≥18).
- `prisma`/`pg`/`@prisma/adapter-pg` in `dependencies` (only `@prisma/client` is needed at runtime).

## 8. Quality & ops gaps

- **Zero tests** anywhere; no CI (`.github/workflows` absent).
- No `lint` script on server; no `.env.example` files.
- `createLead` awaits the n8n webhook round-trip synchronously (adds latency to the 201; resilient though — errors are caught/logged).
- No retry/idempotency for failed n8n triggers or callbacks.
- Auto-refresh (`router.refresh()` every 15s) re-renders the whole dashboard; fine for demo.
- `client/README.md` is the unedited create-next-app boilerplate.

## 9. What's done well

Clean layered architecture, proper validation middleware, UUID route guards, env validation at boot, CORS/Helmet, no secrets committed, sensible error handler, `cache: 'no-store'` on data fetches, reusable shared types, consistent Tailwind UI.

## 10. Fix execution

All fixes are tracked as atomic work items in `docs/fixes/INDEX.md` + `docs/fixes/FIX-*.md`, executed in phased order with a summary checkpoint after each phase.
