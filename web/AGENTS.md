# AGENTS.md (web)

Astro 7 site, deployed as a Cloudflare Worker with static assets (`@astrojs/cloudflare` v14, Workers only).

- Every page is prerendered from Sanity at build time. The only on-demand route is `src/pages/api/contact.ts` (`prerender = false`); keep it that way.
- Data: `src/lib/sanity.ts` (client, types, GROQ). Images: `src/lib/image.ts` (Sanity CDN URLs, `srcset`). Rich text: `src/lib/portableText.ts`.
- Styles: plain CSS. Tokens in `src/styles/global.css`, taken from the flyer; scoped `<style>` per component. No CSS framework.
- Bindings and secrets come from `import {env} from 'cloudflare:workers'`. After editing `wrangler.jsonc`, run `npm run types` (generates `worker-configuration.d.ts`, git-ignored).
- Local dev: `cp .dev.vars.example .dev.vars`, then `npm run dev` (runs in workerd; `astro dev --background` / `astro dev stop` for a background server). The dry-run setting logs contact emails instead of sending them.
