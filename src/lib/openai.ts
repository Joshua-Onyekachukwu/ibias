// OpenAI client configuration
import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OPENAI_API_KEY not found in environment variables');
}

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: apiKey || 'placeholder-key',
  dangerouslyAllowBrowser: false // Server-side only
});

// Helper function to check if OpenAI is properly configured
export function isOpenAIConfigured(): boolean {
  return !!apiKey && apiKey !== 'your_openai_api_key';
}

export async function generateBiasAnalysis(text: string) {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in environment variables.');
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an AI bias detection expert. Analyze the given text for potential biases.'
        },
        {
          role: 'user',
          content: `Please analyze this text for bias: ${text}`
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    return response.choices[0].message.content || 'No analysis generated';
   } catch (error) {
     console.error('OpenAI API error:', error);
     throw new Error('Failed to generate bias analysis. Please try again later.');
   }
}

// Generate business insights from analytics data
export async function generateBusinessInsights(data: Record<string, unknown>, context: string = '') {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key not configured.');
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a business intelligence expert. Analyze the provided data and generate actionable insights and recommendations for e-commerce businesses.'
        },
        {
          role: 'user',
          content: `Context: ${context}\n\nData: ${JSON.stringify(data, null, 2)}\n\nPlease provide 3-5 key insights and actionable recommendations based on this data.`
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    return response.choices[0].message.content || 'No insights generated';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate business insights.');
  }
}

// Generate AI recommendations for business optimization
export async function generateRecommendations(metrics: Record<string, unknown>, goals: string[] = []) {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI API key not configured.');
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an AI business consultant specializing in e-commerce optimization. Provide specific, actionable recommendations based on business metrics.'
        },
        {
          role: 'user',
          content: `Business Metrics: ${JSON.stringify(metrics, null, 2)}\n\nBusiness Goals: ${goals.join(', ')}\n\nPlease provide 3-5 prioritized recommendations with expected impact and implementation steps.`
        }
      ],
      temperature: 0.6,
      max_tokens: 1000
    });

    return response.choices[0].message.content || 'No recommendations generated';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate recommendations.');
  }
}