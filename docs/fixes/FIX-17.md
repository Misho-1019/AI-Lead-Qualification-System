# FIX-17 — Replace n8n with direct OpenAI analysis

**Priority:** High (n8n cloud free trial ended → webhook 404)
**Scope:** server

## Goal

Remove the external n8n workflow dependency. AI analysis now runs directly in the backend via OpenAI (GPT-4o-mini), preserving the async flow and the "Re-run AI Analysis" button.

## Files

- `server/src/services/ai-analysis.service.ts` (new)
- `server/src/services/lead.service.ts`
- `server/src/services/n8n.service.ts` (deleted)
- `server/src/index.ts`
- `server/.env` + `server/.env.example`
- `Readme.md`

## Changes

1. `ai-analysis.service.ts` — `analyzeLeadWithAI(lead)`: builds a qualification system prompt → `POST https://api.openai.com/v1/chat/completions` (`gpt-4o-mini`, `response_format: json_object`) → parses + validates JSON (score 0–100, all strings present).
2. `lead.service.ts` — `analyzeLeadAsync(lead)` fires analysis async (create + reanalyze); result upserted via existing `saveLeadAnalysisFromCallback`. Create response is instant; analysis lands in seconds.
3. `index.ts` — required env: `OPENAI_API_KEY` replaces `N8N_WEBHOOK_URL`.
4. `n8n.service.ts` deleted.
5. Env/README updated (`OPENAI_API_KEY` added, `N8N_WEBHOOK_URL` removed). Internal callback + `INTERNAL_API_KEY` kept as unused legacy.

## Verification

- `npx tsc --noEmit` + `npm run build`
- Boot server; create a lead → analysis appears in ~5–15s; `POST /:id/reanalyze` re-runs it.
- Render: add `OPENAI_API_KEY` to env before deploying (boot requires it).
