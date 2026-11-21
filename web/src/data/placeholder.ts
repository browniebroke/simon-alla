/**
 * Flyer content, hard-coded for phase 2 (design). Phase 3 replaces this with
 * GROQ queries to Sanity, which holds the same content (see studio/scripts).
 */
export const site = {
  firstName: 'Simon',
  lastName: 'ALLA',
  tagline: 'L’atelier Pierre & Paysage',
  phone: '06 33 65 36 76',
  phoneHref: 'tel:+33633653676',
  email: 'simonalla9@gmail.com',
  // Logo already uploaded to Sanity by the seed script.
  logoUrl:
    'https://cdn.sanity.io/images/md9oxzrq/production/335183bd90b1267fe2ed4f44094b4f775bb3fc08-690x690.jpg',
}

/** Intro paragraphs; <strong> words show in green. */
export const intro = [
  'Spécialisé dans le travail de la <strong>pierre</strong> depuis de nombreuses années, je vous accompagne dans vos projets d’<strong>aménagement</strong> et de <strong>valorisation</strong> des espaces extérieurs, avec un savoir-faire <strong>artisanal</strong> et le souci du travail bien réalisé.',
  'J’interviens également dans l’<strong>entretien</strong> et l’aménagement des lieux de mémoire, avec soin, précision et respect des lieux.',
]

export const services = [
  {
    title: 'Débit & taille de pierre',
    summary:
      'Débit et taille de pierre à la main, avec un savoir-faire artisanal, pour des pièces adaptées à votre projet.',
  },
  {
    title: 'Petite maçonnerie',
    summary: 'Petits travaux de maçonnerie en pierre pour aménager et mettre en valeur vos extérieurs.',
  },
  {
    title: 'Aménagements paysagers',
    summary:
      'Aménagement et valorisation de vos jardins et espaces extérieurs, en harmonie avec la pierre.',
  },
  {
    title: 'Entretien et aménagement de tours de tombe',
    summary:
      'Entretien et aménagement des lieux de mémoire, avec soin, précision et respect des lieux.',
  },
]

export const cta = {
  title: 'Un projet ?',
  text: 'Parlez-moi de votre projet, je vous réponds rapidement.',
  buttonLabel: 'Me contacter',
}
