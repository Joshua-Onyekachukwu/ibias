import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown,
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
  Brain,
  Star,
  Repeat,
  Search,
  EyeOff,
  MoreHorizontal,
  XCircle,
  FileText
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
import DataExportModal from './DataExportModal';
import ScheduleReportModal from './ScheduleReportModal';
import AlertConfigModal from './AlertConfigModal';
import PredictiveAnalyticsWidget from './PredictiveAnalyticsWidget';
import AnomalyDetectionWidget from './AnomalyDetectionWidget';
import EnhancedDataVisualization from './EnhancedDataVisualization';
import { EnhancedKPICard } from '@/components/dashboard/enhanced-kpi-card';
import { useDashboardData } from '@/contexts/dashboard-data-context';
import { useQuickActions } from '@/contexts/quick-actions-context';
import { QuickActionsModals } from '@/components/dashboard/quick-actions-modals';
import { CustomerSegments, ConversionFunnel } from '@/components/dashboard/dashboard-sections';
import { QuickActionDiv } from '@/components/dashboard/quick-action-div';
import { dashboardData, businessSummary } from '@/lib/dummy-data';

const UnifiedAnalyticsDashboard = () => {
  const router = useRouter();
  const { userProfile } = useAuth();
  const { dashboardData, liveData } = useDashboard();
  
  // Get dashboard data for consistency with KPI cards
  const { kpiData, refreshData, isRefreshing: dashboardRefreshing } = useDashboardData();
  
  // Quick Actions context
  const { setShowReportModal } = useQuickActions();
  
  // State management
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [formattedTime, setFormattedTime] = useState('');

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setLastRefresh(now);
    setFormattedTime(now.toLocaleTimeString());
  }, []);

  useEffect(() => {
    if (lastRefresh && mounted) {
      setFormattedTime(lastRefresh.toLocaleTimeString());
    }
  }, [lastRefresh, mounted]);
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
    revenue: { min: 2500000, max: 3200000, enabled: true },
    conversion: { min: 5.5, max: 7.0, enabled: true },
    churn: { min: 0, max: 3.0, enabled: true },
    traffic: { min: 140000, max: 160000, enabled: false }
  });
  const [savedReports, setSavedReports] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 300000);
    return () => clearInterval(interval);
  }, []);
  
  // Analytics data using TechVibe Electronics dummy data for consistency
  const analyticsData = {
    overview: {
      totalRevenue: businessSummary?.financial?.totalRevenue || 2847250,
      totalUsers: businessSummary?.customers?.totalCustomers || 15847,
      activeUsers: businessSummary?.customers?.activeCustomers || 12500,
      conversionRate: businessSummary?.performance?.conversionRate || 6.2,
      avgOrderValue: businessSummary?.financial?.avgOrderValue || 189.50,
      churnRate: businessSummary?.performance?.churnRate || 2.1,
      customerLifetimeValue: businessSummary?.customers?.avgLifetimeValue || 2850,
      monthlyRecurringRevenue: businessSummary?.financial?.monthlyRecurringRevenue || 2847250,
      customerAcquisitionCost: businessSummary?.performance?.customerAcquisitionCost || 47.20,
      netPromoterScore: businessSummary?.performance?.netPromoterScore || 72,
      customerSatisfaction: businessSummary?.performance?.customerSatisfaction || 4.6
    },
    // Use dashboard context chart data for consistency with KPI cards
    timeSeriesData: dashboardData?.chartData ? dashboardData.chartData.map(item => ({
      date: `2024-${item.month.split(' ')[0] === 'Aug' ? '08' : 
                   item.month.split(' ')[0] === 'Sep' ? '09' : 
                   item.month.split(' ')[0] === 'Oct' ? '10' : 
                   item.month.split(' ')[0] === 'Nov' ? '11' : 
                   item.month.split(' ')[0] === 'Dec' ? '12' : 
                   item.month.split(' ')[0] === 'Jan' ? '01' : 
                   item.month.split(' ')[0] === 'Feb' ? '02' : 
                   item.month.split(' ')[0] === 'Mar' ? '03' : 
                   item.month.split(' ')[0] === 'Apr' ? '04' : 
                   item.month.split(' ')[0] === 'May' ? '05' : 
                   item.month.split(' ')[0] === 'Jun' ? '06' : 
                   item.month.split(' ')[0] === 'Jul' ? '07' : '08'}-01`,
      revenue: item.revenue,
      customers: item.customers,
      orders: item.orders,
      conversions: item.conversions,
      traffic: Math.floor(item.customers * 4.2), // Estimated traffic based on customers
      bounceRate: Math.max(25, Math.min(50, 42 - (item.conversions - 5.8) * 2)) // Dynamic bounce rate
    })) : [
      { date: '2024-08-01', revenue: 3200000, customers: 12500, orders: 2850, conversions: 5.2, traffic: 52500, bounceRate: 42.1 },
      { date: '2024-09-01', revenue: 3392000, customers: 13125, orders: 2964, conversions: 5.5, traffic: 55125, bounceRate: 39.8 },
      { date: '2024-10-01', revenue: 3596800, customers: 13781, orders: 3083, conversions: 5.1, traffic: 57880, bounceRate: 44.2 },
      { date: '2024-11-01', revenue: 3812608, customers: 14470, orders: 3206, conversions: 5.8, traffic: 60774, bounceRate: 37.5 },
      { date: '2024-12-01', revenue: 4041364, customers: 15194, orders: 3334, conversions: 6.0, traffic: 63814, bounceRate: 35.2 },
      { date: '2025-01-01', revenue: 4284046, customers: 15953, orders: 3467, conversions: 5.9, traffic: 67003, bounceRate: 36.8 },
      { date: '2025-02-01', revenue: 4542089, customers: 16751, orders: 3606, conversions: 6.2, traffic: 70355, bounceRate: 33.5 },
      { date: '2025-03-01', revenue: 4816614, customers: 17589, orders: 3750, conversions: 6.1, traffic: 73874, bounceRate: 34.7 }
    ],
    geographicData: businessSummary?.geographic?.countries ? 
      businessSummary.geographic.countries.map(country => ({
        country: country.name,
        users: Math.floor(country.revenue / 186), // Estimated users based on revenue
        revenue: country.revenue,
        percentage: country.percentage,
        growth: country.growth
      })) : [
      { country: 'United States', users: 84147, revenue: 15651600, percentage: 36.6, growth: 14.5 },
      { country: 'Canada', users: 15658, revenue: 2912400, percentage: 6.8, growth: 17.2 },
      { country: 'United Kingdom', users: 22065, revenue: 4104000, percentage: 9.6, growth: 10.7 },
      { country: 'Germany', users: 18387, revenue: 3420000, percentage: 8.0, growth: 8.3 },
      { country: 'France', users: 14710, revenue: 2736000, percentage: 6.4, growth: 12.1 },
      { country: 'Japan', users: 11032, revenue: 2052000, percentage: 4.8, growth: 22.3 },
      { country: 'Australia', users: 7355, revenue: 1368000, percentage: 3.2, growth: 24.1 },
      { country: 'Others', users: 53065, revenue: 9872000, percentage: 23.0, growth: 18.9 }
    ],
    userSegments: dashboardData?.customerSegments || [
      { segment: 'New Customers', count: 23750, revenue: 7980000, avgValue: 336.00, color: '#10B981' },
      { segment: 'Returning Customers', count: 44060, revenue: 16840000, avgValue: 382.25, color: '#06B6D4' },
      { segment: 'VIP Customers', count: 8473, revenue: 6780000, avgValue: 800.50, color: '#8B5CF6' },
      { segment: 'At Risk', count: 8473, revenue: 1270000, avgValue: 150.00, color: '#F59E0B' }
    ],
    conversionFunnel: dashboardData?.conversionFunnel || [
      { stage: 'Visitors', count: 145000, percentage: 100, dropoff: 0 },
      { stage: 'Product Views', count: 101500, percentage: 70, dropoff: 30 },
      { stage: 'Add to Cart', count: 37700, percentage: 26, dropoff: 44 },
      { stage: 'Checkout Started', count: 18850, percentage: 13, dropoff: 50 },
      { stage: 'Payment Info', count: 13195, percentage: 9.1, dropoff: 30 },
      { stage: 'Purchase Complete', count: 8995, percentage: 6.2, dropoff: 32 }
    ],
    channelPerformance: [
      { channel: 'Organic Search', sessions: 52230, conversions: 3247, revenue: 587392, cpa: 21.40, roas: 4.8 },
      { channel: 'Paid Search', sessions: 31470, conversions: 2123, revenue: 424871, cpa: 42.20, roas: 4.2 },
      { channel: 'Social Media', sessions: 22847, conversions: 1447, revenue: 298472, cpa: 62.80, roas: 3.4 },
      { channel: 'Email', sessions: 18230, conversions: 2047, revenue: 387394, cpa: 16.90, roas: 5.8 },
      { channel: 'Direct', sessions: 15847, conversions: 1187, revenue: 256847, cpa: 10.30, roas: 7.2 },
      { channel: 'Referral', sessions: 10947, conversions: 823, revenue: 148472, cpa: 31.70, roas: 3.8 }
    ],
    deviceBreakdown: [
      { device: 'Desktop', sessions: 78847, percentage: 54.3, revenue: 1547392, avgSession: 265 },
      { device: 'Mobile', sessions: 55230, percentage: 38.2, revenue: 947293, avgSession: 195 },
      { device: 'Tablet', sessions: 16623, percentage: 7.5, revenue: 387394, avgSession: 340 }
    ],
    cohortAnalysis: [
      { cohort: 'Aug 2024', month0: 100, month1: 87, month2: 74, month3: 68, month4: 62, month5: 56 },
      { cohort: 'Sep 2024', month0: 100, month1: 89, month2: 76, month3: 70, month4: 64, month5: 58 },
      { cohort: 'Oct 2024', month0: 100, month1: 85, month2: 72, month3: 66, month4: 60, month5: null },
      { cohort: 'Nov 2024', month0: 100, month1: 88, month2: 75, month3: 69, month4: null, month5: null },
      { cohort: 'Dec 2024', month0: 100, month1: 86, month2: 73, month3: null, month4: null, month5: null },
      { cohort: 'Jan 2025', month0: 100, month1: 84, month2: null, month3: null, month4: null, month5: null }
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
      const now = new Date();
      setLastRefresh(now);
      setFormattedTime(formatTime(now));
      toast.success('Analytics data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleScheduleReport = () => {
    setShowScheduleModal(true);
  };

  const handleConfigureAlerts = () => {
    setShowAlertModal(true);
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
                  Comprehensive business intelligence with real-time insights
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                Last updated: {mounted && formattedTime ? formattedTime : '--:--:--'}
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
                  <button 
                    onClick={handleExport}
                    className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
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
              <h3 className="text-base font-semibold text-yellow-800 dark:text-yellow-200">
                Performance Alerts ({alerts.length})
              </h3>
            </div>
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-yellow-700 dark:text-yellow-300">{alert.message}</span>
                  <button 
                    onClick={handleConfigureAlerts}
                    className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 text-sm font-medium"
                  >
                    Configure Alert
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Enhanced KPI Overview - Using Dashboard Data Context (First 4 KPIs only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData && kpiData.slice(0, 4).map((kpi, index) => (
            <EnhancedKPICard
              key={index}
              {...kpi}
              index={index}
            />
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
              className="relative"
            >
              {/* Outer Box */}
              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 shadow-xl border border-green-200/50 dark:border-green-700/30">
                {/* Inner Box */}
                <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 dark:border-gray-700/50 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        Revenue & Customer Trends
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                        Multi-metric performance analysis with enhanced data insights
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                        <button
                          onClick={() => toggleSection('revenueChart')}
                          className="p-2 text-green-500 hover:text-green-700 dark:hover:text-green-300 transition-all duration-200 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transform hover:scale-105"
                        >
                          {expandedSections.revenueChart ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                        </button>
                        <button className="p-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transform hover:scale-105">
                          <RefreshCw className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transform hover:scale-105">
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
              
                  <div className={`${expandedSections.revenueChart ? 'h-96' : 'h-80'} transition-all duration-300`}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={analyticsData.timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#10B981" opacity={0.2} />
                        <XAxis 
                          dataKey="date" 
                          stroke="#059669"
                          fontSize={12}
                          tickFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <YAxis yAxisId="left" stroke="#059669" fontSize={12} />
                        <YAxis yAxisId="right" orientation="right" stroke="#0D9488" fontSize={12} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.98)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '12px',
                            color: '#1F2937',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                            fontSize: '14px',
                            fontWeight: '500'
                          }}
                          formatter={(value, name) => {
                            if (name === 'revenue') {
                              return [`$${value.toLocaleString()}`, 'Revenue'];
                            } else if (name === 'customers') {
                              return [value.toLocaleString(), 'Customers'];
                            } else if (name === 'orders') {
                              return [value.toLocaleString(), 'Orders'];
                            }
                            return [value, name];
                          }}
                          labelFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            });
                          }}
                        />
                        <defs>
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#059669" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="revenue"
                          fill="url(#revenueGradient)"
                          fillOpacity={0.6}
                          stroke="#059669"
                          strokeWidth={4}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="customers"
                          stroke="#0369A1"
                          strokeWidth={4}
                          dot={{ r: 6, fill: '#0369A1', strokeWidth: 2, stroke: '#FFFFFF' }}
                        />
                        <Bar yAxisId="right" dataKey="orders" fill="#7C3AED" opacity={0.8} radius={[4, 4, 0, 0]} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Geographic Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative"
          >
            {/* Outer Box */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 shadow-xl border border-blue-200/50 dark:border-blue-700/30">
              {/* Inner Box */}
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 dark:border-gray-700/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                        <Globe className="h-6 w-6 text-white" />
                      </div>
                      Geographic Distribution
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                      Global customer reach and market penetration
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                    <button
                      onClick={() => toggleSection('geoChart')}
                      className="p-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transform hover:scale-105"
                    >
                      {expandedSections.geoChart ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                    </button>
                    <button className="p-2 text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all duration-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transform hover:scale-105">
                      <RefreshCw className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {analyticsData.geographicData && analyticsData.geographicData.slice(0, 6).map((country, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg border border-blue-100/50 dark:border-blue-800/30 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center flex-1">
                        <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-md mr-3 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                          {country.country.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {country.country}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                            {country.users.toLocaleString()} users • +{country.growth}% growth
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          ${country.revenue.toLocaleString()}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          {country.percentage}% share
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Enhanced Geographic Stats */}
                <div className="mt-6 grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg p-4 border border-blue-200/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Global Reach</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">127 Countries</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Active presence</p>
                      </div>
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Globe className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Customer Segments & Conversion Funnel */}
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
              className="relative"
            >
              {/* Outer Box */}
              <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 shadow-xl border border-orange-200/50 dark:border-orange-700/30">
                {/* Inner Box */}
                <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 dark:border-gray-700/50 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg shadow-lg">
                          <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                        Channel Performance
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                        Revenue attribution and channel effectiveness analysis
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                        <button className="p-2 text-orange-500 hover:text-orange-700 dark:hover:text-orange-300 transition-all duration-200 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/30 transform hover:scale-105">
                          <RefreshCw className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 transition-all duration-200 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/30 transform hover:scale-105">
                          <Download className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-yellow-600 hover:text-yellow-800 dark:hover:text-yellow-400 transition-all duration-200 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/30 transform hover:scale-105">
                          <Filter className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
              
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.channelPerformance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F59E0B" opacity={0.2} />
                        <XAxis 
                          dataKey="channel" 
                          stroke="#D97706"
                          fontSize={12}
                          fontWeight={500}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis stroke="#D97706" fontSize={12} fontWeight={500} />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(245, 158, 11, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#FFFFFF',
                            boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
                          }}
                        />
                        <Bar 
                          dataKey="sessions" 
                          fill="url(#sessionsChannelGradient)" 
                          name="Sessions"
                          radius={[6, 6, 0, 0]} 
                          stroke="#F59E0B"
                          strokeWidth={1}
                        />
                        <Bar 
                          dataKey="conversions" 
                          fill="url(#conversionsChannelGradient)" 
                          name="Conversions"
                          radius={[6, 6, 0, 0]} 
                          stroke="#D97706"
                          strokeWidth={1}
                        />
                        <defs>
                          <linearGradient id="sessionsChannelGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.9}/>
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.6}/>
                          </linearGradient>
                          <linearGradient id="conversionsChannelGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D97706" stopOpacity={0.9}/>
                            <stop offset="95%" stopColor="#D97706" stopOpacity={0.6}/>
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Enhanced Channel Stats */}
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-lg p-4 border border-orange-200/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">Best ROI</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">Email</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">5.1x return</p>
                        </div>
                        <div className="p-2 bg-orange-500 rounded-lg">
                          <Target className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-lg p-4 border border-amber-200/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">Highest Volume</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">Organic</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">45.2k sessions</p>
                        </div>
                        <div className="p-2 bg-amber-500 rounded-lg">
                          <Search className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-200/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-yellow-600 dark:text-yellow-500 uppercase tracking-wide">Growth Leader</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">Social</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">+45.2% MoM</p>
                        </div>
                        <div className="p-2 bg-yellow-500 rounded-lg">
                          <Share className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Device Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="relative"
          >
            {/* Outer Box */}
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 shadow-xl border border-purple-200/50 dark:border-purple-700/30">
              {/* Inner Box */}
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 dark:border-gray-700/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg shadow-lg">
                        <Smartphone className="h-6 w-6 text-white" />
                      </div>
                      Device Breakdown
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                      User sessions and engagement by device category
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                    <button className="p-2 text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transform hover:scale-105">
                      <RefreshCw className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-pink-500 hover:text-pink-700 dark:hover:text-pink-300 transition-all duration-200 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/30 transform hover:scale-105">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {analyticsData.deviceBreakdown.map((device, index) => (
                    <div key={index} className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-lg p-4 border border-purple-100/50 dark:border-purple-800/30 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 shadow-sm ${
                            device.device === 'Mobile' ? 'bg-gradient-to-r from-purple-500 to-pink-600' :
                            device.device === 'Desktop' ? 'bg-gradient-to-r from-pink-500 to-rose-600' :
                            'bg-gradient-to-r from-rose-500 to-purple-600'
                          }`}>
                            {device.device === 'Mobile' && <Smartphone className="h-5 w-5 text-white" />}
                            {device.device === 'Desktop' && <Monitor className="h-5 w-5 text-white" />}
                            {device.device === 'Tablet' && <Tablet className="h-5 w-5 text-white" />}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white">
                              {device.device}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                              {device.sessions.toLocaleString()} sessions • {device.avgSession}s avg
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {device.percentage}%
                          </div>
                          <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                            ${device.revenue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            device.device === 'Mobile' ? 'bg-gradient-to-r from-purple-500 to-pink-600' :
                            device.device === 'Desktop' ? 'bg-gradient-to-r from-pink-500 to-rose-600' :
                            'bg-gradient-to-r from-rose-500 to-purple-600'
                          }`}
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Enhanced Device Stats */}
                <div className="mt-6 grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-200/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">Mobile Dominance</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">52.3% Traffic</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Leading platform</p>
                      </div>
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Smartphone className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Cohort Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="relative"
        >
          {/* Outer Box */}
          <div className="bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 dark:from-gray-900 dark:via-cyan-900/20 dark:to-teal-900/20 rounded-2xl p-6 shadow-xl border border-cyan-200/50 dark:border-cyan-700/30">
            {/* Inner Box */}
            <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-lg shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    Cohort Retention Analysis
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                    Customer retention patterns and lifecycle analysis
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                    <button className="p-2 text-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-300 transition-all duration-200 rounded-lg hover:bg-cyan-50 dark:hover:bg-cyan-900/30 transform hover:scale-105">
                      <RefreshCw className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-teal-500 hover:text-teal-700 dark:hover:text-teal-300 transition-all duration-200 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/30 transform hover:scale-105">
                      <Download className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => toggleSection('cohortAnalysis')}
                      className="p-2 text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-200 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transform hover:scale-105"
                    >
                      {expandedSections.cohortAnalysis ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
          
              {!expandedSections.cohortAnalysis ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-cyan-200 dark:border-cyan-700">
                        <th className="text-left py-3 px-4 font-bold text-gray-900 dark:text-white bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-l-lg">
                          Cohort
                        </th>
                        {[0, 1, 2, 3, 4, 5].map(month => (
                          <th key={month} className="text-center py-3 px-4 font-bold text-gray-900 dark:text-white bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20">
                            Month {month}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.cohortAnalysis.map((cohort, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gradient-to-r hover:from-cyan-50/30 hover:to-teal-50/30 dark:hover:from-cyan-900/10 dark:hover:to-teal-900/10 transition-all duration-200">
                          <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">
                            {cohort.cohort}
                          </td>
                          {[cohort.month0, cohort.month1, cohort.month2, cohort.month3, cohort.month4, cohort.month5].map((value, monthIndex) => (
                            <td key={monthIndex} className="py-4 px-4 text-center">
                              {value !== null ? (
                                <span 
                                  className={`inline-block px-3 py-2 rounded-lg text-sm font-bold ${
                                    value >= 80 ? 'bg-transparent text-emerald-600 dark:text-emerald-400' :
                                    value >= 60 ? 'bg-transparent text-amber-600 dark:text-amber-400' :
                                    'bg-transparent text-red-600 dark:text-red-400'
                                  }`}
                                >
                                  {value}%
                                </span>
                              ) : (
                                <span className="text-gray-400 font-medium">-</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Enhanced Retention Stats */}
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-lg p-4 border border-cyan-200/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">Avg Retention</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">68.4%</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Month 1 retention</p>
                        </div>
                        <div className="p-2 bg-cyan-500 rounded-lg">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-lg p-4 border border-teal-200/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wide">Best Cohort</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">Sep 2024</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">85% retention</p>
                        </div>
                        <div className="p-2 bg-teal-500 rounded-lg">
                          <TrendingUp className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-lg p-4 border border-emerald-200/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">LTV Impact</p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">+31.7%</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">vs industry avg</p>
                        </div>
                        <div className="p-2 bg-emerald-500 rounded-lg">
                          <DollarSign className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Click to expand cohort analysis
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions & Customization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative"
        >
          <QuickActionDiv variant="analytics" />
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
                <div key={report.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200">
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

        {/* Modals */}
        <AnimatePresence>
          {showExportModal && (
            <DataExportModal 
              isOpen={showExportModal} 
              onClose={() => setShowExportModal(false)} 
              data={analyticsData}
              title="Export Analytics Data"
            />
          )}
          
          {showScheduleModal && (
            <ScheduleReportModal 
              isOpen={showScheduleModal} 
              onClose={() => setShowScheduleModal(false)} 
            />
          )}
          
          {showAlertModal && (
            <AlertConfigModal 
              isOpen={showAlertModal} 
              onClose={() => setShowAlertModal(false)} 
              currentThresholds={alertThresholds}
              onSave={setAlertThresholds}
            />
          )}
        </AnimatePresence>
        
        {/* Quick Actions Modals */}
        <QuickActionsModals />
      </div>
    </EnhancedDashboardLayout>
  );
};

export default UnifiedAnalyticsDashboard;