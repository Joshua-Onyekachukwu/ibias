const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  try {
    console.log('🔍 Checking existing tables in database...');
    
    // Try to query each table individually to see which ones exist
    const tablesToCheck = [
      'companies',
      'user_profiles', 
      'user_subscriptions',
      'feature_usage',
      'plan_features',
      'integrations',
      'analytics_data',
      'ai_recommendations',
      'tasks',
      'task_comments',
      'industry_benchmarks',
      'benchmark_comparisons',
      'audit_logs',
      'notifications',
      'ai_learning_log',
      'profiles',
      'subscriptions',
      'business_metrics',
      'ai_insights',
      'activity_logs'
    ];
    
    const existingTables = [];
    const missingTables = [];
    
    for (const table of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (!error) {
          existingTables.push(table);
          console.log(`✅ ${table} - exists`);
        } else if (error.code === '42P01') {
          missingTables.push(table);
          console.log(`❌ ${table} - does not exist`);
        } else {
          console.log(`⚠️  ${table} - error: ${error.message}`);
        }
      } catch (err) {
        console.log(`⚠️  ${table} - error: ${err.message}`);
        missingTables.push(table);
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`✅ Existing tables (${existingTables.length}):`, existingTables.sort());
    console.log(`❌ Missing tables (${missingTables.length}):`, missingTables.sort());
    
    // Check if we have the core schema or the simple schema
    if (existingTables.includes('companies') && existingTables.includes('user_profiles')) {
      console.log('\n🏗️  Detected: IBIAS Core Database Schema (advanced)');
    } else if (existingTables.includes('profiles') && existingTables.includes('subscriptions')) {
      console.log('\n🏗️  Detected: Simple IBIAS Schema');
    } else {
      console.log('\n🏗️  Schema type: Mixed or incomplete');
    }
    
  } catch (error) {
    console.error('❌ Error checking tables:', error.message);
  }
}

checkTables();