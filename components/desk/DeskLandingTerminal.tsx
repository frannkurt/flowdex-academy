"use client"

// Landing de venta DEFAULT de Flowdex Desk (/desk). Híbrido ganador:
// estructura de conversión (CTA + demo above the fold, hero en 2 columnas,
// sticky CTA mobile) + theme del login del Desk hosteado (fondo #070707 con
// grilla de puntos, mono, triada, botones sólidos #5BB8D4).
//
// NOTA (decisión 2026-06-10): esta página es LA EXCEPCIÓN a las reglas
// visuales de la Academy — acá manda el marketing. Títulos propios más
// chicos y densos que los tokens type-display-*. Lo que no se relaja:
// la filosofía de /no-hacemos (sin urgencia falsa, sin promesas).

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { m as motion } from "framer-motion"
import {
  Users, Gauge, ShieldCheck, Map, History, LayoutGrid, type LucideIcon,
} from "lucide-react"
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion"
import { fadeUpProps, staggerParent, fadeUp, viewport } from "@/lib/motion"
import { deskLanding } from "@/lib/content/desk-landing"
import { DeskMiniDemo } from "./DeskMiniDemo"
import { DeskScrollDepth } from "./DeskScrollDepth"
import { track } from "./track"

const ICONS: Record<string, LucideIcon> = {
  users: Users, gauge: Gauge, shield: ShieldCheck, map: Map, history: History, layout: LayoutGrid,
}

/* Tokens del login del Desk (webui fxa-*) + tipografía propia de venta */
const BG = "#070707"
const CARD = "rounded-xl border border-[#262626] bg-[#0d0d0d]"
const BTN_PRIMARY =
  "inline-flex items-center justify-center rounded-[7px] bg-[#5BB8D4] px-10 py-3.5 text-sm font-bold tracking-[0.5px] text-[#04222c] transition-all duration-150 hover:brightness-110 hover:shadow-[0_0_22px_-6px_rgba(91,184,212,0.5)]"
const BTN_GHOST =
  "inline-flex items-center justify-center rounded-[7px] border border-[#2c2c2c] bg-[#121212] px-6 py-3.5 text-sm font-medium text-[#e6e6e6] transition-all duration-150 hover:border-[#5BB8D4]/60"
const EYEBROW = "font-mono text-[10.5px] uppercase tracking-[2.5px] text-[#555555]"
const H1 = "text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-white sm:text-[36px] lg:text-[42px]"
const H2 = "text-[22px] font-semibold leading-tight tracking-[-0.01em] text-white sm:text-[26px] lg:text-[30px]"

// Filas de ejemplo para el teaser del Radar. El ESTADO (el veredicto, la joya) y los
// números van BLUREADOS — solo el ticker queda legible. No se revela nada accionable.
const RADAR_ROWS = [
  { t: "KO · Coca-Cola", s: "SÓLIDO", c: "#3fb950", y: "3,1%" },
  { t: "O · Realty Income", s: "SÓLIDO", c: "#3fb950", y: "5,2%" },
  { t: "MO · Altria", s: "SÓLIDO", c: "#3fb950", y: "5,7%" },
  { t: "T · AT&T", s: "EN OBS", c: "#d4a017", y: "4,8%" },
  { t: "VZ · Verizon", s: "EN OBS", c: "#d4a017", y: "5,9%" },
  { t: "AGNC · AGNC Inv.", s: "FRÁGIL", c: "#f85149", y: "14,1%" },
] as const

function Triada() {
  return (
    <span
      aria-hidden
      className="absolute left-6 right-6 top-0 h-[2px] rounded-full opacity-90"
      style={{ background: "linear-gradient(90deg,#5BB8D4 0 33%,#7DD4C0 33% 66%,#D4B86A 66% 100%)" }}
    />
  )
}

function Cursor() {
  return <span className="fxa2-cur ml-1 inline-block h-[12px] w-[7px] bg-[#5BB8D4] align-[-2px]" aria-hidden />
}

const tk = (e: string, p?: Record<string, unknown>) => track(e, { ...p, variant: "terminal" })

// Bloque de PASES del Radar (30/90/365). Componente único renderizado en dos lugares:
// en PC vive en el pricing; en mobile va DESPUÉS de explicar el Radar (así no se vende
// un pase de algo que el usuario todavía no sabe qué es). Una sola fuente de verdad.
function RadarPasses() {
  const c = deskLanding
  return (
    <motion.div {...fadeUpProps} className="mt-10">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-xl border border-[#D4B86A]/25 bg-[#0d0b07]/50 px-6 py-7">
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-[#D4B86A]/[0.07] blur-[80px]" />
          <div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-[#5BB8D4]/[0.04] blur-[90px]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/desk/logo-orbital.svg"
            alt=""
            className="absolute -bottom-14 -right-12 w-[190px] opacity-[0.05]"
            style={{
              WebkitMaskImage: "radial-gradient(circle at 60% 40%, #000 35%, transparent 72%)",
              maskImage: "radial-gradient(circle at 60% 40%, #000 35%, transparent 72%)",
            }}
          />
        </div>
        <div className="relative text-center">
          <h3 className="text-[17px] font-semibold text-white sm:text-[19px]">{c.radar.unlockText}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#A8A8A8]">{c.radar.unlockSub}</p>
        </div>
        <div className="relative mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {c.radar.states.map((s) => (
            <span key={s.label} className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#9a9a9a]">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
        <div className="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {c.radar.passes.map((pass) => (
            <Link
              key={pass.label}
              href={pass.href}
              onClick={() => tk("desk_radar_pass_click", { pass: pass.label })}
              style={{
                backgroundImage:
                  "best" in pass && pass.best
                    ? "radial-gradient(120% 85% at 50% -8%, rgba(212,184,106,0.16), transparent 62%), linear-gradient(to bottom, #15100a, #0a0a0a)"
                    : "linear-gradient(to bottom, #131313, #0a0a0a)",
              }}
              className={`relative flex flex-col items-center rounded-[10px] border px-4 py-4 text-center transition-colors duration-200 ${
                "best" in pass && pass.best
                  ? "border-[#D4B86A]/55 hover:border-[#D4B86A]"
                  : "border-[#262626] hover:border-[#D4B86A]/50"
              }`}
            >
              {"best" in pass && pass.best ? (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[3px] bg-[#D4B86A] px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.1em] text-[#1c1708]">
                  Recomendado
                </span>
              ) : null}
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#999999]">{pass.label}</div>
              <div className="mt-1.5 font-mono text-xl font-bold tabular-nums text-white">{pass.price}</div>
              {"bonus" in pass && pass.bonus ? (
                <div className="mt-1 font-mono text-[9px] uppercase tracking-wide text-[#D4B86A]">{pass.bonus}</div>
              ) : null}
            </Link>
          ))}
        </div>
        <p className="relative mt-4 text-center font-mono text-[10.5px] leading-relaxed text-[#777777]">
          ¿Vas a usar los análisis? El pack <span className="text-[#D4B86A]">Premium</span> ya incluye el Radar 90 días.
        </p>
      </div>
    </motion.div>
  )
}

export function DeskLandingTerminal() {
  const c = deskLanding
  const [now, setNow] = useState("")
  const [showSticky, setShowSticky] = useState(false)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = () => setNow(new Date().toLocaleTimeString("es-AR", { hour12: false }))
    t()
    const id = setInterval(t, 1000)
    return () => clearInterval(id)
  }, [])

  // Sticky CTA mobile: aparece al perder de vista el CTA del hero, se oculta en el cierre.
  useEffect(() => {
    const hero = ctaRef.current
    const final = document.getElementById("desk-final")
    let heroVisible = true
    let finalVisible = false
    const update = () => setShowSticky(!heroVisible && !finalVisible)
    const o1 = new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; update() })
    const o2 = new IntersectionObserver(([e]) => { finalVisible = e.isIntersecting; update() })
    if (hero) o1.observe(hero)
    if (final) o2.observe(final)
    return () => { o1.disconnect(); o2.disconnect() }
  }, [])

  return (
    <main className="relative min-h-screen text-[#e6e6e6]" style={{ background: BG }}>
      <style>{`@keyframes fxa2blink{50%{opacity:0}} .fxa2-cur{animation:fxa2blink 1.1s steps(1) infinite}`}</style>
      <DeskScrollDepth />

      {/* Grilla de puntos del login */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,.035) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Topbar de la plataforma — sticky: el CTA queda siempre a la vista (mundo propio del Desk) */}
      <div className="sticky top-0 z-30 border-b border-[#262626] bg-black/85 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/desk/flowdex-wordmark.png" alt="Flowdex" className="block h-[18px] w-auto" />
          <span className="border-l border-[#262626] pl-3 font-mono text-[12px] font-bold tracking-[2.5px] text-[#5BB8D4]">
            DESK
          </span>
          <span className="flex-1" />
          <span className="hidden items-center gap-1.5 font-mono text-[10.5px] font-bold text-[#33b157] sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#33b157]" /> LIVE
          </span>
          <span className="hidden font-mono text-[10.5px] tabular-nums text-[#cdcdcd] sm:inline">{now}</span>
          <span className="hidden h-3.5 w-px bg-[#262626] sm:inline-block" />
          <a
            href={c.hero.loginHref}
            onClick={() => tk("desk_topbar_login_click")}
            className="-my-1 px-1 py-2 font-mono text-[11px] text-[#999999] transition-colors hover:text-[#5BB8D4] lg:my-0 lg:py-0"
          >
            Ingresar
          </a>
          <a
            href={c.hero.ctaHref}
            onClick={() => tk("desk_topbar_cta_click")}
            className="rounded-[6px] bg-[#5BB8D4] px-3.5 py-2 font-mono text-[11px] font-bold tracking-[0.3px] text-[#04222c] transition-all duration-150 hover:brightness-110 lg:py-1.5"
          >
            Probar gratis
          </a>
        </div>
      </div>

      <div className="relative z-10">
        {/* ── HERO: 2 columnas — promesa+CTA a la izquierda, la demo viva a la derecha ── */}
        <section className="px-4 pb-14 pt-12 sm:px-6 sm:pt-16">
          <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-x-8 lg:gap-y-8">
            <motion.div {...fadeUpProps} className="order-1 text-center lg:order-none lg:col-start-1 lg:row-start-1 lg:text-left">
              <p className={EYEBROW}>
                research desk
                <Cursor />
              </p>
              <h1 className={`${H1} mt-4`}>{c.hero.headline}</h1>
              <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-[#A8A8A8] lg:mx-0 lg:text-[15px]">
                {c.hero.subheadline}
              </p>

              <div ref={ctaRef} className="mt-7 flex flex-col items-center gap-3 lg:items-start">
                <Link
                  href={c.hero.ctaHref}
                  onClick={() => tk("desk_hero_cta_click")}
                  className={`${BTN_PRIMARY} w-full max-w-xs sm:w-auto`}
                >
                  {c.hero.ctaText}
                </Link>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 font-mono text-[11px] text-[#cfcfcf] lg:justify-start">
                  {c.hero.trustBadges.map((b) => (
                    <span key={b} className="inline-flex items-center gap-1.5">
                      <span className="text-[#5BB8D4]">✓</span>
                      {b}
                    </span>
                  ))}
                </div>
                <div className="mt-1.5 flex flex-col items-center gap-1.5 font-mono text-[11px] lg:items-start">
                  <Link
                    href="#desk-pricing"
                    onClick={() => tk("desk_hero_planes_click")}
                    className="text-[#5BB8D4] underline-offset-4 hover:underline"
                  >
                    Ver planes
                  </Link>
                  <Link href={c.hero.loginHref} className="text-[#888888] underline-offset-4 hover:underline">
                    {c.hero.loginText}
                  </Link>
                </div>
              </div>

            </motion.div>

            {/* Demo viva — en mobile sube acá (debajo del CTA, arriba de las stats) */}
            <motion.div {...fadeUpProps} className="relative order-2 min-w-0 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:min-w-[auto]">
              <div className="pointer-events-none absolute -inset-5 hidden rounded-2xl bg-[#5BB8D4]/[0.05] blur-2xl lg:block" />
              <div className="relative rounded-xl">
                <Triada />
                <DeskMiniDemo />
              </div>
            </motion.div>

            {/* Números reales del producto — en mobile quedan debajo de la demo */}
            <motion.div {...fadeUpProps} className="order-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:order-none lg:col-start-1 lg:row-start-2">
              {c.stats.map((s) => (
                <div key={s.label} className={`${CARD} flex flex-col items-center gap-1.5 px-2 py-3.5 lg:items-start lg:px-3`}>
                  <span className="font-mono text-2xl font-bold leading-none tabular-nums text-white">{s.value}</span>
                  <span className="flex min-h-[2.1rem] items-start justify-center text-center font-mono text-[9px] uppercase leading-[1.25] tracking-[0.1em] text-[#555555] lg:justify-start lg:text-left">
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── PROBLEMA ── */}
        <section className="px-4 py-8 sm:px-6 lg:py-12">
          <div className="mx-auto max-w-3xl">
            <motion.div {...fadeUpProps} className="mb-7 text-center">
              <p className={`${EYEBROW} mb-3`}>{c.problem.eyebrow}</p>
              <h2 className={H2}>{c.problem.title}</h2>
            </motion.div>
            <motion.ul variants={staggerParent} initial="hidden" whileInView="visible" viewport={viewport} className="space-y-3">
              {c.problem.scenarios.map((s) => (
                <motion.li key={s.slice(0, 24)} variants={fadeUp} className={`${CARD} flex gap-3 px-5 py-4 text-sm leading-relaxed text-[#C9C9C9]`}>
                  <span className="select-none font-mono font-bold text-[#D4B86A]">›</span>
                  <span>{s}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* ── SOLUCIÓN ── */}
        <section className="px-4 py-8 sm:px-6 lg:py-12">
          <div className="mx-auto max-w-5xl">
            <motion.div {...fadeUpProps} className="mb-8 text-center">
              <p className={`${EYEBROW} mb-3`}>{c.solution.eyebrow}</p>
              <h2 className={H2}>{c.solution.title}</h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm text-[#A8A8A8]">{c.solution.description}</p>
            </motion.div>
            <motion.ol variants={staggerParent} initial="hidden" whileInView="visible" viewport={viewport} className="grid gap-4 md:grid-cols-3">
              {c.solution.steps.map((step, i) => (
                <motion.li key={step.title} variants={fadeUp} className={`${CARD} relative px-5 py-6`}>
                  <Triada />
                  <span className="font-mono text-xl font-bold tabular-nums text-[#5BB8D4]">0{i + 1}</span>
                  <h3 className="mt-3 text-[15px] font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#A8A8A8]">{step.text}</p>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="px-4 py-8 sm:px-6 lg:py-12">
          <div className="mx-auto max-w-6xl">
            <motion.div {...fadeUpProps} className="mb-8 text-center">
              <p className={`${EYEBROW} mb-3`}>{c.features.eyebrow}</p>
              <h2 className={H2}>{c.features.title}</h2>
            </motion.div>
            <motion.div
              variants={staggerParent}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {c.features.items.map((f) => {
                const Icon = ICONS[f.icon] ?? LayoutGrid
                return (
                  <motion.div key={f.id} variants={fadeUp} className="rounded-xl border border-[#1f1f1f] bg-gradient-to-b from-[#141414] to-[#0a0a0a] px-5 py-6 transition-colors duration-200 hover:border-[#5BB8D4]/50">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#5BB8D4]/25 bg-[#5BB8D4]/[0.07]">
                      <Icon className="h-5 w-5 text-[#5BB8D4]" strokeWidth={1.75} />
                    </div>
                    <h3 className="text-[15px] font-semibold text-white">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#A8A8A8]">{f.description}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* Reorden SOLO mobile: el pricing sube arriba del Radar y el Origen. En PC,
            lg:contents disuelve el wrapper y se mantiene el orden original. */}
        <div className="flex flex-col lg:contents">

        {/* ── RADAR DE DIVIDENDOS ── */}
        <section className="order-2 px-4 py-8 sm:px-6 lg:order-none lg:py-12">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <motion.div {...fadeUpProps}>
                <p className={`${EYEBROW} mb-3`}>{c.radar.eyebrow}</p>
                <h2 className={H2}>{c.radar.title}</h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#A8A8A8]">{c.radar.description}</p>
                <ul className="mt-6 flex flex-col gap-3">
                  {c.radar.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-[#cfcfcf]">
                      <span className="mt-0.5 font-mono text-[#5BB8D4]">▸</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-7 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#888888]">
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-[#D4B86A]" /> {c.radar.includedNote}
                </p>
                {/* En mobile el pricing ya está arriba: ocultamos este 2º CTA para no
                    duplicar accesos a planes. En PC (pricing abajo) se mantiene. */}
                <div className="hidden lg:block">
                  <Link href={c.radar.ctaHref} className={`${BTN_PRIMARY} mt-5`}>
                    {c.radar.ctaText}
                  </Link>
                </div>
              </motion.div>

              <motion.div {...fadeUpProps} className="relative">
                <div className="pointer-events-none absolute -inset-5 hidden rounded-2xl bg-[#D4B86A]/[0.04] blur-2xl lg:block" />
                <div className="relative overflow-hidden rounded-xl border border-[#262626] bg-[#0b0b0b] font-mono">
                  <div className="flex items-center justify-between border-b border-[#1c1c1c] px-4 py-2.5">
                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#5BB8D4]">▸ Calidad de la renta · 220 pagadores</span>
                    <span className="text-[9.5px] text-[#555]">demo</span>
                  </div>
                  <div className="grid grid-cols-[1.5fr_1fr_0.6fr] gap-2 border-b border-[#1c1c1c] px-4 py-2 text-[9px] uppercase tracking-wide text-[#666]">
                    <span>Activo</span>
                    <span>Estado</span>
                    <span className="text-right">Yield</span>
                  </div>
                  <div>
                    {RADAR_ROWS.map((r, i) => (
                      <motion.div
                        key={r.t}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.08 * i, duration: 0.35 }}
                        className={`grid grid-cols-[1.5fr_1fr_0.6fr] items-center gap-2 border-b border-[#141414] px-4 py-2 text-[11px] ${
                          r.s === "FRÁGIL" ? "bg-[#f85149]/[0.06]" : ""
                        }`}
                      >
                        <span className="text-[#cfcfcf]">{r.t}</span>
                        <span className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.c }} />
                          <span style={{ color: r.c }}>{r.s}</span>
                        </span>
                        <span className="text-right tabular-nums text-[#9a9a9a]">{r.y}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="border-b border-[#1c1c1c] px-4 py-2.5 text-[10px] leading-relaxed text-[#8a8a8a]">
                    <span className="text-[#f85149]">▲</span> {c.radar.thesis}
                  </div>
                  <div className="relative px-4 py-4">
                    <div className="select-none space-y-1.5 blur-[3px]" aria-hidden>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#777]">+ 214 activos clasificados</span>
                        <span className="text-[#5BB8D4]">▸ ▸ ▸</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#777]">Renta a 10 años, reinvirtiendo</span>
                        <span className="font-bold text-[#D4B86A]">$40.826</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#777]">Alertas de ex-date</span>
                        <span className="text-[#7DD4C0]">ON</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/85 to-[#0b0b0b]/40 px-4 text-center">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4B86A" strokeWidth="2" aria-hidden="true">
                        <rect x="5" y="11" width="14" height="9" rx="2" />
                        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                      </svg>
                      <span className="text-[11px] leading-relaxed text-[#cfcfcf]">{c.radar.lockNote}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Pases del Radar en mobile: DESPUÉS de explicar qué es (en PC viven en el
                pricing). Así no se vende el pase antes de que se entienda el producto. */}
            <div className="lg:hidden">
              <RadarPasses />
            </div>
          </div>
        </section>

        {/* ── ORIGEN ── */}
        <section className="order-3 px-4 py-8 sm:px-6 lg:order-none lg:py-12">
          <motion.div {...fadeUpProps} className={`${CARD} relative mx-auto max-w-3xl overflow-hidden px-6 py-9 text-center sm:px-10`}>
            <Triada />
            <div aria-hidden className="pointer-events-none absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/desk/logo-orbital.svg"
                alt=""
                className="absolute -right-16 -top-16 w-[260px] opacity-[0.03]"
                style={{
                  WebkitMaskImage: "radial-gradient(circle at center, #000 30%, transparent 72%)",
                  maskImage: "radial-gradient(circle at center, #000 30%, transparent 72%)",
                }}
              />
            </div>
            <p className={`${EYEBROW} mb-4`}>{c.socialProof.eyebrow}</p>
            <div className="mb-5 flex items-center justify-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/desk/flowdex-wordmark.png" alt="Flowdex" className="block h-[32px] w-auto opacity-95" />
              <span className="border-l border-[#333333] pl-4 font-mono text-[16px] font-bold tracking-[3px] text-[#7DD4C0]">
                ACADEMY
              </span>
            </div>
            <h2 className={`${H2} relative`}>{c.socialProof.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#A8A8A8]">{c.socialProof.text}</p>
            <Link
              href={c.socialProof.linkHref}
              className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[#666666] underline-offset-4 transition-colors duration-150 hover:text-[#7DD4C0] hover:underline"
            >
              {c.socialProof.linkText} →
            </Link>
          </motion.div>
        </section>

        {/* ── PRICING ── */}
        <section id="desk-pricing" className="relative order-1 overflow-hidden px-4 py-8 sm:px-6 lg:order-none lg:py-12">
          {/* Presencia de marca: orbital fantasma + glow celeste — SVG liviano, sin costo de perf */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/3 hidden h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-[#5BB8D4]/[0.05] blur-[130px] lg:block" />
          </div>
          <div className="relative mx-auto max-w-6xl">
            <motion.div {...fadeUpProps} className="mb-9 text-center">
              <p className={`${EYEBROW} mb-3`}>{c.pricing.eyebrow}</p>
              <h2 className={H2}>{c.pricing.title}</h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-[#A8A8A8]">{c.pricing.note}</p>
            </motion.div>

            {/* Confianza en el punto de decisión — solo mobile (en PC ya vive en el hero) */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 font-mono text-[11px] text-[#cfcfcf] lg:hidden">
              {c.hero.trustBadges.map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5">
                  <span className="text-[#5BB8D4]">✓</span>
                  {b}
                </span>
              ))}
            </div>
            <motion.div
              variants={staggerParent}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="flex flex-col gap-3 md:grid md:grid-cols-2 md:items-stretch md:gap-4 lg:grid-cols-4"
            >
              {c.pricing.plans
                .map((p) => {
                  const isPro = p.id === "pro"
                  const isIntensivo = p.id === "intensivo"
                  const isInicial = p.id === "inicial"
                  // Jerarquía visual (research 2026-06-10): un solo tier dominante (Pro,
                  // cyan, medido), Intensivo dorado quieto como ancla premium, Inicial un
                  // borde celeste tenue, Gratis pelado. Color reservado = jerarquía clara.
                  const cardBorder = isPro
                    ? "border border-[#5BB8D4]/55 shadow-[0_0_28px_-20px_rgba(91,184,212,0.55)] lg:scale-[1.02]"
                    : isIntensivo
                      ? "border border-[#D4B86A]/35"
                      : isInicial
                        ? "border border-[#5BB8D4]/20"
                        : "border border-[#5BB8D4]/15"
                  // Glow por tier vía background-image (clipeado por el border-radius, no
                  // necesita overflow-hidden — así los badges -top-3 no se cortan).
                  const cardGlow = isPro
                    ? "radial-gradient(120% 85% at 50% -8%, rgba(91,184,212,0.18), transparent 62%), "
                    : isIntensivo
                      ? "radial-gradient(120% 85% at 50% -8%, rgba(212,184,106,0.16), transparent 62%), "
                      : isInicial
                        ? "radial-gradient(120% 85% at 50% -8%, rgba(91,184,212,0.06), transparent 60%), "
                        : "radial-gradient(120% 85% at 50% -8%, rgba(255,255,255,0.03), transparent 60%), "
                  // Orden SOLO en mobile (se resetea en md+): el Pro recomendado lidera,
                  // después Premium, Inicial y Gratis. En PC manda el orden de datos.
                  const mobileOrder = isPro
                    ? "order-1"
                    : isIntensivo
                      ? "order-2"
                      : isInicial
                        ? "order-3"
                        : "order-4"
                  return (
                  <motion.div
                    key={p.id}
                    variants={fadeUp}
                    style={{ backgroundImage: `${cardGlow}linear-gradient(to bottom, #141414, #0a0a0a)` }}
                    className={`relative flex flex-col rounded-xl px-5 py-5 ${mobileOrder} md:order-none lg:px-6 lg:py-6 ${cardBorder}`}
                  >
                    {isPro && <Triada />}
                    {"badge" in p && p.badge && (
                      <span
                        className={`absolute -top-3 left-6 rounded-[4px] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] ${
                          isPro
                            ? "bg-[#5BB8D4] text-[#04222c]"
                            : "bg-[#1c1708] text-[#d9b95f]"
                        }`}
                      >
                        {p.badge}
                      </span>
                    )}
                    <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#555555]">{p.name}</h3>
                    <div className="mt-3 font-mono text-3xl font-bold tabular-nums text-white sm:text-4xl">{p.id === "free" ? "GRATIS" : p.price}</div>
                    <p className={`mt-1 font-mono text-[11px] font-medium tabular-nums ${isIntensivo ? "text-[#D4B86A]" : "text-[#5BB8D4]"}`}>{p.detail}</p>
                    <ul className="mb-2 mt-4 flex flex-1 flex-col gap-2 lg:mt-5 lg:gap-2.5">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-[14px] leading-snug text-[#B8B8B8] lg:text-[13px]">
                          <span className={`mt-px shrink-0 ${isIntensivo ? "text-[#D4B86A]" : "text-[#5BB8D4]"}`}>✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                      {"radarLine" in p && p.radarLine ? (
                        <li className="flex items-start gap-2 text-[14px] font-semibold leading-snug text-[#e2ce92] lg:text-[13px]">
                          <span className="mt-px shrink-0 text-[#D4B86A]">✓</span>
                          <span>{p.radarLine}</span>
                        </li>
                      ) : null}
                    </ul>
                    <Link
                      href={p.ctaHref}
                      onClick={() => tk("desk_pricing_cta_click", { plan: p.id })}
                      className={`${p.highlight ? BTN_PRIMARY : BTN_GHOST} relative mt-5 w-full lg:mt-6`}
                    >
                      {p.ctaText}
                    </Link>
                  </motion.div>
                  )
                })}
            </motion.div>

            {/* Pases del Radar — en PC viven acá (el Radar ya se explicó arriba). En mobile
                NO se muestran acá: van después de la sección del Radar (ver más abajo). */}
            <div className="hidden lg:block">
              <RadarPasses />
            </div>
          </div>
        </section>
        </div>

        {/* ── FAQ ── */}
        <section className="px-4 py-8 sm:px-6 lg:py-12">
          <div className="mx-auto max-w-3xl">
            <motion.div {...fadeUpProps} className="mb-7 text-center">
              <p className={`${EYEBROW} mb-3`}>{c.faq.eyebrow}</p>
              <h2 className={H2}>{c.faq.title}</h2>
            </motion.div>
            <motion.div {...fadeUpProps}>
              <Accordion
                type="single"
                collapsible
                className="space-y-3"
                onValueChange={(v) => {
                  if (!v) return
                  const q = c.faq.items[Number(String(v).replace("item-", ""))]?.question
                  if (q) tk("desk_faq_expand", { question: q })
                }}
              >
                {c.faq.items.map((faq, index) => (
                  <AccordionItem
                    key={faq.question}
                    value={`item-${index}`}
                    className={`${CARD} px-4 transition-colors duration-200 hover:border-[#5BB8D4]/50 data-[state=open]:border-[#5BB8D4]/50 sm:px-5`}
                  >
                    <AccordionTrigger className="min-h-12 py-4 text-left text-sm text-white hover:text-[#5BB8D4] hover:no-underline sm:text-[15px] [&>svg]:text-[#5BB8D4]">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-sm leading-relaxed text-[#A8A8A8]">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section id="desk-final" className="px-4 py-16 sm:px-6 sm:py-24">
          <motion.div {...fadeUpProps} className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
            <p className="font-mono text-[11px] tracking-[0.12em] text-[#555555]">
              <span className="text-[#5BB8D4]">$</span> flowdex desk <span className="text-[#D4B86A]">--iniciar</span>
              <Cursor />
            </p>
            <h2 className="text-[26px] font-semibold leading-tight tracking-[-0.01em] text-white sm:text-[32px]">
              {c.finalCta.headline}
            </h2>
            <p className="text-[15px] text-[#888888]">{c.finalCta.subheadline}</p>
            <Link href={c.finalCta.ctaHref} onClick={() => tk("desk_final_cta_click")} className={`${BTN_PRIMARY} w-full max-w-xs`}>
              {c.finalCta.ctaText}
            </Link>
          </motion.div>
        </section>

        {/* Footer nativo del Desk — su propio mundo, sin el chrome de la Academy */}
        <footer className="relative overflow-hidden border-t border-[#262626] bg-black/85">
          <Triada />
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/desk/logo-orbital.svg"
              alt=""
              className="absolute -bottom-36 left-1/2 w-[420px] -translate-x-1/2 opacity-[0.028]"
              style={{
                WebkitMaskImage: "radial-gradient(circle at center, #000 38%, transparent 74%)",
                maskImage: "radial-gradient(circle at center, #000 38%, transparent 74%)",
              }}
            />
          </div>
          <div className="relative mx-auto max-w-6xl px-4 py-9 sm:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/desk/flowdex-wordmark.png" alt="Flowdex" className="block h-[21px] w-auto opacity-90" />
                <span className="border-l border-[#262626] pl-3 font-mono text-[12px] font-bold tracking-[2.5px] text-[#5BB8D4]">
                  DESK
                </span>
              </div>

              <p className="max-w-3xl font-mono text-[10px] leading-relaxed text-[#666]">
                Flowdex Desk es una herramienta de análisis con fines educativos e informativos. No constituye
                asesoramiento financiero ni recomendación de compra o venta de instrumentos financieros, ni garantía de
                rendimiento. Operar en los mercados conlleva riesgo de pérdida del capital. La decisión la tomás vos.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#666]">
                <Link href="/legal/terminos" className="transition-colors hover:text-[#5BB8D4]">Términos</Link>
                <span className="text-[#2a2a2a]">·</span>
                <Link href="/legal/privacidad" className="transition-colors hover:text-[#5BB8D4]">Privacidad</Link>
                <span className="text-[#2a2a2a]">·</span>
                <Link href="/legal/reembolsos" className="transition-colors hover:text-[#5BB8D4]">Reembolsos</Link>
              </div>

              <a
                href="https://flowdex.com.ar"
                className="inline-flex items-center gap-2 rounded-[7px] border border-[#2c2c2c] bg-[#0f0f0f] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#b9b9b9] transition-all duration-150 hover:border-[#7DD4C0]/60 hover:text-[#7DD4C0]"
              >
                Flowdex Academy · educación financiera →
              </a>

              <p className="font-mono text-[9.5px] text-[#555]">
                © {new Date().getFullYear()} Flowdex™ · Sin señales · sin promesas de rentabilidad · la decisión la tomás vos
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* CTA sticky — solo mobile */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-[#1f1f1f] bg-[#070707] px-4 pt-3 pb-[max(0.9rem,env(safe-area-inset-bottom))] transition-all duration-300 md:hidden ${
          showSticky ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
        }`}
      >
        {/* Sticky OSCURO con acento celeste (no celeste sólido): Safari 26 deriva el color
            de su barra del elemento fijo de abajo, así que un fondo oscuro la deja negra. */}
        <Link
          href={c.hero.ctaHref}
          onClick={() => tk("desk_sticky_cta_click")}
          className="inline-flex w-full items-center justify-center rounded-[7px] border border-[#5BB8D4]/55 bg-[#0d0d0d] px-10 py-3.5 text-sm font-bold tracking-[0.5px] text-[#5BB8D4] shadow-lg shadow-black/40 transition-all duration-150 hover:border-[#5BB8D4] hover:bg-[#121212]"
        >
          {c.hero.ctaText}
        </Link>
      </div>
    </main>
  )
}
