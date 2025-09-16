-- IBIAS Revenue Analytics Sample Data
-- Populates database with realistic revenue data for testing
-- Matches frontend Revenue Analytics dashboard structure

-- Insert sample revenue analytics data
INSERT INTO analytics_data (company_id, metric_name, metric_value, metric_type, dimensions, timestamp, date_key) VALUES
-- Total Revenue (last 30 days)
('550e8400-e29b-41d4-a716-446655440000', 'total_revenue', 45230.50, 'revenue', '{"period": "daily"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'total_revenue', 42180.75, 'revenue', '{"period": "daily"}', NOW() - INTERVAL '2 days', CURRENT_DATE - 2),
('550e8400-e29b-41d4-a716-446655440000', 'total_revenue', 48920.25, 'revenue', '{"period": "daily"}', NOW() - INTERVAL '3 days', CURRENT_DATE - 3),
('550e8400-e29b-41d4-a716-446655440000', 'total_revenue', 51340.80, 'revenue', '{"period": "daily"}', NOW() - INTERVAL '4 days', CURRENT_DATE - 4),
('550e8400-e29b-41d4-a716-446655440000', 'total_revenue', 47650.30, 'revenue', '{"period": "daily"}', NOW() - INTERVAL '5 days', CURRENT_DATE - 5),
('550e8400-e29b-41d4-a716-446655440000', 'total_revenue', 44890.60, 'revenue', '{"period": "daily"}', NOW() - INTERVAL '6 days', CURRENT_DATE - 6),
('550e8400-e29b-41d4-a716-446655440000', 'total_revenue', 46720.90, 'revenue', '{"period": "daily"}', NOW() - INTERVAL '7 days', CURRENT_DATE - 7),

-- Orders data
('550e8400-e29b-41d4-a716-446655440000', 'total_orders', 342, 'orders', '{"period": "daily"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'total_orders', 318, 'orders', '{"period": "daily"}', NOW() - INTERVAL '2 days', CURRENT_DATE - 2),
('550e8400-e29b-41d4-a716-446655440000', 'total_orders', 367, 'orders', '{"period": "daily"}', NOW() - INTERVAL '3 days', CURRENT_DATE - 3),
('550e8400-e29b-41d4-a716-446655440000', 'total_orders', 389, 'orders', '{"period": "daily"}', NOW() - INTERVAL '4 days', CURRENT_DATE - 4),
('550e8400-e29b-41d4-a716-446655440000', 'total_orders', 356, 'orders', '{"period": "daily"}', NOW() - INTERVAL '5 days', CURRENT_DATE - 5),
('550e8400-e29b-41d4-a716-446655440000', 'total_orders', 334, 'orders', '{"period": "daily"}', NOW() - INTERVAL '6 days', CURRENT_DATE - 6),
('550e8400-e29b-41d4-a716-446655440000', 'total_orders', 348, 'orders', '{"period": "daily"}', NOW() - INTERVAL '7 days', CURRENT_DATE - 7),

-- Average Order Value
('550e8400-e29b-41d4-a716-446655440000', 'average_order_value', 132.25, 'aov', '{"period": "daily"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'average_order_value', 132.70, 'aov', '{"period": "daily"}', NOW() - INTERVAL '2 days', CURRENT_DATE - 2),
('550e8400-e29b-41d4-a716-446655440000', 'average_order_value', 133.35, 'aov', '{"period": "daily"}', NOW() - INTERVAL '3 days', CURRENT_DATE - 3),
('550e8400-e29b-41d4-a716-446655440000', 'average_order_value', 131.95, 'aov', '{"period": "daily"}', NOW() - INTERVAL '4 days', CURRENT_DATE - 4),
('550e8400-e29b-41d4-a716-446655440000', 'average_order_value', 133.85, 'aov', '{"period": "daily"}', NOW() - INTERVAL '5 days', CURRENT_DATE - 5),
('550e8400-e29b-41d4-a716-446655440000', 'average_order_value', 134.40, 'aov', '{"period": "daily"}', NOW() - INTERVAL '6 days', CURRENT_DATE - 6),
('550e8400-e29b-41d4-a716-446655440000', 'average_order_value', 134.25, 'aov', '{"period": "daily"}', NOW() - INTERVAL '7 days', CURRENT_DATE - 7),

-- Conversion Rate
('550e8400-e29b-41d4-a716-446655440000', 'conversion_rate', 3.2, 'conversion_rate', '{"period": "daily"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'conversion_rate', 2.9, 'conversion_rate', '{"period": "daily"}', NOW() - INTERVAL '2 days', CURRENT_DATE - 2),
('550e8400-e29b-41d4-a716-446655440000', 'conversion_rate', 3.4, 'conversion_rate', '{"period": "daily"}', NOW() - INTERVAL '3 days', CURRENT_DATE - 3),
('550e8400-e29b-41d4-a716-446655440000', 'conversion_rate', 3.6, 'conversion_rate', '{"period": "daily"}', NOW() - INTERVAL '4 days', CURRENT_DATE - 4),
('550e8400-e29b-41d4-a716-446655440000', 'conversion_rate', 3.1, 'conversion_rate', '{"period": "daily"}', NOW() - INTERVAL '5 days', CURRENT_DATE - 5),
('550e8400-e29b-41d4-a716-446655440000', 'conversion_rate', 3.0, 'conversion_rate', '{"period": "daily"}', NOW() - INTERVAL '6 days', CURRENT_DATE - 6),
('550e8400-e29b-41d4-a716-446655440000', 'conversion_rate', 3.3, 'conversion_rate', '{"period": "daily"}', NOW() - INTERVAL '7 days', CURRENT_DATE - 7),

-- Top Products Data
('550e8400-e29b-41d4-a716-446655440000', 'product_revenue', 12450.00, 'revenue', '{"product_name": "Premium Wireless Headphones", "product_id": "prod_001"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'product_units', 89, 'orders', '{"product_name": "Premium Wireless Headphones", "product_id": "prod_001"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'product_revenue', 9870.00, 'revenue', '{"product_name": "Smart Fitness Tracker", "product_id": "prod_002"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'product_units', 156, 'orders', '{"product_name": "Smart Fitness Tracker", "product_id": "prod_002"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'product_revenue', 8340.00, 'revenue', '{"product_name": "Bluetooth Speaker", "product_id": "prod_003"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'product_units', 124, 'orders', '{"product_name": "Bluetooth Speaker", "product_id": "prod_003"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),

-- Top Services Data
('550e8400-e29b-41d4-a716-446655440000', 'service_revenue', 15600.00, 'revenue', '{"service_name": "Premium Support", "service_id": "serv_001"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'service_projects', 23, 'orders', '{"service_name": "Premium Support", "service_id": "serv_001"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'service_revenue', 11200.00, 'revenue', '{"service_name": "Consulting", "service_id": "serv_002"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'service_projects', 16, 'orders', '{"service_name": "Consulting", "service_id": "serv_002"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'service_revenue', 8900.00, 'revenue', '{"service_name": "Training", "service_id": "serv_003"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'service_projects', 12, 'orders', '{"service_name": "Training", "service_id": "serv_003"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),

-- Top Channels Data
('550e8400-e29b-41d4-a716-446655440000', 'channel_revenue', 18750.00, 'revenue', '{"channel_name": "Organic Search", "channel_id": "chan_001"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'channel_conversion', 4.2, 'conversion_rate', '{"channel_name": "Organic Search", "channel_id": "chan_001"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'channel_revenue', 14230.00, 'revenue', '{"channel_name": "Paid Ads", "channel_id": "chan_002"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'channel_conversion', 3.8, 'conversion_rate', '{"channel_name": "Paid Ads", "channel_id": "chan_002"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'channel_revenue', 12250.00, 'revenue', '{"channel_name": "Social Media", "channel_id": "chan_003"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1),
('550e8400-e29b-41d4-a716-446655440000', 'channel_conversion', 2.9, 'conversion_rate', '{"channel_name": "Social Media", "channel_id": "chan_003"}', NOW() - INTERVAL '1 day', CURRENT_DATE - 1);

-- Insert AI recommendations for revenue optimization
INSERT INTO ai_recommendations (company_id, title, description, category, priority, confidence_score, potential_impact, data_sources, model_used, model_version) VALUES
('550e8400-e29b-41d4-a716-446655440000', 
 'Optimize Product Bundle Pricing', 
 'Based on purchase patterns, creating a bundle with Premium Wireless Headphones and Bluetooth Speaker could increase AOV by 18%', 
 'revenue_optimization', 
 'high', 
 0.87, 
 '{"metric": "revenue", "estimated_change": "+18%", "timeframe": "30_days"}', 
 '{"analytics_data", "product_performance"}', 
 'OpenAI GPT-4', 
 'v1.0'),
('550e8400-e29b-41d4-a716-446655440000', 
 'Increase Social Media Ad Spend', 
 'Social Media channel shows strong conversion potential. Increasing ad spend by 25% could boost revenue by $8,500/month', 
 'marketing', 
 'medium', 
 0.73, 
 '{"metric": "revenue", "estimated_change": "+$8500", "timeframe": "30_days"}', 
 '{"analytics_data", "channel_performance"}', 
 'OpenAI GPT-4', 
 'v1.0'),
('550e8400-e29b-41d4-a716-446655440000', 
 'Implement Abandoned Cart Recovery', 
 'Cart abandonment rate is 68%. Implementing email recovery sequence could recover 15% of lost revenue', 
 'revenue_optimization', 
 'high', 
 0.91, 
 '{"metric": "revenue", "estimated_change": "+12%", "timeframe": "45_days"}', 
 '{"analytics_data", "conversion_data"}', 
 'OpenAI GPT-4', 
 'v1.0');

-- Insert business metrics for manual tracking
INSERT INTO business_metrics (company_id, metric_name, metric_value, metric_type, date_recorded, source, metadata) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'monthly_recurring_revenue', 45230.50, 'revenue', CURRENT_DATE, 'calculated', '{"calculation": "sum_of_subscriptions"}'),
('550e8400-e29b-41d4-a716-446655440000', 'customer_acquisition_cost', 125.75, 'cac', CURRENT_DATE, 'calculated', '{"calculation": "marketing_spend/new_customers"}'),
('550e8400-e29b-41d4-a716-446655440000', 'customer_lifetime_value', 1250.00, 'ltv', CURRENT_DATE, 'calculated', '{"calculation": "avg_revenue_per_customer * avg_lifespan"}'),
('550e8400-e29b-41d4-a716-446655440000', 'churn_rate', 5.2, 'custom', CURRENT_DATE, 'calculated', '{"calculation": "churned_customers/total_customers * 100"}');

SELECT 'Revenue analytics sample data inserted successfully!' as message;