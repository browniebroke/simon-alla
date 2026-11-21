import {contactPage} from './documents/contactPage'
import {homePage} from './documents/homePage'
import {page} from './documents/page'
import {project} from './documents/project'
import {service} from './documents/service'
import {siteSettings} from './documents/siteSettings'
import {testimonial} from './documents/testimonial'
import {photo} from './objects/photo'
import {blockContent, pageContent} from './objects/richText'
import {seo} from './objects/seo'

export const schemaTypes = [
  // Objects
  photo,
  blockContent,
  pageContent,
  seo,
  // Single documents
  siteSettings,
  homePage,
  contactPage,
  // Collections
  service,
  project,
  testimonial,
  page,
]
