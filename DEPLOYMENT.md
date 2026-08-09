# Screener Analyst Deployment

## Vercel

1. Import this repository into Vercel.
2. Add `AI_GATEWAY_API_KEY` to the project's environment variables.
3. Deploy. Vercel runs `pnpm build` automatically.

The application sends screenshots to its server-side `/api/analyze` route. Do not expose the gateway key in client-side code or commit it to the repository.

## Local setup

Create `.env.local` with:

```bash
AI_GATEWAY_API_KEY=your_vercel_ai_gateway_key
```

Then run:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Legacy static demo

`public/screener.html` is an older standalone demo. It is not used by the Next.js application and is not the recommended deployment target.
