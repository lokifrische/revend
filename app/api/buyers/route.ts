import { NextResponse } from 'next/server'
import { getBuyers } from '@/lib/db'
import { dbBuyerToBuyer } from '@/lib/adapters'

export const runtime = 'edge'

export async function GET() {
  try {
    const dbBuyers = await getBuyers()
    const buyers = dbBuyers.map(b => ({
      ...dbBuyerToBuyer(b),
      website: b.website,
    }))
    return NextResponse.json(buyers, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' },
    })
  } catch (err) {
    console.error('[api/buyers] error:', err)
    return NextResponse.json([])
  }
}
