"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { OrbitalIcon } from "@/components/OrbitalIcon"
import { Checkbox } from "@/components/ui/checkbox"
import type { CheckoutSyllabusSection } from "@/lib/courses/checkout-syllabus"

type Provider = "mercadopago" | "nowpayments" | "paypal"

type Course = {
  id: string
  name: string
  description: string
  price: number
  slug: string
}

type Props = {
  course: Course
  syllabusSections?: CheckoutSyllabusSection[]
  blockInfo?: {
    blocked: boolean
    message: string
    paths: Array<{
      key: "investment" | "trading"
      completed: boolean
      suggestedCourseSlug: string | null
      suggestedCourseUnlocked: boolean
    }>
  } | null
  upgradeApplied?: boolean
  upgradeDiscountAmount?: number
  initialPhone?: string
  // Checkout exprés: sin sesión, el form pide email + nombre y la cuenta se
  // crea invisible en /api/orders/create. El acceso llega por email post-pago.
  isGuest?: boolean
}

// Validación liviana de teléfono: dígitos, espacios, +, -, (), entre 6 y 20
// dígitos reales. No queremos rechazar formatos internacionales, solo basura.
function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "")
  if (digits.length < 6 || digits.length > 20) return false
  return /^[\d\s+()-]+$/.test(value.trim())
}

// Validación liviana de email (espejo de la del server en /api/orders/create).
function isValidEmail(value: string): boolean {
  const email = value.trim().toLowerCase()
  if (email.length < 5 || email.length > 254) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

// Marcas de pago como SVG inline. Dan referencia visual y confianza sin traer
// assets externos (cada pieza ajena rompe institutional feel). Versiones
// legibles sobre fondo oscuro.
function MercadoPagoMark() {
  // Isotipo oficial de Mercado Pago (SVG en /public/mercadopago.svg).
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/mercadopago.svg" alt="Mercado Pago" className="h-7 w-auto" />
}

function TetherMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" role="img" aria-label="USDT (Tether)">
      <circle cx="12" cy="12" r="12" fill="#26A17B" />
      {/* ₮ dibujado en paths: no depende de que la fuente tenga el glifo */}
      <rect x="5" y="6.4" width="14" height="2.7" rx="0.4" fill="#ffffff" />
      <rect x="10.65" y="6.4" width="2.7" height="11.2" rx="0.4" fill="#ffffff" />
      <rect x="7.5" y="10.8" width="9" height="2.3" rx="0.4" fill="#ffffff" />
    </svg>
  )
}

function VisaMark() {
  return (
    <svg viewBox="0 0 38 24" className="h-5 w-auto" role="img" aria-label="Visa">
      <rect width="38" height="24" rx="3" fill="#ffffff" fillOpacity="0.06" />
      <text
        x="19"
        y="16"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontStyle="italic"
        fontSize="11"
        letterSpacing="0.5"
        fill="#F4F4F4"
      >
        VISA
      </text>
    </svg>
  )
}

function MastercardMark() {
  return (
    <svg viewBox="0 0 38 24" className="h-5 w-auto" role="img" aria-label="Mastercard">
      <rect width="38" height="24" rx="3" fill="#ffffff" fillOpacity="0.06" />
      <circle cx="16" cy="12" r="6.5" fill="#EB001B" />
      <circle cx="23" cy="12" r="6.5" fill="#F79E1B" />
      <path d="M19.5 7.2a6.5 6.5 0 0 0 0 9.6 6.5 6.5 0 0 0 0-9.6Z" fill="#FF5F00" />
    </svg>
  )
}

function AmexMark() {
  return (
    <svg viewBox="0 0 38 24" className="h-5 w-auto" role="img" aria-label="American Express">
      <rect width="38" height="24" rx="3" fill="#1F72CF" />
      <text
        x="19"
        y="15.5"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="700"
        fontSize="7"
        letterSpacing="0.3"
        fill="#ffffff"
      >
        AMEX
      </text>
    </svg>
  )
}

function PayPalMark() {
  // Wordmark de dos azules (Pay #003087 · Pal #009cde): la marca más
  // reconocible de PayPal. tspan auto-posiciona, sin riesgo de solape.
  return (
    <svg viewBox="0 0 86 24" className="h-5 w-auto" role="img" aria-label="PayPal">
      <text
        x="0"
        y="18"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontStyle="italic"
        fontSize="20"
        letterSpacing="-0.5"
      >
        <tspan fill="#003087">Pay</tspan>
        <tspan fill="#009cde">Pal</tspan>
      </text>
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

const WHAT_INCLUDES = [
  "Acceso inmediato y de por vida al curso completo",
  "Examen final por módulo para validar tu avance",
  "Certificado de Finalización Flowdex + badge digital verificable",
  "Materiales y recursos descargables",
  "Comunidad privada en Telegram con contenido adicional",
]

// Slugs de cursos públicos que tienen página de detalle bajo /cursos/[slug].
// Inner Circle y la membresía viven en otra ruta y no aplican.
const COURSES_WITH_DETAIL_PAGE = new Set([
  "kickstart-investment",
  "expert-investment",
  "kickstart-trading",
  "trading-lab",
])

export function CheckoutClient({
  course,
  // syllabusSections sigue llegando del server para compatibilidad de tipos,
  // pero el checkout simplificado NO lo renderiza: ese contenido ya vive en
  // la página de detalle del curso (/cursos/[slug]). En checkout solo lo
  // necesario para confirmar y pagar (minimiza fricción y abandono).
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  syllabusSections: _syllabusSections = [],
  blockInfo,
  upgradeApplied = false,
  upgradeDiscountAmount = 0,
  initialPhone = "",
  isGuest = false,
}: Props) {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [acceptedLegal, setAcceptedLegal] = useState(false)
  const [phone, setPhone] = useState(initialPhone)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [emailConfirm, setEmailConfirm] = useState("")
  const [coupon, setCoupon] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isBlocked = Boolean(blockInfo?.blocked)
  const hasDetailPage = COURSES_WITH_DETAIL_PAGE.has(course.slug)

  const handleContinue = async () => {
    if (!selectedProvider || isLoading) return
    if (isGuest) {
      if (fullName.trim().length < 3) {
        setError("Ingresá tu nombre completo.")
        return
      }
      if (!isValidEmail(email)) {
        setError("Ingresá un email válido. Ahí te llega el acceso al curso.")
        return
      }
      // Plata real a una casilla mal tipeada no tiene vuelta atrás fácil:
      // confirmación obligatoria del email.
      if (email.trim().toLowerCase() !== emailConfirm.trim().toLowerCase()) {
        setError("Los emails no coinciden. Revisalos: ahí te llega el acceso.")
        return
      }
    }
    if (!isValidPhone(phone)) {
      setError("Ingresá un teléfono de contacto válido (con código de área).")
      return
    }
    if (!acceptedLegal) {
      setError("Debés aceptar Términos y Condiciones, Política de Privacidad y Política de Reembolsos para continuar.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Step 1: create order
      const orderRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug: course.slug,
          provider: selectedProvider,
          phone: phone.trim(),
          ...(coupon.trim() ? { coupon: coupon.trim() } : {}),
          ...(isGuest
            ? { email: email.trim().toLowerCase(), fullName: fullName.trim() }
            : {}),
        }),
      })

      const orderData = (await orderRes.json().catch(() => null)) as { orderId?: string; error?: string } | null

      if (!orderRes.ok || !orderData?.orderId) {
        setError(orderData?.error ?? "No se pudo iniciar el pago. Intentá de nuevo.")
        return
      }

      const { orderId } = orderData

      // Step 2: init provider payment
      if (selectedProvider === "mercadopago") {
        const prefRes = await fetch("/api/payments/mercadopago/preference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        })

        const prefData = (await prefRes.json().catch(() => null)) as { initPoint?: string; error?: string } | null

        if (!prefRes.ok || !prefData?.initPoint) {
          setError(prefData?.error ?? "No se pudo crear el pago en Mercado Pago.")
          return
        }

        window.location.assign(prefData.initPoint)
      } else if (selectedProvider === "paypal") {
        const ppRes = await fetch("/api/payments/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        })

        const ppData = (await ppRes.json().catch(() => null)) as { approveUrl?: string; error?: string } | null

        if (!ppRes.ok || !ppData?.approveUrl) {
          setError(ppData?.error ?? "No se pudo crear el pago en PayPal.")
          return
        }

        window.location.assign(ppData.approveUrl)
      } else {
        const invRes = await fetch("/api/payments/nowpayments/invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        })

        const invData = (await invRes.json().catch(() => null)) as { invoiceUrl?: string; error?: string } | null

        if (!invRes.ok || !invData?.invoiceUrl) {
          setError(invData?.error ?? "No se pudo crear el pago en NOWPayments.")
          return
        }

        window.location.assign(invData.invoiceUrl)
      }
    } catch {
      setError("Ocurrió un error inesperado. Intentá de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A] text-white">
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5">
        <OrbitalIcon size={700} animate />
      </div>

      <section className="relative z-10 mx-auto max-w-2xl px-4 py-24 sm:px-6">
        {/* Link de escape: solo para cursos con página de detalle.
            Va arriba del todo así no compite con el CTA y le da contexto
            al visitante que llegó acá sin haber pasado por /cursos/[slug]. */}
        {hasDetailPage && (
          <Link
            href={`/cursos/${course.slug}`}
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-[#7A7A7A] hover:text-[#CCCCCC] transition-colors"
          >
            <ArrowLeft size={13} />
            Volver a la página del curso
          </Link>
        )}

        {/* Header — minimalista: eyebrow + nombre del curso.
            La descripción larga se eliminó: en checkout no hace falta vender
            más, solo confirmar. La storytelling vive en /cursos/[slug]. */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#7DD4C0]">Checkout</p>
          <h1 className="mt-2 type-display-lg tracking-tight">
            {course.name.toUpperCase()}
          </h1>
          <p className="mt-3 text-sm text-[#888888]">
            Estás a un paso. Confirmá tu inscripción y empezás hoy mismo.
          </p>
        </div>

        {/* Course summary card */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          {upgradeApplied ? (
            <div className="mb-5 rounded-lg border border-[#7DD4C0]/30 bg-[#7DD4C0]/8 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-[#7DD4C0] font-semibold mb-1">
                Upgrade aplicado
              </p>
              <p className="text-sm text-[#D2EFE7]">
                Reconocemos tu compra previa de Kickstart: ${upgradeDiscountAmount.toFixed(2)} USD de descuento aplicados automáticamente.
              </p>
            </div>
          ) : null}
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs uppercase tracking-[0.18em] text-[#7DD4C0]">Lo que incluye</p>
            <div className="text-right">
              <p className="text-[11px] text-[#666666] uppercase tracking-widest">Precio</p>
              <div className="flex items-baseline justify-end gap-2">
                <p className="type-stat-md tracking-tight text-white">
                  ${course.price.toFixed(2)}{" "}
                  <span className="text-lg text-[#7DD4C0]">USD</span>
                </p>
              </div>
            </div>
          </div>
          <ul className="flex flex-col gap-2">
            {WHAT_INCLUDES.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-[#CCCCCC]">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#7DD4C0]/15 flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-[#7DD4C0]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {isBlocked && blockInfo ? (
          <div className="glass-card rounded-2xl p-6 mb-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[#7DD4C0] mb-3">Acceso bloqueado</p>
            <p className="text-sm text-[#D0D0D0] leading-relaxed mb-5">{blockInfo.message}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              {blockInfo.paths.map((path) => {
                const title = path.key === "investment" ? "Camino Inversiones" : "Camino Trading"
                const targetHref = path.suggestedCourseSlug
                  ? path.suggestedCourseUnlocked
                    ? `/courses/${path.suggestedCourseSlug}`
                    : `/checkout/${path.suggestedCourseSlug}`
                  : "/courses"

                if (path.completed) {
                  return (
                    <div
                      key={path.key}
                      className="rounded-xl border border-[#294D43] bg-[#143129]/40 px-4 py-3 text-center"
                    >
                      <p className="text-sm font-semibold text-[#AEEBDB]">{title}</p>
                      <p className="mt-1 text-xs text-[#8FD0BC]">Camino completado</p>
                    </div>
                  )
                }

                return (
                  <Link
                    key={path.key}
                    href={targetHref}
                    className="rounded-xl border border-[#2A2A2A] bg-[#111111] px-4 py-3 text-center transition-colors hover:border-[#5BB8D4]/45"
                  >
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 text-xs text-[#9CA4A7]">
                      {path.suggestedCourseUnlocked
                        ? "Ya lo tenés: te falta terminarlo"
                        : "Ir al checkout del camino"}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        ) : null}

        {/* Payment method selector */}
        {!isBlocked ? (
          <>
            {/* Datos de contacto: teléfono obligatorio para poder asistir al
                alumno (soporte, avisos). Se guarda en su perfil al crear la orden. */}
            <div className="glass-card rounded-2xl p-6 mb-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[#7DD4C0] mb-1">Datos de contacto</p>
              <p className="text-xs text-[#888888] mb-4">
                {isGuest
                  ? "Tu acceso al curso llega a este email apenas se acredita el pago. No hace falta registrarse antes."
                  : "Lo usamos solo para acompañarte y ayudarte si lo necesitás. No lo compartimos."}
              </p>

              {isGuest && (
                <div className="mb-4 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#CCCCCC]" htmlFor="fullName">
                      Nombre completo
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111] px-4 py-3 text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#7DD4C0]"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#CCCCCC]" htmlFor="email">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111] px-4 py-3 text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#7DD4C0]"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#CCCCCC]" htmlFor="emailConfirm">
                      Confirmá tu email
                    </label>
                    <input
                      id="emailConfirm"
                      name="emailConfirm"
                      type="email"
                      inputMode="email"
                      autoComplete="off"
                      required
                      value={emailConfirm}
                      onChange={(event) => setEmailConfirm(event.target.value)}
                      onPaste={(event) => event.preventDefault()}
                      className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111] px-4 py-3 text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#7DD4C0]"
                      placeholder="Repetilo, sin copiar y pegar"
                    />
                  </div>
                </div>
              )}

              <label className="mb-2 block text-sm font-medium text-[#CCCCCC]" htmlFor="phone">
                Teléfono / WhatsApp
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111] px-4 py-3 text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#7DD4C0]"
                placeholder="+54 9 11 1234 5678"
              />

              <label className="mb-2 mt-4 block text-sm font-medium text-[#CCCCCC]" htmlFor="coupon">
                Cupón de descuento (opcional)
              </label>
              <input
                id="coupon"
                name="coupon"
                type="text"
                autoComplete="off"
                value={coupon}
                onChange={(event) => setCoupon(event.target.value.toUpperCase())}
                className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111] px-4 py-3 uppercase text-white outline-none transition-colors placeholder:text-[#666666] focus:border-[#7DD4C0]"
                placeholder="Si tenés un cupón, va acá"
              />

              {isGuest && (
                <p className="mt-4 text-xs text-[#888888]">
                  ¿Ya tenés cuenta?{" "}
                  <Link
                    href={`/login?returnTo=/checkout/${course.slug}`}
                    className="text-[#7DD4C0] underline underline-offset-2 hover:text-[#AEEBDB]"
                  >
                    Iniciá sesión
                  </Link>
                  {course.slug === "expert-investment" || course.slug === "trading-lab"
                    ? " — si tenés el Kickstart activo, tu descuento de upgrade se aplica solo."
                    : " y la compra queda asociada a tu perfil."}
                </p>
              )}
            </div>

            <div className="glass-card rounded-2xl p-6 mb-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[#7DD4C0] mb-4">Método de pago</p>
              <div className="flex flex-col gap-3">
                {/* Mercado Pago */}
                <button
                  type="button"
                  onClick={() => setSelectedProvider("mercadopago")}
                  className={[
                    "w-full rounded-xl border p-4 text-left transition-all",
                    selectedProvider === "mercadopago"
                      ? "border-[#7DD4C0]/60 bg-[#7DD4C0]/5"
                      : "border-[#2A2A2A] bg-[#111111] hover:border-[#3A3A3A]",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        "flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                        selectedProvider === "mercadopago"
                          ? "border-[#7DD4C0]"
                          : "border-[#444444]",
                      ].join(" ")}
                    >
                      {selectedProvider === "mercadopago" && (
                        <div className="w-2 h-2 rounded-full bg-[#7DD4C0]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-white text-sm">Mercado Pago</p>
                        <MercadoPagoMark />
                      </div>
                      <p className="text-xs text-[#888888] mt-0.5">
                        Tarjeta argentina o transferencia. Cobro en pesos. Acreditación inmediata.
                      </p>
                      <div className="mt-2.5 flex items-center gap-1.5">
                        <VisaMark />
                        <MastercardMark />
                        <AmexMark />
                      </div>
                    </div>
                  </div>
                </button>

                {/* NOWPayments / USDT */}
                <button
                  type="button"
                  onClick={() => setSelectedProvider("nowpayments")}
                  className={[
                    "w-full rounded-xl border p-4 text-left transition-all",
                    selectedProvider === "nowpayments"
                      ? "border-[#5BB8D4]/60 bg-[#5BB8D4]/5"
                      : "border-[#2A2A2A] bg-[#111111] hover:border-[#3A3A3A]",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        "flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                        selectedProvider === "nowpayments"
                          ? "border-[#5BB8D4]"
                          : "border-[#444444]",
                      ].join(" ")}
                    >
                      {selectedProvider === "nowpayments" && (
                        <div className="w-2 h-2 rounded-full bg-[#5BB8D4]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-white text-sm">USDT (Cripto)</p>
                        <TetherMark />
                      </div>
                      <p className="text-xs text-[#888888] mt-0.5">
                        Pagás con USDT desde cualquier wallet. Red TRC-20 recomendada (fees bajos). Confirmación en 1-3 minutos.
                      </p>
                    </div>
                  </div>
                </button>

                {/* PayPal */}
                <button
                  type="button"
                  onClick={() => setSelectedProvider("paypal")}
                  className={[
                    "w-full rounded-xl border p-4 text-left transition-all",
                    selectedProvider === "paypal"
                      ? "border-[#D4B86A]/60 bg-[#D4B86A]/5"
                      : "border-[#2A2A2A] bg-[#111111] hover:border-[#3A3A3A]",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={[
                        "flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                        selectedProvider === "paypal"
                          ? "border-[#D4B86A]"
                          : "border-[#444444]",
                      ].join(" ")}
                    >
                      {selectedProvider === "paypal" && (
                        <div className="w-2 h-2 rounded-full bg-[#D4B86A]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-white text-sm">PayPal</p>
                        <PayPalMark />
                      </div>
                      <p className="text-xs text-[#888888] mt-0.5">
                        Pagás en USD con tu cuenta PayPal o tarjeta internacional. Ideal si tenés saldo en PayPal.
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="mb-5 rounded-xl border border-[#2A2A2A] bg-[#111111] px-4 py-3.5">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={acceptedLegal}
                  onCheckedChange={(checked) => setAcceptedLegal(checked === true)}
                  className="mt-0.5 border-[#3A3A3A] data-[state=checked]:bg-[#7DD4C0] data-[state=checked]:border-[#7DD4C0] data-[state=checked]:text-[#0A0A0A]"
                />
                <span className="text-xs sm:text-sm text-[#BBBBBB] leading-relaxed">
                  Acepto los{" "}
                  <Link href="/legal/terminos" target="_blank" className="ml-1 text-[#7DD4C0] hover:text-[#AEEBDB] underline underline-offset-2">
                    Términos y Condiciones
                  </Link>
                  {", la"}{" "}
                  <Link href="/legal/privacidad" target="_blank" className="ml-1 text-[#7DD4C0] hover:text-[#AEEBDB] underline underline-offset-2">
                    Política de Privacidad
                  </Link>
                  {" "}
                  {" y la "}
                  <Link href="/legal/reembolsos" target="_blank" className="ml-1 text-[#7DD4C0] hover:text-[#AEEBDB] underline underline-offset-2">
                    Política de Reembolsos
                  </Link>
                  .
                </span>
              </label>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={handleContinue}
              disabled={!selectedProvider || !acceptedLegal || !isValidPhone(phone) || isLoading}
              className={[
                "w-full rounded-xl px-6 py-4 type-headline tracking-widest transition-all",
                selectedProvider && acceptedLegal && isValidPhone(phone) && !isLoading
                  ? "bg-gradient-to-r from-[#5BB8D4] to-[#7DD4C0] text-[#0A0A0A] hover:opacity-90"
                  : "bg-[#1A1A1A] text-[#444444] cursor-not-allowed",
              ].join(" ")}
            >
              {isLoading ? (
                <span className="inline-flex items-center justify-center gap-2.5">
                  <Spinner />
                  PROCESANDO...
                </span>
              ) : (
                "CONTINUAR AL PAGO"
              )}
            </button>

            <p className="mt-4 text-center text-[11px] text-[#666666]">
              {isLoading
                ? "Te estamos llevando al pago seguro. No cierres ni recargues esta ventana."
                : "Pago procesado de forma segura. La aceptación legal es obligatoria para continuar."}
            </p>
          </>
        ) : (
          <p className="mt-2 text-center text-[11px] text-[#666666]">
            Este checkout se habilita automáticamente cuando completes uno de los caminos requeridos.
          </p>
        )}
      </section>
    </main>
  )
}
