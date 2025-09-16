-- IBIAS Complete Database Schema
-- AI-Powered Business Intelligence & Analytics System
-- Created: 2024
-- Purpose: Consolidated database schema for IBIAS SaaS platform
-- Includes: Core business entities, AI/ML features, subscription management, and enterprise features

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- CORE BUSINESS ENTITIES
-- =============================================

-- Companies/Organizations table
-- Drop existing constraints if they exist to avoid conflicts
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'companies') THEN
        ALTER TABLE companies DROP CONSTRAINT IF EXISTS companies_subscription_plan_check;
        ALTER TABLE companies DROP CONSTRAINT IF EXISTS companies_subscription_status_check;
        ALTER TABLE companies DROP CONSTRAINT IF EXISTS companies_company_size_check;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  industry VARCHAR(100),
  company_size VARCHAR(50),
  website_url TEXT,
  logo_url TEXT,
  subscription_plan VARCHAR(50) DEFAULT 'starter',
  subscription_status VARCHAR(20) DEFAULT 'active',
  trial_ends_at TIMESTAMPTZ,
  billing_email VARCHAR(255),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add constraints separately to handle existing tables
DO $$
BEGIN
    -- First, update any invalid data to valid values
    UPDATE companies 
    SET subscription_plan = 'starter' 
    WHERE subscription_plan IS NULL OR subscription_plan NOT IN ('starter', 'growth', 'scale', 'enterprise');
    
    UPDATE companies 
    SET subscription_status = 'active' 
    WHERE subscription_status IS NULL OR subscription_status NOT IN ('active', 'cancelled', 'past_due', 'trialing');
    
    UPDATE companies 
    SET company_size = '1-10' 
    WHERE company_size IS NULL OR company_size NOT IN ('1-10', '11-50', '51-200', '201-1000', '1000+');
    
    -- Add company_size constraint
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'companies_company_size_check' 
                   AND table_name = 'companies') THEN
        ALTER TABLE companies ADD CONSTRAINT companies_company_size_check 
        CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+'));
    END IF;
    
    -- Add subscription_plan constraint
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'companies_subscription_plan_check' 
                   AND table_name = 'companies') THEN
        ALTER TABLE companies ADD CONSTRAINT companies_subscription_plan_check 
        CHECK (subscription_plan IN ('starter', 'growth', 'scale', 'enterprise'));
    END IF;
    
    -- Add subscription_status constraint
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'companies_subscription_status_check' 
                   AND table_name = 'companies') THEN
        ALTER TABLE companies ADD CONSTRAINT companies_subscription_status_check 
        CHECK (subscription_status IN ('active', 'cancelled', 'past_due', 'trialing'));
    END IF;
END $$;

-- Enhanced users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  job_title VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('owner', 'admin', 'analyst', 'user', 'viewer')),
  permissions JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{
    "theme": "system",
    "notifications": {
      "email": true,
      "push": true,
      "weekly_summary": true,
      "ai_insights": true
    },
    "ai_settings": {
      "preferred_model": "gpt-4",
      "temperature": 0.7,
      "max_recommendations": 10
    }
  }',
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team invitations table
CREATE TABLE IF NOT EXISTS team_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('owner', 'admin', 'analyst', 'user', 'viewer')),
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitation_token UUID DEFAULT gen_random_uuid() UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, email)
);

-- =============================================
-- SUBSCRIPTION MANAGEMENT
-- =============================================

-- User subscription management
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('starter', 'growth', 'scale', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id) -- One subscription per user
);

-- Feature usage tracking with monthly reset
CREATE TABLE IF NOT EXISTS feature_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_type TEXT NOT NULL, -- 'ai_insights', 'data_sources', 'team_members', etc.
  usage_count INTEGER DEFAULT 0,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  metadata JSONB DEFAULT '{}', -- Store additional context
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, feature_type, period_start)
);

-- Plan configuration (admin-configurable)
CREATE TABLE IF NOT EXISTS plan_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_type TEXT NOT NULL,
  feature_key TEXT NOT NULL,
  feature_limit INTEGER, -- NULL = unlimited
  feature_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plan_type, feature_key)
);

-- Audit log for subscription changes
CREATE TABLE IF NOT EXISTS subscription_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'created', 'upgraded', 'downgraded', 'canceled', 'renewed'
  old_plan_type TEXT,
  new_plan_type TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DATA INTEGRATION & SOURCES
-- =============================================

-- Integration connections (Shopify, WooCommerce, etc.)
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL CHECK (platform IN ('shopify', 'woocommerce', 'google_analytics', 'facebook_ads', 'stripe', 'mailchimp', 'klaviyo')),
  name VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error', 'pending')),
  credentials JSONB NOT NULL, -- Encrypted API keys, tokens
  settings JSONB DEFAULT '{}',
  last_sync_at TIMESTAMPTZ,
  sync_frequency VARCHAR(20) DEFAULT 'daily' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'weekly')),
  error_message TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Raw analytics data from integrations
CREATE TABLE IF NOT EXISTS analytics_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  integration_id UUID REFERENCES integrations(id) ON DELETE SET NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type VARCHAR(50) NOT NULL CHECK (metric_type IN ('revenue', 'orders', 'visitors', 'conversion_rate', 'aov', 'ltv', 'cac', 'roas', 'inventory', 'custom')),
  dimensions JSONB DEFAULT '{}', -- Additional context (product_id, campaign_id, etc.)
  timestamp TIMESTAMPTZ NOT NULL,
  date_key DATE NOT NULL, -- For efficient date-based queries
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business metrics table (for manual/calculated metrics)
CREATE TABLE IF NOT EXISTS business_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(15,2) NOT NULL,
  metric_type TEXT NOT NULL,
  date_recorded DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT DEFAULT 'manual',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- AI & MACHINE LEARNING
-- =============================================

-- AI-generated recommendations
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('revenue_optimization', 'cost_reduction', 'customer_retention', 'marketing', 'inventory', 'pricing', 'operations')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  confidence_score NUMERIC(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  potential_impact JSONB, -- {"metric": "revenue", "estimated_change": "+15%", "timeframe": "30_days"}
  data_sources TEXT[], -- Which integrations/data informed this recommendation
  model_used VARCHAR(100) NOT NULL,
  model_version VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'dismissed', 'archived')),
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  user_feedback TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI insights table (for backward compatibility)
CREATE TABLE IF NOT EXISTS ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  impact_score TEXT,
  status TEXT DEFAULT 'active',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- AI learning and feedback loop
CREATE TABLE IF NOT EXISTS ai_learning_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  recommendation_id UUID REFERENCES ai_recommendations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_taken VARCHAR(100) NOT NULL,
  result_metric VARCHAR(100),
  baseline_value NUMERIC,
  result_value NUMERIC,
  improvement_percent NUMERIC,
  success_score NUMERIC(3,2) CHECK (success_score >= 0 AND success_score <= 1),
  learning_data JSONB, -- Additional context for model training
  model_feedback JSONB, -- What the model should learn from this
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI model performance tracking
CREATE TABLE IF NOT EXISTS ai_model_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_name VARCHAR(100) NOT NULL,
  model_version VARCHAR(50) NOT NULL,
  metric_type VARCHAR(50) NOT NULL CHECK (metric_type IN ('accuracy', 'precision', 'recall', 'f1_score', 'user_satisfaction', 'adoption_rate')),
  metric_value NUMERIC NOT NULL,
  company_id UUID REFERENCES companies(id), -- NULL for global metrics
  measurement_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TASK MANAGEMENT & COLLABORATION
-- =============================================

-- Tasks generated from AI recommendations
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  recommendation_id UUID REFERENCES ai_recommendations(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'cancelled')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  due_date DATE,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  tags TEXT[],
  attachments JSONB DEFAULT '[]',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task comments and updates
CREATE TABLE IF NOT EXISTS task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  comment TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BENCHMARKING & PEER COMPARISON
-- =============================================

-- Anonymized industry benchmarks
CREATE TABLE IF NOT EXISTS industry_benchmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  industry VARCHAR(100) NOT NULL,
  company_size VARCHAR(50) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  percentile_25 NUMERIC,
  percentile_50 NUMERIC,
  percentile_75 NUMERIC,
  percentile_90 NUMERIC,
  sample_size INTEGER,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company benchmark comparisons
CREATE TABLE IF NOT EXISTS benchmark_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  metric_name VARCHAR(100) NOT NULL,
  company_value NUMERIC NOT NULL,
  industry_percentile NUMERIC,
  comparison_date DATE NOT NULL,
  benchmark_id UUID REFERENCES industry_benchmarks(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- AUDIT & COMPLIANCE
-- =============================================

-- Comprehensive audit logging
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity logs table (for user activity tracking)
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  description TEXT,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- NOTIFICATIONS & ALERTS
-- =============================================

-- System notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('ai_insight', 'task_assigned', 'task_due', 'anomaly_detected', 'system_update', 'billing')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  action_url TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BACKWARD COMPATIBILITY VIEWS
-- =============================================

-- Create profiles view for backward compatibility
CREATE OR REPLACE VIEW public.profiles AS
SELECT 
    up.id,
    au.email,
    up.full_name,
    up.avatar_url,
    c.name as company_name,
    up.role,
    c.subscription_plan as subscription_tier,
    up.created_at,
    up.updated_at
FROM public.user_profiles up
LEFT JOIN public.companies c ON up.company_id = c.id
LEFT JOIN auth.users au ON up.id = au.id;

-- Create subscriptions view for backward compatibility
CREATE OR REPLACE VIEW public.subscriptions AS
SELECT 
    us.id,
    us.user_id,
    us.stripe_customer_id,
    us.stripe_subscription_id,
    us.status,
    us.plan_type as plan_name,
    NULL::DECIMAL(10,2) as plan_price,
    'monthly'::TEXT as billing_cycle,
    us.current_period_start,
    us.current_period_end,
    us.created_at,
    us.updated_at
FROM public.user_subscriptions us;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Companies
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_subscription ON companies(subscription_plan, subscription_status);

-- User profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_company ON user_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_active ON user_profiles(last_active_at);

-- Team invitations
CREATE INDEX IF NOT EXISTS idx_team_invitations_company_id ON team_invitations(company_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON team_invitations(email);
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_team_invitations_status ON team_invitations(status);

-- Subscriptions
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_type ON user_subscriptions(plan_type);
CREATE INDEX IF NOT EXISTS idx_feature_usage_user_period ON feature_usage(user_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature_type ON feature_usage(feature_type);
CREATE INDEX IF NOT EXISTS idx_plan_features_plan_type ON plan_features(plan_type);
CREATE INDEX IF NOT EXISTS idx_subscription_audit_user ON subscription_audit_log(user_id);

-- Integrations
CREATE INDEX IF NOT EXISTS idx_integrations_company ON integrations(company_id);
CREATE INDEX IF NOT EXISTS idx_integrations_platform ON integrations(platform);
CREATE INDEX IF NOT EXISTS idx_integrations_status ON integrations(status);

-- Analytics data
CREATE INDEX IF NOT EXISTS idx_analytics_company_date ON analytics_data(company_id, date_key);
CREATE INDEX IF NOT EXISTS idx_analytics_metric ON analytics_data(metric_name, metric_type);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_integration ON analytics_data(integration_id);

-- Business metrics
CREATE INDEX IF NOT EXISTS idx_business_metrics_company_date ON business_metrics(company_id, date_recorded);
CREATE INDEX IF NOT EXISTS idx_business_metrics_user_date ON business_metrics(user_id, date_recorded);
CREATE INDEX IF NOT EXISTS idx_business_metrics_type ON business_metrics(metric_type);

-- AI recommendations
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_company ON ai_recommendations(company_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_status ON ai_recommendations(status);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_priority ON ai_recommendations(priority);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_assigned ON ai_recommendations(assigned_to);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_created ON ai_recommendations(created_at);

-- AI insights
CREATE INDEX IF NOT EXISTS idx_ai_insights_company_status ON ai_insights(company_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_status ON ai_insights(user_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_insights_type ON ai_insights(insight_type);

-- Tasks
CREATE INDEX IF NOT EXISTS idx_tasks_company ON tasks(company_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_company ON audit_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Activity logs
CREATE INDEX IF NOT EXISTS idx_activity_logs_company_created ON activity_logs(company_id, created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_created ON activity_logs(user_id, created_at);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_learning_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmark_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- Users can only access their own company's data
DROP POLICY IF EXISTS "Users can view their company data" ON companies;
CREATE POLICY "Users can view their company data" ON companies
  FOR SELECT USING (
    id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR ALL USING (id = auth.uid());

-- Subscription policies
DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;
CREATE POLICY "Users can view own subscription" ON user_subscriptions
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own feature usage" ON feature_usage;
CREATE POLICY "Users can view own feature usage" ON feature_usage
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view plan features" ON plan_features;
CREATE POLICY "Users can view plan features" ON plan_features
  FOR SELECT USING (true); -- Public read access

DROP POLICY IF EXISTS "Users can view own audit log" ON subscription_audit_log;
CREATE POLICY "Users can view own audit log" ON subscription_audit_log
  FOR SELECT USING (user_id = auth.uid());

-- Service role policies for backend operations
DROP POLICY IF EXISTS "Service role can manage subscriptions" ON user_subscriptions;
CREATE POLICY "Service role can manage subscriptions" ON user_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can manage feature usage" ON feature_usage;
CREATE POLICY "Service role can manage feature usage" ON feature_usage
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can manage plan features" ON plan_features;
CREATE POLICY "Service role can manage plan features" ON plan_features
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can manage audit log" ON subscription_audit_log;
CREATE POLICY "Service role can manage audit log" ON subscription_audit_log
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can access company integrations" ON integrations;
CREATE POLICY "Users can access company integrations" ON integrations
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can access company analytics" ON analytics_data;
CREATE POLICY "Users can access company analytics" ON analytics_data
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage company metrics" ON business_metrics;
CREATE POLICY "Users can manage company metrics" ON business_metrics
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid()
    ) OR user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can access company recommendations" ON ai_recommendations;
CREATE POLICY "Users can access company recommendations" ON ai_recommendations
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage company insights" ON ai_insights;
CREATE POLICY "Users can manage company insights" ON ai_insights
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid()
    ) OR user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can access company tasks" ON tasks;
CREATE POLICY "Users can access company tasks" ON tasks
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can access their notifications" ON notifications;
CREATE POLICY "Users can access their notifications" ON notifications
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view company activity" ON activity_logs;
CREATE POLICY "Users can view company activity" ON activity_logs
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid()
    ) OR user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can insert own activity" ON activity_logs;
CREATE POLICY "Users can insert own activity" ON activity_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Team invitations RLS policies
DROP POLICY IF EXISTS "Users can view company invitations" ON team_invitations;
CREATE POLICY "Users can view company invitations" ON team_invitations
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can create invitations" ON team_invitations;
CREATE POLICY "Admins can create invitations" ON team_invitations
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

DROP POLICY IF EXISTS "Admins can update invitations" ON team_invitations;
CREATE POLICY "Admins can update invitations" ON team_invitations
  FOR UPDATE USING (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

DROP POLICY IF EXISTS "Admins can delete invitations" ON team_invitations;
CREATE POLICY "Admins can delete invitations" ON team_invitations
  FOR DELETE USING (
    company_id IN (
      SELECT company_id FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

DROP POLICY IF EXISTS "Service role can manage invitations" ON team_invitations;
CREATE POLICY "Service role can manage invitations" ON team_invitations
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at 
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_feature_usage_updated_at ON feature_usage;
CREATE TRIGGER update_feature_usage_updated_at 
  BEFORE UPDATE ON feature_usage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_plan_features_updated_at ON plan_features;
CREATE TRIGGER update_plan_features_updated_at 
  BEFORE UPDATE ON plan_features
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_invitations_updated_at ON team_invitations;
CREATE TRIGGER update_team_invitations_updated_at 
  BEFORE UPDATE ON team_invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_integrations_updated_at ON integrations;
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_recommendations_updated_at ON ai_recommendations;
CREATE TRIGGER update_ai_recommendations_updated_at BEFORE UPDATE ON ai_recommendations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Team invitation functions
CREATE OR REPLACE FUNCTION expire_old_invitations()
RETURNS void AS $$
BEGIN
  UPDATE team_invitations 
  SET status = 'expired', updated_at = NOW()
  WHERE status = 'pending' 
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION accept_team_invitation(
  invitation_token_param UUID,
  user_id_param UUID
)
RETURNS json AS $$
DECLARE
  invitation_record team_invitations%ROWTYPE;
  result json;
BEGIN
  -- Get the invitation
  SELECT * INTO invitation_record
  FROM team_invitations
  WHERE invitation_token = invitation_token_param
    AND status = 'pending'
    AND expires_at > NOW();

  -- Check if invitation exists and is valid
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid or expired invitation'
    );
  END IF;

  -- Check if user already has a profile for this company
  IF EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = user_id_param 
      AND company_id = invitation_record.company_id
  ) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User already belongs to this company'
    );
  END IF;

  -- Create user profile
  INSERT INTO user_profiles (
    id,
    company_id,
    role,
    full_name
  ) VALUES (
    user_id_param,
    invitation_record.company_id,
    invitation_record.role,
    (SELECT COALESCE(raw_user_meta_data->>'full_name', email) FROM auth.users WHERE id = user_id_param)
  );

  -- Update invitation status
  UPDATE team_invitations
  SET status = 'accepted',
      accepted_at = NOW(),
      updated_at = NOW()
  WHERE id = invitation_record.id;

  RETURN json_build_object(
    'success', true,
    'company_id', invitation_record.company_id,
    'role', invitation_record.role
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION accept_team_invitation(UUID, UUID) TO authenticated;

-- Create a view for active team members per company
CREATE OR REPLACE VIEW company_team_members AS
SELECT 
  up.company_id,
  up.id as user_id,
  up.full_name,
  up.role,
  au.email,
  up.created_at as joined_at,
  au.last_sign_in_at as last_login
FROM user_profiles up
JOIN auth.users au ON up.id = au.id
WHERE up.company_id IS NOT NULL;

-- Grant access to the view
GRANT SELECT ON company_team_members TO authenticated;

-- RLS for the view
ALTER VIEW company_team_members SET (security_barrier = true);

-- Create function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- DEFAULT PLAN CONFIGURATIONS
-- =============================================

-- Insert default plan configurations
INSERT INTO plan_features (plan_type, feature_key, feature_limit, feature_enabled) VALUES
-- Starter Plan (Free)
('starter', 'data_sources', 2, true),
('starter', 'ai_insights', 5, true),
('starter', 'historical_data_months', 3, true),
('starter', 'team_members', 1, true),
('starter', 'api_access', NULL, false),
('starter', 'custom_dashboards', 0, false),
('starter', 'white_label', NULL, false),
('starter', 'advanced_ai', NULL, false),
('starter', 'sso_integration', NULL, false),
('starter', 'priority_support', NULL, false),
('starter', 'audit_logs', NULL, false),

-- Growth Plan
('growth', 'data_sources', 10, true),
('growth', 'ai_insights', NULL, true), -- unlimited
('growth', 'historical_data_months', 12, true),
('growth', 'team_members', 5, true),
('growth', 'api_access', NULL, true),
('growth', 'custom_dashboards', 10, true),
('growth', 'white_label', NULL, true),
('growth', 'advanced_ai', NULL, false),
('growth', 'sso_integration', NULL, false),
('growth', 'priority_support', NULL, true),
('growth', 'audit_logs', NULL, false),

-- Scale Plan
('scale', 'data_sources', NULL, true), -- unlimited
('scale', 'ai_insights', NULL, true), -- unlimited
('scale', 'historical_data_months', 24, true),
('scale', 'team_members', 25, true),
('scale', 'api_access', NULL, true),
('scale', 'custom_dashboards', NULL, true), -- unlimited
('scale', 'white_label', NULL, true),
('scale', 'advanced_ai', NULL, true),
('scale', 'sso_integration', NULL, true),
('scale', 'priority_support', NULL, true),
('scale', 'audit_logs', NULL, true),

-- Enterprise Plan
('enterprise', 'data_sources', NULL, true), -- unlimited
('enterprise', 'ai_insights', NULL, true), -- unlimited
('enterprise', 'historical_data_months', NULL, true), -- unlimited
('enterprise', 'team_members', NULL, true), -- unlimited
('enterprise', 'api_access', NULL, true),
('enterprise', 'custom_dashboards', NULL, true), -- unlimited
('enterprise', 'white_label', NULL, true),
('enterprise', 'advanced_ai', NULL, true),
('enterprise', 'sso_integration', NULL, true),
('enterprise', 'priority_support', NULL, true),
('enterprise', 'audit_logs', NULL, true),
('enterprise', 'dedicated_support', NULL, true),
('enterprise', 'custom_integrations', NULL, true)
ON CONFLICT (plan_type, feature_key) DO NOTHING;

-- =============================================
-- SAMPLE DATA FOR DEVELOPMENT
-- =============================================

-- Insert sample company
INSERT INTO companies (id, name, slug, industry, company_size, subscription_plan)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Demo E-commerce Co',
  'demo-ecommerce',
  'E-commerce',
  '11-50',
  'growth'
) ON CONFLICT (slug) DO NOTHING;

-- Insert sample industry benchmarks
INSERT INTO industry_benchmarks (industry, company_size, metric_name, percentile_25, percentile_50, percentile_75, percentile_90, sample_size, period_start, period_end)
VALUES 
  ('E-commerce', '11-50', 'conversion_rate', 1.5, 2.3, 3.1, 4.2, 1250, '2024-01-01', '2024-03-31'),
  ('E-commerce', '11-50', 'average_order_value', 45.00, 67.50, 89.00, 125.00, 1250, '2024-01-01', '2024-03-31'),
  ('E-commerce', '11-50', 'customer_lifetime_value', 150.00, 245.00, 380.00, 520.00, 1250, '2024-01-01', '2024-03-31')
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT SELECT ON public.subscriptions TO anon, authenticated;

COMMIT;

-- Success message
SELECT 'IBIAS Complete Database Schema created successfully!' as message;