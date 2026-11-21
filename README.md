# L'atelier Pierre & Paysage — website

Website for Simon Alla's stone and landscaping business. The site is in French: a static Astro site hosted on Cloudflare, with content edited in Sanity Studio.

## Repository layout

An npm workspaces monorepo:

| Folder | What | Deployed to |
| --- | --- | --- |
| [`web/`](web) | Astro site (`@simon-alla/web`) | Cloudflare Workers |
| [`studio/`](studio) | Sanity Studio (`@simon-alla/studio`) | `*.sanity.studio` |
| `assets/` | Brand source files (flyer, business card, logo); git-ignored | — |

The site is static: pages are built from Sanity content at build time. The only server code is the contact form endpoint (`web/src/pages/api/contact.ts`). Seed content from the flyer: `npm run seed -w studio`.

Sanity project: `md9oxzrq`, dataset `production` (public). Manage it at <https://www.sanity.io/manage/project/md9oxzrq>.

Live:

- Site: <https://simon-alla.bruno-alla-s-account.workers.dev> (until the domain is set up)
- Studio: <https://simon-alla.sanity.studio>

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

- **Site:** a Cloudflare Worker (`simon-alla`) serving the static pages, plus the `/api/contact` route. Config: [`web/wrangler.jsonc`](web/wrangler.jsonc). Deployed by GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)):
  - on pushes to `main` that touch `web/`, the root `package*.json` or `.nvmrc`;
  - when Simon publishes in Sanity: a Sanity webhook triggers the workflow through GitHub's `workflow_dispatch` API;
  - by hand, from the Actions tab.
- **Contact form settings:**
  - `CONTACT_FROM_EMAIL` in `wrangler.jsonc`: sender address, on a domain onboarded with `npx wrangler email sending enable <domain>`.
  - `TURNSTILE_SECRET_KEY`: secret, set with `npx wrangler secret put TURNSTILE_SECRET_KEY` (from `web/`).
  - `PUBLIC_TURNSTILE_SITE_KEY`: GitHub Actions repository **variable**, used at build time (defaults to Cloudflare's test key).
  - The recipient is the email set on the Contact page in Sanity, or the site email.
- **Studio:** `npm run deploy:studio` (runs `sanity deploy`).
- **Manual site deploy** (normally done by GitHub Actions): `npm run deploy -w web`. If `CLOUDFLARE_API_TOKEN` is set in your shell, unset it first so wrangler uses your login; `account_id` in `wrangler.jsonc` pins the account either way.
- **Backups:** [`.github/workflows/sanity-backup.yml`](.github/workflows/sanity-backup.yml) exports the dataset on the 1st of each month to a GitHub release. Needs a read-only Sanity token in the `SANITY_AUTH_TOKEN` repository secret.

## Setup checklist

One-off steps done outside the repo. Tick them off as they're done.

- [x] Sanity project and Studio deployed (`simon-alla.sanity.studio`)
- [x] Worker `simon-alla` created (first deploy by hand to workers.dev)
- [ ] GitHub secret `CLOUDFLARE_API_TOKEN`: account-owned Cloudflare API token, "Edit Cloudflare Workers" template, scoped to Bruno Alla's Account
- [ ] GitHub secret `SANITY_AUTH_TOKEN`: read-only (Viewer) Sanity token, for the monthly backup
- [ ] Sanity webhook → GitHub (see below), with a fine-grained GitHub token stored in the webhook's headers
- [ ] Turnstile widget for the workers.dev hostname and `simonalla.fr`; site key in the GitHub variable `PUBLIC_TURNSTILE_SITE_KEY`, secret with `npx wrangler secret put TURNSTILE_SECRET_KEY` (from `web/`)
- [x] Buy `simonalla.fr` (OVH; Cloudflare Registrar doesn't sell `.fr`), add it to Cloudflare as a zone, switch its nameservers
- [ ] Zone `simonalla.fr` active on Cloudflare (waiting for the `.fr` registry to publish the nameservers)
- [ ] Custom domain on the Worker; `www` redirects to the bare domain
- [ ] Email sending on `simonalla.fr` (`npx wrangler email sending enable simonalla.fr`), then set `CONTACT_FROM_EMAIL` in `web/wrangler.jsonc`
- [ ] Invite Simon to the Sanity project as an editor

### Sanity webhook → GitHub Actions

In sanity.io/manage → project → API → Webhooks → Create:

| Setting | Value |
| --- | --- |
| URL | `https://api.github.com/repos/browniebroke/simon-alla/actions/workflows/deploy.yml/dispatches` |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | *(empty: every published document)* |
| Projection | `{"ref": "main"}` |
| HTTP method | `POST` |
| HTTP headers | `Authorization: Bearer <token>` and `Accept: application/vnd.github+json` |

The token is a GitHub fine-grained personal access token limited to this repository, with **Actions: read and write** only. It can start workflows but not change code. Keep it only in the webhook settings, and note its expiry date: the webhook stops working when it expires. GitHub answers `204 No Content` when the call works; the webhook's attempt log in Sanity shows failures.

## Next steps

- **SEO and legal:** `LocalBusiness` JSON-LD from the site settings, `@astrojs/sitemap` and `robots.txt` (needs `site: 'https://simonalla.fr'` in the Astro config), canonical URLs. Write the Mentions légales (LCEN: name, legal status, SIRET, address, publication director, host) and Confidentialité pages in Studio. Lighthouse and accessibility pass.
- **Handover:** invite Simon to Sanity as an editor, write a one-page guide in French ("Ajouter une réalisation", "Changer une photo"), walk him through it.
- **Later:** photo uploads in the contact form, filtering projects by service, Cloudflare Web Analytics.

### Open questions for Simon

- Legal status, SIRET and business address (for the Mentions légales).
- Area served: home town and how far he travels.
- The designer's source files: logo with a transparent background, exact colours, background photos.
- Licences for the flyer photos, and photos of his own work.
- Which email he'll use to log in to Sanity, and which one receives form messages.
- Opening hours or availability to show, if any.
