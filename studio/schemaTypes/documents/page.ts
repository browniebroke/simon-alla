import {DocumentIcon} from '@sanity/icons/Document'
import {defineField, defineType} from 'sanity'
import {slugField} from '../../lib/slugField'

/** Simple text page: mentions légales, confidentialité. */
export const page = defineType({
  name: 'page',
  title: 'Page simple',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    slugField,
    defineField({name: 'body', title: 'Contenu', type: 'pageContent'}),
    defineField({name: 'seo', title: 'Référencement', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current'},
    prepare: ({title, slug}) => ({title, subtitle: slug && `/${slug}/`}),
  },
})
