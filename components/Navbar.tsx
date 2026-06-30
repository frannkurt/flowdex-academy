"use client"

import { useEffect, useMemo, useState } from "react"
import { m as motion, AnimatePresence } from "framer-motion"
import { Compass, LayoutDashboard, Lock, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { useLanguage } from "@/lib/language-context"
import { OrbitalIcon } from "./OrbitalIcon"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type NavMode = "marketing" | "product" | "minimal"

type NavLinkItem = {
  href: string
  label: string
  type: "anchor" | "route" | "external"
  matchStartsWith?: string
  /** Marca el link como "destacado" en el navbar. Aplica tratamiento
   *  visual diferenciado (chip con borde dorado + icono compass) para
   *  promover puntos de entrada estrategicos. Hoy se usa unicamente en
   *  "Por dónde empezar", que es la herramienta de diagnostico mas
   *  fuerte del sitio (RouteSelector) y estaba invisible entre links
   *  iguales. Brecha #4 de la auditoria GAP_UNICORNIO 2026-05. */
  featured?: boolean
  /** Marca el link como "vivo / con ventana abierta". Se renderiza
   *  con un dot dorado pulsante a la izquierda (clase .nav-dot-live
   *  definida en app/globals.css). Pensado para promociones acotadas
   *  en el tiempo donde queremos visibilidad sutil sin caer en
   *  announcement bar tipo Black Friday. Hoy usado en "Programa
   *  Fundador" durante la ventana de inscripción. Sacar el flag (o
   *  el item completo) cuando cierre el cupo. */
  live?: boolean
}

type NavbarProps = {
  /** Usuario resuelto server-side por el RootLayout. Lo usamos como estado
   *  inicial para que el primer render del cliente ya muestre "Panel/Salir"
   *  si el alumno está logueado, en vez de mostrar "Ingresar" hasta que
   *  termine el getUser() del cliente. */
  initialUser?: User | null
}

export function Navbar({ initialUser = null }: NavbarProps = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(initialUser)
  const [activeSection, setActiveSection] = useState("#hero")
  const { language, t } = useLanguage()

  const navMode: NavMode = useMemo(() => {
    const currentPath = pathname ?? "/"

    if (currentPath.startsWith("/checkout") || currentPath.startsWith("/auth/callback")) {
      return "minimal"
    }

    if (
      currentPath.startsWith("/dashboard") ||
      currentPath.startsWith("/courses") ||
      currentPath.startsWith("/admin") ||
      currentPath.startsWith("/herramientas") ||
      currentPath.startsWith("/journal") ||
      currentPath.startsWith("/guia") ||
      currentPath.startsWith("/filosofia")
    ) {
      return "product"
    }

    return "marketing"
  }, [pathname])

  const navLinks = useMemo(
    (): NavLinkItem[] => {
      if (navMode === "minimal") {
        return []
      }

      if (navMode === "product") {
        return [
          {
            href: "/",
            label: t("nav.home"),
            type: "route",
            matchStartsWith: "/",
          },
          {
            href: "/dashboard",
            label: language === "es" ? "Panel" : "Dashboard",
            type: "route",
            matchStartsWith: "/dashboard",
          },
          {
            href: "/dashboard#dashboard-cursos",
            label: language === "es" ? "Cursos" : "Courses",
            type: "route",
            matchStartsWith: "/dashboard",
          },
          {
            href: "/dashboard#dashboard-comunidad",
            label: language === "es" ? "Comunidad" : "Community",
            type: "route",
            matchStartsWith: "/dashboard",
          },
          {
            href: "/filosofia",
            label: language === "es" ? "Filosofía" : "Philosophy",
            type: "route",
            matchStartsWith: "/filosofia",
          },
          {
            href: "/journal",
            label: "Journal",
            type: "route",
            matchStartsWith: "/journal",
          },
          {
            href: "/herramientas",
            label: language === "es" ? "Herramientas" : "Tools",
            type: "route",
            matchStartsWith: "/herramientas",
          },
        ]
      }

      return [
        { href: "#hero", label: t("nav.home"), type: "anchor" },
        {
          href: "/por-donde-empezar",
          label: language === "es" ? "Por dónde empezar" : "Where to start",
          type: "route",
          matchStartsWith: "/por-donde-empezar",
          featured: true,
        },
        // Rutas directas a las páginas de los cursos (junio 2026). Antes
        // eran anchors (#kickstart-investment / #kickstart-trading /
        // #inner-circle) que scrolleaban a las cards de la home con JS
        // (preventDefault + window.scrollTo). En mobile ese scroll
        // programático fallaba silencioso (el tap cerraba el drawer pero
        // no navegaba a nada). Decisión de Franco: los items del navbar
        // llevan directo a la página del Kickstart de cada camino (punto
        // de entrada natural) y a /inner-circle.
        {
          href: "/cursos/kickstart-investment",
          label: t("nav.investment"),
          type: "route",
          matchStartsWith: "/cursos/kickstart-investment",
        },
        {
          href: "/cursos/kickstart-trading",
          label: t("nav.trading"),
          type: "route",
          matchStartsWith: "/cursos/kickstart-trading",
        },
        {
          href: "/inner-circle",
          label: t("nav.innerCircle"),
          type: "route",
          matchStartsWith: "/inner-circle",
        },
      ]
    },
    [language, navMode, t]
  )

  // El antiguo dropdown "Herramientas" (Calculadora/Calendario/TradingView/
  // Heatmap/Broker IOL/Broker XTB) se eliminó en mayo 2026. Razones:
  //   1. Los anchors #calculadora y #calendario quedaron rotos cuando
  //      /herramientas se refactorizó a hub + sub-páginas.
  //   2. Promocionar TradingView/XTB desde el navbar diluye marca Flowdex.
  //   3. El hub /herramientas ya navega claro a calculadoras/noticias y
  //      tiene su propia sección "Atajos externos" para los links de
  //      terceros (TradingView, Heatmap, IOL, XTB).
  // Ahora "Herramientas" es un link route directo al hub.

  const scrollToSection = (href: string) => {
    setIsOpen(false)

    // Inicio siempre va al top de la página, sin depender de buscar el elemento
    if (href === "#hero") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      setActiveSection("#hero")
      return
    }

    const element = document.querySelector(href)
    if (element) {
      // Compensamos la altura del navbar sticky para alinear el target al
      // inicio visible (no oculto detrás del navbar).
      const NAVBAR_OFFSET = 80
      const top = element.getBoundingClientRect().top + window.pageYOffset - NAVBAR_OFFSET
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  const navigateToSection = (href: string) => {
    setIsOpen(false)

    if (href === "#hero") {
      if (pathname === "/") {
        scrollToSection(href)
      } else {
        router.push("/")
      }
      return
    }

    if (pathname === "/") {
      scrollToSection(href)
      return
    }

    router.push(`/${href}`)
  }

  const handleLinkClick = (link: NavLinkItem) => {
    if (link.type === "anchor") {
      navigateToSection(link.href)
      return
    }

    if (link.type === "route") {
      setIsOpen(false)

      if (link.href.startsWith("/dashboard#") && pathname.startsWith("/dashboard")) {
        const hash = link.href.split("#")[1]
        if (hash) {
          const target = document.getElementById(hash)
          if (target) {
            const NAVBAR_OFFSET = 80
            const top = target.getBoundingClientRect().top + window.pageYOffset - NAVBAR_OFFSET
            window.scrollTo({ top, behavior: "smooth" })
          }
          window.history.replaceState(null, "", `#${hash}`)
          setActiveSection(link.href)
          return
        }
      }

      router.push(link.href)
      return
    }

    setIsOpen(false)
  }

  useEffect(() => {
    if (navMode !== "marketing") {
      if (pathname.startsWith("/dashboard")) {
        if (typeof window !== "undefined") {
          const hash = window.location.hash
          if (hash) {
            const href = `/dashboard${hash}`
            const hashLink = navLinks.find((link) => link.type === "route" && link.href === href)
            if (hashLink) {
              setActiveSection(hashLink.href)
              return
            }
          }
        }
        setActiveSection("/dashboard")
        return
      }

      if (pathname.startsWith("/courses")) {
        setActiveSection("/dashboard#dashboard-cursos")
        return
      }

      const routeLink = navLinks.find(
        (link) =>
          link.type === "route" &&
          link.matchStartsWith &&
          link.matchStartsWith !== "/" &&
          pathname.startsWith(link.matchStartsWith)
      )

      if (routeLink) {
        setActiveSection(routeLink.href)
      } else {
        setActiveSection(pathname === "/" ? "/" : "")
      }
      return
    }

    if (pathname !== "/") {
      if (pathname.startsWith("/inner-circle") || pathname.includes("inner-circle")) {
        setActiveSection("/inner-circle")
        return
      }

      if (pathname.includes("investment")) {
        setActiveSection("/cursos/kickstart-investment")
        return
      }

      if (pathname.includes("trading")) {
        setActiveSection("/cursos/kickstart-trading")
        return
      }

      setActiveSection("#hero")
      return
    }

    const sections = navLinks
      .filter((link) => link.type === "anchor")
      .map((link) => ({ href: link.href, element: document.querySelector(link.href) }))
      .filter((item) => item.element) as Array<{ href: string; element: Element }>

    if (sections.length === 0) {
      setActiveSection("#hero")
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible.length === 0) {
          return
        }

        const top = visible[0].target
        const found = sections.find((section) => section.element === top)
        if (found) {
          setActiveSection(found.href)
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.15, 0.35, 0.6],
      }
    )

    sections.forEach((section) => observer.observe(section.element))

    return () => observer.disconnect()
  }, [navLinks, navMode, pathname])

  const isLinkActive = (href: string) => activeSection === href

  // Cierre defensivo del drawer mobile ante cualquier cambio de ruta. Los
  // handlers ya hacen setIsOpen(false) al click, pero hay navegaciones que
  // no pasan por ellos (botón atrás del celular, links del contenido de la
  // página): sin esto el drawer quedaba abierto tapando la página nueva.
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!supabase) {
      setUser(null)
      return
    }

    let isMounted = true

    const loadUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (!isMounted) {
        return
      }

      // Importante: si ya tenemos un user (vino vía initialUser desde el
      // server), no lo sobrescribimos con null si esta llamada cliente
      // devuelve null por timing (cookies aún no sincronizadas, race del
      // primer paint, etc.). El logout real llega por onAuthStateChange,
      // que sí va a setear null cuando corresponda. Sin este guard, al
      // entrar a páginas como /filosofia el navbar parpadeaba en
      // "Ingresar" hasta que llegaba el evento de auth.
      setUser((previous) => currentUser ?? previous)
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Guard contra setState después del unmount. Sin esto, si llega un
      // evento de auth entre el desmontaje y el unsubscribe, React tira
      // warning "Can't perform a React state update on a component that
      // hasn't mounted yet".
      if (isMounted) {
        setUser(session?.user ?? null)
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const onLogout = async () => {
    if (!supabase) {
      return
    }

    await supabase.auth.signOut()
    setIsOpen(false)
    router.push("/")
    router.refresh()
  }

  const initials = user?.email ? user.email.charAt(0).toUpperCase() : "U"
  // En el mundo Desk, la auth lleva al login/registro propio del Desk (otro
  // dominio), no al de la Academy. En el resto del sitio, a la auth normal.
  const onDesk = (pathname ?? "").startsWith("/desk")
  const navLoginHref = onDesk ? "https://desk.flowdex.com.ar" : "/login"
  const navRegisterHref = onDesk ? "https://desk.flowdex.com.ar/?registro=1" : "/register"
  const loginLabel = language === "es" ? "Ingresar" : "Login"
  const dashboardLabel = language === "es" ? "Panel" : "Dashboard"
  const logoutLabel = language === "es" ? "Salir" : "Logout"

  // Todo el Desk es su propio mundo (tema terminal, top bar propio): sin navbar de la
  // Academy. Evita la doble barra apilada y mantiene el attention ratio cerca de 1:1.
  if ((pathname ?? "").startsWith("/desk")) return null

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a
            href={navMode === "marketing" ? "#hero" : "/"}
            onClick={(e) => {
              e.preventDefault()
              if (navMode === "marketing") {
                navigateToSection("#hero")
                return
              }
              setIsOpen(false)
              router.push("/")
            }}
            className="flex items-center gap-2 group"
          >
            {/* priority=true para que Next/Image marque el logo como LCP
                (fetchpriority="high"). Lighthouse mayo 2026 detecto este
                logo como elemento LCP en desktop y pidio prioridad alta. */}
            <OrbitalIcon size={36} animate={false} priority />
            <span className=" text-xl sm:text-2xl tracking-tight text-white">
              FLOWDEX
              <sup className="text-[10px] text-[#888888] ml-0.5">™</sup>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navMode === "minimal" && (
              <>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs text-[#888888] transition-colors hover:text-white"
                >
                  ← Volver al inicio
                </Link>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#7DD4C0]/25 bg-[#7DD4C0]/5 px-3 py-1.5">
                  <Lock size={12} className="text-[#7DD4C0]" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#A8DACE]">
                    Sitio seguro · pago protegido
                  </span>
                </div>
              </>
            )}
            {navLinks.map((link) => {
              if (link.type === "external") {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#888888] transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </a>
                )
              }

              // Featured link: tratamiento minimo. Texto normal con un
              // compass chico en teal apagado al lado. Sin chip, sin
              // borde, sin background — la primera version con chip
              // dorado mataba la paleta sobria del navbar y competia
              // con el CTA "Comenzar". El icono solo es suficiente para
              // diferenciar sin gritar. Aplica solo a "Por dónde
              // empezar" (RouteSelector).
              if (link.featured) {
                const isActive = isLinkActive(link.href)
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleLinkClick(link)
                    }}
                    className={`inline-flex items-center gap-1.5 text-sm transition-colors duration-200 ${
                      isActive
                        ? "text-[#DDF7F1]"
                        : "text-[#A8A8A8] hover:text-white"
                    }`}
                  >
                    <Compass size={13} className="shrink-0 text-[#7DD4C0]/65" aria-hidden="true" />
                    {link.label}
                  </a>
                )
              }

              // Live link: dot dorado pulsante a la izquierda del label.
              // Reservado para items con ventana de tiempo abierta — hoy
              // "Programa Fundador" durante el periodo de postulación.
              // Cuando isActive (estás navegando esa página), el label
              // toma un dorado claro en vez del celeste habitual, para
              // mantener la coherencia visual con el accent del item.
              if (link.live) {
                const isActive = isLinkActive(link.href)
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleLinkClick(link)
                    }}
                    className={`inline-flex items-center gap-2 text-sm transition-colors duration-200 ${
                      isActive
                        ? "text-[#E8DDB8]"
                        : "text-[#A8A8A8] hover:text-white"
                    }`}
                  >
                    <span
                      className="nav-dot-live inline-block size-1.5 rounded-full bg-[#D4B86A]"
                      aria-hidden="true"
                    />
                    {link.label}
                  </a>
                )
              }

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick(link)
                  }}
                  className={`text-sm transition-colors duration-200 ${
                    isLinkActive(link.href)
                      ? "text-[#DDF7F1]"
                      : "text-[#888888] hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              )
            })}

          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Link
                  href={navLoginHref}
                  className="hidden sm:inline-flex h-10 items-center px-4 text-sm font-medium text-white border border-[#2A2A2A] rounded-lg hover:border-[#7DD4C0]/50 hover:bg-white/5 transition-all duration-300"
                >
                  {loginLabel}
                </Link>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex h-10 items-center gap-2 px-4 text-sm font-medium text-white border border-[#2A2A2A] rounded-lg hover:border-[#7DD4C0]/50 hover:bg-white/5 transition-all duration-300"
                >
                  <LayoutDashboard size={16} />
                  {dashboardLabel}
                </Link>
                <button
                  onClick={onLogout}
                  className="inline-flex h-10 items-center gap-2 px-3 text-sm text-[#CCCCCC] border border-[#2A2A2A] rounded-lg hover:border-[#7DD4C0]/50 hover:text-white transition-all"
                >
                  <Avatar className="size-6 border border-[#2A2A2A]">
                    <AvatarFallback className="bg-[#1A1A1A] text-[10px] font-semibold text-[#7DD4C0]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <LogOut size={14} />
                  {logoutLabel}
                </button>
                <div className="h-6 w-px bg-[#2A2A2A]" />
              </div>
            )}

            {/* CTA Button - Desktop. Antes scrolleaba a #programas (sección
                de cursos). Cambiado mayo 2026 a /register — el CTA primario
                del navbar de un sitio de pago debe llevar a registro, no a
                navegar más contenido. Para ver el catálogo el usuario tiene
                los links "Inversión / Trading / Inner Circle" en el menú. */}
            {!user && navMode === "marketing" && (
              <Link
                href={navRegisterHref}
                className="hidden lg:inline-flex h-10 items-center px-5 text-sm font-medium text-[#0A0A0A] rounded-lg transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)",
                }}
              >
                {t("nav.start")}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-white"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-4 py-6 flex flex-col items-center gap-4">
              {navLinks.map((link) => {
                if (link.type === "external") {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="w-full max-w-md py-2 text-center text-lg text-[#888888] transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  )
                }

                // Mismo tratamiento minimo que en desktop: texto normal
                // con compass al lado, sin chip ni borde. Mantiene el
                // tamaño del item mobile (text-lg) para no romper la
                // grilla del menu.
                if (link.featured) {
                  const isActive = isLinkActive(link.href)
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault()
                        handleLinkClick(link)
                      }}
                      className={`inline-flex w-full max-w-md items-center justify-center gap-2 py-2 text-center text-lg transition-colors ${
                        isActive
                          ? "text-[#DDF7F1]"
                          : "text-[#A8A8A8] hover:text-white"
                      }`}
                    >
                      <Compass size={15} className="shrink-0 text-[#7DD4C0]/65" aria-hidden="true" />
                      {link.label}
                    </a>
                  )
                }

                // Live link en mobile: mismo dot dorado pulsante, escalado
                // un poco para acompañar el text-lg del drawer.
                if (link.live) {
                  const isActive = isLinkActive(link.href)
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault()
                        handleLinkClick(link)
                      }}
                      className={`inline-flex w-full max-w-md items-center justify-center gap-2.5 py-2 text-center text-lg transition-colors ${
                        isActive
                          ? "text-[#E8DDB8]"
                          : "text-[#A8A8A8] hover:text-white"
                      }`}
                    >
                      <span
                        className="nav-dot-live inline-block size-2 rounded-full bg-[#D4B86A]"
                        aria-hidden="true"
                      />
                      {link.label}
                    </a>
                  )
                }

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleLinkClick(link)
                    }}
                    className={`w-full max-w-md text-center text-lg transition-colors py-2 ${
                      isLinkActive(link.href)
                        ? "text-[#DDF7F1]"
                        : "text-[#888888] hover:text-white"
                    }`}
                  >
                    {link.label}
                  </a>
                )
              })}

              {!user ? (
                <>
                  <Link
                    href={navLoginHref}
                    onClick={() => setIsOpen(false)}
                    className="w-full max-w-md mt-2 px-5 py-3 text-center text-sm font-medium text-white border border-[#2A2A2A] rounded-lg"
                  >
                    {loginLabel}
                  </Link>
                  {navMode === "marketing" && (
                  <Link
                    href={navRegisterHref}
                    onClick={() => setIsOpen(false)}
                    className="w-full max-w-md px-5 py-3 text-center text-sm font-medium text-[#0A0A0A] rounded-lg"
                    style={{
                      background: "linear-gradient(135deg, #5BB8D4, #7DD4C0)",
                    }}
                  >
                    {t("nav.start")}
                  </Link>
                  )}
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full max-w-md mt-2 px-5 py-3 text-center text-sm font-medium text-white border border-[#2A2A2A] rounded-lg"
                  >
                    {dashboardLabel}
                  </Link>
                  <button
                    onClick={onLogout}
                    className="w-full max-w-md px-5 py-3 text-center text-sm font-medium text-[#CCCCCC] border border-[#2A2A2A] rounded-lg"
                  >
                    {logoutLabel}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
