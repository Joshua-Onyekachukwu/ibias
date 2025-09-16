#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackUrl = process.env.GOOGLE_OAUTH_CALLBACK_URL;

console.log('🔧 IBIAS Google OAuth Setup & Verification');
console.log('==========================================\n');

// Initialize Supabase admin client
const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

async function checkEnvironmentVariables() {
  console.log('📋 Checking Environment Variables...');
  
  const checks = [
    { name: 'NEXT_PUBLIC_SUPABASE_URL', value: supabaseUrl, required: true },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', value: supabaseServiceKey, required: true },
    { name: 'GOOGLE_CLIENT_ID', value: googleClientId, required: true },
    { name: 'GOOGLE_CLIENT_SECRET', value: googleClientSecret, required: true },
    { name: 'GOOGLE_OAUTH_CALLBACK_URL', value: callbackUrl, required: true }
  ];
  
  let allValid = true;
  
  checks.forEach(check => {
    if (check.required && (!check.value || check.value.includes('your_') || check.value.includes('placeholder'))) {
      console.log(`❌ ${check.name}: Missing or placeholder value`);
      allValid = false;
    } else if (check.value) {
      console.log(`✅ ${check.name}: Configured`);
    } else {
      console.log(`⚠️  ${check.name}: Optional - Not set`);
    }
  });
  
  return allValid;
}

async function checkSupabaseConnection() {
  console.log('\n🔗 Testing Supabase Connection...');
  
  try {
    if (!supabaseAdmin) {
      console.log('❌ Supabase admin client not initialized');
      return false;
    }
    
    // Test connection by fetching auth users
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1
    });
    
    if (error) {
      console.log(`❌ Supabase connection failed: ${error.message}`);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    console.log(`📊 Current user count: ${data.users?.length || 0}`);
    return true;
  } catch (error) {
    console.log(`❌ Supabase connection error: ${error.message}`);
    return false;
  }
}

async function checkGoogleOAuthConfig() {
  console.log('\n🔍 Checking Google OAuth Configuration...');
  
  // Validate Google Client ID format
  if (googleClientId && googleClientId.includes('.apps.googleusercontent.com')) {
    console.log('✅ Google Client ID format is valid');
  } else {
    console.log('❌ Google Client ID format is invalid');
    return false;
  }
  
  // Validate Google Client Secret format
  if (googleClientSecret && googleClientSecret.startsWith('GOCSPX-')) {
    console.log('✅ Google Client Secret format is valid');
  } else {
    console.log('❌ Google Client Secret format is invalid');
    return false;
  }
  
  // Validate callback URL
  if (callbackUrl && callbackUrl.includes('supabase.co/auth/v1/callback')) {
    console.log('✅ Callback URL format is valid');
  } else {
    console.log('❌ Callback URL should be your Supabase URL + /auth/v1/callback');
    return false;
  }
  
  return true;
}

async function checkAuthConfiguration() {
  console.log('\n🔐 Checking Authentication Configuration...');
  
  // Check if auth files exist
  const authFiles = [
    'src/contexts/AuthContext.tsx',
    'src/components/auth/enhanced-auth.tsx',
    'src/app/auth/callback/page.tsx'
  ];
  
  authFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
    }
  });
  
  // Check AuthContext implementation
  const authContextPath = path.join(process.cwd(), 'src/contexts/AuthContext.tsx');
  if (fs.existsSync(authContextPath)) {
    const content = fs.readFileSync(authContextPath, 'utf8');
    
    if (content.includes('signInWithOAuth')) {
      console.log('✅ Google OAuth implementation found in AuthContext');
    } else {
      console.log('❌ Google OAuth implementation missing in AuthContext');
    }
    
    if (content.includes('provider: \'google\'')) {
      console.log('✅ Google provider configured');
    } else {
      console.log('❌ Google provider not configured');
    }
  }
}

async function generateSupabaseInstructions() {
  console.log('\n📝 Supabase Google OAuth Setup Instructions:');
  console.log('============================================');
  console.log('\n1. Go to your Supabase Dashboard:');
  console.log(`   https://app.supabase.com/project/${supabaseUrl?.split('//')[1]?.split('.')[0]}/auth/providers`);
  console.log('\n2. Enable Google OAuth Provider:');
  console.log('   - Toggle "Enable sign in with Google"');
  console.log(`   - Client ID: ${googleClientId}`);
  console.log(`   - Client Secret: ${googleClientSecret}`);
  console.log(`   - Redirect URL: ${callbackUrl}`);
  console.log('\n3. Configure Google Cloud Console:');
  console.log('   - Go to https://console.cloud.google.com/');
  console.log('   - Enable Google+ API');
  console.log('   - Add authorized redirect URIs:');
  console.log(`     * ${callbackUrl}`);
  console.log(`     * http://localhost:3004/auth/callback (for development)`);
  console.log('\n4. Test the configuration:');
  console.log('   - Run: npm run dev');
  console.log('   - Go to: http://localhost:3004/auth');
  console.log('   - Click "Sign in with Google"');
}

async function main() {
  try {
    const envValid = await checkEnvironmentVariables();
    
    if (!envValid) {
      console.log('\n❌ Environment variables are not properly configured.');
      console.log('Please update your .env.local file with the correct values.');
      process.exit(1);
    }
    
    const supabaseConnected = await checkSupabaseConnection();
    const googleConfigValid = await checkGoogleOAuthConfig();
    
    await checkAuthConfiguration();
    
    if (supabaseConnected && googleConfigValid) {
      console.log('\n✅ All configurations look good!');
      console.log('\n🚀 Next Steps:');
      console.log('1. Configure Google OAuth in Supabase Dashboard (see instructions below)');
      console.log('2. Test the authentication flow');
      console.log('3. Verify user creation and profile setup');
    } else {
      console.log('\n❌ Some configurations need attention.');
    }
    
    await generateSupabaseInstructions();
    
  } catch (error) {
    console.error('\n💥 Setup script error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  checkEnvironmentVariables,
  checkSupabaseConnection,
  checkGoogleOAuthConfig,
  checkAuthConfiguration
};