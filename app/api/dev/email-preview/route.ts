import { NextResponse } from "next/server"
import {
  sendPurchaseConfirmation,
  sendMembershipExpiringSoon,
  sendCourseExpiringSoon,
  sendAccessRevoked,
  sendFounderApplicationAccepted,
} from "@/lib/emails/send"
import { renderEmail } from "@/lib/emails/render"
import { limitBySlidingWindow } from "@/lib/security/rate-limit"

// Rate limit: 10 envíos cada 1 hora por IP. Si alguien filtra el CRON_SECRET,
// igual no puede spamear Resend infinitamente (consume quota gratuita).
const PREVIEW_WINDOW_MS = 60 * 60 * 1000
const PREVIEW_MAX_PER_IP = 10

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (!forwarded) return "unknown"
  return forwarded.split(",")[0]?.trim() || "unknown"
}

/**
 * Endpoint de utilidad para PREVIEW y TEST de los emails transaccionales.
 *
 * Modos:
 *   GET /api/dev/email-preview?type=purchase
 *     → devuelve HTML renderizado para ver en el browser
 *
 *   GET /api/dev/email-preview?type=purchase&send=true&to=tu@email.com
 *     → manda el email real via Resend
 *
 * Tipos soportados:
 *   - purchase           → confirmación de compra (Inner Circle de ejemplo)
 *   - membership-expiring → aviso de membresía a 3 días
 *   - course-expiring    → aviso de curso a 7 días (Kickstart Trading de ejemplo)
 *   - access-revoked     → aviso de acceso revocado (membresía de ejemplo)
 *
 * Seguridad:
 *   - En desarrollo: acceso libre.
 *   - En producción: requiere `?token=<CRON_SECRET>` o
 *     `Authorization: Bearer <CRON_SECRET>`.
 *
 * Este endpoint NO debe usarse para envíos reales a usuarios — solo para
 * verificar diseño y rendering en tu propio email.
 */

type PreviewType =
  | "purchase"
  | "membership-expiring"
  | "course-expiring"
  | "access-revoked"
  | "founder-accepted"

const SAMPLE_DATA = {
  purchase: {
    firstName: "Franco",
    courseSlug: "inner-circle",
    amountUsd: 399,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    isInnerCircle: true,
  },
  membershipExpiring: {
    firstName: "Franco",
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  courseExpiring: {
    firstName: "Franco",
    courseSlug: "kickstart-trading",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    upgradeSlug: "trading-lab",
    upgradeName: "Trading Lab",
  },
  accessRevoked: {
    firstName: "Franco",
    courseSlug: "membresia",
  },
  founderAccepted: {
    firstName: "Franco",
    programSlug: "kickstart-investment" as const,
    temporaryPassword: "Ab3xK9mPq2Rt",
  },
}

function isAuthorized(request: Request): boolean {
  if (process.env.NODE_ENV !== "production") return true

  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return false

  const url = new URL(request.url)
  const tokenFromQuery = url.searchParams.get("token")
  if (tokenFromQuery === cronSecret) return true

  const authHeader = request.headers.get("authorization") ?? ""
  return authHeader === `Bearer ${cronSecret}`
}

function buildPreviewHtml(type: PreviewType): string {
  if (type === "purchase") {
    const courseName = "Inner Circle"
    const formatDate = (d: string) =>
      new Date(d).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })

    const { html } = renderEmail({
      preheader: `Tu acceso a ${courseName} está activo`,
      title: `¡Bienvenido, ${SAMPLE_DATA.purchase.firstName}!`,
      intro: "Gracias por confiar en nosotros. Tomaste una decisión de las que se notan con el tiempo, y a partir de acá no estás solo: te acompañamos en cada paso.",
      introAccent: "no estás solo",
      blocks: [
        {
          type: "paragraph",
          text: `Tu compra de ${courseName} está confirmada y ya tenés el acceso activo desde el panel.`,
        },
        { type: "highlight", label: "Curso", value: courseName },
        { type: "highlight", label: "Inversión", value: `USD ${SAMPLE_DATA.purchase.amountUsd.toFixed(2)}` },
        { type: "highlight", label: "Acceso hasta", value: formatDate(SAMPLE_DATA.purchase.expiresAt) },
        { type: "divider" },
        {
          type: "paragraph",
          text: "Dentro de tu panel vas a encontrar una guía completa, «Cómo usar el panel», que te lleva de la mano: por dónde empezar, cómo entrar a las comunidades, cómo avanzar los módulos y cómo agendar tus clases en vivo. Es lo primero que te recomendamos abrir.",
        },
        { type: "paragraph", text: "Mientras tanto, estos son los primeros tres pasos:" },
        {
          type: "list",
          items: [
            "Leé la Filosofía Flowdex. Es la carta donde te contamos cómo trabajamos y qué podés esperar. Te da el mapa para todo lo demás.",
            "Entrá a las comunidades de Discord y Telegram desde el panel. El acceso es automático: el sistema te asigna el rol de tu curso.",
            "Abrí el primer módulo y arrancá. Avanzá en orden y marcá cada módulo como completado — eso es lo que habilita tus clases en vivo.",
          ],
        },
        {
          type: "callout",
          text: "Tenés el primer mes de membresía mensual sin costo. Acompañamos tu desarrollo en las reviews semanales con Franco y Augusto.",
        },
        {
          type: "paragraph",
          text: "Cualquier cosa que necesites, respondé este mail directamente — del otro lado te leemos nosotros.",
        },
      ],
      cta: { href: "https://flowdex.com.ar/dashboard", label: "Ir a mi panel" },
      secondaryCta: { href: "https://flowdex.com.ar/guia", label: "Ver la guía" },
      signature: "franco",
      premium: SAMPLE_DATA.purchase.isInnerCircle,
      logo: {
        src: "https://flowdex.com.ar/flowdex-community-transparent-clean.png",
        width: 240,
        alt: "Flowdex",
      },
    })
    return html
  }

  if (type === "membership-expiring") {
    const formatDate = (d: string) =>
      new Date(d).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })
    const dateLabel = formatDate(SAMPLE_DATA.membershipExpiring.expiresAt)
    const { html } = renderEmail({
      preheader: `Tu membresía vence el ${dateLabel}`,
      title: "Tu membresía vence en 3 días",
      intro: `Hola ${SAMPLE_DATA.membershipExpiring.firstName}, te avisamos con tiempo para que decidas con tranquilidad.`,
      blocks: [
        { type: "highlight", label: "Fecha de vencimiento", value: dateLabel },
        {
          type: "paragraph",
          text: "Si renovás, mantenés acceso a las reviews semanales y a las sesiones in-depth donde Franco y Augusto acompañan tu desarrollo como operador. Si no renovás, seguís con el contenido del Inner Circle por los meses que te queden y con la comunidad general de alumnos.",
        },
        {
          type: "callout",
          text: "Podés renovar tu membresía desde el dashboard cuando quieras. Si necesitás algo, respondé a este mail directamente y te contestamos.",
        },
      ],
      cta: { href: "https://flowdex.com.ar/dashboard", label: "Renovar membresía" },
      signature: "team",
    })
    return html
  }

  if (type === "course-expiring") {
    const formatDate = (d: string) =>
      new Date(d).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })
    const dateLabel = formatDate(SAMPLE_DATA.courseExpiring.expiresAt)
    const courseName = "Kickstart Trading"
    const upgradeName = SAMPLE_DATA.courseExpiring.upgradeName
    const { html } = renderEmail({
      preheader: `Te quedan 7 días de acceso a ${courseName}`,
      title: `Te quedan 7 días en ${courseName}`,
      intro: `Hola ${SAMPLE_DATA.courseExpiring.firstName}, te avisamos con anticipación.`,
      blocks: [
        { type: "highlight", label: "Curso", value: courseName },
        { type: "highlight", label: "Vencimiento", value: dateLabel },
        {
          type: "paragraph",
          text: "Vencido el plazo, el acceso al contenido se interrumpe. Aprovechá los días que quedan para terminar lo que te falte y descargar lo que te interese guardar.",
        },
        { type: "divider" },
        {
          type: "paragraph",
          text: `Si querés profundizar, ${upgradeName} es el siguiente paso natural. Como ya completaste ${courseName}, tenés el upgrade aplicado en tu cuenta.`,
        },
      ],
      cta: {
        href: `https://flowdex.com.ar/checkout/${SAMPLE_DATA.courseExpiring.upgradeSlug}`,
        label: `Ver ${upgradeName}`,
      },
      signature: "team",
    })
    return html
  }

  if (type === "founder-accepted") {
    const programName = "Kickstart Investment"
    const fa = SAMPLE_DATA.founderAccepted
    const { html } = renderEmail({
      preheader: "Pocas personas van a poder decir que estuvieron desde el principio.",
      title: `Bienvenido, ${fa.firstName}.`,
      intro: "Día uno de Flowdex. Estás adentro.",
      blocks: [
        {
          type: "paragraph",
          text: "Flowdex empieza hoy, y estás adentro desde el primer día. Pocos van a poder decir que estuvieron en el grupo que lo arrancó. Vos sos uno de ellos.",
        },
        {
          type: "paragraph",
          text: "Recibimos 122 postulaciones. Estás dentro porque vimos algo en tu perfil que queríamos en este grupo. Sos de los primeros, y eso significa el seguimiento más directo: 26 personas, no cientos.",
        },
        { type: "highlight", label: "Tu programa", value: programName },
        { type: "highlight", label: "Email de acceso", value: "martin@email.com" },
        { type: "highlight", label: "Contraseña temporal", value: fa.temporaryPassword },
        { type: "callout", text: "Cambiala en tu primer ingreso al sitio." },
        { type: "divider" },
        { type: "paragraph", text: "Tres pasos para empezar:" },
        {
          type: "list",
          items: [
            "Iniciá sesión en flowdex.com.ar con el email de arriba.",
            "Entrá al canal del programa en Telegram o Discord — el link está en tu dashboard.",
            "Presentate: tu nombre, de dónde venís y qué buscás. Ya tenemos al resto esperando.",
          ],
        },
        { type: "divider" },
        {
          type: "paragraph",
          text: "Lo que recibís no es el acceso a un curso. Es una silla en la mesa donde empieza Flowdex. La mesa tiene 26 sillas. Una es tuya.",
        },
        {
          type: "paragraph",
          text: "Tenés acceso completo a los cursos y a las clases en vivo. No es una promoción: es porque estuviste cuando había que estar.",
        },
      ],
      cta: { href: "https://flowdex.com.ar/login", label: "Iniciar sesión" },
      signature: "founders",
      premium: true,
      logo: {
        src: "https://flowdex.com.ar/flowdex-community-transparent-clean.png",
        width: 260,
        alt: "Flowdex Community",
      },
    })
    return html
  }

  // access-revoked
  const courseName = "Membresía Inner Circle"
  const { html } = renderEmail({
    preheader: "Tu membresía mensual terminó",
    title: "Tu membresía mensual terminó",
    intro: `Hola ${SAMPLE_DATA.accessRevoked.firstName}, te avisamos para que tengas la información clara.`,
    blocks: [
      {
        type: "paragraph",
        text: "Tu membresía mensual terminó. Mantenés acceso al contenido del Inner Circle por los meses que te queden contratados y seguís en la comunidad general de alumnos. Lo que se pausa son las reviews y sesiones in-depth con Franco y Augusto.",
      },
      {
        type: "callout",
        text: "Si querés volver, podés reactivar la membresía cuando quieras desde el dashboard.",
      },
    ],
    cta: { href: "https://flowdex.com.ar/dashboard", label: "Ir al dashboard" },
    signature: "team",
  })
  return html
}

async function sendSampleEmail(type: PreviewType, to: string): Promise<boolean> {
  if (type === "purchase") {
    return sendPurchaseConfirmation({ to, ...SAMPLE_DATA.purchase })
  }
  if (type === "membership-expiring") {
    return sendMembershipExpiringSoon({ to, ...SAMPLE_DATA.membershipExpiring })
  }
  if (type === "course-expiring") {
    return sendCourseExpiringSoon({ to, ...SAMPLE_DATA.courseExpiring })
  }
  if (type === "founder-accepted") {
    return sendFounderApplicationAccepted({ to, ...SAMPLE_DATA.founderAccepted })
  }
  return sendAccessRevoked({ to, ...SAMPLE_DATA.accessRevoked })
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  const url = new URL(request.url)
  const typeParam = url.searchParams.get("type") ?? "purchase"
  const shouldSend = url.searchParams.get("send") === "true"
  const to = url.searchParams.get("to")

  const validTypes: PreviewType[] = [
    "purchase",
    "membership-expiring",
    "course-expiring",
    "access-revoked",
    "founder-accepted",
  ]
  if (!validTypes.includes(typeParam as PreviewType)) {
    return NextResponse.json(
      {
        error: "Tipo inválido.",
        validTypes,
        examples: {
          preview: "/api/dev/email-preview?type=purchase",
          send: "/api/dev/email-preview?type=purchase&send=true&to=tu@email.com",
        },
      },
      { status: 400 }
    )
  }

  const type = typeParam as PreviewType

  if (shouldSend) {
    if (!to) {
      return NextResponse.json({ error: "Falta el parametro 'to'." }, { status: 400 })
    }

    // Rate limit solo sobre envíos reales (no sobre previews HTML).
    const rateLimit = await limitBySlidingWindow({
      key: getClientIp(request),
      prefix: "email-preview:send:ip",
      limit: PREVIEW_MAX_PER_IP,
      windowMs: PREVIEW_WINDOW_MS,
    })

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Demasiados envíos de prueba. Esperá una hora." },
        { status: 429 }
      )
    }

    const ok = await sendSampleEmail(type, to)
    return NextResponse.json({ ok, type, to })
  }

  const html = buildPreviewHtml(type)
  return new NextResponse(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  })
}
