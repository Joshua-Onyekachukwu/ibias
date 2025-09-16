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
  ChevronUp,
  DollarSign,
  Users,
  Target,
  ShoppingCart,
  Activity,
  BarChart3,
  Shield,
  Brain
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
  ReferenceArea,
  ReferenceDot
} from 'recharts';

const AnomalyDetectionWidget = ({ className = '', dashboardData, liveData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [sensitivityLevel, setSensitivityLevel] = useState('medium');
  const [showThresholds, setShowThresholds] = useState(true);
  const [timeframe, setTimeframe] = useState('30d');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLastUpdated(new Date());
  }, []);

  // Consistent metrics with dashboard data
  const metrics = [
    { 
      id: 'revenue', 
      name: 'Revenue', 
      icon: DollarSign,
      color: '#3B82F6', 
      threshold: 0.15,
      current: 38400000,
      format: (val) => `$${(val / 1000000).toFixed(1)}M`
    },
    { 
      id: 'customers', 
      name: 'Customers', 
      icon: Users,
      color: '#10B981', 
      threshold: 0.20,
      current: 12500,
      format: (val) => val.toLocaleString()
    },
    { 
      id: 'conversion', 
      name: 'Conversion Rate', 
      icon: Target,
      color: '#8B5CF6', 
      threshold: 0.25,
      current: 5.8,
      format: (val) => `${val.toFixed(1)}%`
    },
    { 
      id: 'orders', 
      name: 'Orders', 
      icon: ShoppingCart,
      color: '#F59E0B', 
      threshold: 0.30,
      current: 2850,
      format: (val) => val.toLocaleString()
    }
  ];

  // Sensitivity levels
  const sensitivityLevels = [
    { value: 'low', label: 'Low Sensitivity', multiplier: 1.5, description: 'Fewer alerts, major anomalies only' },
    { value: 'medium', label: 'Medium Sensitivity', multiplier: 1.0, description: 'Balanced detection' },
    { value: 'high', label: 'High Sensitivity', multiplier: 0.7, description: 'More alerts, catches subtle changes' }
  ];

  // Timeframe options
  const timeframes = [
    { value: '7d', label: '7 Days', days: 7 },
    { value: '30d', label: '30 Days', days: 30 },
    { value: '90d', label: '90 Days', days: 90 }
  ];

  // Generate consistent data and anomalies
  const generateDataAndAnomalies = () => {
    const selectedMetricData = metrics.find(m => m.id === selectedMetric);
    const currentValue = selectedMetricData.current;
    const days = timeframes.find(t => t.value === timeframe)?.days || 30;
    
    const data = [];
    const anomalies = [];
    
    // Generate base data with trend
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      
      // Base value with slight upward trend
      const trendFactor = 1 + (i / days) * 0.1; // 10% growth over period
      const baseValue = currentValue * trendFactor;
      
      // Add normal variation (±5%)
      const normalVariation = 1 + (((i * 0.07) % 0.1) - 0.05);
      let value = baseValue * normalVariation;
      
      // Inject anomalies based on sensitivity
      const shouldHaveAnomaly = ((i * 0.13) % 1) < (sensitivityLevel === 'high' ? 0.08 : sensitivityLevel === 'medium' ? 0.05 : 0.03);
      
      if (shouldHaveAnomaly) {
        // Create spike or drop
        const isSpike = ((i * 0.17) % 1) > 0.5;
      const anomalyMultiplier = isSpike ? (1.3 + ((i * 0.11) % 0.4)) : (0.6 - ((i * 0.19) % 0.2));
        value = baseValue * anomalyMultiplier;
        
        anomalies.push({
          index: i,
          date: date.toISOString().split('T')[0],
          formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: Math.round(value * 100) / 100,
          type: isSpike ? 'spike' : 'drop',
          severity: ((i * 0.23) % 1) > 0.7 ? 'high' : ((i * 0.29) % 1) > 0.4 ? 'medium' : 'low',
          metric: selectedMetric,
          percentChange: ((value - baseValue) / baseValue * 100).toFixed(1)
        });
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        formattedDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        [selectedMetric]: Math.round(value * 100) / 100,
        revenue: selectedMetric === 'revenue' ? Math.round(value * 100) / 100 : Math.round((38400000 + ((i * 50000) % 500000)) * 100) / 100,
        customers: selectedMetric === 'customers' ? Math.round(value) : Math.round(12500 + ((i * 10) % 100)),
        conversion: selectedMetric === 'conversion' ? Math.round(value * 100) / 100 : Math.round((5.8 + ((i * 0.02) % 0.2)) * 100) / 100,
        orders: selectedMetric === 'orders' ? Math.round(value) : Math.round(2850 + ((i * 20) % 200))
      });
    }
    
    return { data, anomalies };
  };

  const { data: chartData, anomalies } = generateDataAndAnomalies();
  const selectedMetricData = metrics.find(m => m.id === selectedMetric);
  const selectedSensitivity = sensitivityLevels.find(s => s.value === sensitivityLevel);

  // Calculate statistics
  const values = chartData.map(item => item[selectedMetric]);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
  const threshold = 2.0 * selectedSensitivity.multiplier;
  const upperThreshold = mean + (stdDev * threshold);
  const lowerThreshold = mean - (stdDev * threshold);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  // Get anomaly severity styling
  const getAnomalySeverityClass = (severity) => {
    switch (severity) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-warning/10 text-warning border-warning/20';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return XCircle;
      case 'medium': return AlertCircle;
      default: return Info;
    }
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
              <div className="bg-gradient-to-r from-red-500 to-orange-600 p-3 rounded-xl shadow-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                <Shield className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Anomaly Detection
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-powered pattern monitoring with {anomalies.length} alerts
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setShowThresholds(!showThresholds)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={showThresholds ? "Hide thresholds" : "Show thresholds"}
            >
              {showThresholds ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </motion.button>
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
                        ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg'
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
            
            {/* Controls */}
            <div className="flex items-center space-x-3">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              >
                {timeframes.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
              
              <select
                value={sensitivityLevel}
                onChange={(e) => setSensitivityLevel(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              >
                {sensitivityLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Detection Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Anomalies</p>
                  <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                    {anomalies.length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-destructive/10 border-destructive/20 rounded-lg p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-destructive">High Severity</p>
                  <p className="text-lg font-bold text-foreground">
                    {anomalies.filter(a => a.severity === 'high').length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            
            <div className="bg-warning/10 border-warning/20 rounded-lg p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-warning">Spikes Detected</p>
                  <p className="text-lg font-bold text-foreground">
                    {anomalies.filter(a => a.type === 'spike').length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-warning" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Sensitivity</p>
                  <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                    {selectedSensitivity.label.split(' ')[0]}
                  </p>
                </div>
                <Brain className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className={`transition-all duration-300 ${expanded ? 'h-96' : 'h-80'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis 
                  dataKey="formattedDate" 
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
                  formatter={(value, name) => [
                    selectedMetricData.format(value),
                    selectedMetricData.name
                  ]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                
                {/* Threshold lines */}
                {showThresholds && (
                  <>
                    <ReferenceLine 
                      y={mean} 
                      stroke="#6B7280" 
                      strokeDasharray="3 3" 
                      strokeWidth={2}
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
                      strokeDasharray="5 5" 
                      strokeWidth={2}
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
                      strokeDasharray="5 5" 
                      strokeWidth={2}
                      label={{ 
                        value: 'Lower Threshold', 
                        position: 'right',
                        fill: '#3B82F6',
                        fontSize: 12
                      }} 
                    />
                  </>
                )}
                
                {/* Main metric line */}
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke={selectedMetricData.color}
                  strokeWidth={3}
                  dot={{ r: 3, fill: selectedMetricData.color, strokeWidth: 0 }}
                  activeDot={{ r: 6, stroke: selectedMetricData.color, strokeWidth: 2, fill: '#fff' }}
                />
                
                {/* Anomaly dots */}
                {anomalies.map((anomaly, index) => (
                  <ReferenceDot
                    key={index}
                    x={anomaly.formattedDate}
                    y={anomaly.value}
                    r={8}
                    fill={anomaly.type === 'spike' ? '#EF4444' : '#3B82F6'}
                    stroke="white"
                    strokeWidth={3}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Anomaly List */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  Detected Anomalies
                </h4>
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                  {anomalies.length}
                </span>
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {selectedSensitivity.description}
              </div>
            </div>
            
            {anomalies.length === 0 ? (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <div>
                    <h4 className="font-medium text-green-900 dark:text-green-300">No anomalies detected</h4>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      All {selectedMetricData.name.toLowerCase()} data points are within expected ranges.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {anomalies.map((anomaly, index) => {
                  const SeverityIcon = getSeverityIcon(anomaly.severity);
                  return (
                    <motion.div 
                      key={index}
                      className={`rounded-lg p-4 border ${getAnomalySeverityClass(anomaly.severity)}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <SeverityIcon className="h-5 w-5" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium capitalize">
                                {anomaly.type} Detected
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-white/50 dark:bg-black/20">
                                {anomaly.severity.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm mt-1">
                              {anomaly.formattedDate} - {selectedMetricData.format(anomaly.value)} 
                              <span className={`ml-2 font-medium ${
                                parseFloat(anomaly.percentChange) > 0 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                              }`}>
                                ({anomaly.percentChange > 0 ? '+' : ''}{anomaly.percentChange}%)
                              </span>
                            </p>
                          </div>
                        </div>
                        <motion.button 
                          className="text-xs px-3 py-1 rounded-lg bg-background/50 hover:bg-background/70 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Investigate
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Last updated: {mounted && lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--:--'}</span>
              <span>&bull;</span>
              <span>Algorithm: Z-score + ML</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                <span className="text-xs text-muted-foreground">Spikes</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-xs text-muted-foreground">Drops</span>
              </div>
              {showThresholds && (
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-muted rounded-full"></div>
                  <span className="text-xs text-muted-foreground">Thresholds</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnomalyDetectionWidget;