import {createImageUrlBuilder} from '@sanity/image-url'
import {client, type Photo} from './sanity'

const builder = createImageUrlBuilder(client)

/** Image URL from the Sanity CDN, cropped around the hotspot and served as WebP/AVIF. */
export function imageUrl(photo: Photo, width: number, height?: number): string {
  let image = builder.image(photo).width(width).auto('format').quality(80)
  if (height) image = image.height(height).fit('crop')
  return image.url()
}

/** `srcset` for responsive images; `ratio` = height / width, omit to keep the original ratio. */
export function srcSet(photo: Photo, widths: number[], ratio?: number): string {
  return widths
    .map((w) => `${imageUrl(photo, w, ratio ? Math.round(w * ratio) : undefined)} ${w}w`)
    .join(', ')
}

export const hasImage = (photo?: Photo): photo is Photo => Boolean(photo?.asset?._ref)
