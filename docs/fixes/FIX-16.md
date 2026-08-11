# FIX-16 — Real outreach email sending (Resend)

**Priority:** Medium (feature)
**Blocked by:** Screen 2 (details page)
**Scope:** both

## Goal

Send the stored AI-drafted outreach email (`outreach_email_subject` + `outreach_email_body`) to the lead's address via Resend, from the Lead Details page.

## Files

- `server/src/services/email.service.ts` (new)
- `server/src/controllers/lead.controller.ts`
- `server/src/routes/lead.route.ts`
- `server/.env` + `server/.env.example`
- `client/src/lib/api.ts`
- `client/src/components/send-email-button.tsx` (new)
- `client/src/app/leads/[id]/page.tsx`
- `Readme.md` (env block)

## Backend

1. `email.service.ts` — `POST https://api.resend.com/emails` (Bearer `RESEND_API_KEY`), `{ from, to, subject, text }`.
   - `to` = `EMAIL_TEST_TO || lead.email` (test-mode override so no domain is needed).
   - `from` = `EMAIL_FROM || 'onboarding@resend.dev'` (Resend sandbox sender).
   - Throws clear error when `RESEND_API_KEY` unset or the API returns non-2xx.
2. `sendLeadEmailController` — 404 if no lead, 409 if no analysis, 502 on send failure.
3. Route `POST /api/leads/:id/send-email` with `publicLimiter` + `validateUuidParam`.
4. Env: `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TEST_TO` (`.env` + `.env.example` + README).

## Frontend

- `api.ts`: `sendLeadEmail(leadId)` (surfaces backend error message).
- `send-email-button.tsx` (client): confirm dialog → send → toast; disabled until analysis exists.
- Details page: "Send email" button beside "Copy email".

## Verification

- `npx tsc --noEmit` (server + client), `npx eslint .`, `npm run build`
- Boot server; `POST /api/leads/:id/send-email` without analysis → 409; with `EMAIL_TEST_TO` set → email lands in test inbox.
