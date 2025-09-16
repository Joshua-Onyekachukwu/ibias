// IBIAS AI Integration Audit Script
// Tests current AI model integrations and API connectivity

require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');

async function auditAIIntegrations() {
  console.log('🤖 IBIAS AI Integration Audit');
  console.log('=' .repeat(50));
  
  // 1. Check environment variables
  console.log('\n📋 Environment Variables Check:');
  const requiredEnvVars = [
    'OPENAI_API_KEY',
    'ANTHROPIC_API_KEY'
  ];
  
  const envStatus = {};
  requiredEnvVars.forEach(envVar => {
    const value = process.env[envVar];
    const isSet = value && value !== 'your_openai_api_key' && value !== 'your_anthropic_api_key';
    envStatus[envVar] = isSet;
    console.log(`  ${envVar}: ${isSet ? '✅ Set' : '❌ Missing/Placeholder'}`);
  });
  
  // 2. Check package.json for AI dependencies
  console.log('\n📦 AI Package Dependencies:');
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const aiPackages = {
    'openai': 'OpenAI SDK',
    '@anthropic-ai/sdk': 'Anthropic Claude SDK',
    'replicate': 'Replicate SDK',
    '@google/generative-ai': 'Google Gemini SDK'
  };
  
  const installedAIPackages = [];
  const missingAIPackages = [];
  
  Object.entries(aiPackages).forEach(([pkg, description]) => {
    const isInstalled = packageJson.dependencies?.[pkg] || packageJson.devDependencies?.[pkg];
    if (isInstalled) {
      installedAIPackages.push({ pkg, description, version: isInstalled });
      console.log(`  ✅ ${pkg} (${description}): ${isInstalled}`);
    } else {
      missingAIPackages.push({ pkg, description });
      console.log(`  ❌ ${pkg} (${description}): Not installed`);
    }
  });
  
  // 3. Test OpenAI integration
  console.log('\n🧪 OpenAI Integration Test:');
  try {
    const openaiLib = require('../src/lib/openai.ts');
    console.log('  ✅ OpenAI lib file exists');
    
    // Test the placeholder function
    const testResult = await openaiLib.generateBiasAnalysis('Test prompt for bias analysis');
    console.log('  📝 Test response:', testResult?.choices?.[0]?.message?.content || 'No response');
    
    if (testResult?.choices?.[0]?.message?.content?.includes('placeholder')) {
      console.log('  ⚠️  OpenAI integration is using placeholder implementation');
    }
  } catch (error) {
    console.log('  ❌ OpenAI lib test failed:', error.message);
  }
  
  // 4. Check AI API route
  console.log('\n🛣️  AI API Route Check:');
  const aiRoutePath = path.join(process.cwd(), 'src/app/api/ai/route.ts');
  if (fs.existsSync(aiRoutePath)) {
    console.log('  ✅ AI API route exists');
    const routeContent = fs.readFileSync(aiRoutePath, 'utf8');
    
    if (routeContent.includes('TODO: Implement OpenAI')) {
      console.log('  ⚠️  AI API route has TODO for OpenAI implementation');
    }
    
    if (routeContent.includes('AI integration coming soon')) {
      console.log('  ⚠️  AI API route returns placeholder response');
    }
  } else {
    console.log('  ❌ AI API route not found');
  }
  
  // 5. Check database schema for AI tables
  console.log('\n🗄️  Database AI Schema Check:');
  const schemaPath = path.join(process.cwd(), 'scripts/IBIAS_Complete_Schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    const aiTables = [
      'ai_recommendations',
      'ai_insights', 
      'ai_learning_log',
      'ai_model_metrics'
    ];
    
    aiTables.forEach(table => {
      if (schemaContent.includes(table)) {
        console.log(`  ✅ ${table} table defined`);
      } else {
        console.log(`  ❌ ${table} table missing`);
      }
    });
  }
  
  // 6. Generate recommendations
  console.log('\n💡 Recommendations:');
  
  if (missingAIPackages.length > 0) {
    console.log('\n📦 Install missing AI packages:');
    missingAIPackages.forEach(({ pkg, description }) => {
      console.log(`  npm install ${pkg}  # ${description}`);
    });
  }
  
  if (!envStatus.OPENAI_API_KEY) {
    console.log('\n🔑 Set up OpenAI API key:');
    console.log('  1. Get API key from https://platform.openai.com/api-keys');
    console.log('  2. Update OPENAI_API_KEY in .env.local');
  }
  
  if (!envStatus.ANTHROPIC_API_KEY) {
    console.log('\n🔑 Set up Anthropic API key:');
    console.log('  1. Get API key from https://console.anthropic.com/');
    console.log('  2. Update ANTHROPIC_API_KEY in .env.local');
  }
  
  console.log('\n🔧 Implementation priorities:');
  console.log('  1. Install OpenAI SDK: npm install openai');
  console.log('  2. Replace placeholder OpenAI implementation');
  console.log('  3. Implement actual AI API route logic');
  console.log('  4. Add error handling and rate limiting');
  console.log('  5. Test AI recommendations generation');
  
  console.log('\n✅ AI Integration Audit Complete!');
}

// Run the audit
auditAIIntegrations().catch(console.error);