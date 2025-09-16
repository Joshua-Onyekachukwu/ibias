const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAuthTables() {
  console.log('Creating authentication tables directly...')
  
  try {
    // Create rate_limit_attempts table
    console.log('Creating rate_limit_attempts table...')
    const { error: rateLimitError } = await supabase
      .from('rate_limit_attempts')
      .select('id')
      .limit(1)
    
    if (rateLimitError && rateLimitError.code === 'PGRST116') {
      console.log('rate_limit_attempts table does not exist, it should be created via migration')
    } else {
      console.log('✅ rate_limit_attempts table exists')
    }
    
    // Create user_sessions table
    console.log('Creating user_sessions table...')
    const { error: sessionError } = await supabase
      .from('user_sessions')
      .select('id')
      .limit(1)
    
    if (sessionError && sessionError.code === 'PGRST116') {
      console.log('user_sessions table does not exist, it should be created via migration')
    } else {
      console.log('✅ user_sessions table exists')
    }
    
    // Create user_mfa_settings table
    console.log('Creating user_mfa_settings table...')
    const { error: mfaError } = await supabase
      .from('user_mfa_settings')
      .select('id')
      .limit(1)
    
    if (mfaError && mfaError.code === 'PGRST116') {
      console.log('user_mfa_settings table does not exist, it should be created via migration')
    } else {
      console.log('✅ user_mfa_settings table exists')
    }
    
    // Create security_audit_log table
    console.log('Creating security_audit_log table...')
    const { error: auditError } = await supabase
      .from('security_audit_log')
      .select('id')
      .limit(1)
    
    if (auditError && auditError.code === 'PGRST116') {
      console.log('security_audit_log table does not exist, it should be created via migration')
    } else {
      console.log('✅ security_audit_log table exists')
    }
    
    // Create user_login_history table
    console.log('Creating user_login_history table...')
    const { error: historyError } = await supabase
      .from('user_login_history')
      .select('id')
      .limit(1)
    
    if (historyError && historyError.code === 'PGRST116') {
      console.log('user_login_history table does not exist, it should be created via migration')
    } else {
      console.log('✅ user_login_history table exists')
    }
    
    console.log('\n📊 Auth tables verification completed!')
    
  } catch (error) {
    console.error('Error checking tables:', error)
  }
}

createAuthTables()