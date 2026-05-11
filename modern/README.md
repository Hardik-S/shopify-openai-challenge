# Shopify Prompt Studio (Modernized Surface)

## Why this path was selected

- Repository: `Hardik-S/shopify-openai-challenge`
- Selection method: live GitHub `Get-Random` index over eligible repos older than six months
- Eligible count: `68`
- Random index: `35`
- CreatedAt: `2022-05-18T00:08:42Z` (well older than the six-month cutoff `2025-11-11T00:00:00Z`)
- Default branch: `main`
- Default-branch SHA (checked live): `2045377821dbbb74915089b6b20aa5d6d6a7501c`
- PushedAt: `2026-05-11T00:46:40Z`

## Legacy behavior map (preserved)

- Original app: prompt entry form + result list in a React UI.
- Original app: API-based completion request flow (`POST` to OpenAI endpoint).
- Original app: prompt/response list persisted in `localStorage`.
- Original app: clear history action.

## Modern surface additions

### Preserved

- Prompt input and response list remain first-class interactions.
- Submissions create newest-first history entries.
- Persistence is still `localStorage`-backed and replayed across refresh.
- Clear-history behavior is preserved and now uses a confirm-dialog UI.

### Extended

- Added response mode controls:
  - optional in-session OpenAI key input (session only, not persisted),
  - deterministic offline fallback when key is missing or network errors occur,
  - live-mode timing and mode metadata for each card.
- Added searchable history (`search` input for prompt + response text).
- Added per-card actions:
  - copy response,
  - delete individual cards.
- Added export:
- JSON export (`.json`),
- CSV export (`.csv`).
- Added status surface (pill counts and latest run),
- Theme toggle and cleaner empty-state/validation messaging.

## Rejected approaches

- Did not move the legacy code paths or replace existing source files.  
  Kept all legacy code intact and added a new `modern/` surface.
- Did not introduce a backend service for this increment.  
  Kept the modernization purely frontend-first and self-contained.
- Did not hardcode API secrets.  
  `openai` key is optional and typed at runtime.

## Setup and verification

1. Open `modern/index.html` from the same repo checkout.
2. Enter a prompt and submit.
3. Optional: add a temporary OpenAI token in the API field for live mode.
4. Use search, copy, delete, clear, and export actions to validate UX.

### Evidence checked in this run

- `node --check automation-runs/legacy-rebuild/worktrees/shopify-openai-challenge-20260510-2231/modern/app.js`
- `git diff --check` in branch `legacy-rebuild/shopify-openai-challenge-20260510-2231`

## Deploy note

- Vercel deploy is the next logical surface step for this run.
