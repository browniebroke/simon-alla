# AGENTS.md

Website for Simon Alla's stone and landscaping business (L'atelier Pierre & Paysage). See README.md for layout, deployment and the setup checklist.

- npm workspaces: `web/` (Astro site on Cloudflare Workers) and `studio/` (Sanity Studio). Install from the root; add deps with `npm install <pkg> -w web|studio`.
- Everything visitors or Simon see is in French. Code, comments and docs are in English.
- Content lives in Sanity (project `md9oxzrq`, dataset `production`). The site reads it at build time; a schema change needs matching updates in `web/src/lib/sanity.ts` (types and GROQ queries).
- Wrangler: the shell may export a `CLOUDFLARE_API_TOKEN` for another account. Run wrangler as `env -u CLOUDFLARE_API_TOKEN npx wrangler …` so it uses the OAuth login; `account_id` in `web/wrangler.jsonc` pins the account.
- Never commit `web/.dev.vars` or print secrets. Deploys run from GitHub Actions; deploy by hand only when asked.
- Before finishing a change: `npm run format`, then `npm run check` (format check, ESLint, type checks incl. Sanity schema) and `npm run build -w web`. CI (`.github/workflows/ci.yml`) runs the same.
