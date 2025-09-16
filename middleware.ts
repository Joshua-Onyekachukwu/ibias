import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/settings',
  '/admin',
]

// Routes that require admin access
const ADMIN_ROUTES = [
  '/admin'
]

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth',
  '/pricing',
  '/about',
  '/contact',
  '/api/auth',
  '/api/webhooks'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  )
  
  // Check if route is public
  if (isPublicRoute(pathname)) {
    return response
  }

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )
  
  try {
    // Get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      return redirectToAuth(request)
    }

    // Check if route requires authentication
    if (isProtectedRoute(pathname)) {
      if (!session) {
        return redirectToAuth(request)
      }

      // Check admin access
      if (isAdminRoute(pathname)) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        
        if (!profile || profile.role !== 'admin') {
          return new NextResponse(
            JSON.stringify({ error: 'Insufficient permissions' }),
            { 
              status: 403, 
              headers: { 'Content-Type': 'application/json' } 
            }
          )
        }
      }
    }

    return response
  } catch (error) {
    console.error('Auth middleware error:', error)
    
    // For API routes, return JSON error
    if (pathname.startsWith('/api/')) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication error' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      )
    }
    
    // For page routes, redirect to auth page
    return redirectToAuth(request)
  }
}

/**
 * Check if route is public
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => {
    if (route === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(route)
  })
}

/**
 * Check if route requires authentication
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route))
}

/**
 * Check if route requires admin access
 */
function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(route => pathname.startsWith(route))
}

/**
 * Redirect to authentication page
 */
function redirectToAuth(request: NextRequest): NextResponse {
  const redirectUrl = new URL('/auth?mode=signin', request.url)
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};