# Mindmap AI

Mindmap tool with optional OpenAI-powered branch expansion.

## 1) Install and run locally

```bash
npm install
npm run dev
```

App runs on `http://localhost:3000`.

## 2) Configure OpenAI (local)

Create `.env.local` in the project root:

```bash
OPENAI_API_KEY=sk-...
# Optional (defaults to gpt-4.1-mini)
OPENAI_MODEL=gpt-4.1-mini
```

Then restart dev server.

## 3) Configure OpenRouter (OpenAI-compatible)

If you use an OpenRouter key, set the OpenAI-compatible base URL and model:

```bash
OPENAI_API_KEY=sk-or-v1-...
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=openai/gpt-4o-mini

# Optional but recommended by OpenRouter
OPENROUTER_SITE_URL=https://your-site.example
OPENROUTER_APP_NAME=Mindmap AI
```

Then restart dev server.

If you use an `sk-or-v1` key and forget `OPENAI_BASE_URL`, the app now auto-routes to OpenRouter by default.

### Notes
- If `OPENAI_API_KEY` is missing, node expansion falls back to dummy branches so UI still works.
- If `OPENAI_API_KEY` is missing, chat returns setup guidance in-app until configured.
- With a valid key, `Expand node` calls `/api/ai/expand-node` and chat calls `/api/ai/chat`.

## 4) Configure in Vercel

In Vercel project settings:

1. Go to **Settings → Environment Variables**
2. Add:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (optional but recommended)
   - `OPENAI_BASE_URL` (required for OpenRouter)
   - `OPENROUTER_SITE_URL` and `OPENROUTER_APP_NAME` (optional, OpenRouter only)
3. Redeploy the latest deployment

## 5) Quick troubleshooting

- **Expand returns fallback branches**
  - Check that `OPENAI_API_KEY` exists in local `.env.local` or Vercel env vars.
- **Chat/Expand route returns 500 with OpenRouter key**
  - Verify `OPENAI_BASE_URL=https://openrouter.ai/api/v1` (or rely on auto-detection for `sk-or-v1` keys) and a valid `OPENAI_MODEL` (for example `openai/gpt-4o-mini`).
- **OpenAI/OpenRouter not used in Vercel**
  - Confirm variables are set for the correct environment (Preview/Production) and redeploy.
