/**
 * Seeds the dataset with the content of the printed flyer and business card.
 *
 *   npx sanity exec scripts/seed-flyer-content.ts --with-user-token
 *
 * Only creates documents that don't exist yet (createIfNotExists), so it is safe
 * to re-run and never overwrites edits made in the Studio.
 */
import {existsSync, createReadStream} from 'node:fs'
import {resolve} from 'node:path'
import {randomUUID} from 'node:crypto'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2025-01-01'})
const LOGO_PATH = resolve(process.cwd(), '../assets/logo.jpeg')

const key = () => randomUUID().slice(0, 12)

/** One portable-text paragraph; words wrapped in **double stars** become bold. */
function paragraph(text: string) {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: text
      .split(/(\*\*[^*]+\*\*)/)
      .filter(Boolean)
      .map((part) => {
        const bold = part.startsWith('**') && part.endsWith('**')
        return {
          _type: 'span',
          _key: key(),
          text: bold ? part.slice(2, -2) : part,
          marks: bold ? ['strong'] : [],
        }
      }),
  }
}

const services = [
  {
    slug: 'debit-taille-de-pierre',
    title: 'Débit & taille de pierre',
    summary:
      'Débit et taille de pierre à la main, avec un savoir-faire artisanal, pour des pièces adaptées à votre projet.',
  },
  {
    slug: 'petite-maconnerie',
    title: 'Petite maçonnerie',
    summary:
      'Petits travaux de maçonnerie en pierre pour aménager et mettre en valeur vos extérieurs.',
  },
  {
    slug: 'amenagements-paysagers',
    title: 'Aménagements paysagers',
    summary:
      'Aménagement et valorisation de vos jardins et espaces extérieurs, en harmonie avec la pierre.',
  },
  {
    slug: 'entretien-amenagement-tours-de-tombe',
    title: 'Entretien et aménagement de tours de tombe',
    summary:
      'Entretien et aménagement des lieux de mémoire, avec soin, précision et respect des lieux.',
  },
]

async function uploadLogo() {
  if (!existsSync(LOGO_PATH)) {
    console.warn(`Logo not found at ${LOGO_PATH}, skipping.`)
    return undefined
  }
  const asset = await client.assets.upload('image', createReadStream(LOGO_PATH), {
    filename: 'logo.jpeg',
  })
  return {
    _type: 'photo',
    asset: {_type: 'reference', _ref: asset._id},
    alt: 'Logo : marteau et ciseau de tailleur de pierre sur un bloc de pierre',
  }
}

async function main() {
  const ids = [
    'siteSettings',
    ...services.map((s) => `service-${s.slug}`),
    'homePage',
    'contactPage',
  ]
  const existing = new Set(await client.fetch<string[]>('*[_id in $ids]._id', {ids}))
  const missing = ids.filter((id) => !existing.has(id))
  const dataset = client.config().dataset

  if (missing.length === 0) {
    console.log(`Nothing to do: all ${ids.length} documents already exist in ${dataset}.`)
    return
  }

  const tx = client.transaction()

  tx.createIfNotExists({
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: 'Simon Alla',
    tagline: 'L’atelier Pierre & Paysage',
    logo: missing.includes('siteSettings') ? await uploadLogo() : undefined,
    phone: '06 33 65 36 76',
    email: 'simonalla9@gmail.com',
    seoDescription:
      'Simon Alla, artisan de la pierre : débit et taille de pierre, petite maçonnerie, aménagements paysagers et entretien de tours de tombe.',
  })

  for (const [index, s] of services.entries()) {
    tx.createIfNotExists({
      _id: `service-${s.slug}`,
      _type: 'service',
      title: s.title,
      slug: {_type: 'slug', current: s.slug},
      summary: s.summary,
      order: index + 1,
    })
  }

  tx.createIfNotExists({
    _id: 'homePage',
    _type: 'homePage',
    intro: [
      paragraph(
        'Spécialisé dans le travail de la **pierre** depuis de nombreuses années, je vous accompagne dans vos projets d’**aménagement** et de **valorisation** des espaces extérieurs, avec un savoir-faire **artisanal** et le souci du travail bien réalisé.',
      ),
      paragraph(
        'J’interviens également dans l’**entretien** et l’aménagement des lieux de mémoire, avec soin, précision et respect des lieux.',
      ),
    ],
    servicesTitle: 'Les services',
    featuredServices: services.map((s) => ({
      _type: 'reference',
      _key: key(),
      _ref: `service-${s.slug}`,
    })),
    cta: {
      title: 'Un projet ?',
      text: 'Parlez-moi de votre projet, je vous réponds rapidement.',
      buttonLabel: 'Me contacter',
    },
  })

  tx.createIfNotExists({
    _id: 'contactPage',
    _type: 'contactPage',
    title: 'Contact',
    intro: [
      paragraph(
        'Pour toute demande, appelez-moi ou laissez-moi un message avec le formulaire ci-dessous.',
      ),
    ],
    successMessage: 'Merci pour votre message, je vous recontacte rapidement.',
  })

  await tx.commit()
  console.log(`Created ${missing.length} document(s) in ${dataset}: ${missing.join(', ')}.`)
  if (existing.size > 0) {
    console.log(`Skipped ${existing.size} existing document(s): ${[...existing].join(', ')}.`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
