'use client'

import { createClient } from '@/utils/supabase/client'
import { Session } from '@supabase/supabase-js'
import { getSessionConfig, SessionTimeoutReasons } from '@/config/session'
import type { SessionConfig } from '@/config/session'

export interface SessionInfo {
  id: string
  userId: string
  deviceInfo: string
  ipAddress: string
  userAgent: string
  lastActivity: Date
  expiresAt: Date
  isActive: boolean
}

// Re-export for backward compatibility
export type { SessionConfig }

class SessionManagerService {
  private supabase = createClient()
  private sessionCheckInterval: NodeJS.Timeout | null = null
  private lastActivityTime: Date = new Date()
  private config: SessionConfig

  constructor() {
    // Load configuration dynamically
    this.config = getSessionConfig()
  }

  /**
   * Initialize session monitoring
   */
  initializeSessionMonitoring(): void {
    if (typeof window === 'undefined') return

    // Track user activity
    this.trackUserActivity()

    // Check session validity based on configuration
    this.sessionCheckInterval = setInterval(() => {
      this.checkSessionValidity()
    }, this.config.sessionCheckIntervalMinutes * 60 * 1000)

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.updateLastActivity()
        this.checkSessionValidity()
      }
    })

    // Handle beforeunload to update session
    window.addEventListener('beforeunload', () => {
      this.updateSessionOnExit()
    })
  }

  /**
   * Clean up session monitoring
   */
  cleanup(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval)
      this.sessionCheckInterval = null
    }
  }

  /**
   * Create a new session record
   */
  async createSession(userId: string, session: Session): Promise<void> {
    try {
      const deviceInfo = this.getDeviceInfo()
      const ipAddress = await this.getClientIP()
      const userAgent = navigator.userAgent

      // Try to check concurrent sessions limit, but don't fail authentication
      try {
        await this.enforceSessionLimit(userId)
      } catch (limitError) {
        console.warn('Failed to enforce session limit, continuing:', limitError)
      }

      const sessionData = {
        id: session.access_token.substring(0, 32), // Use part of access token as ID
        user_id: userId,
        device_info: deviceInfo,
        ip_address: ipAddress,
        user_agent: userAgent,
        last_activity: new Date().toISOString(),
        expires_at: new Date(Date.now() + this.config.maxSessionHours * 60 * 60 * 1000).toISOString(),
        is_active: true,
        created_at: new Date().toISOString()
      }

      // Try to create session record, but don't fail authentication if database is unavailable
      try {
        await this.supabase
          .from('user_sessions')
          .upsert(sessionData)
      } catch (dbError) {
        console.warn('Failed to create session record in database, continuing authentication:', dbError)
      }

      this.updateLastActivity()
    } catch (_error) {
      console.error('Error creating session:', _error)
      // Don't throw error to prevent authentication failure
    }
  }

  /**
   * Update session activity
   */
  async updateSessionActivity(sessionId: string): Promise<void> {
    try {
      await this.supabase
        .from('user_sessions')
        .update({
          last_activity: new Date().toISOString()
        })
        .eq('id', sessionId)
        .eq('is_active', true)

      this.updateLastActivity()
    } catch (error) {
      console.error('Error updating session activity:', error)
    }
  }

  /**
   * End a session
   */
  async endSession(sessionId: string): Promise<void> {
    try {
      await this.supabase
        .from('user_sessions')
        .update({
          is_active: false,
          ended_at: new Date().toISOString()
        })
        .eq('id', sessionId)
    } catch (error) {
      console.error('Error ending session:', error)
    }
  }

  /**
   * Get active sessions for a user
   */
  async getUserSessions(userId: string): Promise<SessionInfo[]> {
    try {
      const { data, error } = await this.supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('last_activity', { ascending: false })

      if (error) throw error

      return (data || []).map(session => ({
        id: session.id,
        userId: session.user_id,
        deviceInfo: session.device_info,
        ipAddress: session.ip_address,
        userAgent: session.user_agent,
        lastActivity: new Date(session.last_activity),
        expiresAt: new Date(session.expires_at),
        isActive: session.is_active
      }))
    } catch (error) {
      console.error('Error getting user sessions:', error)
      return []
    }
  }

  /**
   * Terminate all sessions for a user except current
   */
  async terminateOtherSessions(userId: string, currentSessionId: string): Promise<void> {
    try {
      await this.supabase
        .from('user_sessions')
        .update({
          is_active: false,
          ended_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .neq('id', currentSessionId)
        .eq('is_active', true)
    } catch (error) {
      console.error('Error terminating other sessions:', error)
      throw new Error('Failed to terminate other sessions')
    }
  }

  /**
   * Check if session is still valid
   */
  async isSessionValid(sessionId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .from('user_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('is_active', true)
        .single()

      if (error || !data) return false

      const now = new Date()
      const lastActivity = new Date(data.last_activity)
      const expiresAt = new Date(data.expires_at)

      // Check if session expired
      if (now > expiresAt) {
        await this.endSession(sessionId)
        return false
      }

      // Check if inactive too long
      const inactiveMinutes = (now.getTime() - lastActivity.getTime()) / (1000 * 60)
      if (inactiveMinutes > this.config.maxInactiveMinutes) {
        await this.endSession(sessionId)
        return false
      }

      return true
    } catch (error) {
      console.error('Error checking session validity:', error)
      return false
    }
  }

  /**
   * Refresh session expiration
   */
  async refreshSession(sessionId: string): Promise<boolean> {
    try {
      const newExpiresAt = new Date(Date.now() + this.config.maxSessionHours * 60 * 60 * 1000)
      
      const { error } = await this.supabase
        .from('user_sessions')
        .update({
          expires_at: newExpiresAt.toISOString(),
          last_activity: new Date().toISOString()
        })
        .eq('id', sessionId)
        .eq('is_active', true)

      if (error) throw error
      
      this.updateLastActivity()
      return true
    } catch (error) {
      console.error('Error refreshing session:', error)
      return false
    }
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<void> {
    try {
      const now = new Date().toISOString()
      
      // Mark expired sessions as inactive
      await this.supabase
        .from('user_sessions')
        .update({
          is_active: false,
          ended_at: now
        })
        .lt('expires_at', now)
        .eq('is_active', true)

      // Delete old session records (older than 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      await this.supabase
        .from('user_sessions')
        .delete()
        .lt('created_at', thirtyDaysAgo)
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error)
    }
  }

  /**
   * Track user activity
   */
  private trackUserActivity(): void {
    if (typeof window === 'undefined') return

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    const activityHandler = () => {
      this.updateLastActivity()
    }

    events.forEach(event => {
      document.addEventListener(event, activityHandler, { passive: true })
    })
  }

  /**
   * Update last activity time
   */
  private updateLastActivity(): void {
    this.lastActivityTime = new Date()
  }

  /**
   * Check session validity periodically
   */
  private async checkSessionValidity(): Promise<void> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession()
      
      if (!session) return

      const sessionId = session.access_token.substring(0, 32)
      
      // Try to validate session, but don't logout on database errors
      try {
        const isValid = await this.isSessionValid(sessionId)
        if (!isValid) {
           // Only logout if session is explicitly invalid, not on database errors
           await this.supabase.auth.signOut()
           window.location.href = `/auth?reason=${SessionTimeoutReasons.EXPIRED}`
           return
         }
      } catch (dbError) {
        // Log database errors but don't logout users
        console.warn('Session validation failed due to database error, continuing session:', dbError)
        // Continue with inactivity check instead of logging out
      }

      // Check if user has been inactive
      const now = new Date()
      const inactiveMinutes = (now.getTime() - this.lastActivityTime.getTime()) / (1000 * 60)
      
      if (inactiveMinutes > this.config.maxInactiveMinutes) {
        await this.supabase.auth.signOut()
        window.location.href = `/auth?reason=${SessionTimeoutReasons.INACTIVITY}`
        return
      }

      // Try to update session activity if user is active, but don't fail on database errors
      if (inactiveMinutes < 5) { // Only update if recently active
        try {
          await this.updateSessionActivity(sessionId)
        } catch (updateError) {
          console.warn('Failed to update session activity, continuing:', updateError)
        }
      }
    } catch (error) {
      console.error('Error checking session validity:', error)
      // Don't logout on general errors, just log them
    }
  }

  /**
   * Update session when user exits
   */
  private updateSessionOnExit(): void {
    // Use sendBeacon for reliable delivery
    if (navigator.sendBeacon && this.supabase) {
      const sessionData = {
        last_activity: new Date().toISOString()
      }
      
      // This is a simplified approach - in production, you'd want a dedicated endpoint
      navigator.sendBeacon('/api/session/update', JSON.stringify(sessionData))
    }
  }

  /**
   * Enforce session limit per user
   */
  private async enforceSessionLimit(userId: string): Promise<void> {
    try {
      const sessions = await this.getUserSessions(userId)
      
      if (sessions.length >= this.config.maxConcurrentSessions) {
        // Remove oldest sessions
        const sessionsToRemove = sessions
          .sort((a, b) => a.lastActivity.getTime() - b.lastActivity.getTime())
          .slice(0, sessions.length - this.config.maxConcurrentSessions + 1)

        for (const session of sessionsToRemove) {
          await this.endSession(session.id)
        }
      }
    } catch (error) {
      console.error('Error enforcing session limit:', error)
    }
  }

  /**
   * Get device information
   */
  private getDeviceInfo(): string {
    if (typeof window === 'undefined') return 'Server'

    const platform = navigator.platform || 'Unknown'
    const userAgent = navigator.userAgent
    
    // Simple device detection
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return `Mobile (${platform})`
    } else if (/Tablet|iPad/.test(userAgent)) {
      return `Tablet (${platform})`
    } else {
      return `Desktop (${platform})`
    }
  }

  /**
   * Get client IP address
   */
  private async getClientIP(): Promise<string> {
    try {
      // In production, you'd get this from headers or a service
      // For now, return a placeholder
      return 'unknown'
    } catch (error) {
      return 'unknown'
    }
  }

  /**
   * Get session configuration
   */
  getConfig(): SessionConfig {
    return { ...this.config }
  }

  /**
   * Update session configuration
   */
  updateConfig(newConfig: Partial<SessionConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }
}

export const sessionManager = new SessionManagerService()
export default sessionManager