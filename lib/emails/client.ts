import { Resend } from "resend"

/**
 * Cliente Resend perezoso (solo se instancia si hay API key).
 *
 * Fail seguro: si no hay API key, si EMAILS_ENABLED=false, o si Resend
 * tira error, la funcion sendEmail devuelve false y loguea, pero NO tira
 * excepcion. Esto es importante porque los emails se disparan dentro de
 * webhooks de pago: si Resend falla, NO queremos romper el grant de la
 * compra. Mejor un alumno sin email de confirmacion que un alumno que pago
 * y no recibe acceso.
 */

let cachedClient: Resend | null = null

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  if (cachedClient) return cachedClient
  cachedClient = new Resend(apiKey)
  return cachedClient
}

function emailsEnabled(): boolean {
  if (process.env.EMAILS_ENABLED === "false") return false
  return Boolean(process.env.RESEND_API_KEY)
}

// "hola@" en lugar de "no-reply@": invitamos a responder en casi todos los
// mails, y un remitente humano mejora confianza y deliverability (Resend
// Insights marca "no-reply" como antipatrón). Para enviar no hace falta que
// la casilla exista — las respuestas van al Reply-To de abajo.
export const EMAIL_FROM =
  process.env.EMAIL_FROM ?? "Flowdex <hola@flowdex.com.ar>"
export const EMAIL_REPLY_TO =
  process.env.EMAIL_REPLY_TO ?? "flowdexacademy@flowdex.com.ar"
export const APP_URL = process.env.APP_URL ?? "https://flowdex.com.ar"

export type SendEmailInput = {
  to: string
  subject: string
  html: string
  text?: string
  replyTo?: string
  tags?: Array<{ name: string; value: string }>
}

export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  if (!emailsEnabled()) {
    console.log("[emails] disabled, skip", { to: input.to, subject: input.subject })
    return false
  }

  const client = getResendClient()
  if (!client) {
    console.warn("[emails] no resend client")
    return false
  }

  // Reintento: los mails transaccionales (confirmacion de compra, etc.) se
  // disparan fire-and-forget dentro de los webhooks de pago. Antes, un hipo
  // puntual de Resend (timeout, 5xx) perdia el mail sin reintento. Hasta 3
  // intentos con backoff corto para garantizar entrega. Preferimos un posible
  // mail duplicado a un mail que no llega. Sigue sin tirar excepcion nunca.
  const MAX_ATTEMPTS = 3
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const { data, error } = await client.emails.send({
        from: EMAIL_FROM,
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
        replyTo: input.replyTo ?? EMAIL_REPLY_TO,
        tags: input.tags,
      })

      if (!error) {
        console.log("[emails] sent", { id: data?.id, attempt, to: input.to, subject: input.subject })
        return true
      }

      console.error("[emails] resend error", { error, attempt, to: input.to, subject: input.subject })
    } catch (err) {
      console.error("[emails] unexpected error", { err, attempt, to: input.to })
    }

    // Backoff antes del proximo intento (600ms, 1200ms). No demora el camino OK.
    if (attempt < MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 600))
    }
  }

  console.error("[emails] all attempts failed", { to: input.to, subject: input.subject })
  return false
}
