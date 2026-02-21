import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { randomUUID } from 'crypto'

// Fallback buyer website map for mock/local data
const BUYER_WEBSITES: Record<string, string> = {
  buybacktree: 'https://www.buybacktree.com',
  gazelle: 'https://www.gazelle.com',
  gadgetgone: 'https://www.gadgetgone.com',
  itsworthmore: 'https://www.itsworthmore.com',
  swappa: 'https://swappa.com',
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ buyer: string; device: string }> }
) {
  const { buyer: buyerSlug, device: deviceSlug } = await params
  const searchParams = req.nextUrl.searchParams

  const conditionSlug = searchParams.get('condition') ?? ''
  const offerCents = parseInt(searchParams.get('offer') ?? '0', 10) || null
  const deviceId = searchParams.get('device_id') ?? undefined
  const buyerId = searchParams.get('buyer_id') ?? undefined
  const conditionId = searchParams.get('condition_id') ?? undefined
  const sessionId = searchParams.get('session_id') ?? undefined

  // Generate a unique click token for this session
  const clickToken = randomUUID()

  // ── Log click to Supabase ─────────────────────────────────
  try {
    const supabase = createServiceClient()
    await supabase.from('affiliate_clicks').insert({
      id: clickToken,
      device_id: deviceId || null,
      buyer_id: buyerId || null,
      condition_id: conditionId || null,
      offer_cents: offerCents,
      session_id: sessionId || null,
      clicked_at: new Date().toISOString(),
    })
  } catch (err) {
    // Don't block redirect on logging failure — log silently
    console.error('[affiliate_click] Failed to log:', err)
  }

  // ── Resolve buyer destination URL ─────────────────────────
  let buyerWebsite: string | null = null

  // Try Supabase first (real data path)
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
      // ignore, fall through to slug-based lookup
    }
  }

  // Fall back to slug-based map (mock data path)
  if (!buyerWebsite) {
    buyerWebsite = BUYER_WEBSITES[buyerSlug] ?? null
  }

  if (!buyerWebsite) {
    // No destination — redirect back with an error
    const fallback = new URL('/sell', req.nextUrl.origin)
    fallback.searchParams.set('error', 'buyer_not_found')
    return NextResponse.redirect(fallback)
  }

  // ── Build tracking URL ────────────────────────────────────
  const destination = new URL(buyerWebsite)
  destination.searchParams.set('ref', 'revend')
  destination.searchParams.set('click_id', clickToken)
  destination.searchParams.set('device', deviceSlug)
  if (conditionSlug) destination.searchParams.set('condition', conditionSlug)

  return NextResponse.redirect(destination.toString(), { status: 302 })
}
