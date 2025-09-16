import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  LineChart,
  Download,
  Filter,
  Calendar,
  Users,
  DollarSign,
  ShoppingCart,
  Target,
  Globe,
  Clock,
  RefreshCw,
  Settings,
  Bell,
  Eye,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Share,
  BookmarkPlus,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Activity,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  X,
  Brain
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart,
  Scatter,
  ScatterChart,
  FunnelChart,
  Funnel,
  LabelList,
  Treemap
} from 'recharts';
import EnhancedDashboardLayout from '../dashboard/enhanced-dashboard-layout';
import { useAuth } from '../../contexts/AuthContext';
import { useDashboard } from '../../contexts/DashboardContext';
import toast from 'react-hot-toast';
import PredictiveAnalyticsWidget from './PredictiveAnalyticsWidget';
import AnomalyDetectionWidget from './AnomalyDetectionWidget';
import EnhancedDataVisualization from './EnhancedDataVisualization';
import { CustomerSegments, ConversionFunnel } from '../dashboard/dashboard-sections';

const AdvancedAnalytics = () => {
  const { userProfile } = useAuth();
  const { dashboardData } = useDashboard();
  
  // State management
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLastRefresh(new Date());
  }, []);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    userActivity: true,
    performance: true,
    geographic: false,
    conversion: false,
    devices: false
  });
  const [activeFilters, setActiveFilters] = useState({
    geography: 'all',
    userSegment: 'all',
    channel: 'all',
    device: 'all'
  });
  const [alertThresholds, setAlertThresholds] = useState({
    revenue: { min: 100000, max: 200000, enabled: true },
    conversion: { min: 2.5, max: 5.0, enabled: true },
    churn: { min: 0, max: 8.0, enabled: true },
    traffic: { min: 10000, max: 50000, enabled: false }
  });
  const [savedReports, setSavedReports] = useState([]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  // Sample comprehensive data - in production, this would come from your data integration service
  const analyticsData = {
    overview: {
      totalRevenue: 2847392,
      totalUsers: 15847,
      activeUsers: 8234,
      conversionRate: 3.8,
      avgOrderValue: 179.50,
      churnRate: 4.2,
      customerLifetimeValue: 1247.80,
      monthlyRecurringRevenue: 847392,
      customerAcquisitionCost: 47.20,
      netPromoterScore: 72,
      customerSatisfaction: 4.6
    },
    timeSeriesData: [
      { date: '2024-01-01', revenue: 45000, customers: 1200, orders: 890, conversions: 3.2, traffic: 28500, bounceRate: 42.1 },
      { date: '2024-01-02', revenue: 52000, customers: 1350, orders: 980, conversions: 3.5, traffic: 31200, bounceRate: 39.8 },
      { date: '2024-01-03', revenue: 48000, customers: 1280, orders: 920, conversions: 3.1, traffic: 29800, bounceRate: 44.2 },
      { date: '2024-01-04', revenue: 61000, customers: 1560, orders: 1150, conversions: 3.8, traffic: 35600, bounceRate: 37.5 },
      { date: '2024-01-05', revenue: 55000, customers: 1420, orders: 1050, conversions: 3.4, traffic: 32400, bounceRate: 41.3 },
      { date: '2024-01-06', revenue: 67000, customers: 1680, orders: 1280, conversions: 4.1, traffic: 38900, bounceRate: 35.2 },
      { date: '2024-01-07', revenue: 72000, customers: 1850, orders: 1420, conversions: 4.3, traffic: 42100, bounceRate: 33.8 },
      { date: '2024-01-08', revenue: 69000, customers: 1780, orders: 1380, conversions: 4.0, traffic: 40200, bounceRate: 36.1 },
      { date: '2024-01-09', revenue: 78000, customers: 1950, orders: 1580, conversions: 4.5, traffic: 45300, bounceRate: 32.4 },
      { date: '2024-01-10', revenue: 85000, customers: 2100, orders: 1720, conversions: 4.8, traffic: 48700, bounceRate: 30.9 },
      { date: '2024-01-11', revenue: 92000, customers: 2280, orders: 1890, conversions: 5.1, traffic: 52100, bounceRate: 29.3 },
      { date: '2024-01-12', revenue: 98000, customers: 2450, orders: 2050, conversions: 5.3, traffic: 55800, bounceRate: 28.1 }
    ],
    geographicData: [
      { country: 'United States', users: 6847, revenue: 1247392, percentage: 43.2, growth: 12.5 },
      { country: 'United Kingdom', users: 2934, revenue: 487293, percentage: 18.5, growth: 8.7 },
      { country: 'Canada', users: 1847, revenue: 324871, percentage: 11.6, growth: 15.2 },
      { country: 'Germany', users: 1692, revenue: 298472, percentage: 11.4, growth: 6.3 },
      { country: 'Australia', users: 1247, revenue: 187394, percentage: 7.9, growth: 22.1 },
      { country: 'France', users: 987, revenue: 156847, percentage: 6.2, growth: 4.8 },
      { country: 'Others', users: 1293, revenue: 145123, percentage: 1.2, growth: 18.9 }
    ],
    userSegments: [
      { segment: 'Enterprise', count: 847, revenue: 1247392, avgValue: 1472.80, color: '#3B82F6' },
      { segment: 'SMB', count: 2847, revenue: 847293, avgValue: 297.50, color: '#10B981' },
      { segment: 'Startup', count: 4923, revenue: 487394, avgValue: 99.00, color: '#F59E0B' },
      { segment: 'Individual', count: 7230, revenue: 265313, avgValue: 36.70, color: '#EF4444' }
    ],
    conversionFunnel: [
      { stage: 'Visitors', count: 125000, percentage: 100, dropoff: 0 },
      { stage: 'Product Views', count: 87500, percentage: 70, dropoff: 30 },
      { stage: 'Add to Cart', count: 32500, percentage: 26, dropoff: 44 },
      { stage: 'Checkout Started', count: 16250, percentage: 13, dropoff: 50 },
      { stage: 'Payment Info', count: 11375, percentage: 9.1, dropoff: 30 },
      { stage: 'Purchase Complete', count: 4875, percentage: 3.9, dropoff: 57 }
    ],
    channelPerformance: [
      { channel: 'Organic Search', sessions: 45230, conversions: 2847, revenue: 487392, cpa: 23.40, roas: 4.2 },
      { channel: 'Paid Search', sessions: 28470, conversions: 1923, revenue: 324871, cpa: 45.20, roas: 3.8 },
      { channel: 'Social Media', sessions: 19847, conversions: 1247, revenue: 198472, cpa: 67.80, roas: 2.9 },
      { channel: 'Email', sessions: 15230, conversions: 1847, revenue: 287394, cpa: 18.90, roas: 5.1 },
      { channel: 'Direct', sessions: 12847, conversions: 987, revenue: 156847, cpa: 12.30, roas: 6.2 },
      { channel: 'Referral', sessions: 8947, conversions: 623, revenue: 98472, cpa: 34.70, roas: 3.2 }
    ],
    deviceBreakdown: [
      { device: 'Desktop', sessions: 67847, percentage: 52.3, revenue: 1247392, avgSession: 245 },
      { device: 'Mobile', sessions: 48230, percentage: 37.2, revenue: 847293, avgSession: 180 },
      { device: 'Tablet', sessions: 13623, percentage: 10.5, revenue: 287394, avgSession: 320 }
    ],
    cohortAnalysis: [
      { cohort: 'Jan 2024', month0: 100, month1: 85, month2: 72, month3: 65, month4: 58, month5: 52 },
      { cohort: 'Feb 2024', month0: 100, month1: 88, month2: 75, month3: 68, month4: 61, month5: null },
      { cohort: 'Mar 2024', month0: 100, month1: 82, month2: 69, month3: 62, month4: null, month5: null },
      { cohort: 'Apr 2024', month0: 100, month1: 86, month2: 73, month3: null, month4: null, month5: null },
      { cohort: 'May 2024', month0: 100, month1: 84, month2: null, month3: null, month4: null, month5: null },
      { cohort: 'Jun 2024', month0: 100, month1: null, month2: null, month3: null, month4: null, month5: null }
    ]
  };

  const dateRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  const availableMetrics = [
    { id: 'revenue', name: 'Revenue', icon: DollarSign, color: '#10B981' },
    { id: 'customers', name: 'Customers', icon: Users, color: '#3B82F6' },
    { id: 'conversion', name: 'Conversion Rate', icon: Target, color: '#8B5CF6' },
    { id: 'orders', name: 'Orders', icon: ShoppingCart, color: '#F59E0B' },
    { id: 'traffic', name: 'Website Traffic', icon: Globe, color: '#EF4444' },
    { id: 'bounceRate', name: 'Bounce Rate', icon: TrendingUp, color: '#6B7280' }
  ];

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Simulate API call to refresh data
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLastRefresh(new Date());
      toast.success('Analytics data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleExport = (format) => {
    toast.success(`Exporting analytics data as ${format.toUpperCase()}...`);
    // Implement export functionality
  };

  const handleScheduleReport = () => {
    toast.success('Opening report scheduling...');
    // Implement scheduled report functionality
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleSaveReport = () => {
    const reportName = prompt('Enter report name:');
    if (reportName) {
      const newReport = {
        id: Date.now(),
        name: reportName,
        dateRange: selectedDateRange,
        filters: activeFilters,
        createdAt: new Date()
      };
      setSavedReports([...savedReports, newReport]);
      toast.success('Report saved successfully');
    }
  };

  const handleFilterChange = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const checkAlerts = () => {
    const alerts = [];
    const { overview } = analyticsData;
    
    Object.entries(alertThresholds).forEach(([metric, threshold]) => {
      if (!threshold.enabled) return;
      
      const value = overview[metric] || overview[`total${metric.charAt(0).toUpperCase() + metric.slice(1)}`];
      if (value) {
        if (value < threshold.min) {
          alerts.push({ type: 'warning', message: `${metric} below minimum threshold`, metric, value });
        }
        if (value > threshold.max) {
          alerts.push({ type: 'error', message: `${metric} exceeds maximum threshold`, metric, value });
        }
      }
    });
    
    return alerts;
  };

  const alerts = checkAlerts();

  const calculateChange = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatValue = (value, unit) => {
    if (unit === '$') {
      return `$${value.toLocaleString()}`;
    } else if (unit === '%') {
      return `${value}%`;
    } else if (unit === '/5') {
      return `${value}/5`;
    }
    return value.toLocaleString();
  };

  return (
    <EnhancedDashboardLayout>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  Advanced Analytics
                </h1>
                <p className="text-purple-100 text-lg mb-4">
                  Comprehensive business intelligence with real-time insights and advanced visualizations
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Last updated: {mounted && lastRefresh ? lastRefresh.toLocaleTimeString() : '--:--:--'}
                  </div>
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-2" />
                    Real-time data
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {analyticsData.timeSeriesData.length} data points
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-white/50 focus:border-transparent"
                >
                  {dateRanges.map(range => (
                    <option key={range.value} value={range.value} className="text-gray-900">
                      {range.label}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                
                <div className="relative">
                  <button className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4"
          >
            <div className="flex items-center mb-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Performance Alerts ({alerts.length})
              </h3>
            </div>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-yellow-700 dark:text-yellow-300">{alert.message}</span>
                  <button className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 text-sm font-medium">
                    Configure Alert
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: 'Total Revenue', 
              value: `$${analyticsData.overview.totalRevenue.toLocaleString()}`, 
              change: '+12.5%', 
              trend: 'up', 
              icon: DollarSign, 
              color: 'green' 
            },
            { 
              title: 'Total Customers', 
              value: analyticsData.overview.totalUsers.toLocaleString(), 
              change: '+8.3%', 
              trend: 'up', 
              icon: Users, 
              color: 'blue' 
            },
            { 
              title: 'Conversion Rate', 
              value: `${analyticsData.overview.conversionRate}%`, 
              change: '+0.3%', 
              trend: 'up', 
              icon: Target, 
              color: 'purple' 
            },
            { 
              title: 'Avg Order Value', 
              value: `$${analyticsData.overview.avgOrderValue}`, 
              change: '-2.1%', 
              trend: 'down', 
              icon: ShoppingCart, 
              color: 'orange' 
            }
          ].map((kpi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {kpi.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {kpi.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {kpi.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 mr-1 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.change}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                      vs last period
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-${kpi.color}-500`}>
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Predictive Analytics Widget */}
        <PredictiveAnalyticsWidget 
          dashboardData={dashboardData}
          liveData={analyticsData}
        />

        {/* Anomaly Detection Widget */}
        <AnomalyDetectionWidget 
          dashboardData={dashboardData}
          liveData={analyticsData}
        />

        {/* Enhanced Data Visualization */}
        <EnhancedDataVisualization 
          dashboardData={dashboardData}
          liveData={analyticsData}
        />

        {/* Main Analytics Charts */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Revenue Trend */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Revenue & Customer Trends
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Multi-metric performance over time
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleSection('revenueChart')}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {expandedSections.revenueChart ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className={`${expandedSections.revenueChart ? 'h-96' : 'h-80'} transition-all duration-300`}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={analyticsData.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6B7280"
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis yAxisId="left" stroke="#6B7280" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="#6B7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="customers"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                    <Bar yAxisId="right" dataKey="orders" fill="#F59E0B" opacity={0.7} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Geographic Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Geographic Distribution
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Revenue by country
                </p>
              </div>
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {analyticsData.geographicData.slice(0, 6).map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded mr-3 flex items-center justify-center text-xs">
                      {country.country.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {country.country}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {country.users.toLocaleString()} users
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      ${country.revenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {country.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* User Segments & Conversion Funnel */}
        <div className="grid lg:grid-cols-2 gap-8">
          <CustomerSegments />
           <ConversionFunnel />
        </div>

        {/* Channel Performance & Device Breakdown */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Channel Performance */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Channel Performance
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Traffic sources and conversion rates
                  </p>
                </div>
                <BarChart3 className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.channelPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      dataKey="channel" 
                      stroke="#6B7280"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#F9FAFB'
                      }}
                    />
                    <Bar dataKey="sessions" fill="#3B82F6" name="Sessions" />
                    <Bar dataKey="conversions" fill="#10B981" name="Conversions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Device Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Device Breakdown
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sessions by device type
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {analyticsData.deviceBreakdown.map((device, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {device.device}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {device.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${device.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{device.sessions.toLocaleString()} sessions</span>
                    <span>${device.revenue.toLocaleString()} revenue</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Cohort Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Cohort Retention Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Customer retention rates by acquisition month
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleSection('cohortAnalysis')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {expandedSections.cohortAnalysis ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {!expandedSections.cohortAnalysis ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Cohort
                    </th>
                    {[0, 1, 2, 3, 4, 5].map(month => (
                      <th key={month} className="text-center py-3 px-4 font-medium text-gray-900 dark:text-white">
                        Month {month}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.cohortAnalysis.map((cohort, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {cohort.cohort}
                      </td>
                      {[cohort.month0, cohort.month1, cohort.month2, cohort.month3, cohort.month4, cohort.month5].map((value, monthIndex) => (
                        <td key={monthIndex} className="py-3 px-4 text-center">
                          {value !== null ? (
                            <span 
                              className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                value >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                                value >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                                'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                              }`}
                            >
                              {value}%
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Click to expand cohort analysis
            </div>
          )}
        </motion.div>

        {/* Quick Actions & Customization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions & Reports
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleSaveReport}
              className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <BookmarkPlus className="h-5 w-5 mr-2" />
              Save Report
            </button>
            
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" />
              Export PDF
            </button>
            
            <button
              onClick={handleScheduleReport}
              className="flex items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Report
            </button>
            
            <button
              className="flex items-center justify-center p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
            >
              <Bell className="h-5 w-5 mr-2" />
              Alert Settings
            </button>
          </div>
        </motion.div>

        {/* Saved Reports */}
        {savedReports.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Saved Reports ({savedReports.length})
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedReports.map((report) => (
                <div key={report.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white">{report.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {report.dateRange === 'custom' ? 'Custom date range' : 
                     dateRanges.find(r => r.value === report.dateRange)?.label || report.dateRange}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Created {report.createdAt.toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </EnhancedDashboardLayout>
  );
};

export default AdvancedAnalytics;