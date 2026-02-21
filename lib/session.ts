/**
 * lib/session.ts
 * Browser session ID generation and retrieval.
 * Generates a stable UUID per browser session stored in localStorage.
 * Used for affiliate click deduplication.
 */

const SESSION_KEY = 'revend_session_id'

/**
 * Get or create a persistent session ID stored in localStorage.
 * Safe to call in any client component — returns null during SSR.
 */
export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null

  try {
    let id = localStorage.getItem(SESSION_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    // localStorage blocked (e.g. private browsing strict mode)
    return crypto.randomUUID()
  }
}

/**
 * Build the /go/[buyer]/[device] URL with all tracking params included.
 */
export function buildGoUrl(opts: {
  buyerSlug: string
  deviceSlug: string
  conditionSlug: string
  offerCents: number
  deviceId?: string
  buyerId?: string
  conditionId?: string
}): string {
  const { buyerSlug, deviceSlug, conditionSlug, offerCents, deviceId, buyerId, conditionId } = opts
  const sessionId = getSessionId()

  const url = new URL(`/go/${buyerSlug}/${deviceSlug}`, window.location.origin)
  url.searchParams.set('condition', conditionSlug)
  url.searchParams.set('offer', String(offerCents))
  if (deviceId) url.searchParams.set('device_id', deviceId)
  if (buyerId) url.searchParams.set('buyer_id', buyerId)
  if (conditionId) url.searchParams.set('condition_id', conditionId)
  if (sessionId) url.searchParams.set('session_id', sessionId)

  return url.toString()
}
