const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testAuthenticationConfiguration() {
  console.log('🔐 Testing IBIAS Authentication Configuration');
  console.log('=' .repeat(50));

  let allTestsPassed = true;

  try {
    // Test 1: Check environment variables
    console.log('\n1. Testing Environment Variables...');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl) {
      console.log('❌ NEXT_PUBLIC_SUPABASE_URL not configured');
      allTestsPassed = false;
    } else {
      console.log('✅ NEXT_PUBLIC_SUPABASE_URL configured');
      console.log('   URL:', supabaseUrl);
    }
    
    if (!supabaseKey) {
      console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY not configured');
      allTestsPassed = false;
    } else {
      console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY configured');
      console.log('   Key length:', supabaseKey.length, 'characters');
    }
    
    if (!serviceKey) {
      console.log('❌ SUPABASE_SERVICE_ROLE_KEY not configured');
      allTestsPassed = false;
    } else {
      console.log('✅ SUPABASE_SERVICE_ROLE_KEY configured');
      console.log('   Key length:', serviceKey.length, 'characters');
    }

    // Test 2: Check Supabase client initialization
    console.log('\n2. Testing Supabase Client Initialization...');
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      console.log('✅ Supabase client initialized successfully');
      console.log('   Client type:', typeof supabase);
      console.log('   Auth available:', typeof supabase.auth === 'object');
      console.log('   Database available:', typeof supabase.from === 'function');
    } catch (error) {
      console.log('❌ Supabase client initialization failed:', error.message);
      allTestsPassed = false;
    }

    // Test 3: Check Google OAuth configuration
    console.log('\n3. Testing Google OAuth Configuration...');
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const googleCallbackUrl = process.env.GOOGLE_OAUTH_CALLBACK_URL;
    
    if (!googleClientId) {
      console.log('❌ GOOGLE_CLIENT_ID not configured');
      allTestsPassed = false;
    } else {
      console.log('✅ GOOGLE_CLIENT_ID configured');
      console.log('   Client ID:', googleClientId.substring(0, 20) + '...');
    }
    
    if (!googleClientSecret) {
      console.log('❌ GOOGLE_CLIENT_SECRET not configured');
      allTestsPassed = false;
    } else {
      console.log('✅ GOOGLE_CLIENT_SECRET configured');
      console.log('   Secret length:', googleClientSecret.length, 'characters');
    }
    
    if (!googleCallbackUrl) {
      console.log('❌ GOOGLE_OAUTH_CALLBACK_URL not configured');
      allTestsPassed = false;
    } else {
      console.log('✅ GOOGLE_OAUTH_CALLBACK_URL configured');
      console.log('   Callback URL:', googleCallbackUrl);
    }

    // Test 4: Check URL format validation
    console.log('\n4. Testing URL Format Validation...');
    if (supabaseUrl) {
      if (supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co')) {
        console.log('✅ Supabase URL format is valid');
      } else {
        console.log('❌ Supabase URL format is invalid');
        allTestsPassed = false;
      }
    }
    
    if (googleCallbackUrl) {
      if (googleCallbackUrl.startsWith('https://') && googleCallbackUrl.includes('supabase.co/auth/v1/callback')) {
        console.log('✅ Google callback URL format is valid');
      } else {
        console.log('❌ Google callback URL format is invalid');
        allTestsPassed = false;
      }
    }

    // Test 5: Check JWT token format
    console.log('\n5. Testing JWT Token Format...');
    if (supabaseKey) {
      const jwtParts = supabaseKey.split('.');
      if (jwtParts.length === 3) {
        console.log('✅ Supabase anon key has valid JWT format');
        try {
          const payload = JSON.parse(atob(jwtParts[1]));
          console.log('   Token role:', payload.role);
          console.log('   Token issuer:', payload.iss);
        } catch (e) {
          console.log('⚠️  Could not decode JWT payload');
        }
      } else {
        console.log('❌ Supabase anon key does not have valid JWT format');
        allTestsPassed = false;
      }
    }
    
    if (serviceKey) {
      const jwtParts = serviceKey.split('.');
      if (jwtParts.length === 3) {
        console.log('✅ Service role key has valid JWT format');
        try {
          const payload = JSON.parse(atob(jwtParts[1]));
          console.log('   Token role:', payload.role);
        } catch (e) {
          console.log('⚠️  Could not decode service key JWT payload');
        }
      } else {
        console.log('❌ Service role key does not have valid JWT format');
        allTestsPassed = false;
      }
    }

    // Test 6: Check application configuration
    console.log('\n6. Testing Application Configuration...');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;
    
    if (!appUrl) {
      console.log('❌ NEXT_PUBLIC_APP_URL not configured');
      allTestsPassed = false;
    } else {
      console.log('✅ NEXT_PUBLIC_APP_URL configured:', appUrl);
    }
    
    if (!nextAuthSecret) {
      console.log('❌ NEXTAUTH_SECRET not configured');
      allTestsPassed = false;
    } else {
      console.log('✅ NEXTAUTH_SECRET configured');
      console.log('   Secret length:', nextAuthSecret.length, 'characters');
    }

  } catch (error) {
    console.error('❌ Unexpected error during testing:', error.message);
    allTestsPassed = false;
  }

  console.log('\n' + '='.repeat(50));
  if (allTestsPassed) {
    console.log('🎉 All Authentication Configuration Tests Passed!');
    console.log('\n📋 Next Steps for Manual Testing:');
    console.log('1. Open http://localhost:3000 in browser');
    console.log('2. Test sign up with email/password');
    console.log('3. Test sign in with email/password');
    console.log('4. Test Google OAuth sign in');
    console.log('5. Verify protected routes access');
    console.log('6. Test sign out functionality');
  } else {
    console.log('❌ Some Authentication Configuration Tests Failed!');
    console.log('\n🔧 Please fix the configuration issues above before proceeding.');
  }
  
  console.log('\n🔐 Authentication Configuration Testing Complete');
  return allTestsPassed;
}

// Run the tests
testAuthenticationConfiguration()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });