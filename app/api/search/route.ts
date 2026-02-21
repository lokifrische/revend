import { NextRequest, NextResponse } from 'next/server'
import { searchFamilies } from '@/lib/db'
import { dbFamilyToDevice } from '@/lib/adapters'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (q.length < 2) {
    return NextResponse.json([])
  }
  try {
    const families = await searchFamilies(q, 8)
    const devices = families.map(dbFamilyToDevice)
    return NextResponse.json(devices)
  } catch (err) {
    console.error('[api/search] error:', err)
    return NextResponse.json([])
  }
}
