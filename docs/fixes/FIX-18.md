# FIX-18 — Google Sheets sync (auto + manual export)

**Priority:** Medium (feature)
**Scope:** both

## Goal

Push leads (with AI analysis) to a Google Sheet — automatically after each analysis, plus a manual "Export to Sheets" button.

## Approach

Official **Google Sheets API** with a **service account** (no new npm deps — RS256 JWT via node `crypto` + plain `fetch`).

## Backend

- `src/services/sheets.service.ts` (new): `getAccessToken()` (JWT assertion → oauth2 token, cached), `appendLeadToSheet(lead)`, `exportAllLeadsToSheet(leads)` (clear + headers + all rows, idempotent), `isSheetsConfigured()`. All env vars optional; failures are logged, never block lead creation.
- `lead.service.ts`: after AI analysis is saved → `appendLeadToSheet` (auto-sync). Added `exportLeadsToSheet()`.
- Controller + route: `POST /api/leads/export-to-sheets` (rate-limited, before `/:id`). Returns a friendly message when not configured.
- Env: `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_JSON` (+ optional `GOOGLE_SHEETS_RANGE`, default `Sheet1!A1`). `.env.example` + README updated.

## Frontend

- `api.ts`: `exportLeadsToSheets()`.
- `export-to-sheets-button.tsx` (client): icon + toast.
- `page.tsx`: button next to "+ New Lead".

## User setup (one-time)

Google Cloud project → enable Sheets API → service account + JSON key → share target sheet with service-account email (Editor) → set the two env vars (JSON on one line).

## Verification

- `npx tsc --noEmit` + `npm run build` (server & client)
- Boot; `POST /api/leads/export-to-sheets` → "not configured" message until credentials set; then rows appear in the sheet; new analyzed leads auto-append.
