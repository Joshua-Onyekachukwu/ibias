'use client';

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  Percent,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Zap,
  Calendar,
  AlertTriangle,
  Info,
  ArrowRight
} from 'lucide-react';

// Type definitions
interface Metric {
  id: 'revenue' | 'customers' | 'conversion' | 'orders';
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface ForecastPeriod {
  value: '1m' | '3m' | '6m' | '12m';
  label: string;
}

interface ForecastDataPoint {
  month: string;
  type: 'historical' | 'forecast';
  revenue: number;
  revenueUpper?: number;
  revenueLower?: number;
  customers: number;
  customersUpper?: number;
  customersLower?: number;
  conversion: number;
  conversionUpper?: number;
  conversionLower?: number;
  orders: number;
  ordersUpper?: number;
  ordersLower?: number;
}

interface PredictiveAnalyticsWidgetProps {
  className?: string;
}

const PredictiveAnalyticsWidget: React.FC<PredictiveAnalyticsWidgetProps> = ({ className = '' }) => {
  // State management
  const [loading, setLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [selectedMetric, setSelectedMetric] = useState<Metric['id']>('revenue');
  const [forecastPeriod, setForecastPeriod] = useState<ForecastPeriod['value']>('3m');
  const [confidenceInterval, setConfidenceInterval] = useState<boolean>(true);
  const [forecastData, setForecastData] = useState<ForecastDataPoint[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Configuration
  const metrics: Metric[] = [
    {
      id: 'revenue',
      name: 'Revenue',
      icon: DollarSign,
      color: '#10B981'
    },
    {
      id: 'customers',
      name: 'Customers',
      icon: Users,
      color: '#3B82F6'
    },
    {
      id: 'conversion',
      name: 'Conversion',
      icon: Percent,
      color: '#8B5CF6'
    },
    {
      id: 'orders',
      name: 'Orders',
      icon: ShoppingCart,
      color: '#F59E0B'
    }
  ];

  const forecastPeriods: ForecastPeriod[] = [
    { value: '1m', label: '1 Month' },
    { value: '3m', label: '3 Month' },
    { value: '6m', label: '6 Month' },
    { value: '12m', label: '12 Month' }
  ];

  // Utility functions
  const getMetricColor = (metricId: Metric['id']): string => {
    return metrics.find(m => m.id === metricId)?.color || '#6B7280';
  };

  const formatValue = (value: number, metricId: Metric['id']): string => {
    switch (metricId) {
      case 'revenue':
        return `$${(value / 1000).toFixed(1)}k`;
      case 'conversion':
        return `${value.toFixed(1)}%`;
      case 'customers':
      case 'orders':
        return value.toLocaleString();
      default:
        return value.toString();
    }
  };

  // Mock data generation
  const generateForecastData = (): ForecastDataPoint[] => {
    const data: ForecastDataPoint[] = [];
    const now = new Date();
    const periodMonths = parseInt(forecastPeriod.replace('m', ''));
    
    // Generate historical data (last 6 months)
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      // Base values with some randomness
      const baseRevenue = 45000 + Math.random() * 15000;
      const baseCustomers = 1200 + Math.random() * 400;
      const baseConversion = 2.5 + Math.random() * 1.5;
      const baseOrders = 850 + Math.random() * 300;
      
      // Add seasonal patterns
      const seasonalMultiplier = 1 + 0.2 * Math.sin((date.getMonth() / 12) * 2 * Math.PI);
      
      data.push({
        month: monthName,
        type: 'historical',
        revenue: Math.round(baseRevenue * seasonalMultiplier),
        customers: Math.round(baseCustomers * seasonalMultiplier),
        conversion: parseFloat((baseConversion * seasonalMultiplier).toFixed(2)),
        orders: Math.round(baseOrders * seasonalMultiplier)
      });
    }
    
    // Generate forecast data
    const lastHistorical = data[data.length - 1];
    const growthRates = {
      revenue: 0.08, // 8% monthly growth
      customers: 0.05, // 5% monthly growth
      conversion: 0.02, // 2% monthly growth
      orders: 0.06 // 6% monthly growth
    };
    
    for (let i = 1; i <= periodMonths; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      // Calculate forecast values with growth
      const forecastRevenue = lastHistorical.revenue * Math.pow(1 + growthRates.revenue, i);
      const forecastCustomers = lastHistorical.customers * Math.pow(1 + growthRates.customers, i);
      const forecastConversion = lastHistorical.conversion * Math.pow(1 + growthRates.conversion, i);
      const forecastOrders = lastHistorical.orders * Math.pow(1 + growthRates.orders, i);
      
      // Add seasonal patterns to forecast
      const seasonalMultiplier = 1 + 0.2 * Math.sin((date.getMonth() / 12) * 2 * Math.PI);
      
      // Calculate confidence intervals (±15% for demonstration)
      const confidenceMargin = 0.15;
      
      data.push({
        month: monthName,
        type: 'forecast',
        revenue: Math.round(forecastRevenue * seasonalMultiplier),
        revenueUpper: Math.round(forecastRevenue * seasonalMultiplier * (1 + confidenceMargin)),
        revenueLower: Math.round(forecastRevenue * seasonalMultiplier * (1 - confidenceMargin)),
        customers: Math.round(forecastCustomers * seasonalMultiplier),
        customersUpper: Math.round(forecastCustomers * seasonalMultiplier * (1 + confidenceMargin)),
        customersLower: Math.round(forecastCustomers * seasonalMultiplier * (1 - confidenceMargin)),
        conversion: parseFloat((forecastConversion * seasonalMultiplier).toFixed(2)),
        conversionUpper: parseFloat((forecastConversion * seasonalMultiplier * (1 + confidenceMargin)).toFixed(2)),
        conversionLower: parseFloat((forecastConversion * seasonalMultiplier * (1 - confidenceMargin)).toFixed(2)),
        orders: Math.round(forecastOrders * seasonalMultiplier),
        ordersUpper: Math.round(forecastOrders * seasonalMultiplier * (1 + confidenceMargin)),
        ordersLower: Math.round(forecastOrders * seasonalMultiplier * (1 - confidenceMargin))
      });
    }
    
    return data;
  };

  // Event handlers
  const handleRefresh = async (): Promise<void> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setForecastData(generateForecastData());
    setLastUpdated(new Date());
    setLoading(false);
  };

  // Effects
  useEffect(() => {
    setForecastData(generateForecastData());
  }, [forecastPeriod]);

  useEffect(() => {
    // Initial data load
    setForecastData(generateForecastData());
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Generating forecast...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg mr-3">
            <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Predictive Analytics
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered forecasting
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Refresh forecast"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Metric selector */}
        <div className="flex flex-wrap items-center gap-2">
          {metrics.map(metric => {
            const IconComponent = metric.icon;
            return (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedMetric === metric.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <IconComponent className="h-4 w-4 mr-1" />
                {metric.name}
              </button>
            );
          })}
        </div>
        
        {/* Forecast period selector */}
        <div className="ml-auto">
          <select
            value={forecastPeriod}
            onChange={(e) => setForecastPeriod(e.target.value as ForecastPeriod['value'])}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {forecastPeriods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label} Forecast
              </option>
            ))}
          </select>
        </div>
        
        {/* Confidence interval toggle */}
        <button
          onClick={() => setConfidenceInterval(!confidenceInterval)}
          className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            confidenceInterval
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {confidenceInterval ? 'Hide Confidence' : 'Show Confidence'}
        </button>
      </div>
      
      <div className={expanded ? 'h-96' : 'h-72'}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecastData}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getMetricColor(selectedMetric)} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={getMetricColor(selectedMetric)} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getMetricColor(selectedMetric)} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={getMetricColor(selectedMetric)} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke="#6B7280"
              fontSize={12}
              tickMargin={10}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={(value: number) => {
                if (selectedMetric === 'revenue') return `$${value / 1000}k`;
                if (selectedMetric === 'conversion') return `${value}%`;
                return value.toString();
              }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value: number, name: string) => {
                if (name === selectedMetric) {
                  return [formatValue(value, selectedMetric), metrics.find(m => m.id === selectedMetric)?.name];
                }
                if (name === `${selectedMetric}Upper` || name === `${selectedMetric}Lower`) {
                  return [formatValue(value, selectedMetric), 'Confidence Bound'];
                }
                return [value, name];
              }}
              labelFormatter={(label: string) => `${label}`}
            />
            
            {/* Confidence interval area */}
            {confidenceInterval && (
              <Area
                type="monotone"
                dataKey={`${selectedMetric}Upper`}
                stroke="transparent"
                fill="url(#colorConfidence)"
                fillOpacity={1}
                activeDot={false}
                isAnimationActive={false}
              />
            )}
            
            {confidenceInterval && (
              <Area
                type="monotone"
                dataKey={`${selectedMetric}Lower`}
                stroke="transparent"
                fill="transparent"
                fillOpacity={1}
                activeDot={false}
                isAnimationActive={false}
              />
            )}
            
            {/* Main metric line */}
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={getMetricColor(selectedMetric)}
              fill="url(#colorMetric)"
              fillOpacity={1}
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
              activeDot={{ r: 6, stroke: getMetricColor(selectedMetric), strokeWidth: 2 }}
            />
            
            {/* Reference line separating historical from forecast */}
            <ReferenceLine
              x={forecastData.findIndex(d => d.type === 'forecast')}
              stroke="#6B7280"
              strokeDasharray="3 3"
              label={{
                value: 'Forecast Start',
                position: 'insideTopRight',
                fill: '#6B7280',
                fontSize: 12
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Forecast insights */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-3">
          <Zap className="h-5 w-5 text-purple-500 mr-2" />
          <h4 className="font-medium text-gray-900 dark:text-white">
            Forecast Insights
          </h4>
        </div>
        
        <div className="space-y-3">
          {/* Calculate growth rate for insights */}
          {(() => {
            const historicalPoints = forecastData.filter(d => d.type === 'historical');
            const forecastPoints = forecastData.filter(d => d.type === 'forecast');
            
            if (historicalPoints.length === 0 || forecastPoints.length === 0) {
              return <p className="text-gray-600 dark:text-gray-400">Insufficient data for insights</p>;
            }
            
            const lastHistorical = historicalPoints[historicalPoints.length - 1][selectedMetric];
            const lastForecast = forecastPoints[forecastPoints.length - 1][selectedMetric];
            const growthRate = ((lastForecast - lastHistorical) / lastHistorical) * 100;
            
            const insights: React.ReactNode[] = [];
            
            // Add growth insight
            insights.push(
              <div key="growth" className="flex items-start">
                <div className={`p-1.5 rounded-lg ${growthRate >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'} mr-3`}>
                  <TrendingUp className={`h-4 w-4 ${growthRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {growthRate >= 0 
                    ? `Projected ${Math.abs(growthRate).toFixed(1)}% growth in ${metrics.find(m => m.id === selectedMetric)?.name.toLowerCase()} over the next ${forecastPeriods.find(p => p.value === forecastPeriod)?.label.toLowerCase()}.`
                    : `Projected ${Math.abs(growthRate).toFixed(1)}% decline in ${metrics.find(m => m.id === selectedMetric)?.name.toLowerCase()} over the next ${forecastPeriods.find(p => p.value === forecastPeriod)?.label.toLowerCase()}.`
                  }
                </p>
              </div>
            );
            
            // Add seasonality insight if applicable
            if (selectedMetric === 'revenue' || selectedMetric === 'orders') {
              insights.push(
                <div key="seasonality" className="flex items-start">
                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/20 mr-3">
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Seasonal patterns detected with higher {selectedMetric === 'revenue' ? 'revenue' : 'orders'} expected in Q4.
                  </p>
                </div>
              );
            }
            
            // Add risk insight if growth is high
            if (growthRate > 20) {
              insights.push(
                <div key="risk" className="flex items-start">
                  <div className="p-1.5 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 mr-3">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    High growth projection may require additional resources to support scaling.
                  </p>
                </div>
              );
            }
            
            return insights;
          })()}
        </div>
        
        {/* Forecast metadata */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Info className="h-3.5 w-3.5 mr-1" />
            <span>
              Last updated: {lastUpdated.toLocaleTimeString()} | 
              Model: ML Regression + ARIMA
            </span>
          </div>
          <button className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            View detailed report
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalyticsWidget;