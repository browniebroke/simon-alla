import {escapeHTML, toHTML, uriLooksSafe} from '@portabletext/to-html'
import type {PortableTextBlock} from '@portabletext/types'

/** Renders rich text from Sanity to HTML. Links to other sites open in a new tab. */
export function renderRichText(blocks?: PortableTextBlock[]): string {
  if (!blocks?.length) return ''
  return toHTML(blocks, {
    components: {
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
