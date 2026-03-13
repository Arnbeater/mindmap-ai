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

### Notes
- If `OPENAI_API_KEY` is missing, the app falls back to dummy branches so UI still works.
- With a valid key, `Expand node` calls `/api/ai/expand-node` and generates AI branches.

## 3) Configure OpenAI in Vercel

In Vercel project settings:

1. Go to **Settings → Environment Variables**
2. Add:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (optional)
3. Redeploy the latest deployment

## 4) Quick troubleshooting

- **Expand returns fallback branches**
  - Check that `OPENAI_API_KEY` exists in local `.env.local` or Vercel env vars.
- **Expand route returns 500**
  - Verify key validity and model name.
- **OpenAI not used in Vercel**
  - Confirm variables are set for the correct environment (Preview/Production) and redeploy.
