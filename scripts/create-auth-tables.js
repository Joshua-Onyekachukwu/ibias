const { createClient } = require('@supabase/supabase-js')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

async function createAuthTables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    console.log('Creating auth enhancement tables...')
    
    // Create user_mfa_settings table
    console.log('Creating user_mfa_settings table...')
    const { error: mfaError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS user_mfa_settings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          mfa_type VARCHAR(20) NOT NULL CHECK (mfa_type IN ('totp', 'sms')),
          secret_key TEXT,
          phone_number TEXT,
          backup_codes TEXT[],
          is_enabled BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(user_id, mfa_type)
        );
      `
    })
    
    if (mfaError) {
      console.log('MFA table creation result:', mfaError)
    } else {
      console.log('✅ user_mfa_settings table created')
    }
    
    // Create rate_limit_attempts table
    console.log('Creating rate_limit_attempts table...')
    const { error: rateLimitError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS rate_limit_attempts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          identifier TEXT NOT NULL,
          attempt_type VARCHAR(50) NOT NULL,
          attempts INTEGER DEFAULT 1,
          last_attempt TIMESTAMPTZ DEFAULT NOW(),
          blocked_until TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    })
    
    if (rateLimitError) {
      console.log('Rate limit table creation result:', rateLimitError)
    } else {
      console.log('✅ rate_limit_attempts table created')
    }
    
    // Create user_sessions table
    console.log('Creating user_sessions table...')
    const { error: sessionError } = await supabase.rpc('exec_sql', {
      query: `
        CREATE TABLE IF NOT EXISTS user_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          session_token TEXT NOT NULL UNIQUE,
          device_info JSONB,
          ip_address INET,
          user_agent TEXT,
          is_active BOOLEAN DEFAULT true,
          last_activity TIMESTAMPTZ DEFAULT NOW(),
          expires_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    })
    
    if (sessionError) {
      console.log('Session table creation result:', sessionError)
    } else {
      console.log('✅ user_sessions table created')
    }
    
    console.log('\n✅ Auth enhancement tables creation completed!')
    
  } catch (error) {
    console.error('Error creating tables:', error)
  }
}

createAuthTables()