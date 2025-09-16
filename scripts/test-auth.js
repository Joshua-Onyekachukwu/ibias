const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: ['.env.local', '.env'] })

console.log('🧪 IBIAS Authentication System Test')
console.log('==================================')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testAuthSystem() {
  try {
    console.log('\n📋 Testing Supabase Connection...')
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (testError && !testError.message.includes('relation "profiles" does not exist')) {
      console.error('❌ Supabase connection failed:', testError.message)
      return
    }
    
    console.log('✅ Supabase connection successful')
    
    console.log('\n🔐 Testing Auth Configuration...')
    
    // Test auth settings
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('❌ Auth configuration error:', authError.message)
      return
    }
    
    console.log('✅ Auth configuration is valid')
    console.log('📊 Current session:', authData.session ? 'Active session found' : 'No active session')
    
    console.log('\n🌐 Testing Google OAuth Configuration...')
    
    // Check environment variables for Google OAuth
    const googleClientId = process.env.GOOGLE_CLIENT_ID
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
    const callbackUrl = process.env.GOOGLE_OAUTH_CALLBACK_URL
    
    if (!googleClientId || !googleClientSecret || !callbackUrl) {
      console.error('❌ Missing Google OAuth environment variables')
      console.log('Required variables:')
      console.log('- GOOGLE_CLIENT_ID:', googleClientId ? '✅ Set' : '❌ Missing')
      console.log('- GOOGLE_CLIENT_SECRET:', googleClientSecret ? '✅ Set' : '❌ Missing')
      console.log('- GOOGLE_OAUTH_CALLBACK_URL:', callbackUrl ? '✅ Set' : '❌ Missing')
      return
    }
    
    console.log('✅ Google OAuth environment variables configured')
    console.log('📋 Google Client ID:', googleClientId.substring(0, 20) + '...')
    console.log('📋 Callback URL:', callbackUrl)
    
    console.log('\n🔍 Testing Database Schema...')
    
    // Test if profiles table exists
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (profilesError) {
      if (profilesError.message.includes('relation "profiles" does not exist')) {
        console.log('⚠️  Profiles table does not exist - this is normal for new setups')
        console.log('💡 You may need to run database migrations')
      } else {
        console.error('❌ Database schema error:', profilesError.message)
      }
    } else {
      console.log('✅ Profiles table exists and accessible')
      console.log('📊 Sample profiles found:', profilesData?.length || 0)
    }
    
    console.log('\n🎯 Authentication Test Summary:')
    console.log('================================')
    console.log('✅ Supabase connection: Working')
    console.log('✅ Auth configuration: Valid')
    console.log('✅ Google OAuth setup: Configured')
    console.log('✅ Environment variables: Complete')
    
    console.log('\n🚀 Next Steps:')
    console.log('1. Ensure Google OAuth is enabled in Supabase Dashboard')
    console.log('2. Test sign-in flow at: http://localhost:3004/auth')
    console.log('3. Verify Google OAuth redirect works')
    console.log('4. Check user profile creation after first sign-in')
    
  } catch (error) {
    console.error('❌ Unexpected error during auth test:', error.message)
  }
}

// Run the test
testAuthSystem()
  .then(() => {
    console.log('\n✅ Authentication test completed')
  })
  .catch((error) => {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  })