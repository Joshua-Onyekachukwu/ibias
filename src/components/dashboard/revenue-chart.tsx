'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  TrendingUp,
  Calendar,
  Download,
  Users,
  DollarSign,
  ShoppingCart,
  Target,
  BarChart3,
  Activity,
  Settings,
  RefreshCw
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ChartData {
  month: string
  revenue: number
  customers: number
  orders: number
  conversions: number
  profit?: number
  expenses?: number
}

interface LiveData {
  revenue?: number
  customers?: number
  orders?: number
  conversionRate?: number
}

interface RevenueChartProps {
  liveData?: LiveData
  className?: string
}

interface Metric {
  key: string
  label: string
  icon: any
  color: string
  format?: (value: number) => string
}

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316']

// Sample data - in real app this would come from API
const generateChartData = (timeframe: string): ChartData[] => {
  const baseData = [
    { month: 'Jan', revenue: 45000, customers: 1200, orders: 890, conversions: 3.2, profit: 18000, expenses: 27000 },
    { month: 'Feb', revenue: 52000, customers: 1350, orders: 980, conversions: 3.5, profit: 22000, expenses: 30000 },
    { month: 'Mar', revenue: 48000, customers: 1280, orders: 920, conversions: 3.1, profit: 19000, expenses: 29000 },
    { month: 'Apr', revenue: 61000, customers: 1560, orders: 1150, conversions: 3.8, profit: 26000, expenses: 35000 },
    { month: 'May', revenue: 55000, customers: 1420, orders: 1050, conversions: 3.4, profit: 23000, expenses: 32000 },
    { month: 'Jun', revenue: 67000, customers: 1680, orders: 1280, conversions: 4.1, profit: 29000, expenses: 38000 },
    { month: 'Jul', revenue: 72000, customers: 1850, orders: 1420, conversions: 4.3, profit: 32000, expenses: 40000 },
    { month: 'Aug', revenue: 69000, customers: 1780, orders: 1380, conversions: 4.0, profit: 30000, expenses: 39000 },
    { month: 'Sep', revenue: 78000, customers: 1950, orders: 1580, conversions: 4.5, profit: 35000, expenses: 43000 },
    { month: 'Oct', revenue: 85000, customers: 2100, orders: 1720, conversions: 4.8, profit: 38000, expenses: 47000 },
    { month: 'Nov', revenue: 92000, customers: 2280, orders: 1890, conversions: 5.1, profit: 42000, expenses: 50000 },
    { month: 'Dec', revenue: 98000, customers: 2450, orders: 2050, conversions: 5.3, profit: 45000, expenses: 53000 }
  ]

  return timeframe === '6m' ? baseData.slice(-6) : baseData
}

export default function RevenueChart({ liveData, className }: RevenueChartProps) {
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area')
  const [timeframe, setTimeframe] = useState('12m')
  const [selectedMetric, setSelectedMetric] = useState('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const metrics: Metric[] = [
    { 
      key: 'all', 
      label: 'All Metrics', 
      icon: BarChart3, 
      color: '#3B82F6',
      format: (value) => value.toLocaleString()
    },
    { 
      key: 'revenue', 
      label: 'Revenue', 
      icon: DollarSign, 
      color: '#2563EB',
      format: (value) => `$${value.toLocaleString()}`
    },
    { 
      key: 'customers', 
      label: 'Customers', 
      icon: Users, 
      color: '#7C3AED',
      format: (value) => value.toLocaleString()
    },
    { 
      key: 'orders', 
      label: 'Orders', 
      icon: ShoppingCart, 
      color: '#4F46E5',
      format: (value) => value.toLocaleString()
    },
    { 
      key: 'conversions', 
      label: 'Conversions', 
      icon: Target, 
      color: '#6366F1',
      format: (value) => `${value}%`
    },
    { 
      key: 'profit', 
      label: 'Profit', 
      icon: TrendingUp, 
      color: '#8B5CF6',
      format: (value) => `$${value.toLocaleString()}`
    }
  ]

  // Memoized data transformation
  const data = useMemo(() => {
    const chartData = generateChartData(timeframe)
    
    // Update the last month with live data if available
    if (liveData && chartData.length > 0) {
      const lastMonth = { ...chartData[chartData.length - 1] }
      if (liveData.revenue) lastMonth.revenue = liveData.revenue
      if (liveData.customers) lastMonth.customers = liveData.customers
      if (liveData.orders) lastMonth.orders = liveData.orders
      if (liveData.conversionRate) lastMonth.conversions = liveData.conversionRate
      
      return [...chartData.slice(0, -1), lastMonth]
    }
    
    return chartData
  }, [timeframe, liveData])

  const getMetricColor = useCallback((metric: string) => {
    const metricObj = metrics.find(m => m.key === metric)
    return metricObj?.color || '#3B82F6'
  }, [metrics])

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
    toast.success('Chart data refreshed')
  }, [])

  const handleExport = useCallback(() => {
    toast.success('Exporting chart data...')
    // Implement export functionality
  }, [])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => {
            const metric = metrics.find(m => m.key === entry.dataKey)
            const formatValue = metric?.format || ((value) => value.toLocaleString())
            return (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {metric?.label || entry.dataKey}: 
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatValue(entry.value)}
                </span>
              </div>
            )
          })}
        </div>
      )
    }
    return null
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    }

    if (selectedMetric === 'all') {
      switch (chartType) {
        case 'area':
          return (
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.6} className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#9CA3AF" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stackId="1" 
                stroke={getMetricColor('revenue')} 
                fill={getMetricColor('revenue')} 
                fillOpacity={0.3} 
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stackId="2" 
                stroke={getMetricColor('profit')} 
                fill={getMetricColor('profit')} 
                fillOpacity={0.3} 
              />
            </AreaChart>
          )
        case 'bar':
          return (
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.6} className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#9CA3AF" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill={getMetricColor('revenue')} radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill={getMetricColor('profit')} radius={[4, 4, 0, 0]} />
            </BarChart>
          )
        default:
          return (
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.6} className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#9CA3AF" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke={getMetricColor('revenue')} 
                strokeWidth={3} 
                dot={{ r: 4, fill: getMetricColor('revenue') }} 
                activeDot={{ r: 6, stroke: getMetricColor('revenue'), strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="customers" 
                stroke={getMetricColor('customers')} 
                strokeWidth={3} 
                dot={{ r: 4, fill: getMetricColor('customers') }} 
                activeDot={{ r: 6, stroke: getMetricColor('customers'), strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke={getMetricColor('orders')} 
                strokeWidth={3} 
                dot={{ r: 4, fill: getMetricColor('orders') }} 
                activeDot={{ r: 6, stroke: getMetricColor('orders'), strokeWidth: 2 }}
              />
            </LineChart>
          )
      }
    } else {
      const color = getMetricColor(selectedMetric)
      switch (chartType) {
        case 'area':
          return (
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.6} className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#9CA3AF" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke={color}
                fill={color}
                fillOpacity={0.3}
                strokeWidth={3}
              />
            </AreaChart>
          )
        case 'bar':
          return (
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.6} className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#9CA3AF" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey={selectedMetric} 
                fill={color} 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )
        default:
          return (
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.6} className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#9CA3AF" 
                fontSize={12}
                tick={{ fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke={color} 
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          )
      }
    }
  }

  return (
    <motion.div 
      className={cn(
        "bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-0 overflow-hidden",
        "bg-gradient-to-br from-white via-gray-50/30 to-white",
        "dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Border Accent */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />
      
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Revenue Overview
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Track your key performance indicators with validated live data
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Business Metrics Overview
            </p>
            {liveData && (
              <div className="flex items-center mt-3">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse mr-2" />
                <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                  Live data active
                </span>
                <div className="ml-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                    Real-time
                  </span>
                </div>
              </div>
            )}
          </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Chart Type Selector */}
          <div className="flex items-center space-x-1 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-1.5 border border-gray-200/50 dark:border-gray-700/50">
            {(['area', 'line', 'bar'] as const).map((type) => (
              <motion.button
                key={type}
                onClick={() => setChartType(type)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "px-4 py-2 text-sm rounded-lg transition-all duration-200 capitalize font-medium",
                  chartType === type 
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md border border-blue-200/50 dark:border-blue-800/50' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
                )}
              >
                {type}
              </motion.button>
            ))}
          </div>
          
          {/* Metric Selector */}
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-44 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {metrics.map((metric) => {
                const Icon = metric.icon
                return (
                  <SelectItem key={metric.key} value={metric.key}>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" style={{ color: metric.color }} />
                      <span>{metric.label}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          
          {/* Timeframe Selector */}
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-36 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="12m">12 Months</SelectItem>
            </SelectContent>
          </Select>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800"
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        </div>

        {/* Chart Container */}
        <div className="relative mt-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/10 dark:to-purple-950/10 rounded-xl" />
          <div className="relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Enhanced Legend */}
        {selectedMetric === 'all' && (
          <div className="mt-8 p-6 bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Chart Legend</h4>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {metrics.slice(1, 4).map((metric) => {
                const Icon = metric.icon
                return (
                  <motion.div 
                    key={metric.key} 
                    className="flex items-center space-x-3 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-gray-200/50 dark:border-gray-700/50"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div 
                      className="w-4 h-4 rounded-full shadow-sm" 
                      style={{ backgroundColor: metric.color }}
                    />
                    <Icon className="h-5 w-5" style={{ color: metric.color }} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {metric.label}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Chart skeleton loader
export function RevenueChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6",
      className
    )}>
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
          </div>
          <div className="flex space-x-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
          </div>
        </div>
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  )
}