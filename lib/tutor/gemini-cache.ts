// Context caching de Gemini para el tutor IA.
//
// Cómo funciona:
// - El system prompt + el contenido del curso es enorme (~20-40K tokens) y se
//   repite en cada pregunta del alumno. Pagar full price por eso cada vez es
//   un desperdicio.
// - Gemini permite cachear ese bloque del lado server: pagás ~1/4 del precio
//   normal por los tokens cacheados.
// - Cada cache tiene un TTL (acá: 1 hora). Cuando expira, se crea uno nuevo.
//   El "name" del cache (ej: cachedContents/abc123) lo persistimos en Upstash
//   Redis para reutilizarlo entre invocations serverless.
//
// Fallback: si Upstash no está configurado o falla la creación del cache,
// el endpoint sigue funcionando sin cache (paga full price). Nunca rompe.

import { Redis } from "@upstash/redis"

const CACHE_TTL_SECONDS = 3600 // 1 hora; primer hit de cada hora paga full price.
const REDIS_KEY_PREFIX = "tutor:gemini-cache"
// Versión del prompt: si cambia el system prompt, bumpear esto para invalidar
// todos los caches viejos (sino el nuevo prompt convive con el viejo durante 1h).
const PROMPT_VERSION = "v4"

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return Redis.fromEnv()
}

function cacheKey(courseSlug: string, model: string) {
  return `${REDIS_KEY_PREFIX}:${PROMPT_VERSION}:${model}:${courseSlug}`
}

export async function getOrCreateCourseCache(params: {
  courseSlug: string
  systemPrompt: string
  apiKey: string
  model: string
}): Promise<string | null> {
  const { courseSlug, systemPrompt, apiKey, model } = params
  const redis = getRedis()
  const key = cacheKey(courseSlug, model)

  // 1) Cache hit en Redis: reusamos el name del cache de Gemini.
  if (redis) {
    try {
      const cached = await redis.get<string>(key)
      if (cached) return cached
    } catch (err) {
      console.error("[tutor-cache] Redis read failed:", err)
    }
  }

  // 2) Cache miss: crear cache nuevo en Gemini.
  const createUrl = `https://generativelanguage.googleapis.com/v1beta/cachedContents?key=${apiKey}`
  const body = {
    model: `models/${model}`,
    systemInstruction: { parts: [{ text: systemPrompt }] },
    ttl: `${CACHE_TTL_SECONDS}s`,
  }

  let cacheName: string | null = null
  try {
    const res = await fetch(createUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const errText = await res.text().catch(() => "")
      console.error("[tutor-cache] create failed:", res.status, errText)
      return null
    }
    const data = await res.json()
    cacheName = (data?.name as string | undefined) ?? null
  } catch (err) {
    console.error("[tutor-cache] create fetch error:", err)
    return null
  }

  if (!cacheName) return null

  // 3) Persistir en Redis con TTL un poco menor que el de Gemini para evitar
  //    referenciar un cache recién expirado.
  if (redis) {
    try {
      await redis.set(key, cacheName, { ex: CACHE_TTL_SECONDS - 60 })
    } catch (err) {
      console.error("[tutor-cache] Redis write failed:", err)
    }
  }

  return cacheName
}
