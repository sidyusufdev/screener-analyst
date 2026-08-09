# Deployment Notes

The production app requires a server-side AI Gateway key, so it cannot use static-only hosting such as GitHub Pages without replacing the analysis API.

Use Vercel for the current implementation. Set `AI_GATEWAY_API_KEY` in Vercel Project Settings before deploying.

For the complete setup steps, see `DEPLOYMENT.md`.
