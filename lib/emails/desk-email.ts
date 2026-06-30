import { sendEmail } from "./client"

// Email de compra/acceso del Flowdex Desk. NO usa el template de la Academy
// (renderEmail): el Desk es su propio mundo visual (terminal, mono, triada),
// así que arma su propio HTML — el mismo diseño que el login del Desk. Lo único
// que comparte con la Academy es el logo (wordmark blanco) y el motor de envío.

const DESK_WORDMARK = "https://flowdex.com.ar/desk/flowdex-wordmark.png"
const DESK_URL = "https://desk.flowdex.com.ar"

function esc(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })
}

// "USD 12,00.-" — formato pedido por Franco (coma decimal + .- de cierre).
function formatUsd(amount: number): string {
  return `USD ${amount.toFixed(2).replace(".", ",")}.-`
}

export type DeskPurchaseEmailInput = {
  to: string
  fullName?: string | null
  packName: string
  credits: number
  // Días de pase del Radar de Dividendos incluidos en la compra (0 = ninguno).
  radarDays?: number
  amountUsd: number
  expiresAt: Date | string
  // Link de recovery para que la cuenta invisible elija su contraseña. Si es
  // null (usuario que ya tenía cuenta), el CTA entra directo al Desk.
  accessUrl?: string | null
}

export function renderDeskPurchaseEmail(input: DeskPurchaseEmailInput): { html: string; text: string } {
  const firstName = input.fullName?.trim().split(" ")[0] ?? null
  const expiresLabel = formatDate(input.expiresAt)
  const priceLabel = formatUsd(input.amountUsd)
  const c = input.credits
  const radarDays = input.radarDays ?? 0
  const radarUntilLabel = radarDays > 0
    ? formatDate(new Date(Date.now() + radarDays * 86400_000))
    : null
  // Línea principal según lo comprado: créditos, pase del Radar, o ambos.
  const headlineHtml = c > 0
    ? `Tenés <span style="color:#5BB8D4;font-weight:600;">${c} créditos</span> listos —son <span style="color:#fff;font-weight:600;">${c} Lecturas Flowdex completas</span>—${radarDays > 0 ? ` y el <span style="color:#D4B86A;font-weight:600;">Radar de Dividendos activo por ${radarDays} días</span>` : ""} para usar en el Desk.`
    : `Tenés el <span style="color:#D4B86A;font-weight:600;">Radar de Dividendos activo por ${radarDays} días</span>: cada pagador clasificado por la calidad de su dividendo, con la calculadora de renta y el análisis por agentes.`

  const accessBlock = input.accessUrl
    ? `
                  <p style="margin:0 0 10px 0;font-size:11px;letter-spacing:2px;color:#5BB8D4;font-family:ui-monospace,Menlo,Consolas,monospace;">TU ACCESO</p>
                  <p style="margin:0 0 14px 0;color:#b8b8b8;font-size:13.5px;line-height:1.7;">Creamos tu cuenta del Desk con <span style="color:#e6e6e6;">${esc(input.to)}</span>. Elegí tu contraseña y entrás directo.</p>
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td align="center" style="background-color:#5BB8D4;border-radius:8px;">
                        <a href="${esc(input.accessUrl)}" style="display:block;padding:14px;color:#04222c;font-size:15px;font-weight:700;text-decoration:none;">Crear mi contraseña y entrar</a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:10px 0 0 0;color:#777;font-size:11.5px;line-height:1.6;text-align:center;">Después entrás siempre en <span style="color:#9a9a9a;">desk.flowdex.com.ar</span>. No compartas este link con nadie.</p>`
    : `
                  <p style="margin:0 0 10px 0;font-size:11px;letter-spacing:2px;color:#5BB8D4;font-family:ui-monospace,Menlo,Consolas,monospace;">TU ACCESO</p>
                  <p style="margin:0 0 14px 0;color:#b8b8b8;font-size:13.5px;line-height:1.7;">Tu compra quedó en tu cuenta de siempre. Entrá con tu email y contraseña.</p>
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td align="center" style="background-color:#5BB8D4;border-radius:8px;">
                        <a href="${DESK_URL}" style="display:block;padding:14px;color:#04222c;font-size:15px;font-weight:700;text-decoration:none;">Entrar al Desk</a>
                      </td>
                    </tr>
                  </table>
                  <p style="margin:10px 0 0 0;color:#777;font-size:11.5px;line-height:1.6;text-align:center;">En <span style="color:#9a9a9a;">desk.flowdex.com.ar</span>.</p>`

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bienvenido a la mesa — Flowdex Desk</title>
</head>
<body style="margin:0;padding:0;background-color:#070707;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<div style="display:none;font-size:0;line-height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;">Tu ${esc(input.packName)} del Desk está activo — entrá y empezá a analizar.</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#070707;">
  <tr>
    <td align="center" style="padding:36px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;">
        <tr>
          <td style="background-color:#0b0b0b;border:1px solid #262626;border-radius:14px;overflow:hidden;">

            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td height="3" style="background-color:#5BB8D4;font-size:0;line-height:0;">&nbsp;</td>
                <td height="3" style="background-color:#7DD4C0;font-size:0;line-height:0;">&nbsp;</td>
                <td height="3" style="background-color:#D4B86A;font-size:0;line-height:0;">&nbsp;</td>
              </tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td align="center" style="padding:32px 38px 6px;">
                  <p style="margin:0 0 16px 0;font-size:11px;letter-spacing:3px;color:#5f5f5f;font-family:ui-monospace,Menlo,Consolas,monospace;">ACCESO · MÉTODO HECHO HERRAMIENTA</p>
                  <img src="${DESK_WORDMARK}" alt="Flowdex" width="190" style="display:block;margin:0 auto;width:190px;max-width:62%;height:auto;border:0;outline:none;text-decoration:none;" />
                  <p style="margin:6px 0 0 0;font-size:12px;font-weight:700;letter-spacing:9px;color:#5BB8D4;padding-left:9px;font-family:ui-monospace,Menlo,Consolas,monospace;">DESK</p>
                </td>
              </tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td align="center" style="padding:18px 38px 0;">
                  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;line-height:1.3;">${firstName ? `Bienvenido, ${esc(firstName)}.` : "Bienvenido a la mesa."}</h1>
                  <p style="margin:14px 0 0 0;color:#b8b8b8;font-size:14.5px;line-height:1.7;">${headlineHtml}</p>
                </td>
              </tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="padding:24px 38px 0;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0a0a0a;border:1px solid #262626;border-radius:10px;">
                    <tr>
                      <td style="padding:18px 20px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                          <tr>
                            <td style="color:#fff;font-size:15px;font-weight:700;">${esc(input.packName)}</td>
                            <td align="right" style="vertical-align:top;">
                              <div style="color:#5f5f5f;font-size:9.5px;letter-spacing:1.5px;font-family:ui-monospace,Menlo,Consolas,monospace;">TOTAL PAGADO</div>
                              <div style="color:#5BB8D4;font-size:19px;font-weight:800;margin-top:3px;">${priceLabel}</div>
                            </td>
                          </tr>
                        </table>
                        ${c > 0 ? `<p style="margin:6px 0 0 0;color:#9a9a9a;font-size:12.5px;">${c} créditos · ${c} lecturas completas</p>
                        <p style="margin:4px 0 0 0;color:#777;font-size:11.5px;">Vencen el ${expiresLabel}</p>` : ""}
                        ${radarUntilLabel ? `<p style="margin:6px 0 0 0;color:#cdbf9a;font-size:12.5px;">Radar de Dividendos · activo hasta el ${radarUntilLabel}</p>` : ""}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr><td style="padding:26px 38px 0;">${accessBlock}</td></tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr><td style="padding:30px 38px 0;"><div style="height:1px;background-color:#1c1c1c;"></div></td></tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="padding:16px 38px 0;">
                  <p style="margin:0 0 14px 0;font-size:11px;letter-spacing:2px;color:#5BB8D4;font-family:ui-monospace,Menlo,Consolas,monospace;">CÓMO SE USA</p>
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:14px;">
                    <tr>
                      <td valign="top" width="34"><div style="width:24px;height:24px;border-radius:50%;border:1px solid #2c2c2c;color:#5BB8D4;font-size:12px;font-weight:700;text-align:center;line-height:24px;">1</div></td>
                      <td style="color:#b8b8b8;font-size:13.5px;line-height:1.6;"><span style="color:#fff;font-weight:600;">Elegís un activo.</span> Acciones globales y argentinas, futuros, índices, divisas, CEDEARs o cripto.</td>
                    </tr>
                  </table>
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom:14px;">
                    <tr>
                      <td valign="top" width="34"><div style="width:24px;height:24px;border-radius:50%;border:1px solid #2c2c2c;color:#5BB8D4;font-size:12px;font-weight:700;text-align:center;line-height:24px;">2</div></td>
                      <td style="color:#b8b8b8;font-size:13.5px;line-height:1.6;"><span style="color:#fff;font-weight:600;">La mesa de 15 agentes lo analiza en vivo.</span> Datos, noticias, debate alcista contra bajista, comité de riesgo y verificación.</td>
                    </tr>
                  </table>
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td valign="top" width="34"><div style="width:24px;height:24px;border-radius:50%;border:1px solid #2c2c2c;color:#5BB8D4;font-size:12px;font-weight:700;text-align:center;line-height:24px;">3</div></td>
                      <td style="color:#b8b8b8;font-size:13.5px;line-height:1.6;"><span style="color:#fff;font-weight:600;">Recibís la Lectura Flowdex.</span> Un tablero auditable —negocio, valuación, riesgo y las 5 lentes—. Cada lectura usa 1 crédito. Nunca una orden de compra.</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="padding:26px 38px 0;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0e0d0a;border-left:2px solid #D4B86A;">
                    <tr>
                      <td style="padding:14px 18px;color:#cdbf9a;font-size:13px;line-height:1.7;">Sin señales, sin promesas de rentabilidad. El Desk te muestra el porqué; la decisión la tomás vos.</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td align="center" style="padding:22px 38px 0;">
                  <p style="margin:0;color:#888;font-size:12.5px;line-height:1.7;">¿Algo no anduvo o no te llega el acceso? <span style="color:#cdcdcd;font-weight:600;">Respondé este mail</span> —lo leemos— o escribinos a <span style="color:#5BB8D4;">flowdexacademy@flowdex.com.ar</span>.</p>
                </td>
              </tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td align="center" style="padding:24px 38px 26px;">
                  <div style="height:1px;background-color:#1c1c1c;margin-bottom:18px;"></div>
                  <p style="margin:0 0 14px 0;font-size:11px;color:#6a6a6a;">Este mail es tu comprobante de compra. Guardalo.</p>
                  <p style="margin:0;font-size:10.5px;letter-spacing:2px;color:#4a4a4a;font-family:ui-monospace,Menlo,Consolas,monospace;">FLOWDEX · INVESTMENT RESEARCH</p>
                  <p style="margin:10px 0 0 0;font-size:10.5px;color:#3a3a3a;line-height:1.6;">Contenido educativo, no asesoramiento financiero ni recomendación de compra/venta. Invertir conlleva riesgo de pérdida total del capital; los rendimientos pasados no garantizan rendimientos futuros.</p>
                  <p style="margin:12px 0 0 0;font-size:10.5px;color:#4a4a4a;">
                    <a href="https://flowdex.com.ar/legal/terminos" style="color:#5f5f5f;text-decoration:none;margin:0 5px;">Términos</a> ·
                    <a href="https://flowdex.com.ar/legal/privacidad" style="color:#5f5f5f;text-decoration:none;margin:0 5px;">Privacidad</a> ·
                    <a href="https://flowdex.com.ar/legal/reembolsos" style="color:#5f5f5f;text-decoration:none;margin:0 5px;">Reembolsos</a>
                  </p>
                  <p style="margin:9px 0 0 0;font-size:10px;color:#3a3a3a;">© ${new Date().getFullYear()} Flowdex™ — Contenido protegido por Ley 11.723</p>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`

  const text = [
    `Bienvenido a la mesa — Flowdex Desk`,
    ``,
    c > 0
      ? `Tenés ${c} créditos (${c} Lecturas Flowdex completas)${radarDays > 0 ? ` y el Radar de Dividendos por ${radarDays} días` : ""} listos para usar en el Desk.`
      : `Tenés el Radar de Dividendos activo por ${radarDays} días en el Desk.`,
    ``,
    `${input.packName} · ${priceLabel}${c > 0 ? ` · ${c} créditos · vencen el ${expiresLabel}` : ""}${radarUntilLabel ? ` · Radar hasta el ${radarUntilLabel}` : ""}`,
    ``,
    input.accessUrl
      ? `Creamos tu cuenta con ${input.to}. Elegí tu contraseña y entrá: ${input.accessUrl}`
      : `Los créditos quedaron en tu cuenta. Entrá al Desk: ${DESK_URL}`,
    ``,
    `Después entrás siempre en ${DESK_URL}`,
    ``,
    `¿Algo no anduvo? Respondé este mail o escribinos a flowdexacademy@flowdex.com.ar`,
    ``,
    `Flowdex — Contenido educativo, no asesoramiento financiero. Invertir conlleva riesgo de pérdida.`,
  ].join("\n")

  return { html, text }
}

export async function sendDeskPurchaseEmail(input: DeskPurchaseEmailInput): Promise<boolean> {
  const { html, text } = renderDeskPurchaseEmail(input)
  return sendEmail({
    to: input.to,
    subject: `Bienvenido a la mesa — tu ${input.packName} está activo`,
    html,
    text,
    tags: [{ name: "type", value: "desk_purchase" }],
  })
}
