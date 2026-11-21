import type {APIRoute} from 'astro'
import {env} from 'cloudflare:workers'
import {formatEmail, validateContact} from '../../lib/contact'
import {client} from '../../lib/sanity'

// The only route that runs on the Worker; every other page is static.
export const prerender = false

const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

type Result = {ok: true} | {ok: false; error: string; fields?: Record<string, string>}

export const POST: APIRoute = async ({request}) => {
  const wantsJson = request.headers.get('accept')?.includes('application/json') ?? false
  const reply = (result: Result, status = 200) =>
    wantsJson
      ? Response.json(result, {status})
      : Response.redirect(
          new URL(result.ok ? '/contact/merci/' : '/contact/?erreur=1#formulaire', request.url),
          303,
        )

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return reply({ok: false, error: 'Formulaire invalide.'}, 400)
  }

  // Honeypot: real visitors never see or fill this field. Pretend it worked.
  if (form.get('website')) return reply({ok: true})

  const validation = validateContact(form)
  if (!validation.ok) {
    return reply(
      {ok: false, error: 'Merci de corriger les champs indiqués.', fields: validation.errors},
      422,
    )
  }

  const human = await verifyTurnstile(
    String(form.get('cf-turnstile-response') ?? ''),
    request.headers.get('cf-connecting-ip'),
  )
  if (!human) {
    return reply(
      {ok: false, error: 'La vérification anti-robot a échoué. Rechargez la page et réessayez.'},
      403,
    )
  }

  const {subject, text, html} = formatEmail(validation.data)

  if (env.EMAIL_DRY_RUN === 'true') {
    console.log('[contact] EMAIL_DRY_RUN, not sending:\n' + subject + '\n\n' + text)
    return reply({ok: true})
  }

  const from = String(env.CONTACT_FROM_EMAIL)
  const to = await getRecipient()
  if (!from || !to) {
    console.error('[contact] CONTACT_FROM_EMAIL or recipient email is not configured')
    return reply(
      {
        ok: false,
        error:
          'Le formulaire est momentanément indisponible. Appelez-moi ou écrivez-moi directement.',
      },
      503,
    )
  }

  try {
    await env.EMAIL.send({
      to,
      from: {email: from, name: env.CONTACT_FROM_NAME},
      ...(validation.data.email && {replyTo: validation.data.email}),
      subject,
      text,
      html,
    })
  } catch (error) {
    console.error('[contact] sending failed', error)
    return reply(
      {ok: false, error: 'L’envoi a échoué. Réessayez, ou appelez-moi directement.'},
      502,
    )
  }

  return reply({ok: true})
}

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  if (!token || !env.TURNSTILE_SECRET_KEY) return false
  const body = new FormData()
  body.append('secret', env.TURNSTILE_SECRET_KEY)
  body.append('response', token)
  if (ip) body.append('remoteip', ip)
  try {
    const res = await fetch(TURNSTILE_VERIFY, {method: 'POST', body})
    const outcome = (await res.json()) as {success: boolean}
    return outcome.success
  } catch (error) {
    console.error('[contact] Turnstile verification failed', error)
    return false
  }
}

/** Address set in Sanity (Contact page), falling back to the site email. */
async function getRecipient(): Promise<string | null> {
  return client.fetch<string | null>(
    `coalesce(*[_id == "contactPage"][0].recipientEmail, *[_id == "siteSettings"][0].email)`,
  )
}
