// Anthropic Claude Integration
// This module provides Claude AI integration for IBIAS

import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'your_anthropic_api_key',
});

// Check if Anthropic is properly configured
export function isAnthropicConfigured(): boolean {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  return !!(apiKey && apiKey !== 'your_anthropic_api_key' && apiKey.length > 0);
}

// Generate business analysis using Claude
export async function generateClaudeAnalysis(
  prompt: string,
  context?: string
): Promise<string> {
  if (!isAnthropicConfigured()) {
    return 'Claude AI is not configured. Please set up your Anthropic API key.';
  }

  try {
    const systemPrompt = context || 'You are an expert business analyst providing insights for e-commerce businesses.';
    
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return response.content[0]?.type === 'text' ? response.content[0].text : 'No response generated';
  } catch (error: any) {
    console.error('Anthropic API error:', error);
    
    if (error.status === 401) {
      throw new Error('Anthropic authentication failed. Please check your API key.');
    }
    
    if (error.status === 429) {
      throw new Error('Anthropic rate limit exceeded. Please try again later.');
    }
    
    throw new Error(`Anthropic API error: ${error.message}`);
  }
}

// Generate strategic recommendations using Claude
export async function generateStrategicRecommendations(
  businessData: any,
  goals: string[]
): Promise<string> {
  if (!isAnthropicConfigured()) {
    return 'Claude AI is not configured. Please set up your Anthropic API key.';
  }

  const prompt = `
Analyze this business data and provide strategic recommendations:

Business Data:
${JSON.stringify(businessData, null, 2)}

Business Goals:
${goals.map(goal => `- ${goal}`).join('\n')}

Please provide:
1. Key insights from the data
2. Strategic recommendations aligned with the goals
3. Specific action items with priority levels
4. Potential risks and mitigation strategies
5. Success metrics to track progress

Format your response in clear sections with actionable advice.
  `;

  try {
    return await generateClaudeAnalysis(
      prompt,
      'You are a strategic business consultant specializing in e-commerce growth and optimization. Provide detailed, actionable recommendations based on data analysis.'
    );
  } catch (error: any) {
    console.error('Strategic recommendations error:', error);
    throw error;
  }
}

// Generate content analysis and optimization suggestions
export async function generateContentAnalysis(
  content: string,
  contentType: 'product_description' | 'marketing_copy' | 'email' | 'social_media'
): Promise<string> {
  if (!isAnthropicConfigured()) {
    return 'Claude AI is not configured. Please set up your Anthropic API key.';
  }

  const contextMap = {
    product_description: 'You are an expert copywriter specializing in e-commerce product descriptions that convert.',
    marketing_copy: 'You are a marketing expert focused on creating compelling copy that drives engagement and conversions.',
    email: 'You are an email marketing specialist who creates high-performing email campaigns.',
    social_media: 'You are a social media expert who creates engaging content that builds brand awareness and drives sales.'
  };

  const prompt = `
Analyze this ${contentType.replace('_', ' ')} content and provide optimization suggestions:

Content:
"${content}"

Please provide:
1. Content quality assessment (clarity, engagement, persuasiveness)
2. Target audience alignment
3. SEO and keyword optimization opportunities
4. Emotional impact and tone analysis
5. Specific improvement suggestions
6. Rewritten version (if significant improvements are needed)

Focus on actionable feedback that will improve conversion rates and user engagement.
  `;

  try {
    return await generateClaudeAnalysis(prompt, contextMap[contentType]);
  } catch (error: any) {
    console.error('Content analysis error:', error);
    throw error;
  }
}

// Generate competitive analysis insights
export async function generateCompetitiveAnalysis(
  competitorData: any[],
  businessMetrics: any
): Promise<string> {
  if (!isAnthropicConfigured()) {
    return 'Claude AI is not configured. Please set up your Anthropic API key.';
  }

  const prompt = `
Perform a competitive analysis based on the following data:

Our Business Metrics:
${JSON.stringify(businessMetrics, null, 2)}

Competitor Data:
${JSON.stringify(competitorData, null, 2)}

Please provide:
1. Competitive positioning analysis
2. Strengths and weaknesses comparison
3. Market opportunities and threats
4. Differentiation strategies
5. Pricing and value proposition insights
6. Actionable recommendations for competitive advantage

Focus on practical strategies that can be implemented to improve market position.
  `;

  try {
    return await generateClaudeAnalysis(
      prompt,
      'You are a competitive intelligence analyst with expertise in e-commerce market analysis and strategic positioning.'
    );
  } catch (error: any) {
    console.error('Competitive analysis error:', error);
    throw error;
  }
}

// Export the Anthropic client for direct use if needed
export { anthropic };