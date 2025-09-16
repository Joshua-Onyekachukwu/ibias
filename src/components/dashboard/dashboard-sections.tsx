'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Activity,
  BarChart3,
  PieChart,
  Zap,
  ArrowRight,
  DollarSign,
  Package,
  Eye,
  UserPlus,
  Star,
  RefreshCw,
  Globe,
  MousePointer,
  Zap as Lightning,
  Calendar,
  Filter,
  ArrowDown,
  TrendingDown,
  CheckCircle,
  CreditCard,
  ExternalLink,
  Plus,
  Brain,
  Settings,
  Database,
  Wifi,
  WifiOff,
  AlertTriangle,
  Clock,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Shield,
  FileText,
  Download,
  Upload,
  Gauge,
  Target
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatNumber, formatTimeAgo } from '@/lib/unified-dashboard-data'
import { useDashboardData } from '@/contexts/dashboard-data-context'
import { useQuickActions } from '@/contexts/quick-actions-context'
import { cn } from '@/lib/utils'

// Top Products Component
export function TopProducts() {
  const { data } = useDashboardData()
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Get products from unified data source
  const products = data.topProducts

  // Enhanced product data with additional metrics and proper icons
  const getProductIcon = (productName: string) => {
    if (productName.includes('Headphones')) return '🎧'
    if (productName.includes('Smart Watch') || productName.includes('Smartwatch')) return '⌚'
    if (productName.includes('Fitness Tracker')) return '🏃‍♂️'
    if (productName.includes('Speaker')) return '🔊'
    if (productName.includes('Charging Pad')) return '🔌'
    if (productName.includes('Earbuds')) return '🎵'
    if (productName.includes('Keyboard')) return '⌨️'
    if (productName.includes('Mouse')) return '🖱️'
    if (productName.includes('Phone') || productName.includes('Smartphone')) return '📱'
    if (productName.includes('Tablet')) return '📱'
    return '📦' // Default icon
  }

  const enhancedProducts = products.map((product: any, index: number) => ({
    ...product,
    image: getProductIcon(product.name)
  }))

  // Sort products based on selected metric
  const sortedProducts = [...enhancedProducts].sort((a, b) => {
    switch (selectedMetric) {
      case 'revenue':
        return b.revenue - a.revenue
      case 'units':
        return b.units - a.units
      case 'growth':
        return b.growth - a.growth
      case 'rating':
        return b.rating - a.rating
      default:
        return b.revenue - a.revenue
    }
  })

  // Prepare chart data
  const chartData = sortedProducts.slice(0, 5).map(product => ({
    name: product.name.split(' ').slice(0, 2).join(' '),
    revenue: product.revenue,
    units: product.units,
    growth: product.growth,
    rating: product.rating
  }))

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const getMetricValue = (product: any) => {
    switch (selectedMetric) {
      case 'revenue':
        return `$${product.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      case 'units':
        return product.units.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      case 'growth':
        return `${product.growth > 0 ? '+' : ''}${product.growth.toFixed(2)}%`
      case 'rating':
        return `${product.rating.toFixed(2)} ⭐`
      default:
        return `$${product.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }

  const getChartColor = () => {
    switch (selectedMetric) {
      case 'revenue':
        return '#2563EB' // Brighter Blue
      case 'units':
        return '#059669' // Brighter Green
      case 'growth':
        return '#D97706' // Brighter Orange
      case 'rating':
        return '#7C3AED' // Brighter Purple
      default:
        return '#2563EB'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-white via-slate-50/40 to-white dark:from-gray-900 dark:via-slate-800/20 dark:to-gray-900 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/60 via-blue-50/40 to-slate-50/60 dark:from-slate-800/40 dark:via-blue-950/20 dark:to-slate-800/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Top Products
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Best performing products by {selectedMetric}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-32 sm:w-36 md:w-40 bg-white/90 dark:bg-slate-800/90 border-slate-200/60 dark:border-slate-600/60 text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="units">Units Sold</SelectItem>
                <SelectItem value="growth">Growth Rate</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-white/90 dark:bg-slate-800/90 border-slate-200/60 dark:border-slate-600/60 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm"
            >
              <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
            </Button>
          </div>
        </div>
      </div>

      {/* Inner Container */}
      <div className="p-6">
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/40 dark:border-slate-700/40 p-6 backdrop-blur-sm">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Performance Chart
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Visual comparison of top 5 products by {selectedMetric}
            </p>
          </div>

          {/* Chart */}
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={getChartColor()} stopOpacity={0.9} />
                    <stop offset="50%" stopColor={getChartColor()} stopOpacity={0.7} />
                    <stop offset="100%" stopColor={getChartColor()} stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="4 4" 
                  stroke="#e2e8f0" 
                  opacity={0.3}
                  className="dark:stroke-slate-600"
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff"
                  fontSize={11}
                  fontWeight={600}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                  tick={{ fill: '#ffffff', fontSize: 11, fontWeight: 600 }}
                  tickLine={{ stroke: '#ffffff', strokeWidth: 1 }}
                  axisLine={{ stroke: '#ffffff', strokeWidth: 1 }}
                />
                <YAxis 
                  stroke="#ffffff"
                  fontSize={11}
                  fontWeight={600}
                  tick={{ fill: '#ffffff', fontSize: 11, fontWeight: 600 }}
                  tickLine={{ stroke: '#ffffff', strokeWidth: 1 }}
                  axisLine={{ stroke: '#ffffff', strokeWidth: 1 }}
                  tickFormatter={(value) => {
                    if (selectedMetric === 'revenue') return `$${(value / 1000).toFixed(0)}k`
                    if (selectedMetric === 'rating') return value.toFixed(1)
                    if (selectedMetric === 'units') return `${(value / 1000).toFixed(1)}k`
                    return formatNumber(value)
                  }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    color: '#1e293b',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                  formatter={(value: any, name: string) => {
                    if (selectedMetric === 'revenue') return [`$${value.toLocaleString()}`, 'Revenue']
                    if (selectedMetric === 'units') return [value.toLocaleString(), 'Units Sold']
                    if (selectedMetric === 'growth') return [`${value}%`, 'Growth Rate']
                    if (selectedMetric === 'rating') return [`${value.toFixed(1)} ⭐`, 'Rating']
                    return [value, selectedMetric]
                  }}
                />
                <Bar 
                  dataKey={selectedMetric === 'growth' ? 'growth' : selectedMetric} 
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Product Details */}
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Product Details
            </h4>
            <div className="space-y-3">
              {sortedProducts.slice(0, 5).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-800/80 dark:to-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-md transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg text-sm">
                        #{index + 1}
                      </div>
                      <div className="text-2xl">{product.image}</div>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{product.name}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {product.category}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            {product.rating.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-base text-slate-900 dark:text-slate-100">
                      {getMetricValue(product)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={product.growth > 0 ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {product.growth > 0 ? '+' : ''}{product.growth}%
                      </Badge>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {product.units.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} units
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      

    </motion.div>
  )
}

// Live Activity Component
export function LiveActivity() {
  const { data } = useDashboardData()
  const [isLive, setIsLive] = useState(true)
  const [refreshCount, setRefreshCount] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)


  // Enhanced real-time business metrics from unified data source
  const businessMetrics = [
    {
      label: 'Active Sessions',
      value: data.liveMetrics.activeSessions.toLocaleString(),
      change: '+2.3%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      description: 'Current active user sessions',
      progress: 85,
      target: '1000',
      timeframe: data.liveMetrics.lastUpdate
    },
    {
      label: 'Revenue Today',
      value: formatCurrency(data.liveMetrics.revenueToday + (refreshCount * (data.liveMetrics.revenueToday * 0.01))),
      change: `+${(5.2 + (refreshCount * 0.1)).toFixed(1)}%`,
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      description: 'Total revenue generated today',
      progress: Math.min(95, 72 + (refreshCount * 1.5)),
      target: formatCurrency(50000),
      timeframe: data.liveMetrics.lastUpdate
    },
    {
      label: 'Conversion Rate',
      value: `${(data.liveMetrics.conversionRate + (refreshCount * 0.01)).toFixed(1)}%`,
      change: `+${(1.8 + (refreshCount * 0.1)).toFixed(1)}%`,
      trend: 'up' as const,
      icon: Target,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      description: 'Visitor to customer conversion rate',
      progress: Math.min(95, 68 + (refreshCount * 1.5)),
      target: '5.0%',
      timeframe: data.liveMetrics.lastUpdate
    },
    {
      label: 'Customer Satisfaction',
      value: `${(data.liveMetrics.customerSatisfaction + (refreshCount * 0.01)).toFixed(1)}/5.0`,
      change: `+${(0.3 + (refreshCount * 0.1)).toFixed(1)}%`,
      trend: 'up' as const,
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
      description: 'Average customer satisfaction rating',
      progress: Math.min(95, 88 + (refreshCount * 1.5)),
      target: '5.0',
      timeframe: data.liveMetrics.lastUpdate
    }
  ]

  // Auto-refresh effect to simulate live data
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setIsRefreshing(true)
        setTimeout(() => {
          setRefreshCount(prev => prev + 1)
          setIsRefreshing(false)
        }, 800) // Show refresh animation for 800ms
      }, 5000) // Update every 5 seconds
      return () => clearInterval(interval)
    }
  }, [isLive])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-white via-slate-50/40 to-white dark:from-gray-900 dark:via-slate-800/20 dark:to-gray-900 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/60 via-emerald-50/40 to-slate-50/60 dark:from-slate-800/40 dark:via-emerald-950/20 dark:to-slate-800/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Live Activity
                </h3>
                <div className="flex items-center gap-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    isRefreshing 
                      ? "bg-yellow-500 animate-spin" 
                      : "bg-emerald-500 animate-pulse"
                  )} />
                  <Badge variant="outline" className={cn(
                    "text-xs border transition-all duration-300",
                    isRefreshing
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-800"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800"
                  )}>
                    {isRefreshing ? 'Updating...' : 'Real-time'}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Live customer activities and business updates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Inner Container */}
      <div className="p-6">
        <div className="bg-gradient-to-br from-slate-50/80 via-white to-slate-50/80 dark:from-slate-800/50 dark:via-slate-700/30 dark:to-slate-800/50 rounded-xl border border-slate-200/40 dark:border-slate-600/40 backdrop-blur-sm shadow-inner">
          {/* Live Activity Feed */}
          <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MousePointer className="w-5 h-5 text-green-500" />
              Activity Feed
            </h4>
            <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {data.liveActivities.slice(0, 12).map((activity, index) => {
                const getActivityIcon = (type: string) => {
                  switch (type) {
                    case 'purchase': return <ShoppingCart className="w-4 h-4 text-green-500" />
                    case 'signup': return <UserPlus className="w-4 h-4 text-blue-500" />
                    case 'refund': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                    case 'view': return <Eye className="w-4 h-4 text-purple-500" />
                    default: return <Activity className="w-4 h-4 text-gray-500" />
                  }
                }
                
                const getActivityColor = (type: string) => {
                  switch (type) {
                    case 'purchase': return 'border-l-green-500 bg-gradient-to-r from-green-50/80 to-white/80 dark:from-green-950/20 dark:to-gray-800/80'
                    case 'signup': return 'border-l-blue-500 bg-gradient-to-r from-blue-50/80 to-white/80 dark:from-blue-950/20 dark:to-gray-800/80'
                    case 'refund': return 'border-l-red-500 bg-gradient-to-r from-red-50/80 to-white/80 dark:from-red-950/20 dark:to-gray-800/80'
                    case 'view': return 'border-l-purple-500 bg-gradient-to-r from-purple-50/80 to-white/80 dark:from-purple-950/20 dark:to-gray-800/80'
                    default: return 'border-l-gray-500 bg-gradient-to-r from-gray-50/80 to-white/80 dark:from-gray-700/80 dark:to-gray-800/80'
                  }
                }
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={cn(
                      'p-3 rounded-xl border-l-4 transition-all hover:shadow-md backdrop-blur-sm border border-gray-200/30 dark:border-gray-600/30',
                      getActivityColor(activity.type)
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-white/80 dark:bg-gray-700/80 shadow-sm">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {activity.user} {activity.action}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {activity.location}
                          </p>
                          <div className="flex items-center gap-2">
                            {activity.amount && (
                              <span className={cn(
                                'text-xs font-bold px-2 py-1 rounded-full',
                                activity.amount > 0 
                                  ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-950/30' 
                                  : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950/30'
                              )}>
                                {activity.amount > 0 ? '+' : ''}${activity.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                              {formatTimeAgo(activity.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Business Metrics */}
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              Real-time Business Metrics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
              {businessMetrics.map((metric: any, index: number) => {
                const IconComponent = metric.icon
                return (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={cn(
                      'p-5 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 transition-all hover:shadow-lg backdrop-blur-sm hover:scale-[1.02] hover:-translate-y-1',
                      metric.bgColor
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn('p-2.5 rounded-xl bg-white/90 dark:bg-gray-700/90 shadow-md')}>
                          <IconComponent className={cn('w-5 h-5', metric.color)} />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 block">
                            {metric.label}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {metric.description}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs px-2 py-1 bg-white/50 dark:bg-gray-800/50">
                        {metric.timeframe}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          {metric.value}
                        </span>
                        <Badge 
                          variant={metric.trend === 'up' ? 'default' : 'destructive'}
                          className="text-xs font-semibold px-2.5 py-1"
                        >
                          {metric.change}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Target: {metric.target}</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{metric.progress}%</span>
                        </div>
                        <Progress 
                          value={metric.progress} 
                          className="h-2 bg-gray-200/60 dark:bg-gray-700/60"
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      

    </motion.div>
  )
}

// Customer Segments Component
export function CustomerSegments() {
  const { data } = useDashboardData();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const totalCustomers = data.customerSegments.reduce((sum, segment) => sum + segment.count, 0);
  const totalRevenue = data.customerSegments.reduce((sum, segment) => sum + segment.revenue, 0);

  // Prepare pie chart data
  const pieChartData = data.customerSegments.map(segment => ({
    name: segment.name,
    value: segment.count,
    percentage: segment.percentage,
    color: segment.color,
    revenue: segment.revenue
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-white via-slate-50/40 to-white dark:from-gray-900 dark:via-slate-800/20 dark:to-gray-900 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/60 via-purple-50/40 to-slate-50/60 dark:from-slate-800/40 dark:via-purple-950/20 dark:to-slate-800/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Customer Segmentation
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Analyze customer distribution and behavior
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-white/90 dark:bg-slate-800/90 border-slate-200/60 dark:border-slate-600/60 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm"
          >
            <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Inner Container */}
      <div className="p-6">
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/40 dark:border-slate-700/40 p-6 backdrop-blur-sm">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Customer Distribution Analytics
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {totalCustomers.toLocaleString()} total customers • $2.4M revenue • 8.3% growth
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  ${((totalRevenue / totalCustomers) || 0).toFixed(0)}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Avg. Customer Value
                </div>
              </div>
            </div>
            
            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-4 border border-blue-200/40 dark:border-blue-800/40">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Top Segment</span>
                </div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">Premium</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">38.2% of revenue</div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-4 border border-green-200/40 dark:border-green-800/40">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Fastest Growing</span>
                </div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">Enterprise</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">+12.4% this month</div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50/80 to-violet-50/80 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg p-4 border border-purple-200/40 dark:border-purple-800/40">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg. Order Value</span>
                </div>
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">$127</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">+5.8% increase</div>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="h-80 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    color: '#1e293b',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                  formatter={(value: any, name: string, props: any) => [
                    `${value.toLocaleString()} customers (${props.payload.percentage.toFixed(1)}%)`,
                    name
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => (
                    <span style={{ color: entry.color, fontWeight: '500', fontSize: '12px' }}>{value}</span>
                  )}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {/* Segment Details */}
          <div className="grid gap-3">
            {data.customerSegments.map((segment, index) => (
              <motion.div
                key={segment.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50/80 to-white/80 dark:from-slate-800/80 dark:to-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl" style={{ backgroundColor: `${segment.color}20` }}>
                    <div 
                      className="w-6 h-6 rounded-full shadow-sm"
                      style={{ backgroundColor: segment.color }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs">{segment.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{segment.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {segment.count.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {segment.percentage.toFixed(1)}% of total
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>

  )
}

// Conversion Funnel Component
export function ConversionFunnel() {
  const { data } = useDashboardData();
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [viewMode, setViewMode] = useState<'funnel' | 'list'>('list');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Calculate summary metrics based on funnel data
  const totalVisitors = data.conversionFunnel[0]?.count || 0;
  const addToCartCount = data.conversionFunnel.find(stage => stage.stage.includes('Cart'))?.count || 0;
  const checkoutCount = data.conversionFunnel.find(stage => stage.stage.includes('Checkout'))?.count || 0;
  const purchaseCount = data.conversionFunnel[data.conversionFunnel.length - 1]?.count || 0;

  const overallConversion = totalVisitors > 0 ? ((purchaseCount / totalVisitors) * 100).toFixed(2) : '0.00';
  const addToCartRate = totalVisitors > 0 ? ((addToCartCount / totalVisitors) * 100).toFixed(2) : '0.00';
  const checkoutCompletion = addToCartCount > 0 ? ((purchaseCount / addToCartCount) * 100).toFixed(2) : '0.00';

  // Enhanced colors for better visual appeal
  const enhancedFunnelData = data.conversionFunnel.map((stage, index) => ({
    ...stage,
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index] || stage.color
  }));

  const renderFunnelView = () => (
    <div className="space-y-4">
      {enhancedFunnelData.map((stage, index) => {
        const width = 100 - (index * 15); // Decreasing width for funnel effect
        return (
          <motion.div
            key={stage.stage}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative flex justify-center"
          >
            <div 
              className="relative rounded-lg p-4 text-white shadow-lg transition-all duration-300 hover:shadow-xl"
              style={{ 
                backgroundColor: stage.color,
                width: `${width}%`,
                minWidth: '200px'
              }}
            >
              <div className="text-center">
                <div className="text-lg font-bold mb-1">{formatNumber(stage.count)}</div>
                <div className="text-sm opacity-90">{stage.stage}</div>
                <div className="text-xs opacity-75 mt-1">{stage.percentage}% of total</div>
              </div>
              {index < enhancedFunnelData.length - 1 && (
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                  <ArrowDown className="w-5 h-5 text-slate-400" />
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-3">
      {enhancedFunnelData.map((stage, index) => (
        <motion.div
          key={stage.stage}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg"
              style={{ backgroundColor: stage.color }}
            >
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{stage.stage}</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {formatNumber(stage.count)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={stage.percentage} 
                  className="flex-1 h-3 bg-slate-200/60 dark:bg-slate-700/60"
                />
                <span className="text-xs text-slate-600 dark:text-slate-400 w-12 text-right font-medium">
                  {stage.percentage}%
                </span>
              </div>
            </div>
          </div>
          {index < enhancedFunnelData.length - 1 && (
            <div className="ml-5 mt-3 mb-1">
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-white via-slate-50/40 to-white dark:from-gray-900 dark:via-slate-800/20 dark:to-gray-900 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/60 via-orange-50/40 to-slate-50/60 dark:from-slate-800/40 dark:via-orange-950/20 dark:to-slate-800/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 shadow-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Conversion Funnel
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Track customer journey and conversion rates
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32 bg-white/90 dark:bg-slate-800/90 border-slate-200/60 dark:border-slate-600/60 text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
            
            {/* View Mode Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'funnel' ? 'list' : 'funnel')}
              className="bg-white/90 dark:bg-slate-800/90 border-slate-200/60 dark:border-slate-600/60 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm"
            >
              {viewMode === 'funnel' ? <BarChart3 className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-white/90 dark:bg-slate-800/90 border-slate-200/60 dark:border-slate-600/60 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm"
            >
              <RefreshCw className={cn('w-4 h-4', isRefreshing && 'animate-spin')} />
            </Button>
          </div>
        </div>
      </div>

      {/* Inner Container */}
      <div className="p-6">
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/40 dark:border-slate-700/40 p-6 backdrop-blur-sm">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Customer Journey Analytics
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Last {selectedPeriod} days • {viewMode === 'funnel' ? 'Funnel View' : 'Detailed View'} • 2.4% improvement
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  3.2%
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Overall Conversion
                </div>
              </div>
            </div>
            
            {/* Journey Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg p-4 border border-blue-200/40 dark:border-blue-800/40">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg. Session</span>
                </div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">4m 32s</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">+12% vs last period</div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50/80 to-amber-50/80 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg p-4 border border-orange-200/40 dark:border-orange-800/40">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Cart Abandon</span>
                </div>
                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">23.7%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">-5.2% improvement</div>
              </div>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="mb-8">
            {viewMode === 'funnel' ? renderFunnelView() : renderListView()}
          </div>

          {/* Summary Section */}
          <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h5 className="text-md font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Conversion Summary & Performance
                </h5>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Detailed conversion metrics and optimization opportunities
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  +8.3%
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  vs last month
                </div>
              </div>
            </div>
            
            {/* Key Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-4 border border-blue-200/40 dark:border-blue-800/40"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Overall Conversion</span>
                </div>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{overallConversion}%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {formatNumber(purchaseCount)} of {formatNumber(totalVisitors)} visitors
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-4 border border-green-200/40 dark:border-green-800/40"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <ShoppingCart className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Add to Cart Rate</span>
                </div>
                <div className="text-xl font-bold text-green-600 dark:text-green-400">{addToCartRate}%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {formatNumber(addToCartCount)} added to cart
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-r from-purple-50/80 to-violet-50/80 dark:from-purple-950/20 dark:to-violet-950/20 rounded-xl p-4 border border-purple-200/40 dark:border-purple-800/40"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Checkout Completion</span>
                </div>
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{checkoutCompletion}%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {formatNumber(purchaseCount)} completed purchases
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Quick Actions Component
export function QuickActions() {
  const {
    setShowReportModal,
    setShowExportModal,
    setShowScheduleMeetingModal,
    setShowUploadDataModal,
    setShowMonitorSystemModal,
    setShowSecurityStatusModal,
    setShowNetworkStatusModal,
  } = useQuickActions()
  const router = useRouter()

  const actions = [
    {
      title: 'Generate Report',
      description: 'Create custom analytics report',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      action: () => setShowReportModal(true),
    },
    {
      title: 'Export Data',
      description: 'Download dashboard data',
      icon: Download,
      color: 'from-green-500 to-green-600',
      action: () => setShowExportModal(true),
    },
    {
      title: 'AI Analysis',
      description: 'Run AI-powered insights',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      action: () => router.push('/dashboard/ai-insights'),
    },
    {
      title: 'Schedule Meeting',
      description: 'Book consultation call',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      action: () => setShowScheduleMeetingModal(true),
    },
    {
      title: 'Upload Data',
      description: 'Import new data sources',
      icon: Upload,
      color: 'from-teal-500 to-teal-600',
      action: () => setShowUploadDataModal(true),
    },
    {
      title: 'Monitor System',
      description: 'Check system performance',
      icon: Gauge,
      color: 'from-red-500 to-red-600',
      action: () => setShowMonitorSystemModal(true),
    },
    {
      title: 'Security Status',
      description: 'View security metrics',
      icon: Shield,
      color: 'from-indigo-500 to-indigo-600',
      action: () => setShowSecurityStatusModal(true),
    },
    {
      title: 'Network Status',
      description: 'Check connectivity status',
      icon: Network,
      color: 'from-cyan-500 to-cyan-600',
      action: () => setShowNetworkStatusModal(true),
    },
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-white via-slate-50/40 to-white dark:from-gray-900 dark:via-slate-800/20 dark:to-gray-900 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/60 via-blue-50/40 to-slate-50/60 dark:from-slate-800/40 dark:via-blue-950/20 dark:to-slate-800/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
            <Lightning className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Quick Actions
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Frequently used tools and shortcuts
            </p>
          </div>
        </div>
      </div>

      {/* Inner Container */}
      <div className="p-6">
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/40 dark:border-slate-700/40 p-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {actions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -2, scale: 1.02, transition: { duration: 0.2 } }}
                className="group cursor-pointer"
                onClick={action.action}
              >
                <div className="bg-white/80 dark:bg-slate-700/80 rounded-xl p-4 border border-slate-200/40 dark:border-slate-600/40 hover:shadow-lg transition-all duration-300 hover:border-slate-300/60 dark:hover:border-slate-500/60">
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn(
                      'p-2.5 rounded-lg bg-gradient-to-br text-white shadow-md group-hover:scale-110 transition-transform duration-200',
                      action.color
                    )}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1">
                    {action.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </motion.div>
  )
}

// Integration Status Component
export function IntegrationStatus() {
  const router = useRouter()
  const integrations = [
    {
      name: 'Shopify',
      status: 'connected',
      lastSync: '2 minutes ago',
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20',
      borderColor: 'border-green-200/50 dark:border-green-700/50',
      description: 'E-commerce platform integration',
      dataPoints: '1.2K orders synced'
    },
    {
      name: 'Google Analytics',
      status: 'connected',
      lastSync: '5 minutes ago',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/20',
      borderColor: 'border-blue-200/50 dark:border-blue-700/50',
      description: 'Web analytics and tracking',
      dataPoints: '52.4K visitors tracked'
    },
    {
      name: 'Stripe',
      status: 'syncing',
      lastSync: 'Syncing...',
      icon: CreditCard,
      color: 'text-yellow-600',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/20',
      borderColor: 'border-yellow-200/50 dark:border-yellow-700/50',
      description: 'Payment processing system',
      dataPoints: 'Processing payments...'
    },
    {
      name: 'Facebook Ads',
      status: 'error',
      lastSync: '2 hours ago',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/30 dark:to-rose-900/20',
      borderColor: 'border-red-200/50 dark:border-red-700/50',
      description: 'Social media advertising',
      dataPoints: 'Connection failed'
    },
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-gradient-to-br from-white via-slate-50/40 to-white dark:from-gray-900 dark:via-slate-800/20 dark:to-gray-900 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/60 via-green-50/40 to-slate-50/60 dark:from-slate-800/40 dark:via-green-950/20 dark:to-slate-800/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg">
              <Wifi className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Integration Status
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Connected services and APIs
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white/90 dark:bg-slate-800/90"
            onClick={() => router.push('/dashboard/integrations')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Inner Container */}
      <div className="p-6">
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/40 dark:border-slate-700/40 p-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -2, scale: 1.02, transition: { duration: 0.2 } }}
                className={cn(
                  'rounded-xl p-5 border-2 hover:shadow-xl transition-all duration-300 group cursor-pointer backdrop-blur-sm',
                  integration.bgColor,
                  integration.borderColor || 'border-slate-200/50 dark:border-slate-600/50'
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-lg group-hover:scale-110 transition-transform duration-200 border border-white/50 dark:border-slate-700/50">
                      <integration.icon className={cn('w-6 h-6', integration.color)} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-1">
                        {integration.name}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        {integration.description}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        {integration.dataPoints}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={integration.status === 'connected' ? 'default' : integration.status === 'syncing' ? 'secondary' : 'destructive'}
                    className="text-xs font-medium px-3 py-1.5 shadow-sm"
                  >
                    {integration.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/30 dark:border-slate-700/30">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-3 h-3 rounded-full shadow-sm', 
                      integration.status === 'connected' ? 'bg-green-500' : 
                      integration.status === 'syncing' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                    )}></div>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {integration.status === 'connected' ? 'Connected & Active' : 
                         integration.status === 'syncing' ? 'Syncing Data...' : 'Connection Error'}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-500">
                        Last sync: {integration.lastSync}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80">
                    <Settings className="w-3 h-3 mr-1" />
                    Configure
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Quick Action Cards Component (Redesigned)
export function QuickActionCards() {
  const actions = [
    {
      title: 'View Analytics',
      description: 'Explore detailed metrics and insights',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600',
      href: '/dashboard/analytics',
    },
    {
      title: 'AI Insights',
      description: 'Get AI-powered recommendations',
      icon: Brain,
      color: 'from-purple-500 to-purple-600',
      href: '/dashboard/ai-insights',
    },
    {
      title: 'Add Integration',
      description: 'Connect new data sources',
      icon: Plus,
      color: 'from-green-500 to-green-600',
      href: '/dashboard/integrations',
    },
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-gradient-to-br from-white via-slate-50/40 to-white dark:from-gray-900 dark:via-slate-800/20 dark:to-gray-900 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/60 via-purple-50/40 to-slate-50/60 dark:from-slate-800/40 dark:via-purple-950/20 dark:to-slate-800/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Action Center
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Quick access to key features
            </p>
          </div>
        </div>
      </div>

      {/* Inner Container */}
      <div className="p-6">
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/40 dark:border-slate-700/40 p-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {actions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -2, scale: 1.02, transition: { duration: 0.2 } }}
                className="group cursor-pointer"
              >
                <div className="bg-white/80 dark:bg-slate-700/80 rounded-xl p-6 border border-slate-200/40 dark:border-slate-600/40 hover:shadow-lg transition-all duration-300 hover:border-slate-300/60 dark:hover:border-slate-500/60">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn(
                      'p-3 rounded-xl bg-gradient-to-br text-white shadow-lg group-hover:scale-110 transition-transform duration-200',
                      action.color
                    )}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                  </div>
                  <h4 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">
                    {action.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// System Performance Component
export function SystemPerformance() {
  const [refreshing, setRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Update time every 7 days (604800000 ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 604800000) // Update every 7 days
    
    return () => clearInterval(timer)
  }, [])
  
  const dataQualityScore = 98.5
  
  const systemMetrics = [
    {
      title: 'API Response Time',
      value: '245ms',
      progress: 85,
      status: 'good',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      title: 'Dashboard Render',
      value: '1.2s',
      progress: 78,
      status: 'good',
      icon: Gauge,
      color: 'text-green-600'
    },
    {
      title: 'Memory Usage',
      value: '67%',
      progress: 67,
      status: 'warning',
      icon: MemoryStick,
      color: 'text-yellow-600'
    },
    {
      title: 'CPU Usage',
      value: '23%',
      progress: 23,
      status: 'good',
      icon: Cpu,
      color: 'text-green-600'
    },
  ]
  
  const dataQualityInsights = [
    'Data completeness: 98.5% - Excellent coverage across all sources',
    'Real-time sync: All integrations updating within 2-minute intervals',
    'Data accuracy: 99.2% - Minor discrepancies detected in Facebook Ads',
    'Schema validation: All data points conform to expected formats',
    'Duplicate detection: 0.3% duplicates found and automatically resolved',
    'Data freshness: Average data age is 1.2 minutes across all sources'
  ]
  
  // Dynamic timestamp calculation with 7-day intervals
  const lastUpdateTime = new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  const nextUpdateTime = new Date(currentTime.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  
  const lastUpdateInfo = {
    timestamp: lastUpdateTime.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }),
    source: 'Automated System Sync',
    status: 'Success',
    nextUpdate: nextUpdateTime.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }
  
  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 2000)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-gradient-to-br from-white via-slate-50/40 to-white dark:from-gray-900 dark:via-slate-800/20 dark:to-gray-900 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/60 via-red-50/40 to-slate-50/60 dark:from-slate-800/40 dark:via-red-950/20 dark:to-slate-800/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-600 to-orange-600 shadow-lg">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                System Performance
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Real-time system health and data quality
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white/90 dark:bg-slate-800/90"
          >
            <RefreshCw className={cn('w-4 h-4 mr-2', refreshing && 'animate-spin')} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Inner Container */}
      <div className="p-6">
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/40 dark:border-slate-700/40 p-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Data Quality Card - Redesigned */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-white via-green-50/30 to-white dark:from-slate-700/80 dark:via-green-950/20 dark:to-slate-700/80 rounded-xl p-6 border border-green-200/40 dark:border-green-800/40 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Data Quality
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      System integrity monitoring
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Excellent</span>
                </div>
              </div>
              
              {/* Quality Score */}
              <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-4 mb-4 border border-green-200/40 dark:border-green-800/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Overall Score
                  </span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {dataQualityScore}%
                  </span>
                </div>
                <Progress value={dataQualityScore} className="h-3 bg-green-100 dark:bg-green-900/30" />
              </div>
              
              {/* Quality Metrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-200/30 dark:border-slate-600/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Data Completeness</span>
                  </div>
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    98.5%
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-slate-200/30 dark:border-slate-600/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Real-time Sync</span>
                  </div>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    Active
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Schema Validation</span>
                  </div>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    Passed
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Performance Metrics Card - Redesigned */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-slate-700/80 dark:via-blue-950/20 dark:to-slate-700/80 rounded-xl p-6 border border-blue-200/40 dark:border-blue-800/40 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg">
                    <Gauge className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Performance Metrics
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      System performance tracking
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Optimal</span>
                </div>
              </div>
              
              {/* Performance Overview */}
              <div className="bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg p-4 mb-4 border border-blue-200/40 dark:border-blue-800/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    System Health
                  </span>
                  <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs border-blue-200 dark:border-blue-800">
                    Excellent
                  </Badge>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  All systems running optimally
                </div>
              </div>
              
              {/* Metrics Details */}
              <div className="space-y-3">
                {systemMetrics.map((metric: any, index: number) => (
                  <div key={metric.title} className="flex items-center justify-between py-2 border-b border-slate-200/30 dark:border-slate-600/30 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <metric.icon className={cn('w-4 h-4', metric.color)} />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {metric.title}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {metric.value}
                      </div>
                      <div className="w-16 mt-1">
                        <Progress value={metric.progress} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Last Update Card - Redesigned */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-white via-indigo-50/30 to-white dark:from-slate-700/80 dark:via-indigo-950/20 dark:to-slate-700/80 rounded-xl p-6 border border-indigo-200/40 dark:border-indigo-800/40 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      System Status
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Real-time monitoring
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Live</span>
                </div>
              </div>
              
              {/* Status Overview */}
              <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-4 mb-4 border border-green-200/40 dark:border-green-800/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">All Systems Operational</span>
                  </div>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs border-green-200 dark:border-green-800">
                    Healthy
                  </Badge>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  99.9% uptime • Last incident: 12 days ago
                </div>
              </div>
              
              {/* Update Information */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-200/30 dark:border-slate-600/30">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Last Sync</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {new Date().toLocaleTimeString()}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-slate-200/30 dark:border-slate-600/30">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Data Source</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      Multi-Platform
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      8 integrations active
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Next Update</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      In 2 minutes
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Auto-refresh enabled
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </div>
    </motion.div>
  )
}