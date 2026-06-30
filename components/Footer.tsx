"use client"

import { Instagram, Linkedin, Send, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/lib/language-context"
import { OrbitalIcon } from "@/components/OrbitalIcon"

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M19.8 5.4A16.9 16.9 0 0 0 15.7 4l-.2.4c-.1.3-.3.7-.4 1-1-.2-1.9-.3-2.9-.3-1 0-1.9.1-2.9.3a12.6 12.6 0 0 0-.6-1.4 16.8 16.8 0 0 0-4 1.4C2.1 9 1.5 12.4 1.8 15.8a16.8 16.8 0 0 0 5 2.5l1.1-1.8c-.6-.2-1.1-.5-1.6-.8l.4-.3c3 1.4 6.3 1.4 9.2 0l.4.3c-.5.3-1 .6-1.6.8l1.1 1.8a16.7 16.7 0 0 0 5-2.5c.5-3.9-.8-7.2-1.2-10.4ZM8.9 13.8c-.8 0-1.4-.8-1.4-1.7 0-1 .6-1.7 1.4-1.7.8 0 1.4.8 1.4 1.7s-.6 1.7-1.4 1.7Zm6.2 0c-.8 0-1.4-.8-1.4-1.7 0-1 .6-1.7 1.4-1.7.8 0 1.4.8 1.4 1.7s-.6 1.7-1.4 1.7Z" />
    </svg>
  )
}

export function Footer() {
  const { t } = useLanguage()
  const pathname = usePathname()

  // Ocultar footer en páginas inmersivas (easter eggs, arte) y en todo el Desk,
  // que es su propio mundo visual (tema terminal, footer propio) — el footer de la
  // Academy quedaba "parchado" abajo del landing terminal.
  if (pathname === "/la-dama" || (pathname ?? "").startsWith("/desk")) {
    return null
  }

  return (
    <footer className="bg-[#0A0A0A] py-12 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-5 sm:gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative h-[106px] w-[296px] max-w-[88vw] sm:h-[128px] sm:w-[360px]">
              <div className="pointer-events-none absolute -left-8 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-[#7DD4C0]/12 blur-2xl" />
              <div className="pointer-events-none absolute -right-9 top-1/2 h-18 w-18 -translate-y-1/2 rounded-full bg-[#5BB8D4]/10 blur-2xl" />
              <div className="pointer-events-none absolute left-1/2 top-[70%] h-10 w-28 -translate-x-1/2 rounded-full bg-[#D4B86A]/8 blur-2xl" />
              <Image
                src="/flowdex-community-transparent-clean.png"
                alt="Flowdex Community"
                fill
                sizes="(max-width: 640px) 296px, 360px"
                className="object-contain object-center opacity-95"
                style={{
                  filter:
                    "drop-shadow(0 0 8px rgba(125, 212, 192, 0.12)) drop-shadow(0 0 12px rgba(91, 184, 212, 0.08))",
                }}
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8">
            <a
              href="https://discord.gg/TrrMKxnP3k"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#888888] hover:text-[#A9B8FF] transition-colors"
            >
              <DiscordIcon className="size-5" />
              <span className="text-sm">Discord</span>
            </a>
            <a
              href="https://www.instagram.com/flowdexx_/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#888888] hover:text-[#5BB8D4] transition-colors"
            >
              <Instagram size={20} />
              <span className="text-sm">Instagram</span>
            </a>
            <a
              href="https://www.linkedin.com/company/flowdexacademy/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#888888] hover:text-[#A9B8FF] transition-colors"
            >
              <Linkedin size={20} />
              <span className="text-sm">LinkedIn</span>
            </a>
            <a
              href="https://t.me/+-J9qtCZnY7xiOWQx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#888888] hover:text-[#7DD4C0] transition-colors"
            >
              <Send size={20} />
              <span className="text-sm">Telegram Community</span>
            </a>
            <a
              href="https://wa.me/message/WD3RGNGTSPFYA1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#888888] hover:text-[#7DD4C0] transition-colors"
            >
              <MessageCircle size={20} />
              <span className="text-sm">WhatsApp</span>
            </a>
            <Link
              href="/partners"
              className="flex items-center gap-2 text-[#D4B86A] hover:text-[#E2CE92] transition-colors"
            >
              <OrbitalIcon size={20} animate={false} />
              <span className="text-sm">Flowdex for Partners</span>
            </Link>
          </div>

          {/* Manifiesto + Legal links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            <Link
              href="/no-hacemos"
              className="text-[#888888] hover:text-[#D4B86A] transition-colors"
            >
              Lo que no hacemos
            </Link>
            <span className="text-[#2A2A2A]">·</span>
            <Link
              href="/track-record"
              className="text-[#888888] hover:text-[#7DD4C0] transition-colors"
            >
              Track Record
            </Link>
            <span className="text-[#2A2A2A]">·</span>
            <Link
              href="/asesores"
              className="text-[#888888] hover:text-[#D4B86A] transition-colors"
            >
              Asesores
            </Link>
            <span className="text-[#2A2A2A]">·</span>
            <Link
              href="/legal/terminos"
              className="text-[#888888] hover:text-[#5BB8D4] transition-colors"
            >
              Términos y Condiciones
            </Link>
            <span className="text-[#2A2A2A]">·</span>
            <Link
              href="/legal/privacidad"
              className="text-[#888888] hover:text-[#7DD4C0] transition-colors"
            >
              Política de Privacidad
            </Link>
            <span className="text-[#2A2A2A]">·</span>
            <Link
              href="/legal/reembolsos"
              className="text-[#888888] hover:text-[#D4B86A] transition-colors"
            >
              Política de Reembolsos
            </Link>
            <span className="text-[#2A2A2A]">·</span>
            <Link
              href="/legal/propiedad-intelectual"
              className="text-[#888888] hover:text-[#D4B86A] transition-colors"
            >
              Propiedad Intelectual
            </Link>
          </div>


          {/* Trust & Security microcopy */}
          <div className="flex flex-col items-center gap-1 text-center mt-4">
            <p className="text-xs font-semibold text-[#7DD4C0]">Sitio seguro · Pagos protegidos</p>
            <p className="text-[11px] leading-relaxed text-[#888888] max-w-5xl">
              {t("footer.disclaimer")}
            </p>
            <p className="text-xs text-[#9a9a9a]">
              © {new Date().getFullYear()} Flowdex™. {t("footer.rights")} ·{" "}
              <span className="text-[#9a9a9a]">
                Contenido protegido por Ley 11.723
              </span>
            </p>
          </div>

          {/* Easter egg — para los que llegan hasta el fondo */}
          <Link
            href="/la-dama"
            className="text-[10px] italic tracking-wide text-[#4a4a4a] transition-colors duration-500 hover:text-[#D4B86A]/70"
          >
            Si la escuchás, seguí el compás →
          </Link>
        </div>
      </div>
    </footer>
  )
}
