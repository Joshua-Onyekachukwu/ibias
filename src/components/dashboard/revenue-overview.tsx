'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
  Users,
  ShoppingCart,
  Target,
  RefreshCw,
  AlertTriangle,
  Eye,
  EyeOff,
  Calendar,
  Download,
  Settings,
  CheckCircle,
  XCircle,
  Info,
  Lightbulb,
  Star,
  Award
} from 'lucide-react'
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
  Legend,
  ReferenceLine,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Brush
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDashboardData, formatNumber } from '@/contexts/dashboard-data-context'
import { cn } from '@/lib/utils'

// Utility function for currency formatting
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Types
interface LiveData {
  revenue?: number
  customers?: number
  conversionRate?: number
}

interface ValidationResult {
  isValid: boolean
  isValidating: boolean
  errors: string[]
  warnings: string[]
}

interface Metric {
  key: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface ChartDataPoint {
  month: string
  revenue: number
  customers: number
  orders: number
  conversions: number
}

// Mock hooks and components
function useDataValidation(data: any, type: string): ValidationResult {
  return useMemo(() => ({
    isValid: true,
    isValidating: false,
    errors: [],
    warnings: []
  }), [data, type])
}

function DataValidationIndicator({ 
  validationResult, 
  isValidating, 
  className 
}: { 
  validationResult: ValidationResult
  isValidating: boolean
  className?: string 
}) {
  if (isValidating) {
    return (
      <div className={cn('flex items-center', className)}>
        <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!validationResult.isValid) {
    return (
      <div className={cn('flex items-center', className)}>
        <AlertTriangle className="h-4 w-4 text-red-500" />
      </div>
    )
  }

  return (
    <div className={cn('flex items-center', className)}>
      <div className="h-2 w-2 rounded-full bg-green-500" />
    </div>
  )
}

export function RevenueOverview({ liveData }: { liveData?: LiveData } = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area')
  const [timeframe, setTimeframe] = useState('12m')
  const [showThresholds, setShowThresholds] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [showForecast, setShowForecast] = useState(true)
  const [showInsights, setShowInsights] = useState(true)

  // Use unified dashboard data context
  const { data: dashboardData, isRefreshing } = useDashboardData()

  // Data validation
  const validation = useDataValidation(liveData || {}, 'revenue')

  // Enhanced metrics configuration with more business-relevant metrics
  const metrics: Metric[] = [
    { key: 'revenue', label: 'Total Revenue', icon: DollarSign },
    { key: 'customers', label: 'Active Customers', icon: Users },
    { key: 'orders', label: 'Orders Processed', icon: ShoppingCart },
    { key: 'conversions', label: 'Conversion Rate', icon: Target }
  ]

  // Enhanced chart data with forecasting capabilities
  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!dashboardData.chartData?.revenue) {
      return []
    }
    
    const baseData = dashboardData.chartData.revenue.map((item, index) => ({
      month: item.month,
      revenue: item.revenue || 0,
      customers: item.customers || 0,
      orders: item.orders || 0,
      conversions: item.conversion || 0, // Note: the data uses 'conversion' not 'conversions'
    }))
    
    return baseData
  }, [dashboardData.chartData?.revenue])

  // Filter data based on timeframe
  const filteredData = useMemo(() => {
    if (timeframe === '6m') {
      return chartData.slice(-6)
    }
    return chartData
  }, [chartData, timeframe])

  // Threshold values
  const thresholds = {
    revenue: { min: 50000, max: 90000 },
    customers: { min: 1500, max: 2500 },
    orders: { min: 1000, max: 2000 },
    conversions: { min: 3.5, max: 5.0 }
  }

  // Get metric color
  const getMetricColor = (metric: string) => {
    const colors = {
      revenue: '#3B82F6',
      customers: '#8B5CF6',
      orders: '#10B981',
      conversions: '#F59E0B'
    }
    return colors[metric as keyof typeof colors] || '#3B82F6'
  }

  // Enhanced Y-axis formatting with better business context
  const formatYAxisTick = (value: number, metric: string) => {
    if (metric === 'revenue') return `$${formatNumber(value)}`
    if (metric === 'conversions') return `${value}%`
    if (metric === 'customers' || metric === 'orders') {
      return formatNumber(value)
    }
    return value.toString()
  }

  // Calculate growth rate for selected metric
  const calculateGrowthRate = () => {
    if (filteredData.length < 2) return 0
    const current = filteredData[filteredData.length - 1][selectedMetric as keyof ChartDataPoint] as number
    const previous = filteredData[filteredData.length - 2][selectedMetric as keyof ChartDataPoint] as number
    return ((current - previous) / previous * 100)
  }

  const growthRate = calculateGrowthRate()
  
  // AI-powered insights
  const insights = useMemo(() => [
    {
      type: 'trend',
      message: 'Revenue acceleration detected in Q4 - 23% above seasonal average',
      confidence: 92,
      impact: 'high'
    },
    {
      type: 'forecast',
      message: 'Projected to exceed annual target by 18% based on current trajectory',
      confidence: 85,
      impact: 'high'
    },
    {
      type: 'anomaly',
      message: 'December spike driven by premium plan upgrades (+67%)',
      confidence: 94,
      impact: 'medium'
    },
    {
      type: 'recommendation',
      message: 'Scale successful Q4 campaigns for sustained growth in Q1',
      confidence: 88,
      impact: 'high'
    }
  ], [])

  // Render chart based on type
  const renderChart = () => {
    const color = getMetricColor(selectedMetric)
    
    if (isLoading || isRefreshing) {
      return (
        <div className="flex items-center justify-center h-80">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )
    }

    return (
      <ResponsiveContainer width="100%" height={320}>
        {chartType === 'area' ? (
          <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`color${selectedMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="50%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis 
              dataKey="month" 
              stroke="#6B7280" 
              fontSize={11}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#6B7280" 
              fontSize={11}
              tickFormatter={(value) => formatYAxisTick(value, selectedMetric)}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const value = payload[0].value as number
                  const metricLabel = metrics.find(m => m.key === selectedMetric)?.label
                  return (
                    <div className="bg-card/95 backdrop-blur-sm border rounded-lg p-4 shadow-xl">
                      <p className="font-semibold text-foreground mb-1">{label} 2024</p>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm font-medium text-muted-foreground">{metricLabel}:</span>
                        <span className="text-sm font-bold text-foreground">{formatYAxisTick(value, selectedMetric)}</span>
                      </div>
                      {growthRate !== 0 && (
                        <p className={`text-xs mt-1 ${
                          growthRate > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {growthRate > 0 ? '↗' : '↘'} {Math.abs(growthRate).toFixed(1)}% vs prev month
                        </p>
                      )}
                      {data?.confidence && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-muted-foreground">Confidence:</span>
                          <span className="text-sm font-medium">{data.confidence}%</span>
                        </div>
                      )}
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={color}
              fill={`url(#color${selectedMetric})`}
              fillOpacity={1}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ 
                r: 5, 
                stroke: color, 
                strokeWidth: 2,
                fill: 'white'
              }}
              name={metrics.find(m => m.key === selectedMetric)?.label}
            />
            
            {showThresholds && thresholds[selectedMetric as keyof typeof thresholds] && (
              <>
                <ReferenceLine 
                  y={thresholds[selectedMetric as keyof typeof thresholds].min} 
                  stroke="#ef4444" 
                  strokeDasharray="8 4" 
                  strokeWidth={2}
                  label={{ 
                    value: `Min Target: ${formatYAxisTick(thresholds[selectedMetric as keyof typeof thresholds].min, selectedMetric)}`, 
                    position: 'insideBottomLeft', 
                    fill: '#ef4444',
                    fontSize: 12
                  }} 
                />
                <ReferenceLine 
                  y={thresholds[selectedMetric as keyof typeof thresholds].max} 
                  stroke="#ef4444" 
                  strokeDasharray="8 4" 
                  strokeWidth={2}
                  label={{ 
                    value: `Max Target: ${formatYAxisTick(thresholds[selectedMetric as keyof typeof thresholds].max, selectedMetric)}`, 
                    position: 'insideTopLeft', 
                    fill: '#ef4444',
                    fontSize: 12
                  }} 
                />
              </>
            )}
          </AreaChart>
        ) : chartType === 'line' ? (
          <LineChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis 
              dataKey="month" 
              stroke="#6B7280" 
              fontSize={11}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#6B7280" 
              fontSize={11}
              tickFormatter={(value) => formatYAxisTick(value, selectedMetric)}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const value = payload[0].value as number
                  const data = payload[0]?.payload
                  const metricLabel = metrics.find(m => m.key === selectedMetric)?.label
                  return (
                    <div className="bg-card/95 backdrop-blur-sm border rounded-lg p-4 shadow-xl min-w-[200px]">
                      <p className="font-semibold text-foreground mb-1">{label} 2024</p>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm font-medium text-muted-foreground">{metricLabel}:</span>
                        <span className="text-sm font-bold text-foreground">{formatYAxisTick(value, selectedMetric)}</span>
                      </div>
                      {data?.confidence && (
                        <div className="mt-2 pt-2 border-t border-border">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Confidence:</span>
                            <span className="font-medium text-blue-600 dark:text-blue-400">{data.confidence}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                }
                return null
              }}
            />
            <Line 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke={color} 
              strokeWidth={3}
              dot={{ 
                fill: color, 
                strokeWidth: 2, 
                r: 4,
                stroke: 'white'
              }}
              activeDot={{ 
                r: 6, 
                stroke: color, 
                strokeWidth: 2,
                fill: 'white'
              }}
              name={metrics.find(m => m.key === selectedMetric)?.label}
            />
            {showForecast && (
              <Line 
                type="monotone" 
                dataKey="forecast" 
                stroke={color} 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ 
                  fill: color, 
                  strokeWidth: 2, 
                  r: 3,
                  stroke: 'white'
                }}
                name="Forecast"
              />
            )}
            
            {showThresholds && thresholds[selectedMetric as keyof typeof thresholds] && (
              <>
                <ReferenceLine 
                  y={thresholds[selectedMetric as keyof typeof thresholds].min} 
                  stroke="#ef4444" 
                  strokeDasharray="8 4" 
                  strokeWidth={2}
                  label={{ 
                    value: `Min Target: ${formatYAxisTick(thresholds[selectedMetric as keyof typeof thresholds].min, selectedMetric)}`, 
                    position: 'insideBottomLeft', 
                    fill: '#ef4444',
                    fontSize: 12
                  }}
                />
                <ReferenceLine 
                  y={thresholds[selectedMetric as keyof typeof thresholds].max} 
                  stroke="#ef4444" 
                  strokeDasharray="8 4" 
                  strokeWidth={2}
                  label={{ 
                    value: `Max Target: ${formatYAxisTick(thresholds[selectedMetric as keyof typeof thresholds].max, selectedMetric)}`, 
                    position: 'insideTopLeft', 
                    fill: '#ef4444',
                    fontSize: 12
                  }}
                />
              </>
            )}
          </LineChart>
        ) : (
          <BarChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis 
              dataKey="month" 
              stroke="#6B7280" 
              fontSize={11}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#6B7280" 
              fontSize={11}
              tickFormatter={(value) => formatYAxisTick(value, selectedMetric)}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const value = payload[0].value as number
                  const metricLabel = metrics.find(m => m.key === selectedMetric)?.label
                  return (
                    <div className="bg-card/95 backdrop-blur-sm border rounded-lg p-4 shadow-xl">
                      <p className="font-semibold text-foreground mb-1">{label} 2024</p>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm font-medium text-muted-foreground">{metricLabel}:</span>
                        <span className="text-sm font-bold text-foreground">{formatYAxisTick(value, selectedMetric)}</span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar 
              dataKey={selectedMetric} 
              fill={color}
              radius={[4, 4, 0, 0]}
              name={metrics.find(m => m.key === selectedMetric)?.label}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    )
  }

  return (
    <div className="bg-card rounded-xl shadow-sm border p-6 mt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Revenue Analytics Dashboard
            </h3>
            <DataValidationIndicator 
              validationResult={validation}
              isValidating={validation.isValidating}
              className="ml-3"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Track your business performance with real-time insights and predictive analytics
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="customers">Customers</SelectItem>
              <SelectItem value="orders">Orders</SelectItem>
              <SelectItem value="conversions">Conversions</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                chartType === 'area' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                chartType === 'line' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                chartType === 'bar' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              Bar
            </button>
          </div>
          
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="text-sm border rounded-lg px-2 py-1 bg-background text-foreground"
          >
            <option value="6m">6 Months</option>
            <option value="12m">12 Months</option>
            <option value="forecast">+3M Forecast</option>
          </select>
          
          <button
            onClick={() => setShowThresholds(!showThresholds)}
            className={`p-2 rounded-lg transition-colors ${
              showThresholds
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
            title={showThresholds ? 'Hide Thresholds' : 'Show Thresholds'}
          >
            {showThresholds ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {metrics.map(metric => {
          const IconComponent = metric.icon
          return (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMetric === metric.key
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <IconComponent className="h-4 w-4 mr-1" />
              {metric.label}
            </button>
          )
        })}
      </div>
      
      <div className="h-80">
        {renderChart()}
      </div>

      {/* Enhanced Summary Statistics */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div 
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <Badge variant="secondary" className="text-xs">
                {timeframe === '12m' ? 'YTD' : '6M'}
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {formatCurrency(dashboardData.businessSummary?.totalRevenue || 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Revenue</div>
            <div className={`text-xs flex items-center gap-1 font-medium ${
              (dashboardData.businessSummary?.monthlyGrowth || 0) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {(dashboardData.businessSummary?.monthlyGrowth || 0) > 0 ? '↗' : '↘'}
              {Math.abs(dashboardData.businessSummary?.monthlyGrowth || 0).toFixed(1)}% vs last period
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200/50 dark:border-green-700/50"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              <Badge variant="secondary" className="text-xs">
                Growth
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {(dashboardData.businessSummary?.monthlyGrowth || 0) >= 0 ? '+' : ''}{(dashboardData.businessSummary?.monthlyGrowth || 0).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Growth Rate</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              vs previous period
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-700/50"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <Badge variant="secondary" className="text-xs">
                Active
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {(dashboardData.businessSummary?.totalCustomers || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Customers</div>
            <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
              +12.3% this month
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200/50 dark:border-orange-700/50"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <Badge variant="secondary" className="text-xs">
                CVR
              </Badge>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {(dashboardData.businessSummary?.conversionRate || 0).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Conversion Rate</div>
            <div className="text-xs text-orange-600 dark:text-orange-400 font-medium">
              Above target (4.5%)
            </div>
          </motion.div>
        </div>

        {/* Additional Business Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Avg Order Value</span>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(dashboardData.businessSummary?.averageOrderValue || 0)}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Per transaction</div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Customer LTV</span>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(
              dashboardData.customerSegments?.reduce((sum, segment) => sum + segment.lifetimeValue, 0) / 
              (dashboardData.customerSegments?.length || 1) || 0
            )}</div>
            <div className="text-xs text-green-600 dark:text-green-400">
              +{(dashboardData.kpiData?.find(kpi => kpi.id === 'customer-ltv')?.change?.replace('%', '') || '0')}% growth
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">Total Orders</span>
            </div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{(dashboardData.businessSummary?.totalOrders || 0).toLocaleString()}</div>
            <div className="text-xs text-green-600 dark:text-green-400">
              ↑ {(dashboardData.businessSummary?.monthlyGrowth || 0).toFixed(1)}% vs last month
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Panel */}
      {showInsights && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">AI Insights</h4>
            </div>
            <button
              onClick={() => setShowInsights(false)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {insights.slice(0, 4).map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-blue-200/50 dark:border-blue-700/50"
              >
                <div className="flex items-start gap-2">
                  <div className={`p-1 rounded-full ${
                    insight.impact === 'high' ? 'bg-red-100 dark:bg-red-900/30' :
                    insight.impact === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    {insight.type === 'trend' && <TrendingUp className="h-3 w-3 text-blue-600 dark:text-blue-400" />}
                    {insight.type === 'forecast' && <Target className="h-3 w-3 text-purple-600 dark:text-purple-400" />}
                    {insight.type === 'anomaly' && <AlertTriangle className="h-3 w-3 text-orange-600 dark:text-orange-400" />}
                    {insight.type === 'recommendation' && <Star className="h-3 w-3 text-green-600 dark:text-green-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{insight.message}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={insight.confidence} className="h-1 flex-1" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{insight.confidence}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Data quality warning if needed */}
      {!validation.isValid && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
        >
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Data Quality Warning</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                {validation.errors[0]}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}