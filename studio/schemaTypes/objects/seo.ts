import {defineField, defineType} from 'sanity'

/** Optional overrides for search engines and link previews. */
export const seo = defineType({
  name: 'seo',
  title: 'Référencement (Google)',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  description: 'Facultatif. Si vide, le titre et le résumé de la page sont utilisés.',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre dans Google',
      type: 'string',
      validation: (rule) =>
        rule.max(60).warning('Au-delà de 60 caractères, Google coupe le titre.'),
    }),
    defineField({
      name: 'description',
      title: 'Description dans Google',
      type: 'text',
      rows: 3,
      validation: (rule) =>
        rule.max(160).warning('Au-delà de 160 caractères, Google coupe la description.'),
    }),
    defineField({
      name: 'image',
      title: 'Image de partage',
      description: 'Affichée quand la page est partagée (WhatsApp, Facebook…).',
      type: 'photo',
    }),
  ],
})
