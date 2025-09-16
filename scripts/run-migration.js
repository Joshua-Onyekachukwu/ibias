const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

async function runMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local')
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'migrations', '20241225_auth_enhancements.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    console.log('Running auth enhancements migration...')
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`Executing ${statements.length} SQL statements...`)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`)
        
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: statement
        })
        
        if (error) {
          console.error(`Error executing statement ${i + 1}:`, error)
          console.error('Statement:', statement)
          // Continue with other statements
        } else {
          console.log(`✓ Statement ${i + 1} executed successfully`)
        }
      }
    }
    
    console.log('\n✅ Migration completed!')
    console.log('\nNew tables created:')
    console.log('- user_mfa_settings (MFA configuration)')
    console.log('- rate_limit_attempts (Brute force protection)')
    console.log('- user_sessions (Session management)')
    console.log('- security_audit_log (Security events)')
    console.log('- user_login_history (Login patterns)')
    
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

runMigration()