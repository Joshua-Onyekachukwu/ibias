/**
 * Session Configuration
 * 
 * This file contains user-configurable session management settings.
 * Adjust these values to control session behavior across the application.
 */

export interface SessionConfig {
  /** Maximum minutes of user inactivity before automatic logout */
  maxInactiveMinutes: number
  
  /** Maximum hours a session can remain active */
  maxSessionHours: number
  
  /** Whether MFA is required for admin users */
  requireMFAForAdmin: boolean
  
  /** Maximum number of concurrent sessions per user */
  maxConcurrentSessions: number
  
  /** How often to check session validity (in minutes) */
  sessionCheckIntervalMinutes: number
  
  /** Whether to enable graceful error handling for database issues */
  enableGracefulErrorHandling: boolean
}

/**
 * Default session configuration
 * 
 * These settings provide a balance between security and user experience:
 * - 2 hours of inactivity timeout (reasonable for business applications)
 * - 24 hours maximum session duration (full work day)
 * - 10 concurrent sessions (supports multiple devices/browsers)
 * - 5-minute check intervals (reduces server load)
 * - Graceful error handling enabled (prevents logouts due to database issues)
 */
export const defaultSessionConfig: SessionConfig = {
  maxInactiveMinutes: 120, // 2 hours
  maxSessionHours: 24, // 24 hours
  requireMFAForAdmin: true,
  maxConcurrentSessions: 10,
  sessionCheckIntervalMinutes: 5,
  enableGracefulErrorHandling: true
}

/**
 * Strict session configuration for high-security environments
 */
export const strictSessionConfig: SessionConfig = {
  maxInactiveMinutes: 15, // 15 minutes
  maxSessionHours: 4, // 4 hours
  requireMFAForAdmin: true,
  maxConcurrentSessions: 3,
  sessionCheckIntervalMinutes: 1,
  enableGracefulErrorHandling: false
}

/**
 * Relaxed session configuration for development/testing
 */
export const relaxedSessionConfig: SessionConfig = {
  maxInactiveMinutes: 480, // 8 hours
  maxSessionHours: 72, // 3 days
  requireMFAForAdmin: false,
  maxConcurrentSessions: 20,
  sessionCheckIntervalMinutes: 10,
  enableGracefulErrorHandling: true
}

/**
 * Get the current session configuration
 * 
 * You can modify this function to return different configurations
 * based on environment variables or user preferences.
 */
export function getSessionConfig(): SessionConfig {
  // Check environment variable for configuration type
  const configType = process.env.NEXT_PUBLIC_SESSION_CONFIG || 'default'
  
  switch (configType) {
    case 'strict':
      return strictSessionConfig
    case 'relaxed':
      return relaxedSessionConfig
    default:
      return defaultSessionConfig
  }
}

/**
 * Session timeout reasons for user-friendly messages
 */
export const SessionTimeoutReasons = {
  INACTIVITY: 'session_timeout',
  EXPIRED: 'session_expired',
  INVALID: 'session_invalid',
  CONCURRENT_LIMIT: 'concurrent_limit_exceeded',
  SECURITY: 'security_logout'
} as const

export type SessionTimeoutReason = typeof SessionTimeoutReasons[keyof typeof SessionTimeoutReasons]