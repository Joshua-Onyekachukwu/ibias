export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'owner' | 'admin' | 'analyst' | 'user' | 'viewer';
  created_at: string;
  updated_at: string;
  company_id?: string;
  subscription_tier?: 'free' | 'starter' | 'pro' | 'enterprise';
}

export interface UserProfile {
  id: string;
  company_id: string;
  full_name?: string;
  avatar_url?: string;
  job_title?: string;
  role: 'owner' | 'admin' | 'analyst' | 'user' | 'viewer';
  permissions: Record<string, boolean>;
  preferences: UserPreferences;
  last_active_at: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    weekly_summary: boolean;
    ai_insights: boolean;
  };
  ai_settings: {
    preferred_model: string;
    temperature: number;
    max_recommendations: number;
  };
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  industry?: string;
  company_size?: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+';
  website_url?: string;
  logo_url?: string;
  subscription_plan: 'free' | 'starter' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  trial_ends_at?: string;
  billing_email?: string;
  settings: Record<string, string | number | boolean>;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}