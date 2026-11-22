import {escapeHTML, toHTML, uriLooksSafe} from '@portabletext/to-html'
import type {PortableTextBlock} from '@portabletext/types'
import {frenchSpacing} from './format'

/**
 * Renders rich text from Sanity to HTML, with French spacing before : ; ? !
 * Links to other sites open in a new tab.
 */
export function renderRichText(blocks?: PortableTextBlock[]): string {
  if (!blocks?.length) return ''
  return toHTML(blocks, {
    components: {
      // Plain text goes through here: apply French spacing before escaping.
      escapeHTML: (text) => escapeHTML(frenchSpacing(text)),
      marks: {
        link: ({children, value}) => {
          const href: string = value?.href ?? ''
          if (!uriLooksSafe(href)) return children
          const external = /^https?:\/\//.test(href)
          const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : ''
          return `<a href="${escapeHTML(href)}"${attrs}>${children}</a>`
        },
      },
    },
  })
}
