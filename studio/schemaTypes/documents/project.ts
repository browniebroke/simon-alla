import {ImagesIcon} from '@sanity/icons/Images'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {slugField} from '../../lib/slugField'

export const project = defineType({
  name: 'project',
  title: 'Réalisation',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      description: 'Ex. « Restauration d’un mur en pierre sèche »',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    slugField,
    defineField({
      name: 'date',
      title: 'Date des travaux',
      type: 'date',
      options: {dateFormat: 'MMMM YYYY'},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'town', title: 'Commune', type: 'string'}),
    defineField({
      name: 'service',
      title: 'Type de travaux',
      type: 'reference',
      to: [{type: 'service'}],
    }),
    defineField({
      name: 'coverImage',
      title: 'Photo principale',
      type: 'photo',
      validation: (rule) => rule.required().error('Ajoutez une photo principale.'),
    }),
    defineField({
      name: 'gallery',
      title: 'Autres photos',
      type: 'array',
      of: [defineArrayMember({type: 'photo'})],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'beforeAfter',
      title: 'Avant / après',
      description: 'Facultatif. Deux photos prises du même endroit.',
      type: 'object',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({name: 'before', title: 'Avant', type: 'photo'}),
        defineField({name: 'after', title: 'Après', type: 'photo'}),
      ],
    }),
    defineField({name: 'description', title: 'Description', type: 'blockContent'}),
    defineField({name: 'seo', title: 'Référencement', type: 'seo'}),
  ],
  orderings: [{title: 'Plus récentes', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', town: 'town', date: 'date', media: 'coverImage'},
    prepare: ({title, town, date, media}) => ({
      title,
      subtitle: [town, date?.slice(0, 4)].filter(Boolean).join(' · '),
      media,
    }),
  },
})
