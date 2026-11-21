// @ts-check
import cloudflare from '@astrojs/cloudflare'
import {defineConfig, envField} from 'astro/config'

// https://astro.build/config
export default defineConfig({
  // Every page is prerendered at build time; only /api/contact runs on the Worker.
  adapter: cloudflare({
    // Photos come resized from the Sanity CDN: no Cloudflare Images binding needed.
    imageService: 'passthrough',
  }),
  // No sessions: avoids provisioning a KV namespace.
  session: false,
  env: {
    schema: {
      // Turnstile site key (public). Defaults to Cloudflare's test key, which always passes.
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({
        context: 'client',
        access: 'public',
        default: '1x00000000000000000000AA',
      }),
    },
  },
})
