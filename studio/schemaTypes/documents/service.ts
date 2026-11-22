import {WrenchIcon} from '@sanity/icons/Wrench'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {slugField} from '../../lib/slugField'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: WrenchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Nom du service',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    slugField,
    defineField({
      name: 'summary',
      title: 'Résumé',
      description: 'Une ou deux phrases, affichées sur la carte du service.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(200),
    }),
    defineField({name: 'coverImage', title: 'Photo principale', type: 'photo'}),
    defineField({name: 'body', title: 'Description détaillée', type: 'blockContent'}),
    defineField({
      name: 'gallery',
      title: 'Photos',
      type: 'array',
      of: [defineArrayMember({type: 'photo'})],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      description: '1 = affiché en premier.',
      type: 'number',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({name: 'seo', title: 'Référencement', type: 'seo'}),
  ],
  orderings: [
    {title: 'Ordre d’affichage', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]},
  ],
  preview: {select: {title: 'title', subtitle: 'summary', media: 'coverImage'}},
})
