"use client"

import { useState } from "react"
import Link from "next/link"
import type { DeskPack } from "@/lib/payments/desk-packs"
import { DESK_CREDIT_EXPIRY_MONTHS } from "@/lib/payments/desk-packs"

type Provider = "mercadopago" | "nowpayments" | "paypal"

// Estilo clonado 1:1 del login del Desk (tradingagices_ar/webui/index.html, clases
// .fxa-*). El checkout vive en Next pero tiene que ser el MISMO mundo visual que el
// Desk, no la estética de la Academy. Prefijo dco- para no chocar con nada del sitio.
const CSS = `
.dco-overlay{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:#070707;overflow:hidden;font-family:'DM Sans',system-ui,sans-serif;color:#e6e6e6;padding:40px 16px}
.dco-mono{font-family:ui-monospace,'Cascadia Code',Menlo,Consolas,monospace}
.dco-bg{position:absolute;inset:0;z-index:0;pointer-events:none;
  background-image:radial-gradient(circle at 1px 1px, rgba(255,255,255,.035) 1px, transparent 0);
  background-size:34px 34px;
  -webkit-mask-image:radial-gradient(ellipse 70% 70% at 50% 50%, #000 40%, transparent 100%);
  mask-image:radial-gradient(ellipse 70% 70% at 50% 50%, #000 40%, transparent 100%)}
.dco-tape{position:absolute;left:0;right:0;z-index:0;white-space:nowrap;overflow:hidden;font-size:11px;color:#1c1c1c;letter-spacing:1px;user-select:none}
.dco-tape.top{top:18px}.dco-tape.bot{bottom:18px}
.dco-tape span{display:inline-block;padding-left:100%;animation:dco-marq 38s linear infinite}
.dco-tape.bot span{animation-duration:46s;animation-direction:reverse}
@keyframes dco-marq{0%{transform:translateX(0)}100%{transform:translateX(-100%)}}
.dco-card{position:relative;z-index:2;width:440px;max-width:94vw;background:#0d0d0d;border:1px solid #262626;
  border-radius:12px;padding:34px 30px 26px;text-align:center;box-shadow:0 30px 80px -30px rgba(0,0,0,.9)}
.dco-triada{position:absolute;top:0;left:24px;right:24px;height:2px;border-radius:2px;opacity:.9;
  background:linear-gradient(90deg,#5BB8D4 0 33%,#7DD4C0 33% 66%,#D4B86A 66% 100%)}
.dco-eyebrow{font-size:10.5px;letter-spacing:2.5px;color:#555;text-transform:uppercase;margin-bottom:18px}
.dco-cur{display:inline-block;width:7px;height:13px;background:#5BB8D4;margin-left:3px;vertical-align:-2px;animation:dco-blink 1.1s steps(1) infinite}
@keyframes dco-blink{50%{opacity:0}}
.dco-brand{display:flex;flex-direction:column;align-items:center;gap:8px;margin-bottom:6px}
.dco-wordmark{width:170px;max-width:70%;height:auto;opacity:.97}
.dco-desk{font-weight:800;letter-spacing:9px;font-size:13px;color:#5BB8D4;padding-left:9px;line-height:1}
.dco-sub{font-size:10.5px;color:#777;letter-spacing:1px;margin:14px 0 20px}
.dco-summary{text-align:left;border:1px solid #262626;border-radius:9px;background:#0a0a0a;padding:14px 16px;margin-bottom:20px}
.dco-sum-row{display:flex;align-items:baseline;justify-content:space-between}
.dco-sum-row span{font-size:15px;font-weight:700;color:#fff}
.dco-sum-row b{font-size:22px;font-weight:800;color:#5BB8D4;letter-spacing:.5px}
.dco-sum-sub{font-size:10.5px;color:#777;margin-top:2px}
.dco-sum-list{list-style:none;padding:12px 0 0;margin:12px 0 0;border-top:1px solid #1c1c1c;font-size:11px;color:#888;line-height:1.9}
.dco-field{margin-bottom:12px;text-align:left}
.dco-lab{display:block;font-size:9.5px;letter-spacing:1.5px;color:#555;text-transform:uppercase;margin:0 0 6px 2px}
.dco-inp{width:100%;background:#121212;border:1px solid #2c2c2c;border-radius:7px;color:#e6e6e6;
  padding:11px 13px;font-family:'DM Sans',system-ui,sans-serif;font-size:14px;outline:none;transition:.15s;box-sizing:border-box}
.dco-inp::placeholder{color:#444}
.dco-inp:focus{border-color:#5BB8D4;box-shadow:0 0 0 3px rgba(91,184,212,.12)}
.dco-paylab{display:block;font-size:9.5px;letter-spacing:1.5px;color:#555;text-transform:uppercase;margin:6px 0 8px 2px;text-align:left}
.dco-pay{width:100%;display:flex;align-items:center;gap:11px;text-align:left;background:#121212;border:1px solid #2c2c2c;
  border-radius:8px;padding:12px 13px;margin-bottom:9px;cursor:pointer;transition:.15s;color:#e6e6e6}
.dco-pay:hover{border-color:#3a3a3a}
.dco-pay .dot{flex:0 0 16px;width:16px;height:16px;border-radius:50%;border:2px solid #3a444d;display:flex;align-items:center;justify-content:center}
.dco-pay .dot i{width:8px;height:8px;border-radius:50%;display:none}
.dco-pay.sel .dot i{display:block}
.dco-pay .body{flex:1;min-width:0}
.dco-pay .ttl{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:13.5px;font-weight:700;color:#fff}
.dco-pay .desc{font-size:11px;color:#777;margin-top:2px}
.dco-btn{width:100%;border:none;border-radius:7px;padding:13px;font-family:'DM Sans',system-ui,sans-serif;
  font-size:14px;font-weight:700;cursor:pointer;transition:.15s;margin-top:8px}
.dco-btn.primary{background:#5BB8D4;color:#04222c}
.dco-btn.primary:hover{filter:brightness(1.08);box-shadow:0 0 22px -6px rgba(91,184,212,.5)}
.dco-btn.primary:disabled{opacity:.45;cursor:default;box-shadow:none;filter:none}
.dco-legal{display:flex;align-items:flex-start;gap:9px;text-align:left;font-size:11px;color:#888;
  border:1px solid #1c1c1c;border-radius:8px;padding:11px 13px;margin:14px 0 4px;line-height:1.6;cursor:pointer}
.dco-legal input{margin-top:2px;accent-color:#5BB8D4;width:15px;height:15px;flex:0 0 15px}
.dco-legal a{color:#5BB8D4;text-decoration:underline;text-underline-offset:2px}
.dco-msg{font-size:11.5px;min-height:15px;margin-top:12px;letter-spacing:.3px;color:#D4B86A}
.dco-msg.error{color:#ff7b72}
.dco-foot{margin-top:18px;font-size:9.5px;color:#3a3a3a;letter-spacing:1.5px}
.dco-note{font-size:10.5px;color:#5a636b;margin-top:12px}
`

function MercadoPagoMark() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/mercadopago.svg" alt="Mercado Pago" style={{ height: 22, width: "auto" }} />
}
function TetherMark() {
  return (
    <svg viewBox="0 0 24 24" style={{ height: 18, width: 18 }} role="img" aria-label="USDT">
      <circle cx="12" cy="12" r="12" fill="#26A17B" />
      <rect x="5" y="6.4" width="14" height="2.7" rx="0.4" fill="#fff" />
      <rect x="10.65" y="6.4" width="2.7" height="11.2" rx="0.4" fill="#fff" />
      <rect x="7.5" y="10.8" width="9" height="2.3" rx="0.4" fill="#fff" />
    </svg>
  )
}
function PayPalMark() {
  return (
    <svg viewBox="0 0 86 24" style={{ height: 15, width: "auto" }} role="img" aria-label="PayPal">
      <text x="0" y="18" fontFamily="Arial, sans-serif" fontWeight="700" fontStyle="italic" fontSize="20" letterSpacing="-0.5">
        <tspan fill="#94c2e8">Pay</tspan><tspan fill="#c7e3f5">Pal</tspan>
      </text>
    </svg>
  )
}

const PROVIDERS: Array<{ id: Provider; name: string; accent: string; desc: string; mark: React.ReactNode }> = [
  { id: "mercadopago", name: "Mercado Pago", accent: "#7DD4C0", desc: "Tarjeta o transferencia en pesos. Acreditación inmediata.", mark: <MercadoPagoMark /> },
  { id: "nowpayments", name: "USDT (Cripto)", accent: "#5BB8D4", desc: "Pagás con USDT desde cualquier wallet. Red TRC-20.", mark: <TetherMark /> },
  { id: "paypal", name: "PayPal", accent: "#D4B86A", desc: "En USD con tu cuenta PayPal o tarjeta internacional.", mark: <PayPalMark /> },
]

function isValidEmail(v: string) {
  const e = v.trim().toLowerCase()
  return e.length >= 5 && e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)
}
function isValidPhone(v: string) {
  const d = v.replace(/\D/g, "")
  return d.length >= 6 && d.length <= 20 && /^[\d\s+()-]+$/.test(v.trim())
}

export function DeskCheckoutClient({ pack, isGuest }: { pack: DeskPack; isGuest: boolean }) {
  const [provider, setProvider] = useState<Provider | null>(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [emailConfirm, setEmailConfirm] = useState("")
  const [phone, setPhone] = useState("")
  const [coupon, setCoupon] = useState("")
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePay = async () => {
    if (!provider || loading) return
    if (isGuest) {
      if (fullName.trim().length < 3) return setError("Ingresá tu nombre completo.")
      if (!isValidEmail(email)) return setError("Ingresá un email válido. Ahí te llega el acceso al Desk.")
      if (email.trim().toLowerCase() !== emailConfirm.trim().toLowerCase())
        return setError("Los emails no coinciden. Revisalos: ahí te llega el acceso.")
      if (!isValidPhone(phone)) return setError("Ingresá un teléfono de contacto válido.")
    }
    if (!accepted) return setError("Tenés que aceptar los términos para continuar.")

    setLoading(true)
    setError(null)
    try {
      const orderRes = await fetch("/api/desk/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pack: pack.id,
          provider,
          ...(coupon.trim() ? { coupon: coupon.trim() } : {}),
          ...(isGuest ? { email: email.trim().toLowerCase(), fullName: fullName.trim(), phone: phone.trim() } : {}),
        }),
      })
      const orderData = (await orderRes.json().catch(() => null)) as { deskOrderId?: string; error?: string } | null
      if (!orderRes.ok || !orderData?.deskOrderId) {
        setError(orderData?.error ?? "No se pudo iniciar el pago. Probá de nuevo.")
        return
      }
      const endpoint =
        provider === "mercadopago" ? "/api/desk/payments/mercadopago/preference"
          : provider === "paypal" ? "/api/desk/payments/paypal/create-order"
            : "/api/desk/payments/nowpayments/invoice"
      const payRes = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deskOrderId: orderData.deskOrderId }),
      })
      const payData = (await payRes.json().catch(() => null)) as
        | { initPoint?: string; approveUrl?: string; invoiceUrl?: string; error?: string }
        | null
      const url = payData?.initPoint ?? payData?.approveUrl ?? payData?.invoiceUrl
      if (!payRes.ok || !url) {
        setError(payData?.error ?? "No se pudo crear el pago. Probá de nuevo.")
        return
      }
      window.location.assign(url)
    } catch {
      setError("Ocurrió un error inesperado. Probá de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="dco-overlay">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="dco-bg" />
      <div className="dco-tape top dco-mono"><span>GGAL 1.528 ·  AAPL 224.31 ·  NVDA 132.04 ·  BTC 67,420 ·  CCL 1.527 ·  YPF 28.90 ·  SPY 541.2 ·  ES 5,488 ·  MELI 1,704 ·  </span></div>
      <div className="dco-tape bot dco-mono"><span>EURUSD 1.084 ·  MERV 1.62M ·  AL30 68.2 ·  TSLA 254.1 ·  AMD 162.5 ·  ETH 3,510 ·  DXY 104.2 ·  VIX 13.4 ·  </span></div>

      <form className="dco-card" autoComplete="on" onSubmit={(e) => e.preventDefault()}>
        <div className="dco-triada" />
        <div className="dco-eyebrow dco-mono">checkout<span className="dco-cur" /></div>
        <div className="dco-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="dco-wordmark" src="/desk/flowdex-wordmark.png" alt="Flowdex" />
          <div className="dco-desk">DESK</div>
        </div>
        <div className="dco-sub dco-mono">
          {pack.kind === "radar"
            ? `${pack.name.toLowerCase()}${pack.credits > 0 ? ` · +${pack.credits} análisis` : ""}`
            : `pack ${pack.name.toLowerCase()} · ${pack.credits} análisis`}
        </div>

        <div className="dco-summary">
          <div className="dco-sum-row">
            <span>
              {pack.kind === "radar"
                ? `Radar de Dividendos · ${pack.radarDays} días${pack.credits > 0 ? ` + ${pack.credits} análisis` : ""}`
                : `${pack.credits} análisis${pack.radarDays > 0 ? ` + Radar ${pack.radarDays} días` : ""}`}
            </span>
            <b>USD {pack.priceUsd}</b>
          </div>
          {pack.perAnalysis ? (
            <div className="dco-sum-sub dco-mono">USD {pack.perAnalysis} por análisis</div>
          ) : null}
          <ul className="dco-sum-list">
            {pack.radarDays > 0 && (
              <li>· Radar de Dividendos completo por {pack.radarDays} días: estados, rachas, calculadora y análisis por agentes.</li>
            )}
            {pack.credits > 0 && <li>· 1 crédito = 1 Lectura Flowdex completa.</li>}
            {pack.credits > 0 && <li>· Los créditos tienen {DESK_CREDIT_EXPIRY_MONTHS} meses de validez desde la compra.</li>}
            <li>· Sin suscripción. Nadie te cobra de nuevo sin que lo pidas.</li>
          </ul>
        </div>

        {isGuest && (
          <>
            <div className="dco-field">
              <label className="dco-lab dco-mono">Nombre completo</label>
              <input className="dco-inp" type="text" autoComplete="name" value={fullName}
                onChange={(e) => setFullName(e.target.value)} placeholder="Tu nombre" />
            </div>
            <div className="dco-field">
              <label className="dco-lab dco-mono">Email</label>
              <input className="dco-inp" type="email" inputMode="email" autoComplete="email" value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="vos@email.com" />
            </div>
            <div className="dco-field">
              <label className="dco-lab dco-mono">Confirmá tu email</label>
              <input className="dco-inp" type="email" inputMode="email" autoComplete="off" value={emailConfirm}
                onChange={(e) => setEmailConfirm(e.target.value)} onPaste={(e) => e.preventDefault()}
                placeholder="Repetilo, sin copiar y pegar" />
            </div>
            <div className="dco-field">
              <label className="dco-lab dco-mono">Teléfono / WhatsApp</label>
              <input className="dco-inp" type="tel" inputMode="tel" autoComplete="tel" value={phone}
                onChange={(e) => setPhone(e.target.value)} placeholder="+54 9 11 1234 5678" />
            </div>
          </>
        )}

        <div className="dco-field">
          <label className="dco-lab dco-mono">Cupón (opcional)</label>
          <input className="dco-inp dco-mono" type="text" autoComplete="off" value={coupon}
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
            placeholder="Si tenés un cupón, va acá" style={{ textTransform: "uppercase" }} />
          <p className="dco-note dco-mono" style={{ marginTop: 6 }}>
            Con un cupón válido sumás +2 análisis al comprar este pack.
          </p>
        </div>

        <label className="dco-paylab dco-mono">Método de pago</label>
        {PROVIDERS.map((p) => {
          const sel = provider === p.id
          return (
            <button key={p.id} type="button" onClick={() => setProvider(p.id)}
              className={`dco-pay${sel ? " sel" : ""}`}
              style={sel ? { borderColor: p.accent, background: `${p.accent}0F` } : undefined}>
              <span className="dot" style={sel ? { borderColor: p.accent } : undefined}>
                <i style={{ background: p.accent }} />
              </span>
              <span className="body">
                <span className="ttl">{p.name} {p.mark}</span>
                <span className="desc">{p.desc}</span>
              </span>
            </button>
          )
        })}

        <label className="dco-legal">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
          <span>
            Acepto los{" "}
            <Link href="/legal/terminos" target="_blank">Términos</Link>, la{" "}
            <Link href="/legal/privacidad" target="_blank">Privacidad</Link> y la{" "}
            <Link href="/legal/reembolsos" target="_blank">Política de Reembolsos</Link>.
          </span>
        </label>

        {error && <div className="dco-msg error dco-mono">{error}</div>}

        <button type="button" className="dco-btn primary" onClick={handlePay}
          disabled={!provider || !accepted || loading}>
          {loading ? "Procesando…" : "Ir al pago"}
        </button>

        {isGuest && (
          <p className="dco-note dco-mono">
            Tu acceso al Desk llega a ese email apenas se acredita el pago. No hace falta registrarse antes.
          </p>
        )}

        <div className="dco-foot dco-mono">FLOWDEX · INVESTMENT RESEARCH</div>
      </form>
    </main>
  )
}
