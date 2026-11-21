import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {frFRLocale} from '@sanity/locale-fr-fr'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: "L'atelier Pierre & Paysage",

  projectId: 'md9oxzrq',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), frFRLocale()],

  schema: {
    types: schemaTypes,
  },
})
