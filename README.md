# Screener Analyst

An AI-assisted research workflow for reviewing Chartink screener screenshots and generating structured swing-trading analysis for Indian equities.

## What it does

- Accepts a PNG, JPEG, or WebP Chartink screener screenshot.
- Uses a vision model to identify and rank visible trading opportunities.
- Presents market regime, sector strength, trade levels, risk conditions, and a watchlist in a consistent UI.
- Validates AI output before it reaches the client, so malformed responses fail safely.

## Architecture

```text
Browser upload -> Next.js API route -> Vercel AI Gateway -> Structured JSON -> Results UI
```

The browser never receives the AI Gateway key. Screenshots are validated for input type and size, requests have a server-side timeout, and model output is checked against a runtime schema before rendering.

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` from `.env.example` and set your Vercel AI Gateway key:

   ```env
   AI_GATEWAY_API_KEY=your_key_here
   ```

3. Start the app:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000`.

## Deployment

Deploy to Vercel and configure `AI_GATEWAY_API_KEY` under Project Settings -> Environment Variables. See `DEPLOYMENT.md` for the detailed deployment steps.

## Scope and Disclaimer

This is a research and decision-support application, not a trade-execution platform or financial-advice service. Model-generated analysis should be independently verified before making an investment decision. A production implementation that requires live prices or news should integrate a licensed, auditable market-data provider.
