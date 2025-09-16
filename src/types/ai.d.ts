// =============================================
// BUSINESS INTELLIGENCE & ANALYTICS
// =============================================

export interface AnalyticsData {
  id: string;
  company_id: string;
  integration_id?: string;
  metric_name: string;
  metric_value: number;
  metric_type: 'revenue' | 'orders' | 'visitors' | 'conversion_rate' | 'aov' | 'ltv' | 'cac' | 'roas' | 'inventory' | 'custom';
  dimensions: Record<string, string | number | boolean>;
  timestamp: string;
  date_key: string;
  created_at: string;
}

export interface Integration {
  id: string;
  company_id: string;
  platform: 'shopify' | 'woocommerce' | 'google_analytics' | 'facebook_ads' | 'stripe' | 'mailchimp' | 'klaviyo';
  name: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  credentials: Record<string, string>;
  settings: Record<string, string | number | boolean>;
  last_sync_at?: string;
  sync_frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  error_message?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// =============================================
// AI RECOMMENDATIONS & INSIGHTS
// =============================================

export interface AIRecommendation {
  id: string;
  company_id: string;
  title: string;
  description: string;
  category: 'revenue_optimization' | 'cost_reduction' | 'customer_retention' | 'marketing' | 'inventory' | 'pricing' | 'operations';
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence_score: number; // 0-1
  potential_impact: {
    metric: string;
    estimated_change: string;
    timeframe: string;
  };
  data_sources: string[];
  model_used: string;
  model_version?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed' | 'archived';
  user_rating?: number; // 1-5
  user_feedback?: string;
  assigned_to?: string;
  due_date?: string;
  completed_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AILearningLog {
  id: string;
  company_id: string;
  recommendation_id?: string;
  action_taken: string;
  result_metric?: string;
  baseline_value?: number;
  result_value?: number;
  improvement_percent?: number;
  success_score?: number; // 0-1
  learning_data: Record<string, string | number | boolean>;
  model_feedback: Record<string, string | number>;
  created_at: string;
}

export interface AIModelMetrics {
  id: string;
  model_name: string;
  model_version: string;
  metric_type: 'accuracy' | 'precision' | 'recall' | 'f1_score' | 'user_satisfaction' | 'adoption_rate';
  metric_value: number;
  company_id?: string;
  measurement_date: string;
  created_at: string;
}

// =============================================
// TASK MANAGEMENT
// =============================================

export interface Task {
  id: string;
  company_id: string;
  recommendation_id?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  created_by?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  tags: string[];
  attachments: { id: string; name: string; url: string; type: string }[];
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  comment: string;
  attachments: { id: string; name: string; url: string; type: string }[];
  created_at: string;
}

// =============================================
// BENCHMARKING & COMPARISONS
// =============================================

export interface IndustryBenchmark {
  id: string;
  industry: string;
  company_size: string;
  metric_name: string;
  percentile_25?: number;
  percentile_50?: number;
  percentile_75?: number;
  percentile_90?: number;
  sample_size?: number;
  period_start: string;
  period_end: string;
  created_at: string;
}

export interface BenchmarkComparison {
  id: string;
  company_id: string;
  metric_name: string;
  company_value: number;
  industry_percentile?: number;
  comparison_date: string;
  benchmark_id?: string;
  created_at: string;
}

// =============================================
// NOTIFICATIONS & ALERTS
// =============================================

export interface Notification {
  id: string;
  company_id?: string;
  user_id: string;
  type: 'ai_insight' | 'task_assigned' | 'task_due' | 'anomaly_detected' | 'system_update' | 'billing';
  title: string;
  message: string;
  data: Record<string, string | number | boolean>;
  read_at?: string;
  action_url?: string;
  expires_at?: string;
  created_at: string;
}

// =============================================
// AI MODEL INTERFACES
// =============================================

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'replicate' | 'huggingface';
  model_type: 'recommendation' | 'forecasting' | 'anomaly_detection' | 'nlq' | 'sentiment';
  capabilities: string[];
  cost_per_request: number;
  response_time_ms: number;
  accuracy_score: number;
  status: 'active' | 'inactive' | 'deprecated';
}

export interface PredictiveAnalysis {
  id: string;
  company_id: string;
  metric_name: string;
  prediction_type: 'sales' | 'churn' | 'inventory' | 'demand';
  predicted_values: {
    date: string;
    value: number;
    confidence_interval: [number, number];
  }[];
  model_used: string;
  confidence_score: number;
  created_at: string;
  valid_until: string;
}

export interface AnomalyDetection {
  id: string;
  company_id: string;
  metric_name: string;
  anomaly_type: 'spike' | 'drop' | 'trend_change' | 'seasonal_deviation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  detected_value: number;
  expected_range: [number, number];
  confidence_score: number;
  context: Record<string, string | number | boolean>;
  detected_at: string;
  resolved_at?: string;
}

// =============================================
// NATURAL LANGUAGE QUERY
// =============================================

export interface NLQRequest {
  query: string;
  company_id: string;
  user_id: string;
  context?: Record<string, string | number | boolean>;
}

export interface NLQResponse {
  id: string;
  query: string;
  interpretation: string;
  sql_query?: string;
  results: Record<string, string | number | boolean>[];
  visualizations?: {
    type: 'chart' | 'table' | 'metric';
    config: Record<string, string | number | boolean>;
  }[];
  confidence_score: number;
  model_used: string;
  processing_time_ms: number;
  created_at: string;
}