// Test OpenAI Integration
// This script tests the actual OpenAI API integration

require('dotenv').config({ path: '.env.local' });

async function testOpenAIIntegration() {
  console.log('🤖 Testing OpenAI Integration');
  console.log('=' .repeat(40));
  
  // Check environment variable
  const apiKey = process.env.OPENAI_API_KEY;
  console.log('\n🔑 API Key Status:');
  
  if (!apiKey) {
    console.log('  ❌ OPENAI_API_KEY not found');
    return;
  }
  
  if (apiKey === 'your_openai_api_key') {
    console.log('  ⚠️  OPENAI_API_KEY is still placeholder');
    console.log('  📝 To test OpenAI integration:');
    console.log('     1. Get API key from https://platform.openai.com/api-keys');
    console.log('     2. Update OPENAI_API_KEY in .env.local');
    console.log('     3. Run this test again');
    return;
  }
  
  console.log('  ✅ OPENAI_API_KEY is configured');
  console.log(`  🔐 Key: ${apiKey.substring(0, 7)}...${apiKey.substring(apiKey.length - 4)}`);
  
  try {
    // Test the OpenAI library functions
    console.log('\n🧪 Testing OpenAI Library Functions:');
    
    // Import the OpenAI functions (using dynamic import for ES modules)
    const openaiModule = await import('../src/lib/openai.ts');
    const { isOpenAIConfigured, generateBiasAnalysis, generateBusinessInsights, generateRecommendations } = openaiModule;
    
    // Test configuration check
    console.log('  📋 Configuration check:', isOpenAIConfigured() ? '✅ Configured' : '❌ Not configured');
    
    if (!isOpenAIConfigured()) {
      console.log('  ⚠️  OpenAI not properly configured');
      return;
    }
    
    // Test bias analysis
    console.log('\n  🔍 Testing Bias Analysis...');
    try {
      const biasResult = await generateBiasAnalysis('This product is perfect for young professionals who want to succeed.');
      console.log('  ✅ Bias Analysis Success');
      console.log('  📝 Sample Response:', biasResult.substring(0, 100) + '...');
    } catch (error) {
      console.log('  ❌ Bias Analysis Failed:', error.message);
    }
    
    // Test business insights
    console.log('\n  📊 Testing Business Insights...');
    try {
      const sampleData = {
        revenue: 125000,
        orders: 450,
        averageOrderValue: 278,
        conversionRate: 3.2,
        topProducts: ['Product A', 'Product B', 'Product C']
      };
      
      const insights = await generateBusinessInsights(sampleData, 'E-commerce monthly performance');
      console.log('  ✅ Business Insights Success');
      console.log('  📝 Sample Response:', insights.substring(0, 100) + '...');
    } catch (error) {
      console.log('  ❌ Business Insights Failed:', error.message);
    }
    
    // Test recommendations
    console.log('\n  🎯 Testing Recommendations...');
    try {
      const sampleMetrics = {
        monthlyRevenue: 125000,
        customerAcquisitionCost: 45,
        customerLifetimeValue: 320,
        churnRate: 5.2
      };
      
      const recommendations = await generateRecommendations(sampleMetrics, ['Increase revenue', 'Reduce churn']);
      console.log('  ✅ Recommendations Success');
      console.log('  📝 Sample Response:', recommendations.substring(0, 100) + '...');
    } catch (error) {
      console.log('  ❌ Recommendations Failed:', error.message);
    }
    
    console.log('\n✅ OpenAI Integration Test Complete!');
    console.log('\n🚀 Next Steps:');
    console.log('  1. Test AI API endpoint: POST /api/ai');
    console.log('  2. Integrate AI insights into dashboard');
    console.log('  3. Set up AI recommendations cron job');
    console.log('  4. Add AI model monitoring and logging');
    
  } catch (error) {
    console.error('\n❌ OpenAI Integration Test Failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('  1. Verify API key is valid');
    console.error('  2. Check network connectivity');
    console.error('  3. Ensure OpenAI package is installed');
    console.error('  4. Check for rate limiting or quota issues');
  }
}

// Run the test
testOpenAIIntegration().catch(console.error);