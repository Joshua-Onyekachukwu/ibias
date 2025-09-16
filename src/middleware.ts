import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest, NextResponse as NextResponseType } from 'next/server'
import { authMiddleware } from '@/middleware/auth'

type CookieOptions = {
  path?: string
  domain?: string
  maxAge?: number
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

export async function middleware(request: NextRequest) {
  // Run authentication middleware
  const authResponse = await authMiddleware(request)
  
  // If auth middleware returns a response (redirect, error, etc.), use it
  if (authResponse.status !== 200) {
    return authResponse
  }
  
  // Otherwise, continue with Supabase session handling
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({ name, value, ...options })
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({ name, value, ...options })
          })
        },
      },
    }
  )

  await supabase.auth.getUser()
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/webhooks (public webhooks)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks).*)',
  ],
}