// AI Integrations Setup and Testing Script
// This script helps set up and test all AI integrations

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

async function setupAIIntegrations() {
  console.log('🤖 AI Integrations Setup & Testing');
  console.log('=' .repeat(50));
  
  // Check current environment variables
  console.log('\n🔑 Environment Variables Status:');
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  
  console.log(`  OpenAI API Key: ${openaiKey === 'your_openai_api_key' ? '⚠️  Placeholder' : openaiKey ? '✅ Configured' : '❌ Missing'}`);
  console.log(`  Anthropic API Key: ${anthropicKey === 'your_anthropic_api_key' ? '⚠️  Placeholder' : anthropicKey ? '✅ Configured' : '❌ Missing'}`);
  
  // Check installed packages
  console.log('\n📦 AI Package Installation Status:');
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const aiPackages = {
    'openai': 'OpenAI SDK',
    '@anthropic-ai/sdk': 'Anthropic Claude SDK',
    '@google/generative-ai': 'Google Gemini SDK',
    'replicate': 'Replicate SDK'
  };
  
  Object.entries(aiPackages).forEach(([pkg, name]) => {
    const installed = dependencies[pkg];
    console.log(`  ${name}: ${installed ? `✅ v${installed}` : '❌ Not installed'}`);
  });
  
  // Check AI integration files
  console.log('\n📁 AI Integration Files Status:');
  const aiFiles = {
    'src/lib/openai.ts': 'OpenAI Integration',
    'src/app/api/ai/route.ts': 'AI API Route',
    'src/types/ai.d.ts': 'AI Type Definitions',
    'src/app/admin/models/page.tsx': 'AI Models Management UI'
  };
  
  Object.entries(aiFiles).forEach(([filePath, description]) => {
    const exists = fs.existsSync(path.join(process.cwd(), filePath));
    console.log(`  ${description}: ${exists ? '✅ Exists' : '❌ Missing'}`);
  });
  
  // Test AI API route
  console.log('\n🌐 Testing AI API Route:');
  try {
    // Check if the route file has proper implementation
    const routeFile = path.join(process.cwd(), 'src/app/api/ai/route.ts');
    const routeContent = fs.readFileSync(routeFile, 'utf8');
    
    const hasOpenAIImport = routeContent.includes('import') && routeContent.includes('openai');
    const hasErrorHandling = routeContent.includes('catch') && routeContent.includes('error');
    const hasValidation = routeContent.includes('zod') || routeContent.includes('validation');
    
    console.log(`  OpenAI Integration: ${hasOpenAIImport ? '✅ Implemented' : '❌ Missing'}`);
    console.log(`  Error Handling: ${hasErrorHandling ? '✅ Implemented' : '❌ Missing'}`);
    console.log(`  Input Validation: ${hasValidation ? '✅ Implemented' : '❌ Missing'}`);
  } catch (error) {
    console.log('  ❌ Route file check failed:', error.message);
  }
  
  // Database schema check
  console.log('\n🗄️  Database Schema Status:');
  try {
    const schemaFile = path.join(process.cwd(), 'IBIAS_Complete_Schema.sql');
    if (fs.existsSync(schemaFile)) {
      const schemaContent = fs.readFileSync(schemaFile, 'utf8');
      
      const aiTables = {
        'ai_recommendations': 'AI Recommendations',
        'ai_insights': 'AI Insights',
        'ai_learning_log': 'AI Learning Log',
        'ai_models': 'AI Models Configuration'
      };
      
      Object.entries(aiTables).forEach(([table, description]) => {
        const hasTable = schemaContent.includes(`CREATE TABLE ${table}`) || schemaContent.includes(`create table ${table}`);
        console.log(`  ${description}: ${hasTable ? '✅ Defined' : '❌ Missing'}`);
      });
    } else {
      console.log('  ❌ Schema file not found');
    }
  } catch (error) {
    console.log('  ❌ Schema check failed:', error.message);
  }
  
  // Recommendations
  console.log('\n🎯 Setup Recommendations:');
  
  if (openaiKey === 'your_openai_api_key' || !openaiKey) {
    console.log('\n  🔑 OpenAI Setup:');
    console.log('     1. Visit: https://platform.openai.com/api-keys');
    console.log('     2. Create a new API key');
    console.log('     3. Update OPENAI_API_KEY in .env.local');
    console.log('     4. Add billing information to your OpenAI account');
  }
  
  if (anthropicKey === 'your_anthropic_api_key' || !anthropicKey) {
    console.log('\n  🤖 Anthropic Setup:');
    console.log('     1. Visit: https://console.anthropic.com/');
    console.log('     2. Create an account and get API key');
    console.log('     3. Update ANTHROPIC_API_KEY in .env.local');
    console.log('     4. Install Anthropic SDK: npm install @anthropic-ai/sdk');
  }
  
  if (!dependencies['@anthropic-ai/sdk']) {
    console.log('\n  📦 Missing AI Packages:');
    console.log('     npm install @anthropic-ai/sdk @google/generative-ai replicate');
  }
  
  console.log('\n  🔧 Development Tasks:');
  console.log('     1. Create Anthropic integration in src/lib/anthropic.ts');
  console.log('     2. Add model switching logic in AI API route');
  console.log('     3. Implement AI model monitoring and logging');
  console.log('     4. Add AI usage analytics and cost tracking');
  console.log('     5. Create AI model performance benchmarks');
  
  console.log('\n  🚀 Production Readiness:');
  console.log('     1. Set up rate limiting for AI endpoints');
  console.log('     2. Implement AI response caching');
  console.log('     3. Add AI model fallback strategies');
  console.log('     4. Monitor AI API costs and usage');
  console.log('     5. Implement AI safety filters and content moderation');
  
  console.log('\n✅ AI Integration Audit Complete!');
  console.log('\n📊 Summary:');
  console.log(`  - OpenAI: ${openaiKey && openaiKey !== 'your_openai_api_key' ? 'Ready' : 'Needs Setup'}`);
  console.log(`  - Anthropic: ${anthropicKey && anthropicKey !== 'your_anthropic_api_key' ? 'Ready' : 'Needs Setup'}`);
  console.log(`  - API Route: ${fs.existsSync(path.join(process.cwd(), 'src/app/api/ai/route.ts')) ? 'Implemented' : 'Missing'}`);
  console.log(`  - Database: ${fs.existsSync(path.join(process.cwd(), 'IBIAS_Complete_Schema.sql')) ? 'Schema Ready' : 'Needs Schema'}`);
}

// Run the setup
setupAIIntegrations().catch(console.error);