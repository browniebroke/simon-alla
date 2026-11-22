import {telHref} from './format'
import {hasImage, imageUrl} from './image'
import type {ServiceSummary, SiteSettings} from './sanity'

/**
 * schema.org description of the business for search engines (JSON-LD), built from the
 * site settings and services in Sanity. Empty fields are left out.
 */
export function businessJsonLd(settings: SiteSettings, services: ServiceSummary[], site: URL) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': new URL('/#entreprise', site).href,
    name: settings.name,
    alternateName: settings.tagline,
    description: settings.seoDescription,
    url: site.href,
    telephone: telHref(settings.phone).replace(/^tel:/, ''),
    email: settings.email,
    logo: hasImage(settings.logo) ? imageUrl(settings.logo, 512, 512) : undefined,
    image: hasImage(settings.shareImage) ? imageUrl(settings.shareImage, 1200, 630) : undefined,
    address: settings.city
      ? {'@type': 'PostalAddress', addressLocality: settings.city, addressCountry: 'FR'}
      : undefined,
    areaServed: settings.towns?.length
      ? settings.towns.map((name) => ({'@type': 'City', name}))
      : settings.serviceArea,
    sameAs: settings.socialLinks?.map((link) => link.url),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.title,
          description: service.summary,
          url: new URL(`/services/${service.slug}/`, site).href,
        },
      })),
    },
  }
  // Drop empty values, and escape "<" so the JSON can't close the <script> tag.
  return JSON.stringify(data, (_key, value) =>
    value === undefined || value === '' || (Array.isArray(value) && value.length === 0)
      ? undefined
      : value,
  ).replace(/</g, '\\u003c')
}
