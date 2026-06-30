import { createServerClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse, type NextRequest } from "next/server"

// Proxy de Flowdex (Next.js 16 convention, reemplaza middleware.ts).
// Primera capa defensiva de auth para rutas privadas. Corre en Edge Runtime
// antes del handler real.
//
// Comportamiento:
// - Rutas web sin sesión → redirect a /login?returnTo=<original>
// - Rutas API sin sesión → respuesta 401 JSON
// - Sesión con must_change_password=true → redirect a /reset-password?forced=1
//   (solo aplica a rutas web, las APIs devuelven 401 normal si corresponde)
// - Acceso a /admin sin role admin → redirect /dashboard (web) o 403 (api)
//
// Los route handlers individuales siguen haciendo su propio auth check como
// segunda capa (defense in depth). El proxy atrapa el primer nivel antes de
// tocar lógica de negocio.
//
// Sobre /courses: la página /courses (sin slug) es pantalla de marketing
// pública. Por eso el matcher usa /courses/:path+ con `+` (1 o más segmentos)
// en lugar de `:path*`. Eso protege /courses/<slug> y sub-rutas pero deja
// /courses como página libre.
//
// Sobre /filosofia: aunque la página tiene su propio gate (mostrar contenido
// solo a alumnos con curso comprado), está adentro del flow privado del
// dashboard. El link no es público, así que la protegemos también.

export async function proxy(request: NextRequest) {
  const response = NextResponse.next()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return response
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  // Usamos getUser() en lugar de getSession(). getSession() devuelve el user
  // object directo de la cookie firmada SIN validar contra el server de
  // Supabase Auth — Supabase loguea warning porque ese dato "podría ser
  // inseguro" si alguien rompiera la firma. getUser() hace round-trip al
  // server de Auth y autentica el dato. Round-trip adicional vale la pena
  // porque el proxy autoriza acceso a rutas sensibles (/admin).
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname, search } = request.nextUrl
  const isApiPath = pathname.startsWith("/api/")
  const isAdminPath = pathname.startsWith("/admin")

  if (!user) {
    if (isApiPath) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 })
    }
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("returnTo", pathname + search)
    return NextResponse.redirect(loginUrl)
  }

  // Usuario autenticado: validaciones extra solo para rutas web. Las APIs no
  // se redirigen, devuelven status apropiado cuando aplica.
  if (!isApiPath) {
    const mustChangePassword = user.user_metadata?.must_change_password === true
    if (mustChangePassword) {
      return NextResponse.redirect(new URL("/reset-password?forced=1", request.url))
    }
  }

  if (isAdminPath) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()

    if (profile?.role !== "admin") {
      if (isApiPath) {
        return NextResponse.json({ error: "No autorizado." }, { status: 403 })
      }
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Trackear actividad real del usuario (no solo logueos explícitos).
  // Llamamos a la RPC touch_last_seen() que aplica throttle de 6h en SQL:
  // si last_seen_at es reciente, no escribe. Resultado: máximo 4 UPDATEs
  // por usuario activo por día. Cualquier visita "hoy" se refleja en el
  // panel (ventanas distintas), sin saturar la DB.
  //
  // Solo en rutas web (no APIs) — no queremos contar cada call de
  // /api/progress como "actividad". Awaiteamos sí o sí porque el query
  // builder de PostgREST es PromiseLike lazy: sin .then() / await la
  // request NUNCA sale del cliente. El RPC es UPDATE simple con guarda
  // SQL (un row, condición de tiempo) — overhead ~10-30ms por request,
  // aceptable para la garantía de que efectivamente trackea.
  if (!isApiPath) {
    try {
      await supabase.rpc("touch_last_seen")
    } catch {
      // Silenciamos errores: el tracking no debe romper navegación.
    }
  }

  return response
}

// Matcher: lista explícita de rutas protegidas. Mantener acotada y precisa
// para no matchear contenido público por accidente. Si en el futuro agregás
// una ruta privada nueva, sumala acá.
export const config = {
  matcher: [
    // Páginas web privadas
    "/dashboard",
    "/dashboard/:path*",
    "/courses/:path+",
    "/filosofia",
    "/filosofia/:path*",
    "/journal",
    "/journal/:path*",
    "/laboratorio",
    "/laboratorio/:path*",
    "/herramientas",
    "/herramientas/:path*",
    "/admin",
    "/admin/:path*",
    // APIs privadas
    "/api/admin/:path*",
    "/api/journal",
    "/api/journal/:path*",
    // NOTA: el checkout exprés (compra sin sesión) usa estas rutas como
    // invitado, así que NO van en el matcher — si las gateáramos acá, el proxy
    // cortaría con 401 "No autenticado." antes de llegar al handler. Cada uno
    // de estos handlers hace su propio control y soporta usuario logueado o
    // invitado: /api/orders/create, /api/payments/mercadopago/preference y
    // /api/payments/nowpayments/invoice.
    "/api/payments/mercadopago/quote",
    "/api/progress/:path*",
    "/api/user/:path*",
    "/api/discord/connect/:path*",
    "/api/telegram/invite/:path*",
  ],
}
