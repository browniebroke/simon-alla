# AGENTS.md (studio)

Sanity Studio v6 for Simon, hosted at https://simon-alla.sanity.studio (`npm run deploy`).

- Simon is not technical: every field has a French `title` and a short French `description`; validation messages are in French.
- Schemas: `schemaTypes/documents/` and `schemaTypes/objects/`. Use the `photo` type for images (hotspot + required alt text) and `blockContent` for rich text.
- Singletons (`homePage`, `contactPage`, `siteSettings`) have the type name as document ID; they're listed in `structure.ts` and can't be created or deleted.
- Icons are imported per icon: `import {HomeIcon} from '@sanity/icons/Home'` (the package root doesn't export them at runtime).
- After a schema change: `npx sanity schemas validate`, update `web/src/lib/sanity.ts`, and run `npx sanity documents validate -y` against existing content.
- `scripts/seed-flyer-content.ts` (`npm run seed`) only creates missing documents; never make it overwrite.
