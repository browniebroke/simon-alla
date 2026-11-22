import {defineField, defineType} from 'sanity'

/** Image with focal-point cropping and a description required for accessibility and SEO. */
export const photo = defineType({
  name: 'photo',
  title: 'Photo',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Description de la photo',
      description:
        'Décrivez en quelques mots ce que montre la photo (ex. « Mur en pierre sèche restauré à Figeac »). Utile pour Google et les personnes malvoyantes.',
      type: 'string',
      validation: (rule) =>
        rule.custom((alt, context) => {
          const parent = context.parent as {asset?: unknown} | undefined
          return parent?.asset && !alt ? 'Ajoutez une courte description de la photo.' : true
        }),
    }),
  ],
})
