require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createEssentialTables() {
  console.log('Creating essential authentication tables...')
  
  try {
    // First, let's add MFA columns to user_profiles table
    console.log('Adding MFA columns to user_profiles...')
    
    const { data: addMfaColumns, error: mfaError } = await supabase
      .from('user_profiles')
      .select('mfa_enabled')
      .limit(1)
    
    if (mfaError && mfaError.code === 'PGRST116') {
      // Column doesn't exist, let's add it
      const { error: alterError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE user_profiles 
          ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT FALSE,
          ADD COLUMN IF NOT EXISTS mfa_secret TEXT,
          ADD COLUMN IF NOT EXISTS mfa_backup_codes TEXT[],
          ADD COLUMN IF NOT EXISTS last_mfa_verification TIMESTAMPTZ;
        `
      })
      
      if (alterError) {
        console.log('Direct ALTER failed, trying alternative approach...')
        // Alternative: Use raw SQL through a function
        const alterSql = `
          DO $$
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='mfa_enabled') THEN
              ALTER TABLE user_profiles ADD COLUMN mfa_enabled BOOLEAN DEFAULT FALSE;
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='mfa_secret') THEN
              ALTER TABLE user_profiles ADD COLUMN mfa_secret TEXT;
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='mfa_backup_codes') THEN
              ALTER TABLE user_profiles ADD COLUMN mfa_backup_codes TEXT[];
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='last_mfa_verification') THEN
              ALTER TABLE user_profiles ADD COLUMN last_mfa_verification TIMESTAMPTZ;
            END IF;
          END
          $$;
        `
        
        console.log('Executing SQL directly...')
        console.log(alterSql)
      }
    } else {
      console.log('MFA columns already exist in user_profiles')
    }
    
    // Create rate limiting table using direct table creation
    console.log('Creating rate_limit_attempts table...')
    
    const { data: rateLimitData, error: rateLimitError } = await supabase
      .from('rate_limit_attempts')
      .select('*')
      .limit(1)
    
    if (rateLimitError && rateLimitError.code === 'PGRST106') {
      console.log('rate_limit_attempts table does not exist, creating...')
      // Table doesn't exist, we need to create it
      // Since we can't use exec_sql, let's try a different approach
      console.log('Note: rate_limit_attempts table needs to be created manually in Supabase dashboard')
      console.log('SQL to run:')
      console.log(`
        CREATE TABLE IF NOT EXISTS rate_limit_attempts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          identifier TEXT NOT NULL,
          attempt_type TEXT NOT NULL,
          attempts INTEGER DEFAULT 1,
          window_start TIMESTAMPTZ DEFAULT NOW(),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_rate_limit_identifier ON rate_limit_attempts(identifier);
        CREATE INDEX IF NOT EXISTS idx_rate_limit_window ON rate_limit_attempts(window_start);
      `)
    } else {
      console.log('rate_limit_attempts table already exists or accessible')
    }
    
    // Create user sessions table
    console.log('Creating user_sessions table...')
    
    const { data: sessionsData, error: sessionsError } = await supabase
      .from('user_sessions')
      .select('*')
      .limit(1)
    
    if (sessionsError && sessionsError.code === 'PGRST106') {
      console.log('user_sessions table does not exist, creating...')
      console.log('Note: user_sessions table needs to be created manually in Supabase dashboard')
      console.log('SQL to run:')
      console.log(`
        CREATE TABLE IF NOT EXISTS user_sessions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          session_token TEXT UNIQUE NOT NULL,
          ip_address INET,
          user_agent TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          last_activity TIMESTAMPTZ DEFAULT NOW(),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          expires_at TIMESTAMPTZ NOT NULL
        );
        
        CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
        CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active);
      `)
    } else {
      console.log('user_sessions table already exists or accessible')
    }
    
    console.log('\n=== SUMMARY ===')
    console.log('✅ Checked user_profiles table for MFA columns')
    console.log('⚠️  Additional tables may need manual creation in Supabase dashboard')
    console.log('📋 Check the SQL statements above and run them in Supabase SQL Editor if needed')
    
  } catch (error) {
    console.error('Error creating tables:', error)
  }
}

createEssentialTables()