"use client"

// UI compartida de los módulos del terminal (colores de marca + primitivos).

import type { ReactNode } from "react"

export const AZUL = "#5BB8D4" // inversión
export const TEAL = "#7DD4C0" // trading
export const ORO = "#D4B86A" // inner circle
export const DOWN = "#ef6a6a"

export function Eyebrow({ accent, children }: { accent: string; children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
      />
      <span className="type-eyebrow uppercase" style={{ color: accent, letterSpacing: "0.22em" }}>
        {children}
      </span>
    </div>
  )
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[linear-gradient(170deg,#0F1117_0%,#0B0D14_100%)] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.28)] sm:p-6 ${className}`}
    >
      {children}
    </div>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-[#98A1B5]">
        {label}
      </span>
      {children}
    </label>
  )
}

export const inputCls =
  "w-full rounded-lg border border-[#2A2A2A] bg-[#0A0D14] px-3 py-2.5 font-mono text-sm text-white outline-none placeholder:text-[#5A6678] focus:border-[#5BB8D4]/60"
