/** Contact form: validation and email formatting, shared by the endpoint. */

export interface ContactMessage {
  name: string
  email: string
  phone: string
  town: string
  projectType: string
  message: string
}

const LIMITS: Record<keyof ContactMessage, number> = {
  name: 100,
  email: 200,
  phone: 30,
  town: 100,
  projectType: 100,
  message: 5000,
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^[+\d][\d\s.()-]{7,}$/

export type ValidationResult =
  | {ok: true; data: ContactMessage}
  | {ok: false; errors: Partial<Record<keyof ContactMessage, string>>}

export function validateContact(form: FormData): ValidationResult {
  const data = Object.fromEntries(
    (Object.keys(LIMITS) as (keyof ContactMessage)[]).map((key) => [
      key,
      String(form.get(key) ?? '')
        .trim()
        .slice(0, LIMITS[key]),
    ]),
  ) as unknown as ContactMessage

  const errors: Partial<Record<keyof ContactMessage, string>> = {}
  if (!data.name) errors.name = 'Indiquez votre nom.'
  if (data.message.length < 10) errors.message = 'Décrivez votre demande en quelques mots.'
  if (!data.email && !data.phone) errors.email = 'Indiquez un e-mail ou un téléphone pour vous répondre.'
  if (data.email && !EMAIL.test(data.email)) errors.email = 'Adresse e-mail invalide.'
  if (data.phone && !PHONE.test(data.phone)) errors.phone = 'Numéro de téléphone invalide.'

  return Object.keys(errors).length > 0 ? {ok: false, errors} : {ok: true, data}
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]!)

export function formatEmail(m: ContactMessage) {
  const rows: [string, string][] = [
    ['Nom', m.name],
    ['E-mail', m.email],
    ['Téléphone', m.phone],
    ['Commune', m.town],
    ['Type de projet', m.projectType],
  ].filter((row): row is [string, string] => Boolean(row[1]))

  const subject = `Nouveau message du site : ${m.name}${m.projectType ? ` (${m.projectType})` : ''}`
  const text = [...rows.map(([k, v]) => `${k} : ${v}`), '', m.message].join('\n')
  const html = `
    <table cellpadding="4" style="font-family:sans-serif;font-size:15px">
      ${rows.map(([k, v]) => `<tr><td style="color:#56604e">${k}</td><td><strong>${escape(v)}</strong></td></tr>`).join('')}
    </table>
    <p style="font-family:sans-serif;font-size:15px;white-space:pre-wrap">${escape(m.message)}</p>
    <p style="font-family:sans-serif;font-size:13px;color:#56604e">Envoyé depuis le formulaire de contact du site.${m.email ? ' Répondez directement à cet e-mail pour écrire à la personne.' : ''}</p>`
  return {subject, text, html}
}
