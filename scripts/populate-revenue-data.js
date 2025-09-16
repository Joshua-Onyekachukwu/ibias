const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function populateRevenueData() {
  console.log('🔄 Testing Supabase connection and populating revenue data...');
  
  try {
    // First, test the connection by checking if tables exist
    console.log('📋 Checking if analytics_data table exists...');
    const { data: tableCheck, error: tableError } = await supabase
      .from('analytics_data')
      .select('count')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Table check failed:', tableError.message);
      console.log('💡 The analytics_data table might not exist. Let\'s check what tables are available.');
      return;
    }
    
    console.log('✅ analytics_data table exists!');
    
    // Sample company ID
    const companyId = '550e8400-e29b-41d4-a716-446655440000';
    
    // Insert a simple test record first
    console.log('📊 Inserting test revenue data...');
    const testData = {
      company_id: companyId,
      metric_name: 'total_revenue',
      metric_value: 45230.50,
      metric_type: 'revenue',
      dimensions: { period: 'daily' },
      timestamp: new Date().toISOString(),
      date_key: new Date().toISOString().split('T')[0]
    };
    
    const { data: insertResult, error: insertError } = await supabase
      .from('analytics_data')
      .insert([testData])
      .select();
    
    if (insertError) {
      console.error('❌ Error inserting test data:', insertError);
      return;
    }
    
    console.log('✅ Test data inserted successfully!');
    console.log('📊 Inserted record:', insertResult);
    
    // Now insert more comprehensive data
    console.log('📈 Inserting comprehensive revenue analytics data...');
    
    const revenueData = [];
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      revenueData.push({
        company_id: companyId,
        metric_name: 'total_revenue',
        metric_value: 40000 + Math.random() * 15000,
        metric_type: 'revenue',
        dimensions: { period: 'daily' },
        timestamp: date.toISOString(),
        date_key: date.toISOString().split('T')[0]
      });
      
      revenueData.push({
        company_id: companyId,
        metric_name: 'total_orders',
        metric_value: Math.floor(300 + Math.random() * 100),
        metric_type: 'orders',
        dimensions: { period: 'daily' },
        timestamp: date.toISOString(),
        date_key: date.toISOString().split('T')[0]
      });
    }
    
    const { error: bulkError } = await supabase
      .from('analytics_data')
      .insert(revenueData);
    
    if (bulkError) {
      console.error('❌ Error inserting bulk data:', bulkError);
      return;
    }
    
    console.log('✅ Bulk revenue data inserted successfully!');
    
    // Check if ai_recommendations table exists and insert sample recommendations
    console.log('🤖 Checking AI recommendations table...');
    const { error: aiTableError } = await supabase
      .from('ai_recommendations')
      .select('count')
      .limit(1);
    
    if (!aiTableError) {
      console.log('📝 Inserting AI recommendations...');
      const recommendations = [
        {
          company_id: companyId,
          title: 'Optimize Product Bundle Pricing',
          description: 'Based on purchase patterns, creating a bundle with Premium Wireless Headphones and Bluetooth Speaker could increase AOV by 18%',
          category: 'revenue_optimization',
          priority: 'high',
          confidence_score: 0.87,
          potential_impact: { metric: 'revenue', estimated_change: '+18%', timeframe: '30_days' },
          data_sources: ['analytics_data', 'product_performance'],
          model_used: 'OpenAI GPT-4',
          model_version: 'v1.0'
        }
      ];
      
      const { error: recError } = await supabase
        .from('ai_recommendations')
        .insert(recommendations);
      
      if (recError) {
        console.error('❌ Error inserting recommendations:', recError);
      } else {
        console.log('✅ AI recommendations inserted successfully!');
      }
    }
    
    console.log('🎉 Revenue analytics data population completed!');
    console.log('📊 Summary:');
    console.log('   - Revenue and orders data for the last 7 days');
    console.log('   - AI recommendations for revenue optimization');
    console.log('   - Data is now ready for the frontend Revenue Analytics dashboard');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

populateRevenueData();