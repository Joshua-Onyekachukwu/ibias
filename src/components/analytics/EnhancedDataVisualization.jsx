import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  Grid3X3,
  RefreshCw, 
  Download, 
  Settings, 
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Filter,
  Search,
  Layers,
  Palette,
  Sliders,
  Info,
  HelpCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Treemap,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend
} from 'recharts';

const EnhancedDataVisualization = ({ className = '', dashboardData, liveData }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [selectedChart, setSelectedChart] = useState('scatter');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedDimension, setSelectedDimension] = useState('time');
  const [colorScheme, setColorScheme] = useState('blue');
  const [showLegend, setShowLegend] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLastUpdated(new Date());
  }, []);
  const [visualizationData, setVisualizationData] = useState([]);
  const [insights, setInsights] = useState([]);

  // Updated metrics data with enhanced values - consistent with dashboard KPI cards
  const metricsData = {
    revenue: {
      current: dashboardData?.totalRevenue || 847250,
      growth: dashboardData?.revenueGrowth || 18.7,
      target: 1000000,
      unit: '$',
      format: 'currency'
    },
    customers: {
      current: dashboardData?.totalCustomers || 12847,
      growth: dashboardData?.customerGrowth || 15.3,
      target: 15000,
      unit: '',
      format: 'number'
    },
    conversionRate: {
      current: dashboardData?.conversionRate || 5.8,
      growth: dashboardData?.conversionGrowth || 8.4,
      target: 7.0,
      unit: '%',
      format: 'percentage'
    },
    avgOrderValue: {
      current: dashboardData?.avgOrderValue || 189.50,
      growth: dashboardData?.avgOrderValueGrowth || 12.1,
      target: 220.0,
      unit: '$',
      format: 'currency'
    },
    churnRate: {
      current: dashboardData?.churnRate || 2.1,
      growth: dashboardData?.churnRateChange || -12.5,
      target: 1.5,
      unit: '%',
      format: 'percentage'
    }
  };

  // Chart options
  const chartTypes = [
    { id: 'scatter', name: 'Scatter Plot', icon: Layers, description: 'Correlation analysis' },
    { id: 'radar', name: 'Radar Chart', icon: Activity, description: 'Multi-dimensional view' },
    { id: 'treemap', name: 'Treemap', icon: Grid3X3, description: 'Hierarchical data' },
    { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Comparative analysis' }
  ];

  // Metrics options
  const metrics = [
    { id: 'revenue', name: 'Revenue', icon: TrendingUp },
    { id: 'customers', name: 'Customers', icon: Activity },
    { id: 'conversionRate', name: 'Conversion Rate', icon: Zap },
    { id: 'avgOrderValue', name: 'Avg Order Value', icon: TrendingUp },
    { id: 'churnRate', name: 'Churn Rate', icon: TrendingDown }
  ];

  // Dimension options
  const dimensions = [
    { id: 'time', name: 'Time Period' },
    { id: 'geography', name: 'Geography' },
    { id: 'channel', name: 'Marketing Channel' },
    { id: 'device', name: 'Device Type' }
  ];

  // Color scheme options
  const colorSchemes = [
    { id: 'blue', name: 'Blue', primary: '#3B82F6', secondary: '#93C5FD' },
    { id: 'green', name: 'Green', primary: '#10B981', secondary: '#6EE7B7' },
    { id: 'purple', name: 'Purple', primary: '#8B5CF6', secondary: '#C4B5FD' },
    { id: 'orange', name: 'Orange', primary: '#F59E0B', secondary: '#FCD34D' },
    { id: 'red', name: 'Red', primary: '#EF4444', secondary: '#FCA5A5' },
    { id: 'indigo', name: 'Indigo', primary: '#6366F1', secondary: '#A5B4FC' }
  ];

  // Generate data when component mounts or when parameters change
  useEffect(() => {
    generateData();
  }, [selectedChart, selectedMetric, selectedDimension, colorScheme]);

  // Initialize component
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Generate visualization data based on selected parameters
  const generateData = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate data based on selected chart type
      let data;
      let generatedInsights = [];
      
      switch (selectedChart) {
        case 'scatter':
          data = generateScatterData();
          generatedInsights = generateScatterInsights();
          break;
        case 'radar':
          data = generateRadarData();
          generatedInsights = generateRadarInsights();
          break;
        case 'treemap':
          data = generateTreemapData();
          generatedInsights = generateTreemapInsights();
          break;
        case 'bar':
          data = generateBarData();
          generatedInsights = generateBarInsights();
          break;
        default:
          data = [];
          generatedInsights = [];
      }
      
      setVisualizationData(data);
      setInsights(generatedInsights);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error generating visualization data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate scatter plot data
  const generateScatterData = () => {
    const data = [];
    const baseValue = metricsData[selectedMetric].current;
    const growth = metricsData[selectedMetric].growth;
    
    // Generate 50 data points with realistic patterns
    for (let i = 0; i < 50; i++) {
      const x = ((i * 17) % 100);
      // Scale y values to be in millions for better currency formatting
      const y = (baseValue / 1000) * (0.5 + ((i * 0.13) % 1.5)) * (1 + growth / 100);
      const z = 20 + ((i * 23) % 80); // Size for bubble
      
      data.push({
        x: Math.round(x),
        y: Math.round(y * 1000), // Convert back to actual values
        z: Math.round(z),
        category: selectedDimension,
        metric: selectedMetric
      });
    }
    
    return data;
  };

  // Get metric color based on selected color scheme
  const getMetricColor = () => {
    const scheme = colorSchemes.find(s => s.id === colorScheme);
    return scheme ? scheme.primary : '#3B82F6';
  };

  // Get color scale function for treemap visualization
  const getColorScale = () => {
    const scheme = colorSchemes.find(s => s.id === colorScheme);
    const colors = scheme ? [scheme.primary, scheme.secondary, scheme.accent] : ['#3B82F6', '#8B5CF6', '#10B981'];
    
    return (t) => {
      // Interpolate between colors based on t (0-1)
      const index = Math.floor(t * (colors.length - 1));
      const nextIndex = Math.min(index + 1, colors.length - 1);
      const factor = (t * (colors.length - 1)) - index;
      
      if (factor === 0) return colors[index];
      
      // Simple color interpolation
      const color1 = colors[index];
      const color2 = colors[nextIndex];
      
      // Convert hex to RGB for interpolation
      const hex1 = color1.replace('#', '');
      const hex2 = color2.replace('#', '');
      
      const r1 = parseInt(hex1.substr(0, 2), 16);
      const g1 = parseInt(hex1.substr(2, 2), 16);
      const b1 = parseInt(hex1.substr(4, 2), 16);
      
      const r2 = parseInt(hex2.substr(0, 2), 16);
      const g2 = parseInt(hex2.substr(2, 2), 16);
      const b2 = parseInt(hex2.substr(4, 2), 16);
      
      const r = Math.round(r1 + (r2 - r1) * factor);
      const g = Math.round(g1 + (g2 - g1) * factor);
      const b = Math.round(b1 + (b2 - b1) * factor);
      
      return `rgb(${r}, ${g}, ${b})`;
    };
  };

  // Generate scatter plot insights
  const generateScatterInsights = () => {
    const metric = metricsData[selectedMetric];
    return [
      `${metric.name} shows ${metric.growth > 0 ? 'positive' : 'negative'} correlation with ${selectedDimension}`,
      `Peak performance observed in ${selectedDimension === 'time' ? 'business hours' : 'key segments'}`,
      `Data points reveal ${metric.growth > 0 ? 'growth opportunities' : 'optimization areas'} across different ${selectedDimension} segments`
    ];
  };

  // Generate radar chart insights
  const generateRadarInsights = () => {
    const metric = metricsData[selectedMetric];
    return [
      `Multi-dimensional analysis shows balanced performance across ${selectedDimension}`,
      `Radar pattern suggests ${metric.growth > 0 ? 'expanding' : 'contracting'} market presence`,
      `Current performance covers ${Math.round(60 + ((Date.now() % 1000) / 1000 * 30))}% of the optimal radar area`
    ];
  };

  // Generate treemap insights
  const generateTreemapInsights = () => {
    const metric = metricsData[selectedMetric];
    return [
      `Hierarchical view reveals ${metric.growth > 0 ? 'growth opportunities' : 'optimization areas'} in ${selectedDimension}`,
      `Size distribution indicates market concentration patterns`,
      `Top ${selectedDimension} segments account for ${Math.round(60 + ((Date.now() % 2000) / 2000 * 25))}% of total ${metric.name.toLowerCase()}`
    ];
  };

  // Generate bar chart insights
  const generateBarInsights = () => {
    const metric = metricsData[selectedMetric];
    return [
      `Top performing ${selectedDimension} segment exceeds target by ${Math.abs(metric.growth)}%`,
      `${metric.name} distribution varies significantly across ${selectedDimension}`,
      `Performance gap between best and worst ${selectedDimension} is ${Math.round(20 + ((Date.now() % 3000) / 3000 * 40))}%`
    ];
  };

  // Generate insights based on chart type and data
  const generateInsights = () => {
    const metric = metricsData[selectedMetric];
    const insights = [];
    
    if (selectedChart === 'scatter') {
      insights.push(`${metric.name} shows ${metric.growth > 0 ? 'positive' : 'negative'} correlation with ${selectedDimension}`);
      insights.push(`Peak performance observed in ${selectedDimension === 'time' ? 'business hours' : 'key segments'}`);
    } else if (selectedChart === 'bar') {
      insights.push(`Top performing ${selectedDimension} segment exceeds target by ${Math.abs(metric.growth)}%`);
      insights.push(`${metric.name} distribution varies significantly across ${selectedDimension}`);
    } else if (selectedChart === 'treemap') {
      insights.push(`Hierarchical view reveals ${metric.growth > 0 ? 'growth opportunities' : 'optimization areas'} in ${selectedDimension}`);
      insights.push(`Size distribution indicates market concentration patterns`);
    } else if (selectedChart === 'radar') {
      insights.push(`Multi-dimensional analysis shows balanced performance across ${selectedDimension}`);
      insights.push(`Radar pattern suggests ${metric.growth > 0 ? 'expanding' : 'contracting'} market presence`);
    }
    
    return insights;
  };

  // Format values based on metric type with proper scaling
  const formatValue = (value) => {
    const metric = metricsData[selectedMetric];
    if (metric.format === 'currency') {
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(2)}M`;
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`;
      }
      return `$${value.toLocaleString()}`;
    } else if (metric.format === 'percentage') {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  // Generate treemap data
  const generateTreemapData = () => {
    const categories = {
      time: [
        { name: 'Q1', children: [{ name: 'Jan', size: 1200 }, { name: 'Feb', size: 1100 }, { name: 'Mar', size: 1300 }] },
        { name: 'Q2', children: [{ name: 'Apr', size: 1400 }, { name: 'May', size: 1500 }, { name: 'Jun', size: 1600 }] }
      ],
      geography: [
        { name: 'North America', children: [{ name: 'USA', size: 2000 }, { name: 'Canada', size: 800 }] },
        { name: 'Europe', children: [{ name: 'UK', size: 1200 }, { name: 'Germany', size: 1000 }] }
      ],
      channel: [
        { name: 'Digital', children: [{ name: 'Organic', size: 1500 }, { name: 'Paid', size: 1200 }] },
        { name: 'Traditional', children: [{ name: 'Email', size: 800 }, { name: 'Direct', size: 600 }] }
      ],
      device: [
        { name: 'Desktop', children: [{ name: 'Windows', size: 1800 }, { name: 'Mac', size: 1200 }] },
        { name: 'Mobile', children: [{ name: 'iOS', size: 1400 }, { name: 'Android', size: 1600 }] }
      ]
    };
    
    const baseValue = metricsData[selectedMetric].current;
    const growth = metricsData[selectedMetric].growth;
    
    return categories[selectedDimension].map(category => ({
      ...category,
      children: category.children.map(child => ({
        ...child,
        size: Math.round(child.size * (baseValue / 10000) * (1 + growth / 100))
      }))
    }));
  };

  // Generate radar chart data
  const generateRadarData = () => {
    const subjects = {
      time: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      geography: ['North America', 'Europe', 'Asia', 'South America'],
      channel: ['Organic', 'Paid Search', 'Social', 'Email', 'Direct'],
      device: ['Desktop', 'Mobile', 'Tablet']
    };
    
    const baseValue = metricsData[selectedMetric].current;
    const growth = metricsData[selectedMetric].growth;
    
    return subjects[selectedDimension].map((subject, index) => ({
      subject,
      A: Math.round(baseValue * (0.5 + ((index * 0.13) % 0.5)) * (1 + growth / 100) / 1000),
      B: Math.round(baseValue * (0.4 + ((index * 0.17) % 0.6)) * (1 + (growth - 5) / 100) / 1000),
      fullMark: Math.round(baseValue * 1.2 / 1000)
    }));
  };

  // Generate bar chart data
  const generateBarData = () => {
    const categories = {
      time: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      geography: ['North America', 'Europe', 'Asia', 'South America'],
      channel: ['Organic', 'Paid Search', 'Social', 'Email', 'Direct'],
      device: ['Desktop', 'Mobile', 'Tablet']
    };
    
    const baseValue = metricsData[selectedMetric].current;
    const growth = metricsData[selectedMetric].growth;
    
    return categories[selectedDimension].map((name, index) => ({
      name,
      value: Math.round(baseValue * (0.7 + ((index * 0.11) % 0.6)) * (1 + growth / 100) / 100),
      target: Math.round(baseValue * (0.8 + ((index * 0.07) % 0.4)) * (1 + (growth + 10) / 100) / 100)
    }));
  };

  // Get chart data based on selected chart type
  const getChartData = () => {
    switch (selectedChart) {
      case 'scatter':
        return generateScatterData();
      case 'bar':
        return generateBarData();
      case 'treemap':
        return generateTreemapData();
      case 'radar':
        return generateRadarData();
      default:
        return [];
    }
  };

  const chartData = getChartData();
  const generatedInsights = generateInsights();

  // Handle refresh button click
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Render loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        {/* Outer Box */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg mr-3">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Enhanced Data Visualization
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Advanced multi-dimensional analytics
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Inner Box - Loading */}
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <Activity className="h-8 w-8 text-purple-500 animate-pulse mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading visualization...</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Outer Box */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 shadow-xl border border-blue-200/50 dark:border-blue-700/30">
        {/* Inner Box */}
        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 dark:border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                Enhanced Data Visualization
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                Advanced analytics with interactive insights and real-time data processing
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                <button
                  onClick={handleRefresh}
                  className="p-2 text-green-500 hover:text-green-700 dark:hover:text-green-300 transition-all duration-200 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transform hover:scale-105"
                  title="Refresh visualization"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowLegend(!showLegend)}
                  className="p-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transform hover:scale-105"
                  title={showLegend ? "Hide legend" : "Show legend"}
                >
                  {showLegend ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="p-2 text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transform hover:scale-105"
                  title={expanded ? "Collapse" : "Expand"}
                >
                  {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
      
        
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Chart type selector */}
            <div className="flex flex-wrap items-center gap-2">
              {chartTypes.map(chart => (
                <button
                  key={chart.id}
                  onClick={() => setSelectedChart(chart.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                    selectedChart === chart.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white/70 dark:bg-gray-700/70 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <chart.icon className="h-4 w-4 mr-2" />
                  {chart.name}
                </button>
              ))}
            </div>
            
            {/* Dimension selector */}
            <select
              value={selectedDimension}
              onChange={(e) => setSelectedDimension(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {dimensions.map(dimension => (
                <option key={dimension.id} value={dimension.id}>
                  By {dimension.name}
                </option>
              ))}
            </select>
            
            {/* Metric selector */}
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {metrics.map(metric => (
                <option key={metric.id} value={metric.id}>
                  {metric.name}
                </option>
              ))}
            </select>
            
            {/* Color scheme selector */}
            <div className="ml-auto flex items-center bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
              <Palette className="h-4 w-4 mr-2 text-blue-500" />
              <select
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value)}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {colorSchemes.map(scheme => (
                  <option key={scheme.id} value={scheme.id}>
                    {scheme.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

      {/* Visualization container */}
      <div className={expanded ? 'h-96' : 'h-72'}>
        {selectedChart === 'heatmap' && (
          <div 
            ref={heatmapRef} 
            className="w-full h-full relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
          >
            {/* Heatmap will be rendered here by heatmap.js */}
            {/* Add legend */}
            {showLegend && (
              <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg shadow-md">
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {metrics.find(m => m.id === selectedMetric)?.name} Intensity
                </div>
                <div className="flex items-center">
                  <div className="w-24 h-3 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded"></div>
                  <div className="flex justify-between w-24 mt-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Low</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">High</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Add dimension labels based on selected dimension */}
            {selectedDimension === 'time' && (
              <>
                <div className="absolute left-4 top-4 text-xs font-medium text-gray-700 dark:text-gray-300">
                  Day of Week
                </div>
                <div className="absolute left-4 bottom-4 text-xs font-medium text-gray-700 dark:text-gray-300">
                  Hour of Day
                </div>
              </>
            )}
            {selectedDimension === 'geography' && (
              <>
                <div className="absolute left-4 top-4 text-xs font-medium text-gray-700 dark:text-gray-300">
                  Region
                </div>
                <div className="absolute left-4 bottom-4 text-xs font-medium text-gray-700 dark:text-gray-300">
                  Country
                </div>
              </>
            )}
            {selectedDimension === 'channel' && (
              <>
                <div className="absolute left-4 top-4 text-xs font-medium text-gray-700 dark:text-gray-300">
                  Channel
                </div>
                <div className="absolute left-4 bottom-4 text-xs font-medium text-gray-700 dark:text-gray-300">
                  Campaign
                </div>
              </>
            )}
            {selectedDimension === 'device' && (
              <>
                <div className="absolute left-4 top-4 text-xs font-medium text-gray-700 dark:text-gray-300">
                  Device
                </div>
                <div className="absolute left-4 bottom-4 text-xs font-medium text-gray-700 dark:text-gray-300">
                  Browser
                </div>
              </>
            )}
          </div>
        )}
        
        {selectedChart === 'scatter' && (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                type="number" 
                dataKey="x" 
                name={selectedDimension === 'time' ? 'Hour' : 'Value'} 
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => {
                  if (selectedDimension === 'time') {
                    return `${value % 12 === 0 ? 12 : value % 12}${value < 12 ? 'am' : 'pm'}`;
                  }
                  return value;
                }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name={metrics.find(m => m.id === selectedMetric)?.name} 
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => formatValue(value)}
              />
              <ZAxis 
                type="number" 
                dataKey="z" 
                range={[50, 400]} 
                name="Size" 
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value, name) => {
                  if (name === metrics.find(m => m.id === selectedMetric)?.name) {
                    return [formatValue(value), name];
                  }
                  return [value, name];
                }}
              />
              <Scatter 
                name={metrics.find(m => m.id === selectedMetric)?.name} 
                data={visualizationData} 
                fill={getMetricColor()}
              />
              
              {/* Add legend if enabled */}
              {showLegend && (
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  formatter={(value) => <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>}
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        )}
        
        {selectedChart === 'treemap' && (
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={visualizationData}
              dataKey="size"
              aspectRatio={4/3}
              stroke="#fff"
              fill="#8884d8"
              content={<CustomizedTreemapContent colorScale={getColorScale()} />}
            >
              {/* Add tooltip */}
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value, name) => [
                  formatValue(value, selectedMetric),
                  name
                ]}
              />
            </Treemap>
          </ResponsiveContainer>
        )}
        
        {selectedChart === 'radar' && (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={visualizationData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar 
                name="Current Period" 
                dataKey="A" 
                stroke={getMetricColor()} 
                fill={getMetricColor()} 
                fillOpacity={0.6} 
              />
              <Radar 
                name="Previous Period" 
                dataKey="B" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.6} 
              />
              
              {/* Add tooltip */}
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value, name) => [
                  formatValue(value, selectedMetric),
                  name
                ]}
              />
              
              {/* Add legend if enabled */}
              {showLegend && (
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>}
                />
              )}
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* Visualization insights */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-3">
          <Info className="h-5 w-5 text-blue-500 mr-2" />
          <h4 className="font-medium text-gray-900 dark:text-white">
            Visualization Insights
          </h4>
        </div>
        
        <div className="space-y-3">
          {/* Generate insights based on selected chart and dimension */}
          {(() => {
            const insights = [];
            
            if (selectedChart === 'heatmap') {
              if (selectedDimension === 'time') {
                insights.push(
                  <div key="time-heatmap-1" className="text-sm text-gray-700 dark:text-gray-300">
                    &bull; Highest {selectedMetric === 'revenue' ? 'revenue' : selectedMetric === 'customers' ? 'customer activity' : selectedMetric === 'conversionRate' ? 'conversion rates' : 'churn rates'} occur during business hours (9am-5pm) on weekdays.
                  </div>
                );
                insights.push(
                  <div key="time-heatmap-2" className="text-sm text-gray-700 dark:text-gray-300">
                    &bull; Weekend activity shows different patterns with peaks around midday.
                  </div>
                );
              } else if (selectedDimension === 'geography') {
                insights.push(
                  <div key="geo-heatmap-1" className="text-sm text-gray-700 dark:text-gray-300">
                    &bull; North American regions show the strongest performance for {metrics.find(m => m.id === selectedMetric)?.name.toLowerCase()}.
                  </div>
                );
                insights.push(
                  <div key="geo-heatmap-2" className="text-sm text-gray-700 dark:text-gray-300">
                    &bull; European markets display consistent patterns across countries.
                  </div>
                );
              } else if (selectedDimension === 'channel') {
                insights.push(
                  <div key="channel-heatmap-1" className="text-sm text-gray-700 dark:text-gray-300">
                    &bull; Paid Search performs best for product-focused campaigns.
                  </div>
                );
                insights.push(
                  <div key="channel-heatmap-2" className="text-sm text-gray-700 dark:text-gray-300">
                    &bull; Email marketing shows strong results for promotional campaigns.
                  </div>
                );
              } else if (selectedDimension === 'device') {
                insights.push(
                  <div key="device-heatmap-1" className="text-sm text-gray-700 dark:text-gray-300">
                    &bull; Desktop users on Chrome show the highest {selectedMetric === 'revenue' ? 'revenue' : selectedMetric === 'customers' ? 'customer counts' : selectedMetric === 'conversionRate' ? 'conversion rates' : 'churn rates'}.
                  </div>
                );
                insights.push(
                  <div key="device-heatmap-2" className="text-sm text-gray-700 dark:text-gray-300">
                    &bull; Mobile Safari users demonstrate unique behavior patterns.
                  </div>
                );
              }
            } else if (selectedChart === 'scatter') {
              insights.push(
                <div key="scatter-1" className="text-sm text-gray-700 dark:text-gray-300">
                  &bull; Clear clusters indicate distinct customer segments or behavior patterns.
                </div>
              );
              insights.push(
                <div key="scatter-2" className="text-sm text-gray-700 dark:text-gray-300">
                  &bull; Outliers represent opportunities for targeted optimization.
                </div>
              );
            } else if (selectedChart === 'treemap') {
              insights.push(
                <div key="treemap-1" className="text-sm text-gray-700 dark:text-gray-300">
                  &bull; Relative size of each segment shows contribution to overall {metrics.find(m => m.id === selectedMetric)?.name.toLowerCase()}.
                </div>
              );
              insights.push(
                <div key="treemap-2" className="text-sm text-gray-700 dark:text-gray-300">
                  &bull; Hierarchical structure reveals relationships between categories and subcategories.
                </div>
              );
            } else if (selectedChart === 'radar') {
              insights.push(
                <div key="radar-1" className="text-sm text-gray-700 dark:text-gray-300">
                  &bull; Current period (blue) shows improvements in most dimensions compared to previous period (green).
                </div>
              );
              insights.push(
                <div key="radar-2" className="text-sm text-gray-700 dark:text-gray-300">
                  &bull; The shape reveals strengths and weaknesses across different dimensions.
                </div>
              );
            }
            
            return insights;
          })()}
        </div>
        
        {/* Visualization metadata */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>
              Last updated: {mounted && lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--:--'}
            </span>
          </div>
          <button className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            Export visualization
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </button>
        </div>
      </div>
        </div>
      </div>
    </motion.div>
  );
};

// Custom Treemap content component
const CustomizedTreemapContent = (props) => {
  const { root, depth, x, y, width, height, index, name, value, colorScale } = props;
  
  // Calculate color based on depth and index
  const color = depth < 2 
    ? colorScale(index / root.children.length * 0.8 + 0.2) 
    : colorScale(index / root.children.length * 0.5 + 0.5);
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: color,
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {depth < 2 && width > 50 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={12}
          fontWeight={depth === 0 ? 'bold' : 'normal'}
        >
          {name}
        </text>
      )}
    </g>
  );
};







export default EnhancedDataVisualization;