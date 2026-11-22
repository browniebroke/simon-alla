import {defineField} from 'sanity'
import {slugify} from './slugify'

/** URL field generated from the title, with accents and punctuation stripped. */
export const slugField = defineField({
  name: 'slug',
  title: 'Adresse de la page (URL)',
  description: 'Cliquez sur « Générer » pour la créer à partir du titre.',
  type: 'slug',
  options: {source: 'title', maxLength: 96, slugify},
  validation: (rule) => rule.required().error('Générez l’adresse de la page.'),
})
