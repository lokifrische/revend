import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'revend-admin-2026'

export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      // No auth header - prompt for credentials
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Dashboard"',
        },
      })
    }

    // Verify credentials
    const base64Credentials = authHeader.replace('Basic ', '')
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [, password] = credentials.split(':')

    if (password !== ADMIN_PASSWORD) {
      // Wrong password
      return new NextResponse('Invalid credentials', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Dashboard"',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
