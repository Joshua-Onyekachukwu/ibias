import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

// Input validation schemas
const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const signUpSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check (implement with Redis/Upstash in production)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    const body = await request.json();
    const { action } = body;
    
    // Validate input based on action
    if (action !== 'signin' && action !== 'signup') {
      return NextResponse.json(
        { error: 'Invalid action. Must be signin or signup' },
        { status: 400 }
      );
    }
    
    // Implement Supabase authentication
    const supabase = await createClient();
    
    if (action === 'signin') {
      const validatedData = signInSchema.parse(body);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });
      
      if (error) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Signed in successfully',
        user: data.user
      });
    } else if (action === 'signup') {
      const validatedData = signUpSchema.parse(body);
      const { data, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            first_name: validatedData.firstName,
            last_name: validatedData.lastName,
          }
        }
      });
      
      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Account created successfully. Please check your email for verification.',
        user: data.user
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Auth API endpoint is active' 
  });
}