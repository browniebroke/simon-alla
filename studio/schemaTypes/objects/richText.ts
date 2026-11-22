import {defineArrayMember, defineField, defineType} from 'sanity'

const marks = {
  decorators: [
    {title: 'Gras', value: 'strong'},
    {title: 'Italique', value: 'em'},
  ],
  annotations: [
    defineField({
      name: 'link',
      title: 'Lien',
      type: 'object',
      fields: [
        defineField({
          name: 'href',
          title: 'Adresse du lien',
          type: 'url',
          validation: (rule) =>
            rule.required().uri({scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true}),
        }),
      ],
    }),
  ],
}

const lists = [
  {title: 'Liste à puces', value: 'bullet'},
  {title: 'Liste numérotée', value: 'number'},
]

/** Short formatted text: paragraphs, bold, italic, links and lists. No headings, so the design stays intact. */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Texte',
  type: 'array',
  of: [
    defineArrayMember({type: 'block', styles: [{title: 'Normal', value: 'normal'}], lists, marks}),
  ],
})

/** Longer text for simple pages (legal notice, privacy): adds two heading levels. */
export const pageContent = defineType({
  name: 'pageContent',
  title: 'Texte',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Titre', value: 'h2'},
        {title: 'Sous-titre', value: 'h3'},
      ],
      lists,
      marks,
    }),
  ],
})
