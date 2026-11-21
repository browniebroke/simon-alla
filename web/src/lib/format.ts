/** "2026-05-14" -> "mai 2026" */
export function monthYear(date: string): string {
  return new Intl.DateTimeFormat('fr-FR', {month: 'long', year: 'numeric', timeZone: 'UTC'}).format(
    new Date(date),
  )
}

/** "06 33 65 36 76" -> "tel:+33633653676" */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '')
  return `tel:${digits.startsWith('0') ? `+33${digits.slice(1)}` : digits}`
}

/** "Simon Alla" -> ["Simon", "ALLA"], as on the flyer. */
export function splitName(name: string): [string, string] {
  const [first, ...rest] = name.trim().split(/\s+/)
  return [first ?? '', rest.join(' ').toUpperCase()]
}
