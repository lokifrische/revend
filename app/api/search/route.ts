import { NextRequest, NextResponse } from 'next/server'
import { searchFamilies } from '@/lib/db'
import { dbFamilyToDevice } from '@/lib/adapters'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  // Rate limiting: 60 requests per minute per IP
  const ip = getClientIp(req.headers)
  const rateLimitResult = rateLimit(ip, { maxRequests: 60, windowSeconds: 60 })

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

  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (q.length < 2) {
    return NextResponse.json([])
  }
  try {
    const families = await searchFamilies(q, 8)
    const devices = families.map(dbFamilyToDevice)
    return NextResponse.json(devices, {
      headers: {
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
      },
    })
  } catch (err) {
    console.error('[api/search] error:', err)
    return NextResponse.json([])
  }
}
