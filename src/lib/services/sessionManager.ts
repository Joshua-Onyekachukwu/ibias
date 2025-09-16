// import { supabase as _supabase } from '@/lib/supabase'

export interface SessionInfo {
  id: string
  userId: string
  deviceInfo: {
    browser?: string
    os?: string
    device?: string
    userAgent: string
  }
  ipAddress: string
  location?: string
  createdAt: Date
  lastActivity: Date
  expiresAt: Date
  isActive: boolean
}

export interface CreateSessionRequest {
  userId: string
  ipAddress: string
  userAgent: string
  location?: string
}

class SessionManager {
  private readonly SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours
  private readonly CLEANUP_INTERVAL = 60 * 60 * 1000 // 1 hour

  /**
   * Create a new session
   */
  async createSession(request: CreateSessionRequest): Promise<string> {
    try {
      const sessionId = this.generateSessionId()
      const now = new Date()
      const expiresAt = new Date(now.getTime() + this.SESSION_DURATION)
      
      const deviceInfo = this.parseUserAgent(request.userAgent)

      // For now, just log until database tables are created
      console.log('Session created:', {
        sessionId,
        userId: request.userId,
        deviceInfo,
        ipAddress: request.ipAddress,
        location: request.location,
        createdAt: now,
        expiresAt
      })

      // Real implementation would be:
      // await supabase
      //   .from('user_sessions')
      //   .insert({
      //     id: sessionId,
      //     user_id: request.userId,
      //     device_info: deviceInfo,
      //     ip_address: request.ipAddress,
      //     location: request.location,
      //     created_at: now.toISOString(),
      //     last_activity: now.toISOString(),
      //     expires_at: expiresAt.toISOString(),
      //     is_active: true
      //   })

      return sessionId
    } catch (error) {
      console.error('Create session error:', error)
      throw new Error('Failed to create session')
    }
  }

  /**
   * Update session activity
   */
  async updateActivity(sessionId: string): Promise<void> {
    try {
      const now = new Date()
      
      console.log('Session activity updated:', { sessionId, timestamp: now })

      // Real implementation would be:
      // await supabase
      //   .from('user_sessions')
      //   .update({
      //     last_activity: now.toISOString()
      //   })
      //   .eq('id', sessionId)
      //   .eq('is_active', true)
    } catch (error) {
      console.error('Update session activity error:', error)
      // Don't throw - this is not critical
    }
  }

  /**
   * End a session
   */
  async endSession(sessionId: string): Promise<void> {
    try {
      console.log('Session ended:', { sessionId })

      // Real implementation would be:
      // await supabase
      //   .from('user_sessions')
      //   .update({
      //     is_active: false,
      //     ended_at: new Date().toISOString()
      //   })
      //   .eq('id', sessionId)
    } catch (error) {
      console.error('End session error:', error)
    }
  }

  /**
   * End all sessions for a user except the current one
   */
  async endAllOtherSessions(userId: string, currentSessionId: string): Promise<void> {
    try {
      console.log('All other sessions ended for user:', { userId, currentSessionId })

      // Real implementation would be:
      // await supabase
      //   .from('user_sessions')
      //   .update({
      //     is_active: false,
      //     ended_at: new Date().toISOString()
      //   })
      //   .eq('user_id', userId)
      //   .neq('id', currentSessionId)
      //   .eq('is_active', true)
    } catch (error) {
      console.error('End all other sessions error:', error)
    }
  }

  /**
   * Get active sessions for a user
   */
  async getActiveSessions(userId: string): Promise<SessionInfo[]> {
    try {
      // Mock data until database is ready
      return [
        {
          id: 'session-1',
          userId,
          deviceInfo: {
            browser: 'Chrome',
            os: 'Windows 11',
            device: 'Desktop',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          ipAddress: '192.168.1.100',
          location: 'New York, US',
          createdAt: new Date(),
          lastActivity: new Date(),
          expiresAt: new Date(Date.now() + this.SESSION_DURATION),
          isActive: true
        }
      ]

      // Real implementation would be:
      // const { data: sessions, error } = await supabase
      //   .from('user_sessions')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .eq('is_active', true)
      //   .order('last_activity', { ascending: false })

      // if (error) {
      //   throw error
      // }

      // return sessions?.map(session => ({
      //   id: session.id,
      //   userId: session.user_id,
      //   deviceInfo: session.device_info,
      //   ipAddress: session.ip_address,
      //   location: session.location,
      //   createdAt: new Date(session.created_at),
      //   lastActivity: new Date(session.last_activity),
      //   expiresAt: new Date(session.expires_at),
      //   isActive: session.is_active
      // })) || []
    } catch (error) {
      console.error('Get active sessions error:', error)
      return []
    }
  }

  /**
   * Validate session
   */
  async validateSession(_sessionId: string): Promise<SessionInfo | null> {
    try {
      // Mock validation until database is ready
      return null

      // Real implementation would be:
      // const { data: session, error } = await supabase
      //   .from('user_sessions')
      //   .select('*')
      //   .eq('id', sessionId)
      //   .eq('is_active', true)
      //   .gt('expires_at', new Date().toISOString())
      //   .single()

      // if (error || !session) {
      //   return null
      // }

      // // Update last activity
      // await this.updateActivity(sessionId)

      // return {
      //   id: session.id,
      //   userId: session.user_id,
      //   deviceInfo: session.device_info,
      //   ipAddress: session.ip_address,
      //   location: session.location,
      //   createdAt: new Date(session.created_at),
      //   lastActivity: new Date(session.last_activity),
      //   expiresAt: new Date(session.expires_at),
      //   isActive: session.is_active
      // }
    } catch (error) {
      console.error('Validate session error:', error)
      return null
    }
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<void> {
    try {
      const now = new Date()
      
      console.log('Cleaning up expired sessions:', { timestamp: now })

      // Real implementation would be:
      // await supabase
      //   .from('user_sessions')
      //   .update({
      //     is_active: false,
      //     ended_at: now.toISOString()
      //   })
      //   .lt('expires_at', now.toISOString())
      //   .eq('is_active', true)
    } catch (error) {
      console.error('Cleanup expired sessions error:', error)
    }
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  /**
   * Parse user agent string to extract device info
   */
  private parseUserAgent(userAgent: string): {
    browser?: string
    os?: string
    device?: string
    userAgent: string
  } {
    const deviceInfo = {
      userAgent,
      browser: undefined as string | undefined,
      os: undefined as string | undefined,
      device: undefined as string | undefined
    }

    // Simple user agent parsing - in production, use a proper library
    if (userAgent.includes('Chrome')) {
      deviceInfo.browser = 'Chrome'
    } else if (userAgent.includes('Firefox')) {
      deviceInfo.browser = 'Firefox'
    } else if (userAgent.includes('Safari')) {
      deviceInfo.browser = 'Safari'
    } else if (userAgent.includes('Edge')) {
      deviceInfo.browser = 'Edge'
    }

    if (userAgent.includes('Windows')) {
      deviceInfo.os = 'Windows'
    } else if (userAgent.includes('Mac')) {
      deviceInfo.os = 'macOS'
    } else if (userAgent.includes('Linux')) {
      deviceInfo.os = 'Linux'
    } else if (userAgent.includes('Android')) {
      deviceInfo.os = 'Android'
    } else if (userAgent.includes('iOS')) {
      deviceInfo.os = 'iOS'
    }

    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      deviceInfo.device = 'Mobile'
    } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
      deviceInfo.device = 'Tablet'
    } else {
      deviceInfo.device = 'Desktop'
    }

    return deviceInfo
  }

  /**
   * Start automatic cleanup of expired sessions
   */
  startCleanupTimer(): void {
    setInterval(() => {
      this.cleanupExpiredSessions()
    }, this.CLEANUP_INTERVAL)
  }
}

export const sessionManager = new SessionManager()