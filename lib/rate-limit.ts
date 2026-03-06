/**
 * Simple in-memory rate limiter for Edge runtime
 * Note: This is MVP-level protection. For production scale, use Upstash Redis or Vercel's rate limiting.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store (resets on cold starts, but good enough for MVP)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetAt) {
        rateLimitStore.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed within the window
   */
  maxRequests: number
  /**
   * Time window in seconds
   */
  windowSeconds: number
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const windowMs = config.windowSeconds * 1000

  let entry = rateLimitStore.get(identifier)

  // If no entry exists or window has expired, create new entry
  if (!entry || now > entry.resetAt) {
    entry = {
      count: 1,
      resetAt: now + windowMs,
    }
    rateLimitStore.set(identifier, entry)
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      reset: entry.resetAt,
    }
  }

  // Increment count
  entry.count++

  // Check if over limit
  if (entry.count > config.maxRequests) {
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      reset: entry.resetAt,
    }
  }

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    reset: entry.resetAt,
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIp(headers: Headers): string {
  // Try various headers that might contain the real IP
  return (
    headers.get('x-forwarded-for')?.split(',')[0] ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    'unknown'
  )
}
