import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

// Input validation schema
const aiRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(4000, 'Prompt too long'),
  model: z.enum(['gpt-4', 'gpt-3.5-turbo', 'claude-3']).default('gpt-4'),
  maxTokens: z.number().min(1).max(4000).optional().default(1000),
  temperature: z.number().min(0).max(2).optional().default(0.7),
});

// Rate limiting and authentication helper
async function checkAuthentication(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return { authenticated: false, user: null };
    }
    
    return { authenticated: true, user };
  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false, user: null };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { authenticated, user } = await checkAuthentication(request);
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to access AI features.' },
        { status: 401 }
      );
    }
    
    // Rate limiting check (implement with Redis/Upstash in production)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    const body = await request.json();
    
    // Validate input
    const validatedData = aiRequestSchema.parse(body);
    const { prompt, model, maxTokens, temperature } = validatedData;
    
    // Content filtering (basic example)
    const forbiddenPatterns = ['hack', 'exploit', 'malware', 'virus'];
    if (forbiddenPatterns.some(pattern => prompt.toLowerCase().includes(pattern))) {
      return NextResponse.json(
        { error: 'Content not allowed' },
        { status: 400 }
      );
    }
    
    // Determine AI provider based on model
    const isClaudeModel = model.startsWith('claude-');
    const isOpenAIModel = model.startsWith('gpt-');
    
    try {
      let aiResponse: string;
      let usage: any = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
      
      if (isClaudeModel) {
        // Use Anthropic Claude
        const { generateClaudeAnalysis, isAnthropicConfigured } = await import('@/lib/anthropic');
        
        if (!isAnthropicConfigured()) {
          return NextResponse.json(
            { error: 'Claude AI service not configured. Please contact administrator.' },
            { status: 503 }
          );
        }
        
        aiResponse = await generateClaudeAnalysis(prompt);
        // Note: Anthropic doesn't provide detailed usage stats in the same format
        usage = {
          promptTokens: Math.ceil(prompt.length / 4),
          completionTokens: Math.ceil(aiResponse.length / 4),
          totalTokens: Math.ceil((prompt.length + aiResponse.length) / 4)
        };
        
      } else if (isOpenAIModel) {
        // Use OpenAI GPT
        const { openai, isOpenAIConfigured } = await import('@/lib/openai');
        
        if (!isOpenAIConfigured()) {
          return NextResponse.json(
            { error: 'OpenAI service not configured. Please contact administrator.' },
            { status: 503 }
          );
        }
        
        const response = await openai.chat.completions.create({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: maxTokens,
          temperature,
        });
        
        aiResponse = response.choices[0]?.message?.content || 'No response generated';
        usage = {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0
        };
        
      } else {
        return NextResponse.json(
          { error: `Unsupported model: ${model}. Please use a supported OpenAI (gpt-*) or Anthropic (claude-*) model.` },
          { status: 400 }
        );
      }
      
      return NextResponse.json({ 
        success: true,
        response: aiResponse,
        model,
        provider: isClaudeModel ? 'anthropic' : 'openai',
        usage
      });
      
    } catch (aiError: any) {
      console.error('AI API error:', aiError);
      
      // Handle specific AI provider errors
      if (aiError.status === 401) {
        return NextResponse.json(
          { error: 'AI service authentication failed' },
          { status: 503 }
        );
      }
      
      if (aiError.status === 429) {
        return NextResponse.json(
          { error: 'AI service rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: `AI processing failed: ${aiError.message}` },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('AI processing error:', error);
    return NextResponse.json(
      { error: 'AI processing failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Import configuration checks
  const { isOpenAIConfigured } = await import('@/lib/openai');
  const { isAnthropicConfigured } = await import('@/lib/anthropic');
  
  const availableModels = [];
  
  // Add OpenAI models if configured
  if (isOpenAIConfigured()) {
    availableModels.push(
      { id: 'gpt-4', name: 'GPT-4', provider: 'openai', status: 'available' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', status: 'available' }
    );
  } else {
    availableModels.push(
      { id: 'gpt-4', name: 'GPT-4', provider: 'openai', status: 'not_configured' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', status: 'not_configured' }
    );
  }
  
  // Add Anthropic models if configured
  if (isAnthropicConfigured()) {
    availableModels.push(
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', provider: 'anthropic', status: 'available' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'anthropic', status: 'available' }
    );
  } else {
    availableModels.push(
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', provider: 'anthropic', status: 'not_configured' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: 'anthropic', status: 'not_configured' }
    );
  }
  
  return NextResponse.json({
    models: availableModels,
    providers: {
      openai: { configured: isOpenAIConfigured(), name: 'OpenAI' },
      anthropic: { configured: isAnthropicConfigured(), name: 'Anthropic' }
    },
    status: 'available'
  });
}