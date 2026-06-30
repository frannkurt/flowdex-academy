export function isProductionEnvironment() {
  return process.env.NODE_ENV === "production"
}

export function hasDistributedRateLimitConfig() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

export function hasTurnstileConfig() {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY)
}