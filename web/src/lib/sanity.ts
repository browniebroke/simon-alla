import {createClient} from '@sanity/client'
import type {PortableTextBlock} from '@portabletext/types'

/**
 * Content is fetched at build time only: the dataset is public, so no token is needed.
 * A publish in the Studio triggers a rebuild (see docs/plan.html, section 7).
 */
export const client = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? 'md9oxzrq',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2025-01-01',
  useCdn: false,
  perspective: 'published',
})

// ---------------------------------------------------------------------------
// Types (mirror studio/schemaTypes)
// ---------------------------------------------------------------------------

export interface Photo {
  _type: 'photo'
  asset?: {_ref: string}
  hotspot?: {x: number; y: number; height: number; width: number}
  crop?: {top: number; bottom: number; left: number; right: number}
  alt?: string
}

export interface Seo {
  title?: string
  description?: string
  image?: Photo
}

export interface SiteSettings {
  name: string
  tagline?: string
  logo?: Photo
  phone: string
  email: string
  city?: string
  serviceArea?: string
  towns?: string[]
  availability?: string
  socialLinks?: {label: string; url: string}[]
  seoDescription?: string
  shareImage?: Photo
  pages: {title: string; slug: string}[]
}

export interface ServiceSummary {
  _id: string
  title: string
  slug: string
  summary: string
  coverImage?: Photo
}

export interface Service extends ServiceSummary {
  body?: PortableTextBlock[]
  gallery?: Photo[]
  seo?: Seo
  projects: ProjectSummary[]
}

export interface ProjectSummary {
  _id: string
  title: string
  slug: string
  date: string
  town?: string
  coverImage: Photo
  service?: {title: string; slug: string}
}

export interface Project extends ProjectSummary {
  gallery?: Photo[]
  beforeAfter?: {before?: Photo; after?: Photo}
  description?: PortableTextBlock[]
  seo?: Seo
}

export interface HomePage {
  heroTitle?: string
  heroSubtitle?: string
  heroBackground?: Photo
  heroPhoto?: Photo
  intro?: PortableTextBlock[]
  servicesTitle?: string
  services: ServiceSummary[]
  projects: ProjectSummary[]
  cta?: {title?: string; text?: string; buttonLabel?: string}
  seo?: Seo
}

export interface ContactPage {
  title: string
  intro?: PortableTextBlock[]
  successMessage?: string
  seo?: Seo
}

export interface SimplePage {
  title: string
  slug: string
  body?: PortableTextBlock[]
  seo?: Seo
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

const serviceSummary = `_id, title, "slug": slug.current, summary, coverImage`
const projectSummary = `_id, title, "slug": slug.current, date, town, coverImage,
  "service": service->{title, "slug": slug.current}`
const servicesOrdered = `*[_type == "service" && defined(slug.current)] | order(order asc, title asc)`
const projectsByDate = `*[_type == "project" && defined(slug.current)] | order(date desc)`

let settingsPromise: Promise<SiteSettings> | undefined

/** Site settings are used on every page: fetch them once per build. */
export function getSettings(): Promise<SiteSettings> {
  settingsPromise ??= client
    .fetch<SiteSettings | null>(
      `*[_id == "siteSettings"][0]{
        ...,
        "pages": *[_type == "page" && defined(slug.current)] | order(title asc){title, "slug": slug.current}
      }`,
    )
    .then((settings) => {
      if (!settings) throw new Error('Missing "siteSettings" document in Sanity.')
      return settings
    })
  return settingsPromise
}

export async function getHomePage(): Promise<HomePage> {
  const home = await client.fetch<HomePage | null>(
    `*[_id == "homePage"][0]{
      ...,
      "services": select(
        count(featuredServices) > 0 => featuredServices[]->{${serviceSummary}},
        ${servicesOrdered}{${serviceSummary}}
      ),
      "projects": select(
        count(featuredProjects) > 0 => featuredProjects[]->{${projectSummary}},
        ${projectsByDate}[0...6]{${projectSummary}}
      )
    }`,
  )
  if (!home) throw new Error('Missing "homePage" document in Sanity.')
  return home
}

export function getServices(): Promise<ServiceSummary[]> {
  return client.fetch(`${servicesOrdered}{${serviceSummary}}`)
}

export function getServicesFull(): Promise<Service[]> {
  return client.fetch(
    `${servicesOrdered}{
      ${serviceSummary}, body, gallery, seo,
      "projects": *[_type == "project" && service._ref == ^._id && defined(slug.current)] | order(date desc){${projectSummary}}
    }`,
  )
}

export function getProjects(): Promise<ProjectSummary[]> {
  return client.fetch(`${projectsByDate}{${projectSummary}}`)
}

export function getProjectsFull(): Promise<Project[]> {
  return client.fetch(`${projectsByDate}{${projectSummary}, gallery, beforeAfter, description, seo}`)
}

export async function getContactPage(): Promise<ContactPage> {
  const page = await client.fetch<ContactPage | null>(`*[_id == "contactPage"][0]`)
  return page ?? {title: 'Contact'}
}

export function getSimplePages(): Promise<SimplePage[]> {
  return client.fetch(`*[_type == "page" && defined(slug.current)]{title, "slug": slug.current, body, seo}`)
}
