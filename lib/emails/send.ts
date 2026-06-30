import { APP_URL, sendEmail } from "./client"
import { renderEmail } from "./render"

/**
 * Funciones de alto nivel para los 4 emails transaccionales de Flowdex.
 * Cada funcion arma su propio renderEmail y delega a sendEmail. Los
 * callers no necesitan saber nada de HTML ni de Resend.
 */

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function courseDisplayName(slug: string, fallback?: string): string {
  const map: Record<string, string> = {
    "kickstart-investment": "Kickstart Investment",
    "kickstart-trading": "Kickstart Trading",
    "expert-investment": "Expert Investment",
    "trading-lab": "Trading Lab",
    "inner-circle": "Inner Circle",
    membresia: "Membresía Inner Circle",
  }
  return map[slug] ?? fallback ?? slug
}

// ---------------------------------------------------------------------------
// 1) Confirmación de compra + bienvenida (un solo email)
// ---------------------------------------------------------------------------

export async function sendPurchaseConfirmation(input: {
  to: string
  firstName?: string | null
  courseSlug: string
  courseName?: string
  amountUsd: number
  expiresAt?: Date | string | null
  isInnerCircle?: boolean
  // Checkout exprés: link de recovery para que el comprador sin contraseña
  // (cuenta invisible creada al ordenar) elija su clave y entre. Si viene,
  // el CTA principal apunta acá en vez del dashboard.
  accessUrl?: string | null
}): Promise<boolean> {
  const courseName = courseDisplayName(input.courseSlug, input.courseName)
  const greeting = input.firstName ? `¡Bienvenido, ${input.firstName}!` : "¡Bienvenido!"
  const expiresLabel = input.expiresAt ? formatDate(input.expiresAt) : null

  const blocks: Array<
    | { type: "paragraph"; text: string }
    | { type: "highlight"; label: string; value: string }
    | { type: "list"; items: string[] }
    | { type: "callout"; text: string }
    | { type: "divider" }
  > = [
    { type: "paragraph", text: `Tu compra de ${courseName} está confirmada y ya tenés el acceso activo desde el panel.` },
    { type: "highlight", label: "Curso", value: courseName },
    { type: "highlight", label: "Inversión", value: `USD ${input.amountUsd.toFixed(2)}` },
  ]

  if (expiresLabel) {
    blocks.push({ type: "highlight", label: "Acceso hasta", value: expiresLabel })
  }

  blocks.push({ type: "divider" })
  blocks.push({
    type: "paragraph",
    text: "Dentro de tu panel vas a encontrar una guía completa, «Cómo usar el panel», que te lleva de la mano: por dónde empezar, cómo entrar a las comunidades, cómo avanzar los módulos y cómo agendar tus clases en vivo. Es lo primero que te recomendamos abrir.",
  })
  blocks.push({ type: "paragraph", text: "Mientras tanto, estos son los primeros tres pasos:" })
  blocks.push({
    type: "list",
    items: [
      "Leé la Filosofía Flowdex. Es la carta donde te contamos cómo trabajamos y qué podés esperar. Te da el mapa para todo lo demás.",
      "Entrá a las comunidades de Discord y Telegram desde el panel. El acceso es automático: el sistema te asigna el rol de tu curso.",
      "Abrí el primer módulo y arrancá. Avanzá en orden y marcá cada módulo como completado — eso es lo que habilita tus clases en vivo.",
    ],
  })

  if (input.isInnerCircle) {
    blocks.push({
      type: "callout",
      text: "Tenés el primer mes de membresía mensual sin costo. Acompañamos tu desarrollo en las reviews semanales con Franco y Augusto.",
    })
  }

  if (input.accessUrl) {
    blocks.push({
      type: "callout",
      text: `Creamos tu cuenta con este email (${input.to}). Tocá el botón de abajo para elegir tu contraseña y entrar al panel. Si el link venció, pedí uno nuevo desde ${APP_URL}/forgot-password — llega al instante.`,
    })
  }

  blocks.push({
    type: "paragraph",
    text: "Cualquier cosa que necesites, respondé este mail directamente — del otro lado te leemos nosotros.",
  })

  const { html, text } = renderEmail({
    preheader: `Tu acceso a ${courseName} está activo`,
    title: greeting,
    intro: "Gracias por confiar en nosotros. Tomaste una decisión de las que se notan con el tiempo, y a partir de acá no estás solo: te acompañamos en cada paso.",
    introAccent: "no estás solo",
    blocks,
    cta: input.accessUrl
      ? { href: input.accessUrl, label: "Crear mi contraseña y entrar" }
      : { href: `${APP_URL}/dashboard`, label: "Ir a mi panel" },
    secondaryCta: { href: `${APP_URL}/guia`, label: "Ver la guía" },
    signature: "franco",
    premium: input.isInnerCircle,
    logo: {
      src: "https://flowdex.com.ar/flowdex-community-transparent-clean.png",
      width: 240,
      alt: "Flowdex",
    },
  })

  return sendEmail({
    to: input.to,
    subject: `Bienvenido a Flowdex — tu acceso a ${courseName} está activo`,
    html,
    text,
    tags: [
      { name: "type", value: "purchase_confirmation" },
      { name: "course", value: input.courseSlug },
    ],
  })
}

// ---------------------------------------------------------------------------
// 2) Membresía por vencer (3 días antes)
// ---------------------------------------------------------------------------

export async function sendMembershipExpiringSoon(input: {
  to: string
  firstName?: string | null
  expiresAt: Date | string
}): Promise<boolean> {
  const dateLabel = formatDate(input.expiresAt)
  const greeting = input.firstName ? `Hola ${input.firstName}` : "Hola"

  const { html, text } = renderEmail({
    preheader: `Tu membresía vence el ${dateLabel}`,
    title: "Tu membresía vence en 3 días",
    intro: `${greeting}, te avisamos con tiempo para que decidas con tranquilidad.`,
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
    cta: { href: `${APP_URL}/dashboard`, label: "Renovar membresía" },
    signature: "team",
  })

  return sendEmail({
    to: input.to,
    subject: "Tu membresía vence en 3 días",
    html,
    text,
    tags: [{ name: "type", value: "membership_expiring" }],
  })
}

// ---------------------------------------------------------------------------
// 3) Curso por vencer (7 días antes)
// ---------------------------------------------------------------------------

export async function sendCourseExpiringSoon(input: {
  to: string
  firstName?: string | null
  courseSlug: string
  courseName?: string
  expiresAt: Date | string
  upgradeSlug?: string | null
  upgradeName?: string | null
}): Promise<boolean> {
  const courseName = courseDisplayName(input.courseSlug, input.courseName)
  const dateLabel = formatDate(input.expiresAt)
  const greeting = input.firstName ? `Hola ${input.firstName}` : "Hola"

  const blocks: Array<
    | { type: "paragraph"; text: string }
    | { type: "highlight"; label: string; value: string }
    | { type: "list"; items: string[] }
    | { type: "callout"; text: string }
    | { type: "divider" }
  > = [
    { type: "highlight", label: "Curso", value: courseName },
    { type: "highlight", label: "Vencimiento", value: dateLabel },
    {
      type: "paragraph",
      text: "Vencido el plazo, el acceso al contenido se interrumpe. Aprovechá los días que quedan para terminar lo que te falte y descargar lo que te interese guardar.",
    },
  ]

  let ctaHref = `${APP_URL}/dashboard`
  let ctaLabel = "Ir al dashboard"

  if (input.upgradeSlug && input.upgradeName) {
    blocks.push({ type: "divider" })
    blocks.push({
      type: "paragraph",
      text: `Si querés profundizar, ${input.upgradeName} es el siguiente paso natural. Como ya completaste ${courseName}, tenés el upgrade aplicado en tu cuenta.`,
    })
    ctaHref = `${APP_URL}/checkout/${input.upgradeSlug}`
    ctaLabel = `Ver ${input.upgradeName}`
  }

  const { html, text } = renderEmail({
    preheader: `Te quedan 7 días de acceso a ${courseName}`,
    title: `Te quedan 7 días en ${courseName}`,
    intro: `${greeting}, te avisamos con anticipación.`,
    blocks,
    cta: { href: ctaHref, label: ctaLabel },
    signature: "team",
  })

  return sendEmail({
    to: input.to,
    subject: `Te quedan 7 días en ${courseName}`,
    html,
    text,
    tags: [
      { name: "type", value: "course_expiring" },
      { name: "course", value: input.courseSlug },
    ],
  })
}

// ---------------------------------------------------------------------------
// 4.5) Programa Fundador: postulación recibida (confirmación inmediata)
// ---------------------------------------------------------------------------

export async function sendFounderApplicationReceived(input: {
  to: string
  firstName?: string | null
  programChoice: "kickstart-investment" | "kickstart-trading" | "either"
}): Promise<boolean> {
  const programLabel =
    input.programChoice === "kickstart-investment"
      ? "Kickstart Investment"
      : input.programChoice === "kickstart-trading"
      ? "Kickstart Trading"
      : "Cualquiera de los dos"

  const greeting = input.firstName ? `Hola ${input.firstName}` : "Hola"

  const { html, text } = renderEmail({
    preheader: "Recibimos tu postulación al programa fundador",
    title: "Recibimos tu postulación",
    intro: `${greeting}, tu postulación al programa fundador de Flowdex quedó registrada.`,
    blocks: [
      { type: "highlight", label: "Programa elegido", value: programLabel },
      { type: "highlight", label: "Anuncio de seleccionados", value: "Lunes 1 de junio, a la mañana" },
      {
        type: "paragraph",
        text: "Vamos a leer cada postulación. Si querés, repasá lo que mandaste durante la semana — si te das cuenta que querés agregar algo, escribinos por WhatsApp y lo sumamos.",
      },
      {
        type: "callout",
        text: "Convocamos a 20 personas para el grupo fundador. Si no quedás seleccionado, quedás en la lista para futuras promociones y oportunidades.",
      },
      {
        type: "paragraph",
        text: "Si quedás dentro de los 20, te mandamos email el lunes 1 de junio con los pasos para activar tu cuenta. Si no, también te avisamos.",
      },
    ],
    signature: "team",
  })

  return sendEmail({
    to: input.to,
    subject: "Recibimos tu postulación al programa fundador de Flowdex",
    html,
    text,
    tags: [
      { name: "type", value: "founder_application_received" },
      { name: "program", value: input.programChoice },
    ],
  })
}

// ---------------------------------------------------------------------------
// 4.6) Programa Fundador: postulación aceptada (entras a los 20)
// ---------------------------------------------------------------------------

export async function sendFounderApplicationAccepted(input: {
  to: string
  firstName?: string | null
  programSlug: "kickstart-investment" | "kickstart-trading"
  temporaryPassword?: string | null
}): Promise<boolean> {
  const programName = courseDisplayName(input.programSlug)
  const greeting = input.firstName ? `${input.firstName}` : "Hola"

  const blocks: Array<
    | { type: "paragraph"; text: string }
    | { type: "highlight"; label: string; value: string }
    | { type: "list"; items: string[] }
    | { type: "callout"; text: string }
    | { type: "divider" }
  > = [
    {
      type: "paragraph",
      text: "Flowdex empieza hoy, y estás adentro desde el primer día. Pocos van a poder decir que estuvieron en el grupo que lo arrancó. Vos sos uno de ellos.",
    },
    {
      type: "paragraph",
      text: "Recibimos 122 postulaciones. Estás dentro porque vimos algo en tu perfil que queríamos en este grupo. Sos de los primeros, y eso significa el seguimiento más directo: 26 personas, no cientos.",
    },
    { type: "highlight", label: "Tu programa", value: programName },
    { type: "highlight", label: "Email de acceso", value: input.to },
  ]

  if (input.temporaryPassword) {
    blocks.push({
      type: "highlight",
      label: "Contraseña temporal",
      value: input.temporaryPassword,
    })
    blocks.push({
      type: "callout",
      text: "Cambiala en tu primer ingreso al sitio.",
    })
  }

  blocks.push({ type: "divider" })
  blocks.push({ type: "paragraph", text: "Tres pasos para empezar:" })
  blocks.push({
    type: "list",
    items: [
      "Iniciá sesión en flowdex.com.ar con el email de arriba.",
      "Entrá al canal del programa en Telegram o Discord — el link está en tu dashboard.",
      "Presentate: tu nombre, de dónde venís y qué buscás. Ya tenemos al resto esperando.",
    ],
  })
  blocks.push({ type: "divider" })
  blocks.push({
    type: "paragraph",
    text: "Lo que recibís no es el acceso a un curso. Es una silla en la mesa donde empieza Flowdex. La mesa tiene 26 sillas. Una es tuya.",
  })
  blocks.push({
    type: "paragraph",
    text: "Tenés acceso completo a los cursos y a las clases en vivo. No es una promoción: es porque estuviste cuando había que estar.",
  })

  const { html, text } = renderEmail({
    preheader: "Pocas personas van a poder decir que estuvieron desde el principio.",
    title: `Bienvenido, ${greeting}.`,
    intro: "Día uno de Flowdex. Estás adentro.",
    blocks,
    cta: { href: `${APP_URL}/login`, label: "Iniciar sesión" },
    signature: "founders",
    premium: true,
    logo: {
      src: "https://flowdex.com.ar/flowdex-community-transparent-clean.png",
      width: 260,
      alt: "Flowdex Community",
    },
  })

  return sendEmail({
    to: input.to,
    subject: "Día uno de Flowdex. Estás adentro.",
    html,
    text,
    tags: [
      { name: "type", value: "founder_application_accepted" },
      { name: "program", value: input.programSlug },
    ],
  })
}

// ---------------------------------------------------------------------------
// 4.7) Programa Fundador: postulación rechazada
// ---------------------------------------------------------------------------

export async function sendFounderApplicationRejected(input: {
  to: string
  firstName?: string | null
}): Promise<boolean> {
  const greeting = input.firstName ? `Hola ${input.firstName}` : "Hola"

  const { html, text } = renderEmail({
    preheader: "Actualización sobre tu postulación al programa fundador",
    title: "Gracias por postularte",
    intro: `${greeting}, esta vez no quedaste dentro de los 20 elegidos.`,
    blocks: [
      {
        type: "paragraph",
        text: "Te lo decimos sin vueltas porque preferimos eso a no decir nada. La decisión no juzga tu interés ni tu compromiso: fueron 20 cupos y muchas postulaciones que valoramos.",
      },
      {
        type: "paragraph",
        text: "Quedás en nuestra lista. Cuando abramos próximas oportunidades, los que ya postularon van a tener prioridad.",
      },
      {
        type: "callout",
        text: "Mientras tanto, si querés arrancar igual, los cursos están disponibles en el sitio y podés sumarte cuando quieras.",
      },
    ],
    cta: { href: `${APP_URL}/cursos/kickstart-investment`, label: "Ver los cursos" },
    signature: "team",
  })

  return sendEmail({
    to: input.to,
    subject: "Sobre tu postulación al programa fundador de Flowdex",
    html,
    text,
    tags: [{ name: "type", value: "founder_application_rejected" }],
  })
}

// ---------------------------------------------------------------------------
// 4) Acceso revocado
// ---------------------------------------------------------------------------

export async function sendAccessRevoked(input: {
  to: string
  firstName?: string | null
  courseSlug: string
  courseName?: string
}): Promise<boolean> {
  const courseName = courseDisplayName(input.courseSlug, input.courseName)
  const greeting = input.firstName ? `Hola ${input.firstName}` : "Hola"

  const isMembership = input.courseSlug === "membresia"

  const blocks: Array<
    | { type: "paragraph"; text: string }
    | { type: "highlight"; label: string; value: string }
    | { type: "list"; items: string[] }
    | { type: "callout"; text: string }
    | { type: "divider" }
  > = []

  if (isMembership) {
    blocks.push({
      type: "paragraph",
      text: "Tu membresía mensual terminó. Mantenés acceso al contenido del Inner Circle por los meses que te queden contratados y seguís en la comunidad general de alumnos. Lo que se pausa son las reviews y sesiones in-depth con Franco y Augusto.",
    })
    blocks.push({
      type: "callout",
      text: "Si querés volver, podés reactivar la membresía cuando quieras desde el dashboard.",
    })
  } else {
    blocks.push({
      type: "paragraph",
      text: `Tu acceso a ${courseName} terminó hoy. Si te quedaron temas pendientes y querés extender el acceso, escribinos respondiendo a este mail y vemos cómo te ayudamos.`,
    })
  }

  const { html, text } = renderEmail({
    preheader: isMembership ? "Tu membresía mensual terminó" : `Tu acceso a ${courseName} terminó`,
    title: isMembership ? "Tu membresía mensual terminó" : `Tu acceso a ${courseName} terminó`,
    intro: `${greeting}, te avisamos para que tengas la información clara.`,
    blocks,
    cta: { href: `${APP_URL}/dashboard`, label: "Ir al dashboard" },
    signature: "team",
  })

  return sendEmail({
    to: input.to,
    subject: isMembership ? "Tu membresía mensual terminó" : `Tu acceso a ${courseName} terminó`,
    html,
    text,
    tags: [
      { name: "type", value: "access_revoked" },
      { name: "course", value: input.courseSlug },
    ],
  })
}

// ---------------------------------------------------------------------------
// 5) Re-enganche: alumno que entró pero frenó (ciclo semanal de 4 pasos)
// ---------------------------------------------------------------------------

type ReengageBlock =
  | { type: "paragraph"; text: string }
  | { type: "highlight"; label: string; value: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "divider" }

type ReengageContent = {
  subject: string
  preheader: string
  title: string
  intro: (greeting: string) => string
  blocks: ReengageBlock[]
  cta: { href: string; label: string }
  secondaryCta?: { href: string; label: string }
}

// Las 4 piezas del ciclo "inactivo". Cada una cambia el ángulo para que NO se
// sienta el mismo mail repetido cada semana: 1) pregunta honesta, 2) retomar es
// fácil, 3) la comunidad, 4) cierre sin culpa. Tono corto y personal.
const INACTIVE_STEPS: Record<number, ReengageContent> = {
  1: {
    subject: "¿Te quedaste trabado con algo?",
    preheader: "No es un mail automático cualquiera. Quiero la respuesta real.",
    title: "¿Algo te frenó?",
    intro: (g) => `${g}, arrancaste en Flowdex y hace unos días no volviste.`,
    blocks: [
      {
        type: "paragraph",
        text: "No te escribo de oficio: quiero saber qué pasó. ¿Algo no se entendió, te faltó tiempo, te trabaste en un módulo? Lo que sea.",
      },
      {
        type: "paragraph",
        text: "Respondé este mail y contame. Si hay algo para destrabar, lo destrabamos.",
      },
    ],
    cta: { href: `${APP_URL}/dashboard`, label: "Ir a mi panel" },
  },
  2: {
    subject: "Tu próximo módulo te está esperando",
    preheader: "Tu progreso quedó guardado. Retomar lleva menos de lo que pensás.",
    title: "Donde lo dejaste sigue ahí",
    intro: (g) => `${g}, no hace falta que recuperes nada ni que empieces de cero.`,
    blocks: [
      {
        type: "paragraph",
        text: "Abrí el panel, seguí por donde ibas y marcá el módulo cuando lo termines — eso es lo que te habilita las clases en vivo.",
      },
      {
        type: "paragraph",
        text: "Si te perdiste, la guía «Cómo usar el panel» te reordena en dos minutos.",
      },
      {
        type: "paragraph",
        text: "Y si tuviste algún problema o hay algo que no se entendió, respondé este mail y lo resolvemos.",
      },
    ],
    cta: { href: `${APP_URL}/dashboard`, label: "Ir a mi panel" },
    secondaryCta: { href: `${APP_URL}/guia`, label: "Ver la guía" },
  },
  3: {
    subject: "Mientras tanto, en la comunidad…",
    preheader: "Los que avanzan no lo hacen solos.",
    title: "No estudies solo",
    intro: (g) => `${g}, los que avanzan no lo hacen por fuerza de voluntad. Lo hacen acompañados.`,
    blocks: [
      {
        type: "paragraph",
        text: "En las comunidades de Discord y Telegram hay alumnos preguntando, compartiendo lo que les funciona y agendando sus clases en vivo. Entrar te cambia el ritmo.",
      },
      {
        type: "paragraph",
        text: "Tu acceso sigue activo. Cuando quieras, estás a un clic.",
      },
      {
        type: "paragraph",
        text: "¿Te trabó algo o tenés una duda? Respondé este mail y te ayudo.",
      },
    ],
    cta: { href: `${APP_URL}/dashboard`, label: "Ir a mi panel" },
  },
  4: {
    subject: "¿Seguimos o lo dejamos?",
    preheader: "El último recordatorio, sin vueltas.",
    title: "Última, sin vueltas",
    intro: (g) => `${g}, no te quiero llenar la casilla.`,
    blocks: [
      {
        type: "paragraph",
        text: "Este es el último recordatorio que te mando. Si es buen momento para retomar, tu acceso te espera. Si no, todo bien — cuando quieras volver, vas a saber dónde encontrarnos.",
      },
      {
        type: "paragraph",
        text: "Y si hubo algo que no funcionó o te decepcionó, te pido un favor: respondé y contame. Es la única forma que tengo de mejorarlo.",
      },
    ],
    cta: { href: `${APP_URL}/dashboard`, label: "Ir a mi panel" },
  },
}

// Las 2 piezas para quien registró cuenta y nunca entró.
const NEVER_ENTERED_STEPS: Record<number, ReengageContent> = {
  1: {
    subject: "Tu cuenta de Flowdex está lista (y sin estrenar)",
    preheader: "Todo lo que compraste ya está adentro, esperándote.",
    title: "Todavía no entraste",
    intro: (g) => `${g}, creaste tu cuenta hace unos días pero todavía no la abriste.`,
    blocks: [
      {
        type: "paragraph",
        text: "Todo lo que compraste ya está adentro. Iniciás sesión y arrancás cuando quieras — no hay nada que configurar.",
      },
      {
        type: "paragraph",
        text: "Lo primero que te recomiendo: la guía «Cómo usar el panel». Te lleva de la mano en dos minutos.",
      },
      {
        type: "paragraph",
        text: "Si tuviste algún problema para entrar o hay algo que no se entendió, respondé este mail y lo resolvemos.",
      },
    ],
    cta: { href: `${APP_URL}/login`, label: "Iniciar sesión" },
    secondaryCta: { href: `${APP_URL}/guia`, label: "Ver la guía" },
  },
  2: {
    subject: "Tu lugar en Flowdex sigue reservado",
    preheader: "El acceso no vence por no entrar.",
    title: "Tu lugar sigue ahí",
    intro: (g) => `${g}, pasaron unos días y tu cuenta sigue sin estrenar.`,
    blocks: [
      {
        type: "paragraph",
        text: "No pasa nada — el acceso no vence por no entrar. Pero el mejor momento para arrancar es siempre el mismo: ahora, diez minutos, el primer módulo.",
      },
      {
        type: "paragraph",
        text: "Si tuviste algún problema para iniciar sesión, o algo te frena antes de empezar, respondé este mail y te ayudo a entrar.",
      },
    ],
    cta: { href: `${APP_URL}/login`, label: "Iniciar sesión" },
  },
}

// Las 2 piezas para quien tiene curso activo pero no entró a NINGUNA de las
// dos comunidades (Discord ni Telegram). Si ya está en una, no se le manda
// nada: con una alcanza.
const COMMUNITY_STEPS: Record<number, ReengageContent> = {
  1: {
    subject: "Tu comunidad te está esperando",
    preheader: "Tu curso viene con comunidad privada y todavía no entraste.",
    title: "Te falta la comunidad",
    intro: (g) => `${g}, vimos que todavía no entraste a la comunidad privada de tu curso.`,
    blocks: [
      {
        type: "paragraph",
        text: "Cada curso tiene su espacio en Discord y Telegram: ahí los alumnos preguntan dudas, comparten avances y se acompañan entre clases. Estudiar acompañado cambia el ritmo.",
      },
      {
        type: "paragraph",
        text: "Entrar es automático: en tu panel está la sección «Acceso a Discord y Telegram». Tocás el botón y el sistema te asigna solo el rol de tu curso.",
      },
      {
        type: "paragraph",
        text: "No hace falta estar en las dos: algunos viven en Telegram, otros en Discord. Elegí la que más uses — con una alcanza.",
      },
    ],
    cta: { href: `${APP_URL}/dashboard#dashboard-comunidad`, label: "Ir a mis comunidades" },
  },
  2: {
    subject: "¿Telegram o Discord?",
    preheader: "Con entrar a una de las dos ya estás adentro.",
    title: "¿Telegram o Discord?",
    intro: (g) => `${g}, seguís sin estar en la comunidad de tu curso, y es de lo más valioso que incluye.`,
    blocks: [
      {
        type: "paragraph",
        text: "No es un canal de anuncios: es donde se destraba lo que estudiando solo no sale. Preguntas, debates, resultados de otros alumnos.",
      },
      {
        type: "paragraph",
        text: "Elegí la app que más te guste — hay gente que prefiere Telegram y gente que prefiere Discord. Con estar en una ya estás adentro; lo ideal es estar en ambas, pero no es obligación.",
      },
      {
        type: "paragraph",
        text: "Si tuviste algún problema para entrar, respondé este mail y lo resolvemos.",
      },
    ],
    cta: { href: `${APP_URL}/dashboard#dashboard-comunidad`, label: "Ir a mis comunidades" },
  },
}

async function sendReengagement(
  content: ReengageContent,
  input: { to: string; firstName?: string | null },
  tagType: string,
  step: number
): Promise<boolean> {
  const greeting = input.firstName ? `Hola ${input.firstName}` : "Hola"

  const { html, text } = renderEmail({
    preheader: content.preheader,
    title: content.title,
    intro: content.intro(greeting),
    blocks: content.blocks,
    cta: content.cta,
    secondaryCta: content.secondaryCta,
    signature: "franco",
    // Cierre más liviano que el "Un abrazo," global: estos mails van a gente
    // que quizás todavía no nos conoce, y "Te leo," además invita a responder.
    signatureClosing: "Te leo,",
    logo: {
      src: "https://flowdex.com.ar/flowdex-community-transparent-clean.png",
      width: 240,
      alt: "Flowdex",
    },
  })

  return sendEmail({
    to: input.to,
    subject: content.subject,
    html,
    text,
    tags: [
      { name: "type", value: tagType },
      { name: "step", value: String(step) },
    ],
  })
}

export async function sendReengagementInactive(input: {
  to: string
  firstName?: string | null
  step: number
}): Promise<boolean> {
  const content = INACTIVE_STEPS[input.step]
  if (!content) return false
  return sendReengagement(content, input, "reengagement_inactive", input.step)
}

export async function sendReengagementNeverEntered(input: {
  to: string
  firstName?: string | null
  step: number
}): Promise<boolean> {
  const content = NEVER_ENTERED_STEPS[input.step]
  if (!content) return false
  return sendReengagement(content, input, "reengagement_never_entered", input.step)
}

export async function sendReengagementCommunity(input: {
  to: string
  firstName?: string | null
  step: number
}): Promise<boolean> {
  const content = COMMUNITY_STEPS[input.step]
  if (!content) return false
  return sendReengagement(content, input, "reengagement_community", input.step)
}

// ---------------------------------------------------------------------------
// 6) Curso completado al 100% — felicitación + medalla + aviso de certificado
// ---------------------------------------------------------------------------

// Siguiente escalón del camino, para el remate del mail.
const COMPLETION_NEXT_STEP: Record<string, string> = {
  "kickstart-investment": "Expert Investment",
  "kickstart-trading": "Trading Lab",
  "expert-investment": "Inner Circle",
  "trading-lab": "Inner Circle",
}

export async function sendCourseCompleted(input: {
  to: string
  firstName?: string | null
  courseSlug: string
  courseName?: string
}): Promise<boolean> {
  const courseName = courseDisplayName(input.courseSlug, input.courseName)
  const title = input.firstName ? `¡Felicitaciones, ${input.firstName}!` : "¡Felicitaciones!"
  const nextStep = COMPLETION_NEXT_STEP[input.courseSlug] ?? null

  const blocks: Array<ReengageBlock> = [
    {
      type: "paragraph",
      text: "Cada módulo que marcaste, cada clase que tomaste, cada duda que destrabaste: todo eso te trajo hasta acá. Tomate un segundo y registralo, porque este logro es tuyo.",
    },
    { type: "highlight", label: "Curso completado", value: courseName },
    { type: "divider" },
    {
      type: "paragraph",
      text: "Tu medalla ya está desbloqueada en la sección «Tus medallas» de tu panel. Es tu credencial digital: descargala y compartila donde quieras — LinkedIn incluido. Te la ganaste.",
    },
    {
      type: "callout",
      text: "En los próximos días te llega a este mismo mail tu Certificado de Finalización Flowdex. Atento a la casilla.",
    },
  ]

  if (nextStep) {
    blocks.push({ type: "divider" })
    blocks.push({
      type: "paragraph",
      text: `¿Y ahora? El siguiente escalón del camino es ${nextStep}. Cuando quieras subir, te está esperando.`,
    })
  }

  const { html, text } = renderEmail({
    preheader: "Completaste el curso entero. Tu medalla ya está desbloqueada.",
    title,
    intro: `Completaste ${courseName} al 100%. Empezar lo hace cualquiera — terminar, no.`,
    introAccent: "al 100%",
    blocks,
    cta: { href: `${APP_URL}/dashboard`, label: "Ver mi medalla" },
    signature: "franco",
    // Marco dorado: el dorado es el código visual de las medallas/logros.
    premium: true,
  })

  return sendEmail({
    to: input.to,
    subject: `Lo lograste: completaste ${courseName}`,
    html,
    text,
    tags: [
      { name: "type", value: "course_completed" },
      { name: "course", value: input.courseSlug },
    ],
  })
}

// ---------------------------------------------------------------------------
// 7) Curso asignado manualmente desde el panel de admin
// ---------------------------------------------------------------------------

export async function sendCourseGranted(input: {
  to: string
  firstName?: string | null
  courseSlug: string
  courseName?: string
  expiresAt?: Date | string | null
}): Promise<boolean> {
  const courseName = courseDisplayName(input.courseSlug, input.courseName)
  const greeting = input.firstName ? `Hola ${input.firstName}` : "Hola"
  const expiresLabel = input.expiresAt ? formatDate(input.expiresAt) : null
  const isInnerCircle = input.courseSlug === "inner-circle"

  const blocks: Array<ReengageBlock> = [
    { type: "highlight", label: "Curso", value: courseName },
  ]

  if (expiresLabel) {
    blocks.push({ type: "highlight", label: "Acceso hasta", value: expiresLabel })
  }

  blocks.push({ type: "divider" })
  blocks.push({
    type: "paragraph",
    text: "Dentro de tu panel vas a encontrar una guía completa, «Cómo usar el panel», que te lleva de la mano: por dónde empezar, cómo entrar a las comunidades, cómo avanzar los módulos y cómo agendar tus clases en vivo. Es lo primero que te recomendamos abrir.",
  })
  blocks.push({ type: "paragraph", text: "Mientras tanto, estos son los primeros tres pasos:" })
  blocks.push({
    type: "list",
    items: [
      "Leé la Filosofía Flowdex. Es la carta donde te contamos cómo trabajamos y qué podés esperar. Te da el mapa para todo lo demás.",
      "Entrá a las comunidades de Discord y Telegram desde el panel. El acceso es automático: el sistema te asigna el rol de tu curso.",
      "Abrí el primer módulo y arrancá. Avanzá en orden y marcá cada módulo como completado — eso es lo que habilita tus clases en vivo.",
    ],
  })
  blocks.push({
    type: "paragraph",
    text: "Cualquier cosa que necesites, respondé este mail directamente — del otro lado te leemos nosotros.",
  })

  const { html, text } = renderEmail({
    preheader: `Tu acceso a ${courseName} ya está activo`,
    title: "Ya tenés acceso",
    intro: `${greeting}, te activamos el acceso a ${courseName}. Está todo listo en tu panel.`,
    introAccent: courseName,
    blocks,
    cta: { href: `${APP_URL}/dashboard`, label: "Ir a mi panel" },
    secondaryCta: { href: `${APP_URL}/guia`, label: "Ver la guía" },
    signature: "franco",
    premium: isInnerCircle,
  })

  return sendEmail({
    to: input.to,
    subject: `Ya tenés acceso a ${courseName}`,
    html,
    text,
    tags: [
      { name: "type", value: "course_granted" },
      { name: "course", value: input.courseSlug },
    ],
  })
}
