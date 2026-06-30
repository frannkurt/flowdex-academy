/**
 * Render de HTML para emails Flowdex.
 *
 * Mantengo el HTML simple, inline-styles, compatible con Gmail/Outlook/etc.
 * No uso React Email para evitar otra dependencia. La identidad visual
 * (paleta turquesa-celeste, mono para numeros, footer con direccion legal)
 * vive aca.
 */

export type EmailRenderInput = {
  preheader?: string
  title: string
  intro?: string
  /**
   * Acento de color opcional dentro del intro. Si se pasa, la subcadena que
   * coincida con `introAccent` se resalta en cyan (color de marca). Pensado
   * para darle golpe a una frase del subtítulo (ej. "Estás adentro.").
   */
  introAccent?: string
  /** Bloques de contenido HTML que van en el cuerpo, en orden. */
  blocks: Array<EmailBlock>
  cta?: {
    href: string
    label: string
  }
  /**
   * CTA secundario opcional, estilo outline (transparente con borde). Se
   * renderiza al lado del CTA principal. Pensado para un segundo destino de
   * menor jerarquía (ej. "Ver la guía" junto a "Ir a mi panel").
   */
  secondaryCta?: {
    href: string
    label: string
  }
  signature?: "franco" | "team" | "founders"
  /**
   * Cierre opcional para la firma de Franco (default "Un abrazo,"). Permite
   * que piezas puntuales (ej. re-enganche) usen un cierre más liviano como
   * "Te leo," sin tocar la firma global del resto de los mails.
   */
  signatureClosing?: string
  /**
   * Variante VIP del card: borde dorado fino + glow sutil. Reservado para
   * piezas premium puntuales (ej. bienvenida fundador). El dorado pleno sigue
   * siendo código de Inner Circle; acá se usa SOLO como hairline del marco,
   * nunca como relleno de botones.
   */
  premium?: boolean
  /**
   * Logo opcional como imagen hosteada (URL pública absoluta). Si se pasa,
   * reemplaza el wordmark de texto del header. Pensado para piezas puntuales
   * (ej. programa fundador → lockup "FLOWDEX COMMUNITY"). El resto de los
   * mails transaccionales sigue con el wordmark de texto por defecto.
   */
  logo?: {
    src: string
    /** Ancho en px del <img> en el mail. Alto va auto. */
    width: number
    alt: string
  }
}

export type EmailBlock =
  | { type: "paragraph"; text: string }
  | { type: "highlight"; label: string; value: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "divider" }

const COLORS = {
  bg: "#0A0A0A",
  surface: "#111316",
  surfaceAlt: "#0F1318",
  border: "#2A2A2A",
  text: "#E6E6E6",
  textMuted: "#9AA3AE",
  textFaint: "#6A6F7E",
  accentTurquoise: "#7DD4C0",
  accentCyan: "#5BB8D4",
  accentGold: "#D4B86A",
  white: "#FFFFFF",
}

// Logo por defecto de todos los mails (header). Se puede pisar por pieza vía
// `logo` en el input (ej. founders usa el lockup a 260px).
const DEFAULT_LOGO = {
  src: "https://flowdex.com.ar/flowdex-community-transparent-clean.png",
  width: 240,
  alt: "Flowdex",
}

const FOOTER_LINKS = [
  { label: "Términos", href: "https://flowdex.com.ar/legal/terminos" },
  { label: "Privacidad", href: "https://flowdex.com.ar/legal/privacidad" },
  { label: "Propiedad Intelectual", href: "https://flowdex.com.ar/legal/propiedad-intelectual" },
]

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function renderBlock(block: EmailBlock): string {
  switch (block.type) {
    case "paragraph":
      return `<p style="margin:0 0 16px 0;color:${COLORS.text};font-size:15px;line-height:1.6;">${escapeHtml(block.text)}</p>`
    case "highlight":
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 16px 0;">
          <tr>
            <td style="padding:14px 16px;background-color:${COLORS.surfaceAlt};border:1px solid ${COLORS.border};border-radius:10px;">
              <p style="margin:0;color:${COLORS.textMuted};font-size:11px;text-transform:uppercase;letter-spacing:1.5px;">${escapeHtml(block.label)}</p>
              <p style="margin:6px 0 0 0;color:${COLORS.accentTurquoise};font-size:20px;font-weight:600;">${escapeHtml(block.value)}</p>
            </td>
          </tr>
        </table>
      `
    case "list": {
      const lis = block.items
        .map(
          (item) =>
            `<li style="margin:0 0 8px 0;color:${COLORS.text};font-size:15px;line-height:1.6;">${escapeHtml(item)}</li>`
        )
        .join("")
      return `<ul style="margin:0 0 16px 0;padding:0 0 0 20px;">${lis}</ul>`
    }
    case "callout":
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 16px 0;">
          <tr>
            <td style="padding:14px 16px;background-color:#0E1A1F;border-left:3px solid ${COLORS.accentTurquoise};border-radius:8px;">
              <p style="margin:0;color:${COLORS.text};font-size:14px;line-height:1.6;">${escapeHtml(block.text)}</p>
            </td>
          </tr>
        </table>
      `
    case "divider":
      return `<div style="margin:24px 0;height:1px;background:linear-gradient(to right, ${COLORS.accentTurquoise}33, ${COLORS.border}, transparent);"></div>`
  }
}

function renderSignature(
  signature: EmailRenderInput["signature"],
  closing?: string
): string {
  if (signature === "founders") {
    // Firma doble Franco + Augusto, para piezas institucionales de fundación.
    // Nombres en dorado (toque VIP puntual), cargo compartido abajo.
    return `
      <p style="margin:24px 0 0 0;color:${COLORS.text};font-size:15px;line-height:1.6;">
        Nos vemos adentro.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0 0 0;">
        <tr>
          <td style="color:${COLORS.accentGold};font-size:16px;font-weight:600;letter-spacing:0.01em;white-space:nowrap;">
            Franco Escudero &nbsp;·&nbsp; Augusto Holman
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-top:2px;color:${COLORS.textMuted};font-size:13px;letter-spacing:0.02em;">
            Fundadores de Flowdex
          </td>
        </tr>
      </table>
    `
  }
  if (signature === "franco") {
    // Firma personal de Franco. Bloque a dos líneas con el nombre en dorado
    // (accent del Inner Circle, reservado acá como toque puntual de
    // institucionalidad — NO usar en el cuerpo de mails generales para
    // mantener la asociación dorado=IC). Cargo abajo en gris muted.
    return `
      <p style="margin:24px 0 0 0;color:${COLORS.text};font-size:15px;line-height:1.6;">
        ${escapeHtml(closing ?? "Un abrazo,")}
      </p>
      <p style="margin:10px 0 0 0;color:${COLORS.accentGold};font-size:16px;font-weight:600;letter-spacing:0.01em;">
        Franco Escudero
      </p>
      <p style="margin:2px 0 0 0;color:${COLORS.textMuted};font-size:13px;letter-spacing:0.02em;">
        Fundador de Flowdex
      </p>
    `
  }
  return `
    <p style="margin:24px 0 0 0;color:${COLORS.textMuted};font-size:13px;line-height:1.6;">
      — Equipo Flowdex
    </p>
  `
}

export function renderEmail(input: EmailRenderInput): { html: string; text: string } {
  const preheaderHtml = input.preheader
    ? `<div style="display:none;font-size:0;line-height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(input.preheader)}</div>`
    : ""

  const secondaryCtaCell = input.secondaryCta
    ? `
            <td style="width:12px;font-size:0;line-height:0;">&nbsp;</td>
            <td style="border:1px solid ${COLORS.border};border-radius:10px;">
              <a href="${input.secondaryCta.href}" style="display:inline-block;padding:12px 26px;color:${COLORS.text};font-size:15px;font-weight:600;text-decoration:none;letter-spacing:0.02em;">${escapeHtml(input.secondaryCta.label)}</a>
            </td>
    `
    : ""

  const ctaHtml = input.cta
    ? `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0 0;">
        <tr>
          <td style="background:linear-gradient(135deg, ${COLORS.accentCyan}, ${COLORS.accentTurquoise});border-radius:10px;">
            <a href="${input.cta.href}" style="display:inline-block;padding:13px 28px;color:#0A0A0A;font-size:15px;font-weight:600;text-decoration:none;letter-spacing:0.02em;">${escapeHtml(input.cta.label)}</a>
          </td>
${secondaryCtaCell}        </tr>
      </table>
    `
    : ""

  const blocksHtml = input.blocks.map(renderBlock).join("")
  let introInner = input.intro ? escapeHtml(input.intro) : ""
  if (input.intro && input.introAccent && input.intro.includes(input.introAccent)) {
    const accentHtml = `<span style="color:${COLORS.accentCyan};font-weight:600;">${escapeHtml(input.introAccent)}</span>`
    introInner = escapeHtml(input.intro).replace(escapeHtml(input.introAccent), accentHtml)
  }
  const introHtml = input.intro
    ? `<p style="margin:0 0 20px 0;color:${COLORS.textMuted};font-size:15px;line-height:1.6;">${introInner}</p>`
    : ""
  const signatureHtml = renderSignature(input.signature, input.signatureClosing)

  const footerLinksHtml = FOOTER_LINKS.map(
    (link) =>
      `<a href="${link.href}" style="color:${COLORS.textFaint};text-decoration:none;margin:0 6px;">${escapeHtml(link.label)}</a>`
  ).join(" · ")

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(input.title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${COLORS.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
${preheaderHtml}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${COLORS.bg};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;">

        <!-- Logo -->
        <tr>
          <td align="center" style="padding:0 0 24px 0;">
            ${(() => {
              const logo = input.logo ?? DEFAULT_LOGO
              return `<img src="${logo.src}" alt="${escapeHtml(logo.alt)}" width="${logo.width}" style="display:block;width:${logo.width}px;max-width:80%;height:auto;border:0;outline:none;text-decoration:none;" />`
            })()}
          </td>
        </tr>

        <!-- Card principal -->
        <tr>
          <td style="background-color:${COLORS.surface};border:1px solid ${input.premium ? `${COLORS.accentGold}59` : COLORS.border};border-radius:14px;padding:32px 28px;${input.premium ? `box-shadow:0 0 0 1px ${COLORS.accentGold}1A, 0 18px 60px rgba(0,0,0,0.45);` : ""}">
            <h1 style="margin:0 0 8px 0;color:${COLORS.white};font-size:24px;font-weight:600;line-height:1.3;">${escapeHtml(input.title)}</h1>
            ${introHtml}
            ${blocksHtml}
            ${ctaHtml}
            ${signatureHtml}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="padding:24px 12px 8px 12px;">
            <p style="margin:0 0 8px 0;font-size:11px;color:${COLORS.textFaint};">
              ${footerLinksHtml}
            </p>
            <p style="margin:0 0 4px 0;font-size:11px;color:${COLORS.textFaint};">
              <a href="https://flowdex.com.ar" style="color:${COLORS.textFaint};text-decoration:none;">flowdex.com.ar</a>
            </p>
            <p style="margin:0;font-size:10px;color:${COLORS.textFaint};">
              © ${new Date().getFullYear()} Flowdex™ — Contenido protegido por Ley 11.723
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`

  // Versión texto plano para clientes que no renderizan HTML.
  const textLines: string[] = []
  textLines.push(input.title)
  textLines.push("")
  if (input.intro) textLines.push(input.intro)
  for (const block of input.blocks) {
    if (block.type === "paragraph") textLines.push("", block.text)
    else if (block.type === "highlight") textLines.push("", `${block.label}: ${block.value}`)
    else if (block.type === "list") textLines.push("", ...block.items.map((item) => `- ${item}`))
    else if (block.type === "callout") textLines.push("", `> ${block.text}`)
  }
  if (input.cta) textLines.push("", `${input.cta.label}: ${input.cta.href}`)
  if (input.secondaryCta) textLines.push("", `${input.secondaryCta.label}: ${input.secondaryCta.href}`)
  textLines.push("", input.signature === "franco" ? "— Franco, Flowdex" : "— Equipo Flowdex")
  textLines.push("", "---")
  textLines.push(`Flowdex™ · https://flowdex.com.ar`)
  textLines.push(`© ${new Date().getFullYear()} — Contenido protegido por Ley 11.723`)

  return {
    html,
    text: textLines.join("\n"),
  }
}
