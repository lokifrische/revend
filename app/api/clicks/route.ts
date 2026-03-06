import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { randomUUID } from 'crypto'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// Fallback buyer website map for mock/local data
const BUYER_WEBSITES: Record<string, string> = {
  buybacktree: 'https://www.buybacktree.com',
  gazelle: 'https://www.gazelle.com',
  gadgetgone: 'https://www.gadgetgone.com',
  itsworthmore: 'https://www.itsworthmore.com',
  swappa: 'https://swappa.com',
}

/**
 * POST /api/clicks
 * Client-side fallback for logging affiliate clicks from client components.
 *
 * Body: { deviceId?, buyerId?, conditionId?, offerCents?, sessionId?, buyerSlug?, deviceSlug?, conditionSlug? }
 * Returns: { clickId, redirectUrl }
 */
export async function POST(req: NextRequest) {
  // Rate limiting: 10 clicks per minute per IP (generous for legitimate users)
  const ip = getClientIp(req.headers)
  const rateLimitResult = rateLimit(ip, { maxRequests: 10, windowSeconds: 60 })

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
        },
      }
    )
  }
  let body: {
    deviceId?: string
    buyerId?: string
    conditionId?: string
    offerCents?: number
    sessionId?: string
    buyerSlug?: string
    deviceSlug?: string
    conditionSlug?: string
  } = {}

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { deviceId, buyerId, conditionId, offerCents, sessionId, buyerSlug, deviceSlug, conditionSlug } = body
  const clickId = randomUUID()

  // ── Log click ─────────────────────────────────────────────
  try {
    const supabase = createServiceClient()
    await supabase.from('affiliate_clicks').insert({
      id: clickId,
      device_id: deviceId ?? null,
      buyer_id: buyerId ?? null,
      condition_id: conditionId ?? null,
      offer_cents: offerCents ?? null,
      session_id: sessionId ?? null,
      clicked_at: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[api/clicks] Failed to log:', err)
    // Still return a clickId — don't block the user
  }

  // ── Resolve redirect URL ──────────────────────────────────
  let buyerWebsite: string | null = null

  if (buyerId) {
    try {
      const supabase = createServiceClient()
      const { data } = await supabase
        .from('buyers')
        .select('website')
        .eq('id', buyerId)
        .single()
      buyerWebsite = data?.website ?? null
    } catch {
      // ignore
    }
  }

  if (!buyerWebsite && buyerSlug) {
    buyerWebsite = BUYER_WEBSITES[buyerSlug] ?? null
  }

  let redirectUrl: string | null = null
  if (buyerWebsite && deviceSlug) {
    const url = new URL(buyerWebsite)
    url.searchParams.set('ref', 'revend')
    url.searchParams.set('click_id', clickId)
    url.searchParams.set('device', deviceSlug)
    if (conditionSlug) url.searchParams.set('condition', conditionSlug)
    redirectUrl = url.toString()
  }

  return NextResponse.json({ clickId, redirectUrl })
}
