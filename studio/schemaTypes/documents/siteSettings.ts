import {CogIcon} from '@sanity/icons/Cog'
import {defineArrayMember, defineField, defineType} from 'sanity'

const FRENCH_PHONE = /^(?:\+33\s?|0)[1-9](?:[\s.]?\d{2}){4}$/

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Paramètres du site',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'identity', title: 'Entreprise', default: true},
    {name: 'contact', title: 'Coordonnées'},
    {name: 'seo', title: 'Référencement'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Slogan',
      description: 'Ex. « L’atelier Pierre & Paysage »',
      type: 'string',
      group: 'identity',
    }),
    defineField({name: 'logo', title: 'Logo', type: 'photo', group: 'identity'}),
    defineField({
      name: 'phone',
      title: 'Téléphone',
      description: 'Ex. 06 33 65 36 76',
      type: 'string',
      group: 'contact',
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            !value || FRENCH_PHONE.test(value.trim()) ? true : 'Numéro de téléphone invalide.',
          ),
    }),
    defineField({
      name: 'email',
      title: 'Adresse e-mail',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.required().email().error('Adresse e-mail invalide.'),
    }),
    defineField({
      name: 'city',
      title: 'Ville principale',
      description: 'Utilisée dans les titres pour Google (ex. « Taille de pierre à … »).',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'serviceArea',
      title: 'Zone d’intervention',
      description: 'Ex. « Dans un rayon de 40 km autour de … »',
      type: 'text',
      rows: 2,
      group: 'contact',
    }),
    defineField({
      name: 'towns',
      title: 'Communes desservies',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      group: 'contact',
    }),
    defineField({
      name: 'availability',
      title: 'Horaires ou disponibilités',
      description: 'Facultatif. Ex. « Du lundi au samedi, sur rendez-vous »',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Réseaux sociaux',
      type: 'array',
      group: 'contact',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'label',
              title: 'Nom',
              description: 'Ex. Facebook, Instagram',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Lien',
              type: 'url',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'seoDescription',
      title: 'Description du site dans Google',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (rule) =>
        rule.max(160).warning('Au-delà de 160 caractères, Google coupe la description.'),
    }),
    defineField({
      name: 'shareImage',
      title: 'Image de partage par défaut',
      description: 'Affichée quand le site est partagé (WhatsApp, Facebook…).',
      type: 'photo',
      group: 'seo',
    }),
  ],
  preview: {prepare: () => ({title: 'Paramètres du site'})},
})
