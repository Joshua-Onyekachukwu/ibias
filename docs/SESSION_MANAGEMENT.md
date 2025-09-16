# Session Management System

IBIAS includes a comprehensive session management system that provides secure, configurable user sessions with automatic timeout handling and graceful error recovery.

## Overview

The session management system handles:
- User session creation and validation
- Automatic timeout based on inactivity
- Maximum session duration limits
- Concurrent session management
- Graceful error handling for database issues
- Configurable timeout reasons and user feedback

## Configuration

### Environment Variables

Set the session configuration in your `.env.local` file:

```bash
# Session Management Configuration
# Options: 'default', 'strict', 'relaxed'
NEXT_PUBLIC_SESSION_CONFIG=default
```

### Available Configurations

#### Default Configuration (Recommended for Production)
```typescript
{
  maxInactiveMinutes: 120,        // 2 hours of inactivity
  maxSessionHours: 24,            // 24 hours maximum session
  sessionCheckIntervalMinutes: 5, // Check every 5 minutes
  maxConcurrentSessions: 10,      // Up to 10 concurrent sessions
  requireMFAForAdmin: true,       // MFA required for admin users
  gracefulErrorHandling: true     // Don't logout on database errors
}
```

#### Strict Configuration (High Security)
```typescript
{
  maxInactiveMinutes: 15,         // 15 minutes of inactivity
  maxSessionHours: 4,             // 4 hours maximum session
  sessionCheckIntervalMinutes: 2, // Check every 2 minutes
  maxConcurrentSessions: 3,       // Up to 3 concurrent sessions
  requireMFAForAdmin: true,       // MFA required for admin users
  gracefulErrorHandling: false    // Strict error handling
}
```

#### Relaxed Configuration (Development/Testing)
```typescript
{
  maxInactiveMinutes: 480,        // 8 hours of inactivity
  maxSessionHours: 72,            // 72 hours maximum session
  sessionCheckIntervalMinutes: 10,// Check every 10 minutes
  maxConcurrentSessions: 20,      // Up to 20 concurrent sessions
  requireMFAForAdmin: false,      // MFA optional
  gracefulErrorHandling: true     // Graceful error handling
}
```

## Session Timeout Reasons

When a session times out, users are redirected with specific reasons:

- `expired`: Session exceeded maximum duration
- `inactivity`: Session timed out due to inactivity
- `concurrent`: Too many concurrent sessions
- `security`: Security-related logout
- `manual`: User manually logged out

## User Interface

Users can configure their session preferences through the Settings > Security page:

- Inactivity timeout duration
- Maximum session duration
- Session check frequency
- Maximum concurrent sessions
- Graceful error handling preference
- MFA requirements

## Database Tables

The session management system uses the following database tables:

### user_sessions
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  device_info JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true
);
```

### rate_limit_attempts
```sql
CREATE TABLE rate_limit_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  first_attempt TIMESTAMPTZ DEFAULT NOW(),
  last_attempt TIMESTAMPTZ DEFAULT NOW(),
  blocked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Error Handling

The session management system includes graceful error handling:

### Database Connection Issues
- Sessions continue to work even if database is temporarily unavailable
- Errors are logged as warnings instead of causing logouts
- Fallback to client-side session validation

### Session Validation Errors
- Non-critical errors don't terminate sessions
- Users receive helpful error messages
- Automatic retry mechanisms for transient failures

### Network Issues
- Offline detection and graceful degradation
- Session state preserved during network interruptions
- Automatic reconnection and sync when online

## Security Features

### Session Security
- Secure session tokens with cryptographic randomness
- Session rotation on privilege escalation
- IP address and user agent tracking
- Concurrent session limits

### Rate Limiting
- Login attempt rate limiting
- Session creation rate limiting
- API endpoint protection
- Automatic IP blocking for suspicious activity

### Audit Logging
- All session events are logged
- Security-related events are tracked
- Compliance with audit requirements
- Real-time monitoring and alerting

## Troubleshooting

### Common Issues

#### Users Being Logged Out Too Frequently
1. Check the `NEXT_PUBLIC_SESSION_CONFIG` environment variable
2. Consider using 'relaxed' configuration for development
3. Verify database connectivity
4. Check for network issues

#### Database Table Missing Errors
1. Run database migrations: `npm run db:migrate`
2. Verify Supabase connection
3. Check database permissions
4. Enable graceful error handling

#### Session Not Persisting
1. Check browser cookie settings
2. Verify HTTPS in production
3. Check session token generation
4. Verify database write permissions

### Debug Mode

Enable debug logging in development:

```bash
NEXT_PUBLIC_ENABLE_DEBUG_LOGS=true
```

This will log detailed session management information to the browser console.

## API Reference

### SessionManager Class

```typescript
class SessionManager {
  // Create a new session
  async createSession(userId: string): Promise<Session>
  
  // Validate existing session
  async validateSession(sessionToken: string): Promise<boolean>
  
  // Update session activity
  async updateActivity(sessionToken: string): Promise<void>
  
  // End session
  async endSession(sessionToken: string): Promise<void>
  
  // Get active sessions for user
  async getActiveSessions(userId: string): Promise<Session[]>
  
  // Cleanup expired sessions
  async cleanupExpiredSessions(): Promise<void>
}
```

### Configuration Functions

```typescript
// Get current session configuration
function getSessionConfig(): SessionConfig

// Update session configuration
function updateSessionConfig(config: Partial<SessionConfig>): void

// Reset to default configuration
function resetSessionConfig(): void
```

## Best Practices

1. **Production Settings**: Use 'default' configuration for production environments
2. **Development Settings**: Use 'relaxed' configuration for development to avoid frequent logouts
3. **Security Settings**: Use 'strict' configuration for high-security environments
4. **Error Handling**: Always enable graceful error handling in production
5. **Monitoring**: Monitor session metrics and adjust configuration as needed
6. **Testing**: Test session timeout scenarios thoroughly
7. **Documentation**: Keep session configuration documented and version controlled

## Migration Guide

If upgrading from a previous version:

1. Update environment variables with new session configuration options
2. Run database migrations to create new tables
3. Update any custom session handling code
4. Test session timeout scenarios
5. Update user documentation

## Support

For issues related to session management:

1. Check the troubleshooting section above
2. Enable debug logging for detailed information
3. Review server logs for database connection issues
4. Contact support with specific error messages and configuration details