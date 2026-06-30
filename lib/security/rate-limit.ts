import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

type RateLimitResult = {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

const FALLBACK_BUCKETS = new Map<string, number[]>()

function getRedisClient() {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!redisUrl || !redisToken) {
    return null
  }

  return Redis.fromEnv()
}

function fallbackSlidingWindow(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const recent = (FALLBACK_BUCKETS.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs)

  recent.push(now)
  FALLBACK_BUCKETS.set(key, recent)

  const count = recent.length
  const oldestTimestamp = recent[0] ?? now

  return {
    success: count <= limit,
    limit,
    remaining: Math.max(0, limit - count),
    reset: oldestTimestamp + windowMs,
  }
}

export async function limitBySlidingWindow(params: {
  key: string
  prefix: string
  limit: number
  windowMs: number
}): Promise<RateLimitResult> {
  const { key, prefix, limit, windowMs } = params
  const redis = getRedisClient()

  if (!redis) {
    return fallbackSlidingWindow(`${prefix}:${key}`, limit, windowMs)
  }

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${Math.ceil(windowMs / 1000)} s`),
    prefix,
  })

  const result = await limiter.limit(key)

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  }
}
