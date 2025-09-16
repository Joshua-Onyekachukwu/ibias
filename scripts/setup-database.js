const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

// Use service role for setup operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Use anon key for testing
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupDatabase() {
  console.log('🚀 Setting up IBIAS Database Schema...');
  console.log('📍 Supabase URL:', supabaseUrl);
  
  try {
    // Check if SQL file exists
    const sqlPath = path.join(__dirname, 'IBIAS_Complete_Schema.sql');
    if (!fs.existsSync(sqlPath)) {
      console.error('❌ SQL setup file not found:', sqlPath);
      console.log('💡 Please ensure IBIAS_Complete_Schema.sql exists in the scripts directory');
      return false;
    }
    
    console.log('📄 SQL setup file found, proceeding with manual setup instructions...');
    console.log('\n🔧 MANUAL SETUP REQUIRED:');
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
    console.log('2. Select your project: nzeuxqodvgdadtsjjvum');
    console.log('3. Navigate to SQL Editor');
    console.log('4. Copy and paste the contents of scripts/IBIAS_Complete_Schema.sql');
    console.log('5. Execute the SQL script');
    console.log('6. Run this script again to verify setup');
    
    return true;
    
  } catch (err) {
    console.error('❌ Database setup preparation failed:', err.message);
    return false;
  }
}

async function testDatabaseSetup() {
  console.log('\n🧪 Testing Database Setup...');
  
  const tables = [
    'profiles',
    'subscriptions', 
    'business_metrics',
    'ai_insights',
    'integrations',
    'activity_logs',
    'ai_learning_log'
  ];
  
  const results = {};
  let successCount = 0;
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        results[table] = `❌ ${error.message}`;
      } else {
        results[table] = '✅ Table exists and accessible';
        successCount++;
      }
      
    } catch (err) {
      results[table] = `❌ ${err.message}`;
    }
  }
  
  console.log('\n📋 Table Status:');
  for (const [table, status] of Object.entries(results)) {
    console.log(`  ${table}: ${status}`);
  }
  
  // Test sample data if tables exist
  if (successCount > 0) {
    try {
      const { data: metricsData } = await supabase
        .from('business_metrics')
        .select('*')
        .limit(5);
      
      const { data: insightsData } = await supabase
        .from('ai_insights')
        .select('*')
        .limit(5);
      
      console.log('\n📊 Sample Data:');
      console.log(`  Business Metrics: ${metricsData?.length || 0} records`);
      console.log(`  AI Insights: ${insightsData?.length || 0} records`);
      
    } catch (err) {
      console.warn('⚠️  Sample data test failed:', err.message);
    }
  }
  
  return successCount === tables.length;
}

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase Connection...');
    console.log('📍 Supabase URL:', supabaseUrl);
    console.log('🔑 Anon Key configured:', !!supabaseAnonKey);
    console.log('🔐 Service Key configured:', !!supabaseServiceKey);
    
    // Test basic connection
    const { data, error } = await supabase.auth.getSession();
    
    if (error && error.message !== 'Auth session missing!') {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    return true;
    
  } catch (err) {
    console.error('❌ Connection test error:', err.message);
    return false;
  }
}

async function main() {
  try {
    console.log('🎯 IBIAS Database Setup & Verification\n');
    
    // Test connection first
    const connectionOk = await testConnection();
    if (!connectionOk) {
      console.log('\n💥 Connection failed - please check your environment variables');
      return;
    }
    
    // Test if database is already set up
    const isSetup = await testDatabaseSetup();
    
    if (!isSetup) {
      console.log('\n🔧 Database setup required...');
      await setupDatabase();
    } else {
      console.log('\n🎉 Database is already set up and working!');
      console.log('💡 Your IBIAS platform is ready for development');
    }
    
  } catch (error) {
    console.error('\n💥 Setup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { setupDatabase, testDatabaseSetup, testConnection };