'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Settings, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Zap, 
  Search,
  ArrowRight,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp
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
  ReferenceArea
} from 'recharts';

// Type definitions
type MetricType = 'revenue' | 'customers' | 'conversionRate' | 'churnRate';
type SensitivityLevel = 'low' | 'medium' | 'high';
type TimeframeType = '7d' | '30d' | '90d';
type AnomalyType = 'spike' | 'drop';

interface MetricOption {
  id: MetricType;
  name: string;
  color: string;
  threshold: number;
}

interface SensitivityOption {
  value: SensitivityLevel;
  label: string;
  multiplier: number;
}

interface TimeframeOption {
  value: TimeframeType;
  label: string;
}

interface ChartDataPoint {
  date: string;
  revenue: number;
  customers: number;
  conversionRate: number;
  churnRate: number;
  formattedDate: string;
}

interface Anomaly {
  index: number;
  date: string;
  formattedDate: string;
  value: number;
  zScore: number;
  type: AnomalyType;
  percentChange: string;
  metric: MetricType;
}

interface DashboardData {
  // Define dashboard data structure as needed
  [key: string]: any;
}

interface LiveData {
  // Define live data structure as needed
  [key: string]: any;
}

interface AnomalyDetectionWidgetProps {
  className?: string;
  dashboardData?: DashboardData;
  liveData?: LiveData;
}

// Custom ReferenceDot component for anomalies
interface ReferenceDotProps {
  x?: number | string;
  y?: number | string;
  r?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

const ReferenceDot: React.FC<ReferenceDotProps> = ({ 
  x = 0, 
  y = 0, 
  r = 6, 
  fill = '#EF4444', 
  stroke = 'white', 
  strokeWidth = 2 
}) => {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      <circle cx={x} cy={y} r={r + 4} fill="none" stroke={fill} strokeWidth={1} opacity={0.5} />
      <circle cx={x} cy={y} r={r + 8} fill="none" stroke={fill} strokeWidth={1} opacity={0.2} />
    </g>
  );
};

const AnomalyDetectionWidget: React.FC<AnomalyDetectionWidgetProps> = ({ 
  className = '', 
  dashboardData, 
  liveData 
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('revenue');
  const [sensitivityLevel, setSensitivityLevel] = useState<SensitivityLevel>('medium');
  const [showThresholds, setShowThresholds] = useState<boolean>(true);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [timeframe, setTimeframe] = useState<TimeframeType>('30d');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Metrics options
  const metrics: MetricOption[] = [
    { id: 'revenue', name: 'Revenue', color: '#10B981', threshold: 0.15 },
    { id: 'customers', name: 'Customers', color: '#3B82F6', threshold: 0.20 },
    { id: 'conversionRate', name: 'Conversion Rate', color: '#8B5CF6', threshold: 0.25 },
    { id: 'churnRate', name: 'Churn Rate', color: '#EF4444', threshold: 0.30 }
  ];

  // Sensitivity levels
  const sensitivityLevels: SensitivityOption[] = [
    { value: 'low', label: 'Low', multiplier: 1.5 },
    { value: 'medium', label: 'Medium', multiplier: 1.0 },
    { value: 'high', label: 'High', multiplier: 0.7 }
  ];

  // Timeframe options
  const timeframes: TimeframeOption[] = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  // Generate data and detect anomalies when component mounts or when parameters change
  useEffect(() => {
    generateData();
  }, [selectedMetric, sensitivityLevel, timeframe]);

  // Generate mock data and detect anomalies
  const generateData = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Generate mock data
      const data = generateMockData();
      setChartData(data);
      
      // Detect anomalies in the data
      const detectedAnomalies = detectAnomalies(data, selectedMetric, sensitivityLevel);
      setAnomalies(detectedAnomalies);
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error generating data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate mock data for the selected timeframe
  const generateMockData = (): ChartDataPoint[] => {
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    const data: ChartDataPoint[] = [];
    
    // Current date
    const endDate = new Date();
    
    // Base values
    const baseRevenue = 100000;
    const baseCustomers = 2000;
    const baseConversionRate = 3.5;
    const baseChurnRate = 4.0;
    
    // Generate data for each day
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      
      // Add some randomness and trends
      const dayFactor = 1 + ((days - i) / days * 0.2); // Gradual increase over time
      const randomFactor = 0.9 + (Math.random() * 0.2); // Random variation
      
      // Add some anomalies
      const isAnomaly = Math.random() < 0.05; // 5% chance of anomaly
      const anomalyFactor = isAnomaly ? (Math.random() > 0.5 ? 1.5 : 0.6) : 1.0;
      
      // Calculate values
      const revenue = Math.round(baseRevenue * dayFactor * randomFactor * anomalyFactor);
      const customers = Math.round(baseCustomers * dayFactor * randomFactor * anomalyFactor);
      const conversionRate = parseFloat((baseConversionRate * randomFactor * anomalyFactor).toFixed(1));
      const churnRate = parseFloat((baseChurnRate * (2 - randomFactor) * (isAnomaly ? 1.3 : 1)).toFixed(1));
      
      data.push({
        date: date.toISOString().split('T')[0],
        revenue,
        customers,
        conversionRate,
        churnRate,
        formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    
    return data;
  };

  // Detect anomalies in the data using Z-score method
  const detectAnomalies = (data: ChartDataPoint[], metric: MetricType, sensitivity: SensitivityLevel): Anomaly[] => {
    if (!data || data.length < 5) return [];
    
    // Get values for the selected metric
    const values = data.map(item => item[metric]);
    
    // Calculate mean and standard deviation
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    );
    
    // Get sensitivity multiplier
    const sensitivityMultiplier = sensitivityLevels.find(level => level.value === sensitivity)?.multiplier || 1.0;
    
    // Threshold for anomaly detection (Z-score)
    const threshold = 2.0 * sensitivityMultiplier;
    
    // Detect anomalies
    const anomalies: Anomaly[] = [];
    data.forEach((item, index) => {
      const value = item[metric];
      const zScore = Math.abs((value - mean) / stdDev);
      
      if (zScore > threshold) {
        anomalies.push({
          index,
          date: item.date,
          formattedDate: item.formattedDate,
          value,
          zScore,
          type: value > mean ? 'spike' : 'drop',
          percentChange: ((value - mean) / mean * 100).toFixed(1),
          metric
        });
      }
    });
    
    return anomalies;
  };

  // Format value based on metric
  const formatValue = (value: number, metric: MetricType): string => {
    if (metric === 'revenue') return `$${value.toLocaleString()}`;
    if (metric === 'conversionRate' || metric === 'churnRate') return `${value}%`;
    return value.toLocaleString();
  };

  // Get color for selected metric
  const getMetricColor = (metric: MetricType): string => {
    return metrics.find(m => m.id === metric)?.color || '#3B82F6';
  };

  // Get anomaly severity class
  const getAnomalySeverityClass = (zScore: number): string => {
    if (zScore > 4) return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    if (zScore > 3) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-lg mr-3">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Anomaly Detection
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-powered pattern monitoring
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Analyzing data patterns...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-lg mr-3">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Anomaly Detection
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered pattern monitoring
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowThresholds(!showThresholds)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title={showThresholds ? "Hide thresholds" : "Show thresholds"}
          >
            {showThresholds ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            onClick={() => generateData()}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Refresh analysis"
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
          {metrics.map(metric => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedMetric === metric.id
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {metric.name}
            </button>
          ))}
        </div>
        
        {/* Timeframe selector */}
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as TimeframeType)}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {timeframes.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Sensitivity selector */}
        <div className="ml-auto flex items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Sensitivity:</span>
          <select
            value={sensitivityLevel}
            onChange={(e) => setSensitivityLevel(e.target.value as SensitivityLevel)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sensitivityLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className={expanded ? 'h-96' : 'h-72'}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="formattedDate" 
              stroke="#6B7280"
              fontSize={12}
              tickMargin={10}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={(value: number) => {
                if (selectedMetric === 'revenue') return `$${value / 1000}k`;
                if (selectedMetric === 'conversionRate' || selectedMetric === 'churnRate') return `${value}%`;
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
              formatter={(value: number) => [
                formatValue(value, selectedMetric),
                metrics.find(m => m.id === selectedMetric)?.name
              ]}
              labelFormatter={(label: string) => `Date: ${label}`}
            />
            
            {/* Main metric line */}
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={getMetricColor(selectedMetric)}
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 6, stroke: getMetricColor(selectedMetric), strokeWidth: 2 }}
            />
            
            {/* Highlight anomalies */}
            {anomalies.map((anomaly, index) => (
              <ReferenceDot
                key={index}
                x={chartData[anomaly.index].formattedDate}
                y={anomaly.value}
                r={6}
                fill={anomaly.type === 'spike' ? '#EF4444' : '#3B82F6'}
                stroke="white"
                strokeWidth={2}
              />
            ))}
            
            {/* Show threshold lines if enabled */}
            {showThresholds && (() => {
              // Calculate mean for threshold lines
              const values = chartData.map(item => item[selectedMetric]);
              const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
              const stdDev = Math.sqrt(
                values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
              );
              
              // Get sensitivity multiplier
              const sensitivityMultiplier = sensitivityLevels.find(level => level.value === sensitivityLevel)?.multiplier || 1.0;
              
              // Threshold for anomaly detection (Z-score)
              const threshold = 2.0 * sensitivityMultiplier;
              
              // Upper and lower thresholds
              const upperThreshold = mean + (stdDev * threshold);
              const lowerThreshold = mean - (stdDev * threshold);
              
              return (
                <>
                  <ReferenceLine 
                    y={mean} 
                    stroke="#6B7280" 
                    strokeDasharray="3 3" 
                    label={{ 
                      value: 'Mean', 
                      position: 'right',
                      fill: '#6B7280',
                      fontSize: 12
                    }} 
                  />
                  <ReferenceLine 
                    y={upperThreshold} 
                    stroke="#EF4444" 
                    strokeDasharray="3 3" 
                    label={{ 
                      value: 'Upper Threshold', 
                      position: 'right',
                      fill: '#EF4444',
                      fontSize: 12
                    }} 
                  />
                  <ReferenceLine 
                    y={lowerThreshold} 
                    stroke="#3B82F6" 
                    strokeDasharray="3 3" 
                    label={{ 
                      value: 'Lower Threshold', 
                      position: 'right',
                      fill: '#3B82F6',
                      fontSize: 12
                    }} 
                  />
                </>
              );
            })()}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Anomaly summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Zap className="h-5 w-5 text-orange-500 mr-2" />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Detected Anomalies
            </h4>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {anomalies.length} found
          </span>
        </div>
        
        {anomalies.length === 0 ? (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" />
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-300 mb-1">No anomalies detected</h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  All {metrics.find(m => m.id === selectedMetric)?.name.toLowerCase()} data points are within expected ranges.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
            {anomalies.map((anomaly, index) => (
              <div 
                key={index} 
                className="flex items-start p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className={`p-1.5 rounded-lg ${anomaly.type === 'spike' ? 'bg-red-100 dark:bg-red-900/20' : 'bg-blue-100 dark:bg-blue-900/20'} mr-3`}>
                  {anomaly.type === 'spike' ? (
                    <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {anomaly.type === 'spike' ? 'Unusual spike' : 'Unusual drop'} in {metrics.find(m => m.id === anomaly.metric)?.name.toLowerCase()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getAnomalySeverityClass(anomaly.zScore)}`}>
                      {Math.abs(parseFloat(anomaly.percentChange))}% {anomaly.type === 'spike' ? 'increase' : 'decrease'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {anomaly.formattedDate} - {formatValue(anomaly.value, anomaly.metric)}
                    </span>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      Investigate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Anomaly detection metadata */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Info className="h-3.5 w-3.5 mr-1" />
            <span>
              Last updated: {lastUpdated.toLocaleTimeString()} | 
              Algorithm: Z-score + ML
            </span>
          </div>
          <button className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            Configure alerts
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnomalyDetectionWidget;