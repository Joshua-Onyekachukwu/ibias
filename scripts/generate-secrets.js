#!/usr/bin/env node

/**
 * IBIAS Secret Generation Script
 * 
 * Generates secure secrets for production deployment
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Generate a cryptographically secure random string
 */
function generateSecureSecret(length = 32) {
  return crypto.randomBytes(length).toString('base64');
}

/**
 * Update .env.local file with generated secrets
 */
function updateEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found');
    return false;
  }
  
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Generate new NEXTAUTH_SECRET if not present or too short
  const nextAuthSecretMatch = envContent.match(/NEXTAUTH_SECRET=(.*)/);
  const currentSecret = nextAuthSecretMatch ? nextAuthSecretMatch[1].trim() : '';
  
  if (!currentSecret || currentSecret.length < 32) {
    const newSecret = generateSecureSecret(32);
    
    if (nextAuthSecretMatch) {
      // Replace existing secret
      envContent = envContent.replace(
        /NEXTAUTH_SECRET=.*/,
        `NEXTAUTH_SECRET=${newSecret}`
      );
      console.log('✅ Updated NEXTAUTH_SECRET');
    } else {
      // Add new secret
      envContent += `\nNEXTAUTH_SECRET=${newSecret}\n`;
      console.log('✅ Added NEXTAUTH_SECRET');
    }
  } else {
    console.log('✅ NEXTAUTH_SECRET already configured');
  }
  
  // Add NODE_ENV if not present
  if (!envContent.includes('NODE_ENV=')) {
    envContent += `NODE_ENV=development\n`;
    console.log('✅ Added NODE_ENV=development');
  } else {
    console.log('✅ NODE_ENV already configured');
  }
  
  // Write updated content
  fs.writeFileSync(envPath, envContent);
  return true;
}

/**
 * Display current environment status
 */
function displayEnvStatus() {
  console.log('\n🔍 Environment Variables Status:');
  console.log('================================');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXTAUTH_SECRET',
    'NEXT_PUBLIC_APP_URL',
    'NODE_ENV'
  ];
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      if (varName === 'NEXTAUTH_SECRET') {
        const isSecure = value.length >= 32;
        console.log(`${isSecure ? '✅' : '⚠️ '} ${varName}: ${isSecure ? 'Secure' : 'Too short'} (${value.length} chars)`);
      } else {
        console.log(`✅ ${varName}: Configured`);
      }
    } else {
      console.log(`❌ ${varName}: Missing`);
    }
  });
}

/**
 * Generate Vercel environment commands
 */
function generateVercelCommands() {
  console.log('\n🚀 Vercel Environment Setup Commands:');
  console.log('====================================');
  
  const envVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY', 
    'NEXTAUTH_SECRET',
    'NEXT_PUBLIC_APP_URL'
  ];
  
  envVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`vercel env add ${varName}`);
      console.log(`# Enter: ${varName === 'NEXTAUTH_SECRET' ? '[GENERATED_SECRET]' : value}`);
    }
  });
  
  console.log('\n# Or set all at once:');
  envVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      const displayValue = varName.includes('SECRET') || varName.includes('KEY') 
        ? '[REDACTED]' 
        : value;
      console.log(`# ${varName}=${displayValue}`);
    }
  });
}

/**
 * Main function
 */
function main() {
  console.log('🔐 IBIAS Secret Generation & Environment Setup');
  console.log('==============================================\n');
  
  // Load current environment
  require('dotenv').config({ path: '.env.local' });
  
  // Update environment file
  const success = updateEnvFile();
  
  if (success) {
    // Reload environment after updates
    delete require.cache[require.resolve('dotenv')];
    require('dotenv').config({ path: '.env.local' });
    
    // Display status
    displayEnvStatus();
    
    // Generate Vercel commands
    generateVercelCommands();
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Review the generated secrets above');
    console.log('2. Run: npm run verify');
    console.log('3. If database setup needed: Follow MANUAL_SETUP.md');
    console.log('4. Deploy: vercel --prod');
    
  } else {
    console.error('\n❌ Failed to update environment file');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  generateSecureSecret,
  updateEnvFile,
  displayEnvStatus,
  generateVercelCommands
};