// import { supabase as _supabase } from '@/lib/supabase'

export interface RateLimitResult {
  allowed: boolean
  remainingAttempts: number
  resetTime: Date
  isLocked: boolean
}

export interface RateLimitConfig {
  maxAttempts: number
  windowMinutes: number
  lockoutMinutes: number
}

class RateLimiter {
  private defaultConfig: RateLimitConfig = {
    maxAttempts: 5,
    windowMinutes: 15,
    lockoutMinutes: 30
  }

  /**
   * Check if an action is rate limited
   */
  async checkRateLimit(
    identifier: string,
    action: string,
    config?: Partial<RateLimitConfig>
  ): Promise<RateLimitResult> {
    const finalConfig = { ...this.defaultConfig, ...config }
    
    try {
      // For now, return a mock response until database tables are created
      // In production, this would check the rate_limit_attempts table
      
      // Mock implementation - always allow for now
      return {
        allowed: true,
        remainingAttempts: finalConfig.maxAttempts,
        resetTime: new Date(Date.now() + finalConfig.windowMinutes * 60 * 1000),
        isLocked: false
      }

      // Real implementation would be:
      // const windowStart = new Date(Date.now() - finalConfig.windowMinutes * 60 * 1000)
      
      // const { data: attempts, error } = await supabase
      //   .from('rate_limit_attempts')
      //   .select('*')
      //   .eq('identifier', identifier)
      //   .eq('action', action)
      //   .gte('created_at', windowStart.toISOString())
      //   .order('created_at', { ascending: false })

      // if (error) {
      //   console.error('Rate limit check error:', error)
      //   return {
      //     allowed: true, // Fail open
      //     remainingAttempts: finalConfig.maxAttempts,
      //     resetTime: new Date(Date.now() + finalConfig.windowMinutes * 60 * 1000),
      //     isLocked: false
      //   }
      // }

      // const attemptCount = attempts?.length || 0
      // const remainingAttempts = Math.max(0, finalConfig.maxAttempts - attemptCount)
      // const allowed = attemptCount < finalConfig.maxAttempts

      // // Check if account is locked
      // const lockoutTime = new Date(Date.now() - finalConfig.lockoutMinutes * 60 * 1000)
      // const recentFailures = attempts?.filter(attempt => 
      //   attempt.success === false && new Date(attempt.created_at) > lockoutTime
      // ) || []
      
      // const isLocked = recentFailures.length >= finalConfig.maxAttempts

      // return {
      //   allowed: allowed && !isLocked,
      //   remainingAttempts,
      //   resetTime: new Date(Date.now() + finalConfig.windowMinutes * 60 * 1000),
      //   isLocked
      // }
    } catch (error) {
      console.error('Rate limit check error:', error)
      // Fail open - allow the request
      return {
        allowed: true,
        remainingAttempts: finalConfig.maxAttempts,
        resetTime: new Date(Date.now() + finalConfig.windowMinutes * 60 * 1000),
        isLocked: false
      }
    }
  }

  /**
   * Record an attempt (success or failure)
   */
  async recordAttempt(
    identifier: string,
    action: string,
    success: boolean,
    metadata?: Record<string, string | number | boolean>
  ): Promise<void> {
    try {
      // For now, just log to console until database tables are created
      console.log('Rate limit attempt recorded:', {
        identifier,
        action,
        success,
        metadata,
        timestamp: new Date().toISOString()
      })

      // Real implementation would be:
      // await supabase
      //   .from('rate_limit_attempts')
      //   .insert({
      //     identifier,
      //     action,
      //     success,
      //     metadata: metadata || {},
      //     created_at: new Date().toISOString()
      //   })
    } catch (error) {
      console.error('Record attempt error:', error)
      // Don't throw - this is logging only
    }
  }

  /**
   * Clear rate limit for an identifier
   */
  async clearRateLimit(identifier: string, action?: string): Promise<void> {
    try {
      console.log('Rate limit cleared for:', { identifier, action })

      // Real implementation would be:
      // let query = supabase
      //   .from('rate_limit_attempts')
      //   .delete()
      //   .eq('identifier', identifier)

      // if (action) {
      //   query = query.eq('action', action)
      // }

      // await query
    } catch (error) {
      console.error('Clear rate limit error:', error)
    }
  }

  /**
   * Get rate limit status for an identifier
   */
  async getRateLimitStatus(
    _identifier: string,
    _action: string
  ): Promise<{
    attempts: number
    lastAttempt: Date | null
    isLocked: boolean
    lockExpiresAt: Date | null
  }> {
    try {
      // Mock response until database is ready
      return {
        attempts: 0,
        lastAttempt: null,
        isLocked: false,
        lockExpiresAt: null
      }

      // Real implementation would be:
      // const windowStart = new Date(Date.now() - this.defaultConfig.windowMinutes * 60 * 1000)
      
      // const { data: attempts, error } = await supabase
      //   .from('rate_limit_attempts')
      //   .select('*')
      //   .eq('identifier', identifier)
      //   .eq('action', action)
      //   .gte('created_at', windowStart.toISOString())
      //   .order('created_at', { ascending: false })

      // if (error) {
      //   throw error
      // }

      // const attemptCount = attempts?.length || 0
      // const lastAttempt = attempts?.[0] ? new Date(attempts[0].created_at) : null
      
      // const lockoutTime = new Date(Date.now() - this.defaultConfig.lockoutMinutes * 60 * 1000)
      // const recentFailures = attempts?.filter(attempt => 
      //   attempt.success === false && new Date(attempt.created_at) > lockoutTime
      // ) || []
      
      // const isLocked = recentFailures.length >= this.defaultConfig.maxAttempts
      // const lockExpiresAt = isLocked && recentFailures[0] 
      //   ? new Date(new Date(recentFailures[0].created_at).getTime() + this.defaultConfig.lockoutMinutes * 60 * 1000)
      //   : null

      // return {
      //   attempts: attemptCount,
      //   lastAttempt,
      //   isLocked,
      //   lockExpiresAt
      // }
    } catch (error) {
      console.error('Get rate limit status error:', error)
      return {
        attempts: 0,
        lastAttempt: null,
        isLocked: false,
        lockExpiresAt: null
      }
    }
  }

  /**
   * Clean up old rate limit records
   */
  async cleanup(): Promise<void> {
    try {
      const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
      
      console.log('Cleaning up rate limit records older than:', cutoffTime)

      // Real implementation would be:
      // await supabase
      //   .from('rate_limit_attempts')
      //   .delete()
      //   .lt('created_at', cutoffTime.toISOString())
    } catch (error) {
      console.error('Rate limit cleanup error:', error)
    }
  }
}

export const rateLimiter = new RateLimiter()