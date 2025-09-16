'use client'

import { createClient } from '@/utils/supabase/client'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: Date
  retryAfter?: number
}

export interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
  blockDurationMs: number
}

class RateLimiterService {
  private getSupabase() {
    return createClient()
  }

  // Default configurations for different actions
  private configs: Record<string, RateLimitConfig> = {
    login: {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
      blockDurationMs: 30 * 60 * 1000, // 30 minutes
    },
    signup: {
      maxAttempts: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
      blockDurationMs: 60 * 60 * 1000, // 1 hour
    },
    passwordReset: {
      maxAttempts: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
      blockDurationMs: 2 * 60 * 60 * 1000, // 2 hours
    },
    mfaVerification: {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
      blockDurationMs: 60 * 60 * 1000, // 1 hour
    }
  }

  /**
   * Check if an action is rate limited
   */
  async checkRateLimit(
    identifier: string,
    action: string,
    customConfig?: Partial<RateLimitConfig>
  ): Promise<RateLimitResult> {
    try {
      const config = { ...this.configs[action], ...customConfig }
      if (!config) {
        throw new Error(`Unknown action: ${action}`)
      }

      const now = new Date()
      const windowStart = new Date(now.getTime() - config.windowMs)
      const key = `${action}:${identifier}`

      // Get recent attempts
      const { data: attempts, error } = await this.getSupabase()
        .from('rate_limit_attempts')
        .select('*')
        .eq('key', key)
        .gte('created_at', windowStart.toISOString())
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error checking rate limit:', error)
        // Allow the request if we can't check (fail open)
        return {
          allowed: true,
          remaining: config.maxAttempts - 1,
          resetTime: new Date(now.getTime() + config.windowMs)
        }
      }

      const recentAttempts = attempts || []
      const attemptCount = recentAttempts.length

      // Check if user is currently blocked
      const lastAttempt = recentAttempts[0]
      if (lastAttempt && attemptCount >= config.maxAttempts) {
        const blockUntil = new Date(
          new Date(lastAttempt.created_at).getTime() + config.blockDurationMs
        )
        
        if (now < blockUntil) {
          return {
            allowed: false,
            remaining: 0,
            resetTime: blockUntil,
            retryAfter: Math.ceil((blockUntil.getTime() - now.getTime()) / 1000)
          }
        }
      }

      // Calculate remaining attempts
      const remaining = Math.max(0, config.maxAttempts - attemptCount)
      const resetTime = new Date(
        Math.max(
          now.getTime() + config.windowMs,
          recentAttempts.length > 0 
            ? new Date(recentAttempts[0].created_at).getTime() + config.windowMs
            : now.getTime() + config.windowMs
        )
      )

      return {
        allowed: remaining > 0,
        remaining: remaining - 1, // Account for current attempt
        resetTime
      }
    } catch (error) {
      console.error('Error in rate limit check:', error)
      // Fail open - allow the request
      return {
        allowed: true,
        remaining: this.configs[action]?.maxAttempts - 1 || 4,
        resetTime: new Date(Date.now() + (this.configs[action]?.windowMs || 15 * 60 * 1000))
      }
    }
  }

  /**
   * Record an attempt
   */
  async recordAttempt(
    identifier: string,
    action: string,
    success: boolean,
    metadata?: Record<string, string | number | boolean>
  ): Promise<void> {
    try {
      const key = `${action}:${identifier}`
      
      await this.getSupabase()
        .from('rate_limit_attempts')
        .insert({
          key,
          identifier,
          action,
          success,
          metadata: metadata || {},
          created_at: new Date().toISOString()
        })

      // Clean up old attempts (keep last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      await this.getSupabase()
        .from('rate_limit_attempts')
        .delete()
        .lt('created_at', thirtyDaysAgo.toISOString())
    } catch (error) {
      console.error('Error recording attempt:', error)
      // Don't throw - this shouldn't block the main operation
    }
  }

  /**
   * Reset rate limit for a specific identifier and action
   */
  async resetRateLimit(identifier: string, action: string): Promise<void> {
    try {
      const key = `${action}:${identifier}`
      
      await this.getSupabase()
        .from('rate_limit_attempts')
        .delete()
        .eq('key', key)
    } catch (error) {
      console.error('Error resetting rate limit:', error)
      throw new Error('Failed to reset rate limit')
    }
  }

  /**
   * Get rate limit status for an identifier and action
   */
  async getRateLimitStatus(
    identifier: string,
    action: string
  ): Promise<{
    isBlocked: boolean
    attemptsRemaining: number
    resetTime: Date
    totalAttempts: number
  }> {
    try {
      const config = this.configs[action]
      if (!config) {
        throw new Error(`Unknown action: ${action}`)
      }

      const now = new Date()
      const windowStart = new Date(now.getTime() - config.windowMs)
      const key = `${action}:${identifier}`

      const { data: attempts, error } = await this.getSupabase()
        .from('rate_limit_attempts')
        .select('*')
        .eq('key', key)
        .gte('created_at', windowStart.toISOString())
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error getting rate limit status:', error)
        return {
          isBlocked: false,
          attemptsRemaining: config.maxAttempts,
          resetTime: new Date(now.getTime() + config.windowMs),
          totalAttempts: 0
        }
      }

      const recentAttempts = attempts || []
      const attemptCount = recentAttempts.length
      const attemptsRemaining = Math.max(0, config.maxAttempts - attemptCount)

      // Check if blocked
      let isBlocked = false
      let resetTime = new Date(now.getTime() + config.windowMs)

      if (attemptCount >= config.maxAttempts && recentAttempts[0]) {
        const blockUntil = new Date(
          new Date(recentAttempts[0].created_at).getTime() + config.blockDurationMs
        )
        
        if (now < blockUntil) {
          isBlocked = true
          resetTime = blockUntil
        }
      }

      return {
        isBlocked,
        attemptsRemaining,
        resetTime,
        totalAttempts: attemptCount
      }
    } catch (error) {
      console.error('Error getting rate limit status:', error)
      const config = this.configs[action]
      return {
        isBlocked: false,
        attemptsRemaining: config?.maxAttempts || 5,
        resetTime: new Date(Date.now() + (config?.windowMs || 15 * 60 * 1000)),
        totalAttempts: 0
      }
    }
  }

  /**
   * Get client IP address for rate limiting
   */
  getClientIdentifier(request?: Request): string {
    if (typeof window !== 'undefined') {
      // Client-side: use a combination of user agent and screen resolution
      const userAgent = navigator.userAgent
      const screen = `${window.screen.width}x${window.screen.height}`
      return btoa(`${userAgent}:${screen}`).substring(0, 32)
    }

    if (request) {
      // Server-side: try to get real IP
      const forwarded = request.headers.get('x-forwarded-for')
      const realIp = request.headers.get('x-real-ip')
      const cfConnectingIp = request.headers.get('cf-connecting-ip')
      
      return forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown'
    }

    return 'unknown'
  }
}

export const rateLimiter = new RateLimiterService()
export default rateLimiter