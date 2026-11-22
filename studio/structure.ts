import type {StructureResolver} from 'sanity/structure'

/** Document types with exactly one document, whose ID is the type name. */
export const SINGLETON_TYPES = new Set(['homePage', 'contactPage', 'siteSettings'])

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.documentTypeListItem(type)
    .title(title)
    .child(S.document().schemaType(type).documentId(type).title(title))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      singleton(S, 'homePage', 'Accueil'),
      S.documentTypeListItem('service').title('Services'),
      S.documentTypeListItem('project').title('Réalisations'),
      S.documentTypeListItem('testimonial').title('Avis clients'),
      singleton(S, 'contactPage', 'Contact'),
      S.documentTypeListItem('page').title('Pages simples'),
      S.divider(),
      singleton(S, 'siteSettings', 'Paramètres du site'),
    ])
