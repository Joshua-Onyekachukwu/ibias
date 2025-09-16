import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Using placeholder values.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types (these would typically be generated from your Supabase schema)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: 'free' | 'basic' | 'pro' | 'enterprise'
          status: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start: string
          current_period_end: string
          cancel_at_period_end: boolean
          trial_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan: 'free' | 'basic' | 'pro' | 'enterprise'
          status: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start: string
          current_period_end: string
          cancel_at_period_end?: boolean
          trial_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: 'free' | 'basic' | 'pro' | 'enterprise'
          status?: 'active' | 'canceled' | 'past_due' | 'trialing'
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
          trial_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper functions for common operations
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  return { data, error }
}

export const updateProfile = async (userId: string, updates: Database['public']['Tables']['profiles']['Update']) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  return { data, error }
}

export const getSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  return { data, error }
}

export const createSubscription = async (subscription: Database['public']['Tables']['subscriptions']['Insert']) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert(subscription)
    .select()
    .single()
  
  return { data, error }
}

export const updateSubscription = async (userId: string, updates: Database['public']['Tables']['subscriptions']['Update']) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()
  
  return { data, error }
}