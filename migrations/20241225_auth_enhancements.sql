-- Migration: Enhanced Authentication System
-- Date: 2024-12-25
-- Description: Add MFA, rate limiting, and session management tables

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User MFA Settings Table
CREATE TABLE IF NOT EXISTS user_mfa_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    totp_secret TEXT,
    backup_codes JSONB DEFAULT '[]'::jsonb,
    is_enabled BOOLEAN DEFAULT FALSE,
    phone_number TEXT,
    sms_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_user_mfa UNIQUE (user_id)
);

-- Rate Limiting Attempts Table
CREATE TABLE IF NOT EXISTS rate_limit_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL, -- Format: "action:identifier"
    identifier TEXT NOT NULL, -- IP address, email, or user ID
    action TEXT NOT NULL, -- login, signup, password_reset, mfa_verification
    success BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Index for efficient lookups
    INDEX idx_rate_limit_key_created ON rate_limit_attempts(key, created_at),
    INDEX idx_rate_limit_identifier_action ON rate_limit_attempts(identifier, action),
    INDEX idx_rate_limit_created_at ON rate_limit_attempts(created_at)
);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY, -- Derived from access token
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_info TEXT,
    ip_address TEXT,
    user_agent TEXT,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Indexes for efficient queries
    INDEX idx_user_sessions_user_id ON user_sessions(user_id),
    INDEX idx_user_sessions_active ON user_sessions(is_active, expires_at),
    INDEX idx_user_sessions_last_activity ON user_sessions(last_activity)
);

-- Security Audit Log Table
CREATE TABLE IF NOT EXISTS security_audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL, -- login, logout, mfa_setup, mfa_disable, password_change, etc.
    event_details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    risk_score INTEGER DEFAULT 0, -- 0-100 risk assessment
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Indexes for security monitoring
    INDEX idx_security_audit_user_id ON security_audit_log(user_id),
    INDEX idx_security_audit_event_type ON security_audit_log(event_type),
    INDEX idx_security_audit_created_at ON security_audit_log(created_at),
    INDEX idx_security_audit_risk_score ON security_audit_log(risk_score)
);

-- User Login History Table (for tracking login patterns)
CREATE TABLE IF NOT EXISTS user_login_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    login_method TEXT NOT NULL, -- password, google, mfa
    ip_address TEXT,
    user_agent TEXT,
    device_fingerprint TEXT,
    location_data JSONB DEFAULT '{}'::jsonb,
    success BOOLEAN DEFAULT TRUE,
    failure_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Indexes for analytics and security
    INDEX idx_login_history_user_id ON user_login_history(user_id),
    INDEX idx_login_history_created_at ON user_login_history(created_at),
    INDEX idx_login_history_success ON user_login_history(success)
);

-- Update user_profiles table to include security fields
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS account_locked_until TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS requires_password_change BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS security_questions JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"security_alerts": true, "login_notifications": true}'::jsonb;

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE user_mfa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_login_history ENABLE ROW LEVEL SECURITY;

-- MFA Settings Policies
CREATE POLICY "Users can view their own MFA settings" ON user_mfa_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own MFA settings" ON user_mfa_settings
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all MFA settings" ON user_mfa_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Rate Limit Policies (service role only)
CREATE POLICY "Service role can manage rate limits" ON rate_limit_attempts
    FOR ALL USING (auth.role() = 'service_role');

-- Session Policies
CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON user_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all sessions" ON user_sessions
    FOR ALL USING (auth.role() = 'service_role');

-- Security Audit Policies
CREATE POLICY "Users can view their own audit logs" ON security_audit_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all audit logs" ON security_audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Service role can insert audit logs" ON security_audit_log
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Login History Policies
CREATE POLICY "Users can view their own login history" ON user_login_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage login history" ON user_login_history
    FOR ALL USING (auth.role() = 'service_role');

-- Functions and Triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for user_mfa_settings
CREATE TRIGGER update_user_mfa_settings_updated_at
    BEFORE UPDATE ON user_mfa_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up old records
CREATE OR REPLACE FUNCTION cleanup_old_security_records()
RETURNS void AS $$
BEGIN
    -- Clean up rate limit attempts older than 30 days
    DELETE FROM rate_limit_attempts 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    -- Clean up inactive sessions older than 7 days
    DELETE FROM user_sessions 
    WHERE is_active = FALSE 
    AND (ended_at < NOW() - INTERVAL '7 days' OR expires_at < NOW() - INTERVAL '7 days');
    
    -- Clean up old login history (keep 90 days)
    DELETE FROM user_login_history 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Clean up old audit logs (keep 1 year)
    DELETE FROM security_audit_log 
    WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    p_user_id UUID,
    p_event_type TEXT,
    p_event_details JSONB DEFAULT '{}'::jsonb,
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_success BOOLEAN DEFAULT TRUE,
    p_risk_score INTEGER DEFAULT 0
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO security_audit_log (
        user_id, event_type, event_details, ip_address, 
        user_agent, success, risk_score
    ) VALUES (
        p_user_id, p_event_type, p_event_details, p_ip_address,
        p_user_agent, p_success, p_risk_score
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user account is locked
CREATE OR REPLACE FUNCTION is_account_locked(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    locked_until TIMESTAMPTZ;
BEGIN
    SELECT account_locked_until INTO locked_until
    FROM user_profiles
    WHERE user_id = p_user_id;
    
    RETURN (locked_until IS NOT NULL AND locked_until > NOW());
END;
$$ LANGUAGE plpgsql;

-- Function to lock user account
CREATE OR REPLACE FUNCTION lock_user_account(
    p_user_id UUID,
    p_duration_minutes INTEGER DEFAULT 30
)
RETURNS void AS $$
BEGIN
    UPDATE user_profiles
    SET account_locked_until = NOW() + (p_duration_minutes || ' minutes')::INTERVAL,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Log the account lock event
    PERFORM log_security_event(
        p_user_id,
        'account_locked',
        jsonb_build_object('duration_minutes', p_duration_minutes),
        NULL,
        NULL,
        TRUE,
        80
    );
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_last_login 
    ON user_profiles(last_login_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_profiles_account_locked 
    ON user_profiles(account_locked_until) WHERE account_locked_until IS NOT NULL;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Insert initial data or configurations if needed
INSERT INTO user_mfa_settings (user_id, is_enabled) 
SELECT id, FALSE 
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM user_mfa_settings)
ON CONFLICT (user_id) DO NOTHING;

-- Create a scheduled job to clean up old records (if pg_cron is available)
-- SELECT cron.schedule('cleanup-security-records', '0 2 * * *', 'SELECT cleanup_old_security_records();');

COMMIT;