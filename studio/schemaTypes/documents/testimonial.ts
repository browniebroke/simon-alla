import {CommentIcon} from '@sanity/icons/Comment'
import {defineField, defineType} from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Avis client',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'quote',
      title: 'Avis',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Prénom du client',
      description: 'Le prénom seulement, avec l’accord du client.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'town', title: 'Commune', type: 'string'}),
    defineField({name: 'date', title: 'Date', type: 'date'}),
    defineField({
      name: 'project',
      title: 'Réalisation liée',
      type: 'reference',
      to: [{type: 'project'}],
    }),
  ],
  preview: {
    select: {quote: 'quote', author: 'author', town: 'town'},
    prepare: ({quote, author, town}) => ({
      title: quote,
      subtitle: [author, town].filter(Boolean).join(', '),
    }),
  },
})
