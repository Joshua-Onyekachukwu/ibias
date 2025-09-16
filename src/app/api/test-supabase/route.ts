import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔍 Testing Supabase connection from Next.js API...')
    
    // Test 1: Basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    let connectionStatus = 'unknown'
    let connectionMessage = ''
    
    if (error) {
      if (error.message.includes('relation "public.profiles" does not exist')) {
        connectionStatus = 'success'
        connectionMessage = 'Database accessible (profiles table not created yet - this is expected)'
      } else {
        connectionStatus = 'error'
        connectionMessage = error.message
      }
    } else {
      connectionStatus = 'success'
      connectionMessage = 'Database query successful'
    }
    
    // Test 2: Auth service
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    const authStatus = authError ? 'error' : 'success'
    const authMessage = authError ? authError.message : 'Auth service working'
    
    // Test 3: Environment variables
    const envCheck = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    }
    
    const results = {
      timestamp: new Date().toISOString(),
      tests: {
        database: {
          status: connectionStatus,
          message: connectionMessage
        },
        auth: {
          status: authStatus,
          message: authMessage,
          hasSession: !!session
        },
        environment: {
          status: Object.values(envCheck).every(Boolean) ? 'success' : 'warning',
          variables: envCheck
        }
      },
      overall: connectionStatus === 'success' && authStatus === 'success' ? 'success' : 'partial'
    }
    
    return NextResponse.json(results)
    
  } catch (error) {
    console.error('Supabase test error:', error)
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      tests: {
        database: {
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        auth: {
          status: 'error',
          message: 'Could not test auth service'
        },
        environment: {
          status: 'unknown',
          variables: {}
        }
      },
      overall: 'error'
    }, { status: 500 })
  }
}