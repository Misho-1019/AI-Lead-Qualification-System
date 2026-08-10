# Fix Execution Index

All fixes are atomic, self-contained work items. Execute strictly in order. Each phase ends with a summary checkpoint (except Phase 0).

Legend: 🔧 server · 🖥 client · ⚙️ both · ⏳ blocked on user

---

## Phase 0 — Audit & index (no checkpoint)

| Item | Scope | Description |
|---|---|---|
| `AUDIT.md` | — | Full audit report at repo root. |
| `docs/fixes/INDEX.md` | — | This file. |

## Phase 1 — Server foundation (ONE `npm install`, ONE `npm audit fix`)

| # | Fix | Scope | Description |
|---|---|---|---|
| FIX-01 | Prisma migrations & tooling | 🔧 | Offline initial migration (`prisma migrate diff --from-empty`), `migration_lock.toml`, `postinstall: prisma generate`, `db:push`/`db:deploy`/`typecheck` scripts, `engines`. |
| FIX-02 | Migrate DB to Neon | 🔧 | Activate Neon `DATABASE_URL`/`DIRECT_URL` in `.env`; install `@prisma/adapter-neon`; swap adapter in `utils/prisma.ts`; `prisma.config.ts` → `DIRECT_URL`; `prisma migrate deploy`; drop `pg`/`@prisma/adapter-pg`; update Render env instructions. |
| FIX-06 | `prisma` → devDependencies | 🔧 | Shrinks prod install + audit surface. |
| FIX-10 | Rate limiting | 🔧 | `express-rate-limit` on lead create / reanalyze / internal callback. |
| FIX-07 | Server `npm audit fix` | 🔧 | body-parser / qs fixes. Runs after FIX-02/06/10 install. |

**Verify:** `npx tsc --noEmit`, server boot, `curl /` health.

## Phase 2 — Server logic (ONE `tsc`, ONE boot + curl against Neon)

| # | Fix | Scope | Description |
|---|---|---|---|
| FIX-03 | Analysis in `getAllLeads` | 🔧 | `include: { analysis: true }` → fixes dashboard KPIs + cards (BUG-1). |
| FIX-04 | Pagination `total` + `/api/leads/stats` | 🔧 | `total` count in list response; `/stats` endpoint computing analyzed / high-priority / avg score across ALL leads (BUG-2). |
| FIX-09 | JSON body limit | 🔧 | `express.json({ limit: '100kb' })`. |
| FIX-11 | Timing-safe API key | 🔧 | `crypto.timingSafeEqual` in `verifyInternalApiKey`. |
| FIX-12 | Callback score range | 🔧 | Mirror 0–100 validation in `validateLeadAnalysisCallback`. |

**Verify:** `npx tsc --noEmit`, server boot, `curl` list + stats.

## Phase 3 — Client functional (ONE `tsc`/`eslint`/`next build`)

| # | Fix | Scope | Description |
|---|---|---|---|
| FIX-04 | Client KPI wiring | 🖥 | Consume `/stats` + `total` for accurate KPIs; handle paginated data. |
| FIX-05 | 404 on details page | 🖥 | `notFound()` in `leads/[id]/page.tsx` (BUG-3). |
| FIX-08 | Next upgrade | 🖥 | `next@16.3.0` + sharp/postcss/nanoid via audit fix; verify `next build`. |
| FIX-13 | Env examples | ⚙️ | `server/.env.example` (Neon `DATABASE_URL`/`DIRECT_URL`) + `client/.env.example`; README env section. |

**Verify:** `npx tsc --noEmit`, `npx eslint .`, `npm run build`.

## Phase 4 — Stitch UI/UX redesign (all three pages)

| # | Fix | Scope | Description |
|---|---|---|---|
| FIX-14 | Stitch redesign | 🖥 | Create Stitch project + design system → generate Dashboard / Lead Details / New Lead screens → generate variants → **user picks** → `stitch-to-react` → integrate (keep server/client split, data flow, auto-refresh, toasts) → update `globals.css` + `layout.tsx` fonts → `tsc`/`eslint`/`build` + `agent-browser` QA. |

**Verify:** lint + typecheck + `next build` + browser pass.

## Phase 5 — Deferred (not executed)

| # | Fix | Scope | Description |
|---|---|---|---|
| FIX-15 | Tests + CI | ⚙️ | Test scaffolding (server + client), `.github/workflows`, coverage. Deferred by default. |

---

## Checkpoints

- ⏳ FIX-02: user created Neon project; connection strings present in `server/.env` (lines 23–24, activated during execution).
- ⏳ FIX-14: user picks Stitch design variants at the review checkpoint.
- After each phase (1→4): **STOP and summarize** before continuing.
