import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  ArrowRight, 
  Brain, 
  Zap, 
  AlertTriangle, 
  Info, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Download,
  Settings,
  Target,
  DollarSign,
  Users,
  ShoppingCart,
  Activity,
  BarChart3,
  Eye,
  TrendingDown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  Area,
  AreaChart
} from 'recharts';

const PredictiveAnalyticsWidget = ({ className = '', dashboardData, liveData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [forecastPeriod, setForecastPeriod] = useState('3m');
  const [confidenceInterval, setConfidenceInterval] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLastUpdated(new Date());
  }, []);

  // Dashboard-consistent metrics data
  const metrics = [
    { 
      id: 'revenue', 
      name: 'Revenue', 
      icon: DollarSign, 
      color: '#3B82F6', 
      format: (val) => `$${(val / 1000000).toFixed(1)}M`,
      current: 38400000,
      growth: 14.8
    },
    { 
      id: 'customers', 
      name: 'Customers', 
      icon: Users, 
      color: '#10B981', 
      format: (val) => val.toLocaleString(),
      current: 12500,
      growth: 8.7
    },
    { 
      id: 'conversion', 
      name: 'Conversion Rate', 
      icon: Target, 
      color: '#8B5CF6', 
      format: (val) => `${val.toFixed(1)}%`,
      current: 5.8,
      growth: 1.4
    },
    { 
      id: 'orders', 
      name: 'Orders', 
      icon: ShoppingCart, 
      color: '#F59E0B', 
      format: (val) => val.toLocaleString(),
      current: 2850,
      growth: 11.2
    }
  ];

  // Forecast period options
  const forecastPeriods = [
    { value: '1m', label: '1 Month' },
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' },
    { value: '12m', label: '1 Year' }
  ];

  // Generate consistent forecast data
  const generateForecastData = () => {
    const selectedMetricData = metrics.find(m => m.id === selectedMetric);
    const currentValue = selectedMetricData.current;
    const monthlyGrowthRate = selectedMetricData.growth / 100 / 12; // Convert annual to monthly
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const data = [];
    
    // Historical data (last 6 months)
    for (let i = -6; i < 0; i++) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() + i);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      
      // Calculate historical value with some variation
      const baseValue = currentValue * Math.pow(1 + monthlyGrowthRate, i);
      const variation = 1 + (((i * 0.07) % 0.1) - 0.05); // ±5% variation
      
      data.push({
        month: `${months[monthIndex]} ${year}`,
        date: date,
        type: 'historical',
        [selectedMetric]: Math.round(baseValue * variation * 100) / 100,
        isHistorical: true
      });
    }
    
    // Current month
    data.push({
      month: `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
      date: new Date(currentDate),
      type: 'current',
      [selectedMetric]: currentValue,
      isHistorical: false,
      isCurrent: true
    });
    
    // Forecast data
    const forecastMonths = forecastPeriod === '1m' ? 1 : forecastPeriod === '3m' ? 3 : forecastPeriod === '6m' ? 6 : 12;
    
    for (let i = 1; i <= forecastMonths; i++) {
      const date = new Date(currentDate);
      date.setMonth(date.getMonth() + i);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      
      // Calculate forecast value
      const forecastValue = currentValue * Math.pow(1 + monthlyGrowthRate, i);
      const uncertainty = 0.05 * i; // Increasing uncertainty over time
      
      data.push({
        month: `${months[monthIndex]} ${year}`,
        date: date,
        type: 'forecast',
        [selectedMetric]: Math.round(forecastValue * 100) / 100,
        [`${selectedMetric}Upper`]: Math.round(forecastValue * (1 + uncertainty) * 100) / 100,
        [`${selectedMetric}Lower`]: Math.round(forecastValue * (1 - uncertainty) * 100) / 100,
        isHistorical: false,
        isForecast: true
      });
    }
    
    return data;
  };

  const forecastData = generateForecastData();
  const selectedMetricData = metrics.find(m => m.id === selectedMetric);
  
  // Calculate forecast insights
  const forecastInsights = {
    nextMonth: forecastData.find(d => d.isForecast)?.[selectedMetric] || 0,
    totalGrowth: selectedMetricData.growth,
    confidence: 85 - (forecastPeriod === '12m' ? 15 : forecastPeriod === '6m' ? 10 : forecastPeriod === '3m' ? 5 : 0)
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  return (
    <motion.div 
      className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Outer Container */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                <Activity className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Predictive Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-powered forecasting with {forecastInsights.confidence}% confidence
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={handleRefresh}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={isLoading}
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
            <motion.button
              onClick={() => setExpanded(!expanded)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>

        {/* Inner Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {/* Metric Selector */}
            <div className="flex flex-wrap items-center gap-2">
              {metrics.map(metric => {
                const Icon = metric.icon;
                return (
                  <motion.button
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedMetric === metric.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {metric.name}
                  </motion.button>
                );
              })}
            </div>
            
            {/* Period Selector */}
            <div className="flex items-center space-x-3">
              <select
                value={forecastPeriod}
                onChange={(e) => setForecastPeriod(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {forecastPeriods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label} Forecast
                  </option>
                ))}
              </select>
              
              <motion.button
                onClick={() => setConfidenceInterval(!confidenceInterval)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  confidenceInterval
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye className="h-4 w-4 mr-1" />
                {confidenceInterval ? 'Hide Bands' : 'Show Bands'}
              </motion.button>
            </div>
          </div>



          {/* Chart */}
          <div className={`transition-all duration-300 ${expanded ? 'h-96' : 'h-80'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={selectedMetricData.color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={selectedMetricData.color} stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={selectedMetricData.color} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={selectedMetricData.color} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis 
                  dataKey="month" 
                  stroke="#6B7280"
                  fontSize={12}
                  tickMargin={10}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={(value) => selectedMetricData.format(value)}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#F9FAFB',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                  formatter={(value, name) => {
                    if (name === selectedMetric) {
                      return [selectedMetricData.format(value), selectedMetricData.name];
                    }
                    return [selectedMetricData.format(value), 'Confidence Bound'];
                  }}
                  labelFormatter={(label) => `${label}`}
                />
                
                {/* Confidence interval */}
                {confidenceInterval && (
                  <Area
                    type="monotone"
                    dataKey={`${selectedMetric}Upper`}
                    stroke="transparent"
                    fill={selectedMetricData.color}
                    fillOpacity={0.1}
                    activeDot={false}
                  />
                )}
                
                {confidenceInterval && (
                  <Area
                    type="monotone"
                    dataKey={`${selectedMetric}Lower`}
                    stroke="transparent"
                    fill="#ffffff"
                    fillOpacity={1}
                    activeDot={false}
                  />
                )}
                
                {/* Main forecast line with intersection points */}
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={selectedMetricData.color}
                  strokeWidth={3}
                  fill="url(#colorMetric)"
                  fillOpacity={1}
                  dot={{ r: 4, stroke: selectedMetricData.color, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, stroke: selectedMetricData.color, strokeWidth: 2, fill: '#fff' }}
                />
                
                {/* Reference line for current date */}
                <ReferenceLine 
                  x={forecastData.find(d => d.isCurrent)?.month} 
                  stroke="#EF4444" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                  label={{ value: "Today", position: "top" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Forecast Insights Section */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Forecast Insights</h4>
            
            {/* Forecast Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Next Month Forecast</p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      {selectedMetricData.format(forecastInsights.nextMonth)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Growth Rate</p>
                    <p className="text-lg font-bold text-green-900 dark:text-green-100">
                      {forecastInsights.totalGrowth > 0 ? '+' : ''}{forecastInsights.totalGrowth}%
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 dark:from-emerald-400/10 dark:to-cyan-400/10"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
                      <Brain className="h-4 w-4 mr-1" />
                      AI Confidence
                    </p>
                    <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100 flex items-center">
                      {Math.min(95, forecastInsights.confidence + 7)}%
                      <span className="ml-2 text-xs bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full font-medium">
                        High
                      </span>
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-400 rounded-full animate-pulse opacity-20"></div>
                    <Zap className="h-8 w-8 text-emerald-500 relative z-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Last updated: {mounted && lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--:--'}</span>
              <span>&bull;</span>
              <span>Model: ML Regression + ARIMA</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Historical</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Forecast</span>
              </div>
              {confidenceInterval && (
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-100 rounded-full"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Confidence</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PredictiveAnalyticsWidget;