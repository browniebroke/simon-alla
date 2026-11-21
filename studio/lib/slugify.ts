/**
 * French-friendly slugs: "Débit & taille de pierre" -> "debit-taille-de-pierre".
 * Sanity's default slugify keeps accents and punctuation.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}
