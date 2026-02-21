import { NextResponse } from 'next/server'
import { getPopularFamilies } from '@/lib/db'
import { dbFamilyToDevice } from '@/lib/adapters'

export const runtime = 'edge'

export async function GET() {
  try {
    const families = await getPopularFamilies(8)
    const devices = families.map(dbFamilyToDevice)
    return NextResponse.json(devices, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=60' },
    })
  } catch (err) {
    console.error('[api/popular] error:', err)
    return NextResponse.json([])
  }
}
