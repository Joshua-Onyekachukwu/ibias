import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { sessionManager } from '@/lib/services/sessionManager'
import { rateLimiter } from '@/lib/auth/rate-limiter'

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/settings',
  '/admin',
  '/api/protected'
]

// Routes that require admin access
const ADMIN_ROUTES = [
  '/admin'
]

// Routes that require MFA
const MFA_REQUIRED_ROUTES = [
  '/admin',
  '/settings/security'
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

export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()
  
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
  
  // Get client IP for rate limiting
  const clientIP = getClientIP(request)
  
  try {
    // Check if route is public
    if (isPublicRoute(pathname)) {
      return response
    }

    // Rate limiting for authentication endpoints
    if (pathname.startsWith('/api/auth/')) {
      const rateLimit = await rateLimiter.checkRateLimit(
        clientIP,
        'login',
        { maxAttempts: 10, windowMs: 15 * 60 * 1000 }
      )
      
      if (!rateLimit.allowed) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Too many requests', 
            resetTime: rateLimit.resetTime 
          }),
          { 
            status: 429, 
            headers: { 'Content-Type': 'application/json' } 
          }
        )
      }
    }

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

      // Validate session with our session manager
      const sessionId = request.cookies.get('session_id')?.value
      if (sessionId) {
        const sessionInfo = await sessionManager.validateSession(sessionId)
        if (!sessionInfo) {
          // Session expired or invalid
          await supabase.auth.signOut()
          return redirectToAuth(request)
        }
        
        // Update session activity
        await sessionManager.updateActivity(sessionId)
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

      // Check MFA requirement
      if (isMFARequiredRoute(pathname)) {
        // For now, skip MFA check until tables are created
        // const mfaEnabled = await mfaService.isMFAEnabled(session.user.id)
        // const mfaVerified = request.cookies.get('mfa_verified')?.value === 'true'
        
        // if (mfaEnabled && !mfaVerified) {
        //   return redirectToMFA(request)
        // }
      }
    }

    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
    )

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
    
    // For page routes, redirect to error page
    return NextResponse.redirect(new URL('/error', request.url))
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
 * Check if route requires MFA
 */
function isMFARequiredRoute(pathname: string): boolean {
  return MFA_REQUIRED_ROUTES.some(route => pathname.startsWith(route))
}

/**
 * Redirect to authentication page
 */
function redirectToAuth(request: NextRequest): NextResponse {
  const redirectUrl = new URL('/auth', request.url)
  redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
  return NextResponse.redirect(redirectUrl)
}

/**
 * Redirect to MFA verification page
 */
// function _redirectToMFA(request: NextRequest): NextResponse {
//   const redirectUrl = new URL('/auth/mfa', request.url)
//   redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
//   return NextResponse.redirect(redirectUrl)
// }

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  // Fallback to a default IP
  return '127.0.0.1'
}

/**
 * Log security event
 */
// async function _logSecurityEvent(
//   userId: string | undefined,
//   eventType: string,
//   description: string,
//   ipAddress: string,
//   userAgent: string
// ) {
//   try {
//     // For now, just log to console until database functions are ready
//     console.log('Security event:', {
//       userId,
//       eventType,
//       description,
//       ipAddress,
//       userAgent,
//       timestamp: new Date().toISOString()
//     })
    
//     // Real implementation would use:
//     // await supabase.rpc('log_security_event', {
//     //   p_user_id: userId,
//     //   p_event_type: eventType,
//     //   p_description: description,
//     //   p_ip_address: ipAddress,
//     //   p_user_agent: userAgent
//     // })
//   } catch (error) {
//     console.error('Failed to log security event:', error)
//   }
// }