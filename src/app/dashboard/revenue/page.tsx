'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  BarChart3,
  Target,
  Calendar,
  Download,
  RefreshCw,
  Settings,
  Filter,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Repeat,
  FileText,
  Mail,
  Calendar as CalendarIcon
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts'
import EnhancedDashboardLayout from '@/components/dashboard/enhanced-dashboard-layout'
import { EnhancedKPICard } from '@/components/dashboard/enhanced-kpi-card'
import { dashboardData, primaryKPIs, secondaryKPIs, additionalKPIs } from '@/lib/dummy-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface RevenueKPI {
  title: string
  value: string
  change: number
  trend: 'up' | 'down' | 'neutral'
  icon: any
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'orange' | 'indigo' | 'emerald' | 'amber' | 'cyan' | 'teal'
  description: string
}

// Utility function to format numbers consistently (prevents hydration mismatch)
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num)
}

export default function RevenueAnalyticsPage() {
  const { user, userProfile } = useAuth()
  const [timeRange, setTimeRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [forecastRange, setForecastRange] = useState('3m')
  
  // Use centralized data from dashboardData
  const forecastData = dashboardData.chartData?.revenue?.map(item => ({
    month: item.month,
    actual: item.revenue,
    forecast: item.revenue * 1.1
  }))

  const revenueBySegment = dashboardData.customerSegments?.map(segment => ({
    name: segment.name,
    value: segment.revenue,
    percentage: segment.percentage
  })) || []

  const topProducts = dashboardData.topProducts?.slice(0, 5) || []

  const revenueBySource = [
    { name: 'Direct Sales', value: 45, color: '#3B82F6' },
    { name: 'Online', value: 30, color: '#10B981' },
    { name: 'Partners', value: 15, color: '#F59E0B' },
    { name: 'Referrals', value: 10, color: '#EF4444' }
  ]

  const topServices = [
    { name: 'Premium Support', revenue: 125000, growth: 15.2 },
    { name: 'Consulting', revenue: 98000, growth: 8.7 },
    { name: 'Training', revenue: 67000, growth: 22.1 },
    { name: 'Implementation', revenue: 45000, growth: -3.2 }
  ]

  const topChannels = [
    { name: 'Enterprise Sales', revenue: 450000, conversion: 12.5 },
    { name: 'SMB Direct', revenue: 280000, conversion: 8.3 },
    { name: 'Partner Channel', revenue: 180000, conversion: 6.7 },
    { name: 'Online Self-Service', revenue: 95000, conversion: 15.2 }
  ]

  const conversionMetrics = [
    { stage: 'Lead', count: 2450, rate: 100 },
    { stage: 'Qualified', count: 1225, rate: 50 },
    { stage: 'Proposal', count: 490, rate: 20 },
    { stage: 'Negotiation', count: 245, rate: 10 },
    { stage: 'Closed Won', count: 147, rate: 6 }
  ]

  const efficiencyMetrics = [
    { metric: 'Customer Acquisition Cost', value: '$2,450', change: -8.5, target: '$2,200' },
    { metric: 'Customer Lifetime Value', value: '$24,500', change: 12.3, target: '$25,000' },
    { metric: 'Revenue per Employee', value: '$145K', change: 6.7, target: '$150K' },
    { metric: 'Sales Cycle Length', value: '45 days', change: -12.1, target: '40 days' }
  ]

  // Revenue KPIs using centralized data
  const revenueKPIs: RevenueKPI[] = [
    {
      title: 'Total Revenue',
      value: `$${formatNumber(dashboardData.businessSummary?.totalRevenue || 0)}`,
      change: 12.5,
      trend: 'up',
      icon: DollarSign,
      color: 'blue',
      description: 'Monthly recurring revenue'
    },
    {
      title: 'Revenue Growth',
      value: '+15.8%',
      change: 2.3,
      trend: 'up',
      icon: TrendingUp,
      color: 'green',
      description: 'Year-over-year growth'
    },
    {
      title: 'Average Deal Size',
      value: `$${formatNumber(dashboardData.businessSummary?.averageOrderValue || 0)}`,
      change: -3.2,
      trend: 'down',
      icon: Target,
      color: 'purple',
      description: 'Per customer transaction'
    },
    {
      title: 'Forecast Accuracy',
      value: '87%',
      change: 5.1,
      trend: 'up',
      icon: BarChart3,
      color: 'indigo',
      description: 'Prediction confidence'
    }
  ]

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastUpdated(new Date())
      toast.success('Revenue data refreshed successfully')
    } catch (error) {
      toast.error('Failed to refresh data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    toast.success('Revenue report exported successfully')
  }

  useEffect(() => {
    setLastUpdated(new Date())
  }, [])

  return (
    <EnhancedDashboardLayout>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Revenue Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg font-medium">
                  Comprehensive revenue insights and forecasting
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-600 dark:text-gray-400">Live Data</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Updated {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400">
                      {dashboardData.businessSummary?.totalCustomers?.toLocaleString() || '0'} customers
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                  className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button onClick={handleExport} variant="outline" size="sm" className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Top-level KPIs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {revenueKPIs.map((kpi, index) => (
              <EnhancedKPICard key={index} {...kpi} />
            ))}
          </div>
        </motion.div>

        {/* Revenue Trends & Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  Revenue Trends & Forecast
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                  Historical performance and AI-powered predictions
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Select value={forecastRange} onValueChange={setForecastRange}>
                  <SelectTrigger className="w-[120px] bg-white/50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3m">3 months</SelectItem>
                    <SelectItem value="6m">6 months</SelectItem>
                    <SelectItem value="12m">12 months</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                  <Button size="sm" variant="ghost" className="h-8 px-3">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 px-3">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}K`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: any, name: string) => [
                      `$${value}K`,
                      name === 'actual' ? 'Actual Revenue' : 'Forecasted Revenue'
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="url(#colorActual)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="forecast"
                    stackId="2"
                    stroke="#8b5cf6"
                    fill="url(#colorForecast)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <ReferenceLine x="Sep" stroke="#ef4444" strokeDasharray="2 2" />
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Forecast Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Next Month Forecast
                    </p>
                    <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      $2.4M
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      +12% vs current
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse opacity-20"></div>
                    <TrendingUp className="h-8 w-8 text-blue-500 relative z-10" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      AI Confidence
                    </p>
                    <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                      87%
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      High accuracy
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-400 rounded-full animate-pulse opacity-20"></div>
                    <BarChart3 className="h-8 w-8 text-purple-500 relative z-10" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      Growth Trend
                    </p>
                    <p className="text-lg font-bold text-green-900 dark:text-green-100">
                      +24.8%
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      3 month outlook
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-pulse opacity-20"></div>
                    <Target className="h-8 w-8 text-green-500 relative z-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Revenue Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  Revenue Breakdown & Analysis
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">
                  Detailed revenue segmentation and performance metrics
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 rounded-lg p-1">
                  <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                    Products
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 px-3 text-xs bg-white dark:bg-gray-600">
                    Services
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 px-3 text-xs">
                    Channels
                  </Button>
                </div>
                <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-700/50 rounded-lg p-2">
                  <Button size="sm" variant="ghost" className="h-8 px-3">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 px-3">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue by Segment Chart */}
              <div className="h-[350px]">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Revenue by Customer Segment
                </h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueBySegment}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueBySegment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`$${value}K`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top Products & Services */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Top Performing Products
                </h4>
                <div className="space-y-3">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          ${product.revenue.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {product.units} units
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h4 className="text-lg font-semibold text-gray-900 dark:text-white pt-4">
                  Service Revenue
                </h4>
                <div className="space-y-3">
                  {topServices.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {service.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Service offering
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          ${service.revenue.toLocaleString()}
                        </div>
                        <div className={`text-sm ${service.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {service.growth >= 0 ? '+' : ''}{service.growth}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    ${formatNumber(dashboardData.businessSummary?.totalRevenue || 0)}
                  </div>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400">
                    Total Revenue
                  </div>
                </div>
                <div className="text-center bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg p-3 border border-teal-200 dark:border-teal-800">
                  <div className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                    +15.8%
                  </div>
                  <div className="text-sm text-teal-600 dark:text-teal-400">
                    Growth Rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </EnhancedDashboardLayout>
  )
}