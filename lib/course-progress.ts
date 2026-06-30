import { createSupabaseBrowserClient } from "@/lib/supabase/client"

let pendingUserIdRequest: Promise<string | null> | null = null
const remoteWriteQueue = new Map<string, Promise<void>>()

async function getCurrentUserId() {
  if (pendingUserIdRequest) {
    return pendingUserIdRequest
  }

  pendingUserIdRequest = (async () => {
    const supabase = createSupabaseBrowserClient()

    if (!supabase) {
      return null
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    return user?.id ?? null
  })()

  try {
    return await pendingUserIdRequest
  } finally {
    pendingUserIdRequest = null
  }
}

function normalizeCompletedModules(raw: string | null, maxModuleNumber?: number): number[] {
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return Array.from(
      new Set(
        parsed
          .map((value) => Number(value))
          .filter((value) => Number.isInteger(value) && value >= 1)
          .filter((value) => (maxModuleNumber ? value <= maxModuleNumber : true))
      )
    ).sort((a, b) => a - b)
  } catch {
    return []
  }
}

async function fetchRemoteCompletedModules(courseSlug: string, maxModuleNumber?: number): Promise<number[] | null> {
  try {
    const response = await fetch(`/api/progress/${courseSlug}`, {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    })

    if (!response.ok) {
      return null
    }

    const payload = (await response.json()) as { completedModules?: unknown }

    return normalizeCompletedModules(
      JSON.stringify(Array.isArray(payload.completedModules) ? payload.completedModules : []),
      maxModuleNumber
    )
  } catch {
    return null
  }
}

// Escrituras remotas que no llegaron a confirmarse, por curso. Se reintentan
// cuando el usuario vuelve a la pestaña o recupera conexión, en vez de
// perderse en silencio.
const pendingRemoteWrites = new Map<string, number[]>()
let flushListenersAttached = false

function attachFlushListeners() {
  if (flushListenersAttached || typeof window === "undefined") {
    return
  }
  flushListenersAttached = true
  const flush = () => {
    for (const [slug, modules] of pendingRemoteWrites) {
      void persistRemoteCompletedModules(slug, modules)
    }
  }
  window.addEventListener("online", flush)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      flush()
    }
  })
}

async function persistRemoteCompletedModules(courseSlug: string, modules: number[]) {
  attachFlushListeners()
  const maxAttempts = 3
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(`/api/progress/${courseSlug}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completedModules: modules }),
      })
      if (res.ok) {
        pendingRemoteWrites.delete(courseSlug)
        return
      }
      // 4xx (sesión/acceso): no tiene sentido reintentar en el acto, pero lo
      // dejamos pendiente por si se resuelve (renovación de acceso, re-login).
      if (res.status < 500) {
        break
      }
    } catch {
      // Red caída: reintentamos con backoff.
    }
    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
    }
  }
  // No se pudo confirmar: queda pendiente para reintentar al volver a la
  // pestaña o recuperar conexión.
  pendingRemoteWrites.set(courseSlug, modules)
}

// Lee el módulo activo desde la URL (?m=N). Devuelve null si no hay un valor
// válido. Se usa para retomar la posición exacta del alumno (ej. al volver del
// examen) en vez de caer siempre en el primer módulo incompleto.
export function getModuleParamFromUrl(): number | null {
  if (typeof window === "undefined") {
    return null
  }
  const raw = new URLSearchParams(window.location.search).get("m")
  if (!raw) {
    return null
  }
  const parsed = Number.parseInt(raw, 10)
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : null
}

// Escribe el módulo activo en la URL (?m=N) sin recargar, para que la posición
// sobreviva a un reload y los módulos queden deep-linkeables/compartibles.
export function setModuleParamInUrl(moduleNumber: number) {
  if (typeof window === "undefined" || moduleNumber <= 0) {
    return
  }
  const url = new URL(window.location.href)
  url.searchParams.set("m", String(moduleNumber))
  url.hash = ""
  window.history.replaceState(null, "", `${url.pathname}${url.search}`)
}

export async function resolveProgressStorageKey(baseKey: string) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return baseKey
  }

  return `${baseKey}:user:${userId}`
}

export async function loadCompletedModules(baseKey: string, maxModuleNumber?: number, courseSlug?: string) {
  const storageKey = await resolveProgressStorageKey(baseKey)
  const userScopedRaw = window.localStorage.getItem(storageKey)
  let localModules = normalizeCompletedModules(userScopedRaw, maxModuleNumber)

  if (userScopedRaw) {
    if (localModules.length === 0) {
      window.localStorage.removeItem(storageKey)
    }
  }

  if (storageKey !== baseKey && localModules.length === 0) {
    const legacyRaw = window.localStorage.getItem(baseKey)
    if (legacyRaw) {
      const migratedModules = normalizeCompletedModules(legacyRaw, maxModuleNumber)
      if (migratedModules.length > 0) {
        window.localStorage.setItem(storageKey, JSON.stringify(migratedModules))
      }
      window.localStorage.removeItem(baseKey)
      localModules = migratedModules
    }
  }

  if (!courseSlug) {
    return { storageKey, modules: localModules }
  }

  const remoteModules = await fetchRemoteCompletedModules(courseSlug, maxModuleNumber)

  if (remoteModules !== null) {
    // Unimos local y remoto en vez de que uno pise al otro. Completar un módulo
    // es aditivo, así que la unión nunca pierde una marca hecha en este equipo
    // ni en otro. Si la unión agrega algo que el remoto no tenía, lo sincronizamos.
    const merged = Array.from(new Set([...localModules, ...remoteModules])).sort((a, b) => a - b)
    window.localStorage.setItem(storageKey, JSON.stringify(merged))
    if (merged.length !== remoteModules.length) {
      void persistRemoteCompletedModules(courseSlug, merged)
    }
    return { storageKey, modules: merged }
  }

  return { storageKey, modules: localModules }
}

export function persistCompletedModules(storageKey: string, modules: number[], courseSlug?: string) {
  window.localStorage.setItem(storageKey, JSON.stringify(modules))

  if (!courseSlug) {
    return
  }

  const previous = remoteWriteQueue.get(courseSlug) ?? Promise.resolve()
  const next = previous.then(() => persistRemoteCompletedModules(courseSlug, modules))
  remoteWriteQueue.set(courseSlug, next)
}
