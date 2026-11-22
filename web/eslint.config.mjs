import js from '@eslint/js'
import astro from 'eslint-plugin-astro'
import {defineConfig, globalIgnores} from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist/', '.astro/', 'worker-configuration.d.ts']),
  js.configs.recommended,
  tseslint.configs.recommended,
  astro.configs.recommended,
  // Accessibility checks on Astro templates (eslint-plugin-jsx-a11y-x).
  astro.configs['jsx-a11y-recommended'],
  {languageOptions: {globals: {...globals.browser, ...globals.node}}},
])
