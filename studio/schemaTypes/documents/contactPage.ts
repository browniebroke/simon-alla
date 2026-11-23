import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {defineField, defineType} from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      initialValue: 'Contact',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'intro', title: 'Texte d’introduction', type: 'blockContent'}),
    defineField({
      name: 'recipientEmail',
      title: 'E-mail qui reçoit les messages du formulaire',
      description:
        'Si vide, l’adresse des paramètres du site est utilisée. Attention : l’adresse doit être vérifiée dans Cloudflare (Email Routing), sinon les messages ne seront pas envoyés.',
      type: 'string',
      validation: (rule) => rule.email().error('Adresse e-mail invalide.'),
    }),
    defineField({
      name: 'successMessage',
      title: 'Message de confirmation',
      description: 'Affiché après l’envoi du formulaire.',
      type: 'text',
      rows: 2,
      initialValue: 'Merci pour votre message, je vous recontacte rapidement.',
    }),
    defineField({name: 'seo', title: 'Référencement', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Contact'})},
})
