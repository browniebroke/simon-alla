# L'atelier Pierre & Paysage — website

Website for Simon Alla's stone and landscaping business. The site is in French: a static Astro site hosted on Cloudflare, with content edited in Sanity Studio.

See [`docs/plan.html`](docs/plan.html) for the full plan (architecture, design system, content model, build phases).

## Repository layout

An npm workspaces monorepo:

| Folder | What | Deployed to |
| --- | --- | --- |
| [`web/`](web) | Astro site (`@simon-alla/web`) | Cloudflare Pages |
| [`studio/`](studio) | Sanity Studio (`@simon-alla/studio`) | `*.sanity.studio` |
| [`docs/`](docs) | Plan and project docs | — |
| `assets/` | Brand source files (flyer, business card, logo); git-ignored | — |

Both packages are empty stubs for now; they get scaffolded in phase 1 of the plan.

## Requirements

- Node.js 22 or later (see `.nvmrc`)
- npm (comes with Node)

## Getting started

```sh
npm install          # installs dependencies for every workspace
npm run dev:web      # Astro dev server
npm run dev:studio   # Sanity Studio dev server
```

Add a dependency to one workspace:

```sh
npm install <package> -w web
npm install <package> -w studio
```

## Deployment

- **Site:** Cloudflare Pages builds from the repo root with `npm run build:web`, output directory `web/dist`. Publishing in Sanity triggers a rebuild through a deploy hook.
- **Studio:** `npm run deploy:studio` (runs `sanity deploy`).
