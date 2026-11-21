# L'atelier Pierre & Paysage — website

Website for Simon Alla's stone and landscaping business. The site is in French: a static Astro site hosted on Cloudflare, with content edited in Sanity Studio.

See [`docs/plan.html`](docs/plan.html) for the full plan (architecture, design system, content model, build phases).

## Repository layout

An npm workspaces monorepo:

| Folder | What | Deployed to |
| --- | --- | --- |
| [`web/`](web) | Astro site (`@simon-alla/web`) | Cloudflare Workers |
| [`studio/`](studio) | Sanity Studio (`@simon-alla/studio`) | `*.sanity.studio` |
| [`docs/`](docs) | Plan and project docs | — |
| `assets/` | Brand source files (flyer, business card, logo); git-ignored | — |

The site is static: pages are built from Sanity content at build time. The only server code is the contact form endpoint (`web/src/pages/api/contact.ts`). Seed content from the flyer: `npm run seed -w studio`.

Sanity project: `md9oxzrq`, dataset `production` (public). Manage it at <https://www.sanity.io/manage/project/md9oxzrq>.

## Requirements

- Node.js 22 or later (see `.nvmrc`)
- npm (comes with Node)

## Getting started

```sh
npm install          # installs dependencies for every workspace
cp web/.dev.vars.example web/.dev.vars   # local secrets: Turnstile test key, email dry run
npm run dev:web      # Astro dev server
npm run dev:studio   # Sanity Studio dev server
```

Add a dependency to one workspace:

```sh
npm install <package> -w web
npm install <package> -w studio
```

## Deployment

- **Site:** a Cloudflare Worker (`simon-alla`) serving the static pages, plus the `/api/contact` route. Workers Builds deploys on every push to `main`; publishing in Sanity triggers a rebuild through a deploy hook. Config: [`web/wrangler.jsonc`](web/wrangler.jsonc).
- **Contact form settings:**
  - `CONTACT_FROM_EMAIL` in `wrangler.jsonc`: sender address, on a domain onboarded with `npx wrangler email sending enable <domain>`.
  - `TURNSTILE_SECRET_KEY`: secret, set with `npx wrangler secret put TURNSTILE_SECRET_KEY` (from `web/`).
  - `PUBLIC_TURNSTILE_SITE_KEY`: build variable in Workers Builds (defaults to Cloudflare's test key).
  - The recipient is the email set on the Contact page in Sanity, or the site email.
- **Studio:** `npm run deploy:studio` (runs `sanity deploy`).
