'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Zap,
  Target,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  Clock,
  Download,
  RefreshCw,
  Server,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  Database,
  CheckCircle,
  AlertTriangle,
  ShoppingCart,
  Users,
  Eye,
  MousePointer,
  Timer,
  Wifi,
  WifiOff
} from 'lucide-react'
import EnhancedDashboardLayout from '@/components/dashboard/enhanced-dashboard-layout'
import RevenueChart from '@/components/dashboard/revenue-chart'
import { RevenueOverview } from '@/components/dashboard/revenue-overview'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { cn, formatTime } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { EnhancedKPICard } from '@/components/dashboard/enhanced-kpi-card'

interface PerformanceKPI {
  title: string
  value: string
  change: number
  trend: 'up' | 'down' | 'neutral'
  icon: any
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'orange' | 'indigo' | 'emerald' | 'amber' | 'cyan' | 'teal'
  description: string
}

export default function PerformanceMetricsPage() {
  const { user, userProfile } = useAuth()
  const [timeRange, setTimeRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Performance KPI data
  const performanceKPIs: PerformanceKPI[] = [
    {
      title: 'Conversion Rate',
      value: '3.47%',
      change: 12.5,
      trend: 'up',
      icon: Target,
      color: 'green',
      description: 'visitor to customer'
    },
    {
      title: 'Avg. Order Value',
      value: '$247.83',
      change: 8.2,
      trend: 'up',
      icon: ShoppingCart,
      color: 'blue',
      description: 'per transaction'
    },
    {
      title: 'Session Duration',
      value: '4m 32s',
      change: 15.7,
      trend: 'up',
      icon: Timer,
      color: 'purple',
      description: 'average time'
    },
    {
      title: 'System Uptime',
      value: '99.97%',
      change: 0.02,
      trend: 'up',
      icon: Server,
      color: 'emerald',
      description: 'availability'
    }
  ]

  // System uptime data
  const uptimeData = [
    {
      service: 'Web Application',
      uptime: 99.98,
      status: 'operational',
      lastIncident: '12 days ago',
      responseTime: '142ms'
    },
    {
      service: 'API Gateway',
      uptime: 99.95,
      status: 'operational',
      lastIncident: '8 days ago',
      responseTime: '89ms'
    },
    {
      service: 'Database',
      uptime: 99.99,
      status: 'operational',
      lastIncident: '23 days ago',
      responseTime: '12ms'
    },
    {
      service: 'CDN',
      uptime: 99.97,
      status: 'operational',
      lastIncident: '5 days ago',
      responseTime: '67ms'
    }
  ]

  // API response times data
  const apiResponseTimes = [
    { endpoint: '/api/users', avgTime: 145, p95Time: 289, requests: 12847 },
    { endpoint: '/api/orders', avgTime: 234, p95Time: 456, requests: 8934 },
    { endpoint: '/api/products', avgTime: 89, p95Time: 167, requests: 15672 },
    { endpoint: '/api/analytics', avgTime: 567, p95Time: 1234, requests: 3456 },
    { endpoint: '/api/auth', avgTime: 78, p95Time: 145, requests: 9876 }
  ]

  // Conversion rate trends data
  const conversionTrends = [
    { period: 'This Week', rate: 3.47, change: 12.5, visitors: 24567, conversions: 852 },
    { period: 'Last Week', rate: 3.09, change: -2.1, visitors: 23891, conversions: 738 },
    { period: 'This Month', rate: 3.28, change: 8.7, visitors: 98234, conversions: 3224 },
    { period: 'Last Month', rate: 3.02, change: 5.3, visitors: 94567, conversions: 2856 }
  ]

  // Sales performance data
  const salesPerformance = [
    {
      metric: 'Revenue Growth',
      current: '$847,293',
      target: '$800,000',
      achievement: 105.9,
      trend: 'up'
    },
    {
      metric: 'Units Sold',
      current: '12,847',
      target: '12,000',
      achievement: 107.1,
      trend: 'up'
    },
    {
      metric: 'Customer Acquisition',
      current: '1,247',
      target: '1,200',
      achievement: 103.9,
      trend: 'up'
    },
    {
      metric: 'Market Share',
      current: '18.4%',
      target: '20.0%',
      achievement: 92.0,
      trend: 'down'
    }
  ]

  // Performance alerts
  const performanceAlerts = [
    {
      type: 'warning',
      message: 'API response time increased by 15% in the last hour',
      timestamp: '2 minutes ago',
      severity: 'medium'
    },
    {
      type: 'info',
      message: 'Conversion rate reached monthly target',
      timestamp: '1 hour ago',
      severity: 'low'
    },
    {
      type: 'success',
      message: 'System uptime maintained at 99.97% for 30 days',
      timestamp: '3 hours ago',
      severity: 'low'
    }
  ]

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastUpdated(new Date())
      toast.success('Performance data refreshed successfully')
    } catch (error) {
      toast.error('Failed to refresh performance data')
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  const handleExport = useCallback(() => {
    toast.success('Export started - you will receive an email when ready')
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100'
      case 'degraded': return 'text-yellow-600 bg-yellow-100'
      case 'down': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle
      case 'success': return CheckCircle
      case 'info': return Database
      default: return AlertTriangle
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-yellow-600'
      case 'success': return 'text-green-600'
      case 'info': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <EnhancedDashboardLayout>
      <div className="space-y-6 p-6">
      <TooltipProvider>
        {/* Header Section - Matching Dashboard Style */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl mb-8 overflow-hidden"
        >
          {/* Animated Gradient Blobs */}
          <div className="absolute inset-0 z-0">
            <motion.div
              animate={{
                x: [0, 30, 0],
                y: [0, -20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-4 right-8 w-32 h-32 bg-emerald-400/30 rounded-full blur-xl mix-blend-multiply"
            />
            <motion.div
              animate={{
                x: [0, -25, 0],
                y: [0, 15, 0],
                scale: [1, 0.9, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute bottom-6 left-12 w-40 h-40 bg-teal-400/25 rounded-full blur-xl mix-blend-multiply"
            />
          </div>
          
          {/* Black Overlay */}
          <div className="absolute inset-0 bg-black/10 z-0" />
          
          {/* Content with proper z-index */}
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              {/* Left Side - Page Info */}
              <div className="flex-1">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-3xl lg:text-4xl font-bold mb-3"
                >
                  Performance Metrics
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-lg text-emerald-100 mb-6"
                >
                  Operational efficiency and key performance indicators
                </motion.p>
                
                {/* Data Indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-wrap items-center gap-6 text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-emerald-300" />
                    <span className="font-medium">{currentTime.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="font-medium">Live Monitoring</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-300" />
                    <span className="font-medium">Last updated:</span>
                    <div className="bg-white/20 rounded-full px-3 py-1">
                      <span className="text-sm font-bold">{formatTime(lastUpdated)}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Side - Controls */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col sm:flex-row lg:flex-col space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-0 lg:space-y-4 min-w-[300px]"
              >
                {/* Timeframe Selector */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <label className="block text-sm font-medium mb-2">Time Period</label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-full bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 transition-all duration-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Last hour</SelectItem>
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    variant="secondary"
                    size="sm"
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    {isRefreshing ? (
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Refresh
                  </Button>
                  <Button
                    onClick={handleExport}
                    variant="secondary"
                    size="sm"
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {performanceKPIs.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
            >
              <EnhancedKPICard
                title={kpi.title}
                value={kpi.value}
                change={kpi.change}
                trend={kpi.trend}
                icon={kpi.icon}
                color={kpi.color}
                description={kpi.description}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* System Uptime & API Response Times */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* System Uptime */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-600" />
                System Uptime
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Service availability and operational status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {uptimeData.map((service, index) => (
                <div key={service.service} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <div>
                      <p className="font-medium">{service.service}</p>
                      <p className="text-sm text-muted-foreground">
                        Last incident: {service.lastIncident}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={cn("text-xs", getStatusColor(service.status))}>
                        {service.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold">{service.uptime}%</p>
                    <p className="text-xs text-muted-foreground">{service.responseTime}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* API Response Times */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                API Response Times
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Average and 95th percentile response times
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {apiResponseTimes.map((api, index) => (
                <div key={api.endpoint} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium font-mono text-sm">{api.endpoint}</p>
                    <p className="text-sm text-muted-foreground">
                      {api.requests.toLocaleString()} requests
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{api.avgTime}ms avg</p>
                    <p className="text-xs text-muted-foreground">{api.p95Time}ms p95</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Conversion Rate Trends & Sales Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Conversion Rate Trends */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Conversion Rate Trends
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Visitor to customer conversion performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {conversionTrends.map((trend, index) => (
                <div key={trend.period} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{trend.period}</p>
                    <p className="text-sm text-muted-foreground">
                      {trend.visitors.toLocaleString()} visitors
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      {trend.conversions.toLocaleString()} conversions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{trend.rate}%</p>
                    <div className="flex items-center gap-1">
                      {trend.change > 0 ? (
                        <ArrowUpRight className="w-3 h-3 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-red-600" />
                      )}
                      <span className={cn(
                        "text-xs",
                        trend.change > 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {trend.change > 0 ? '+' : ''}{trend.change}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Sales Performance */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Sales Performance
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Key sales metrics vs targets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {salesPerformance.map((metric, index) => (
                <div key={metric.metric} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{metric.metric}</p>
                      <p className="text-sm text-muted-foreground">
                        {metric.current} / {metric.target}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-semibold",
                        metric.achievement >= 100 ? "text-green-600" : "text-red-600"
                      )}>
                        {metric.achievement.toFixed(1)}%
                      </p>
                      <div className="flex items-center gap-1">
                        {metric.trend === 'up' ? (
                          <ArrowUpRight className="w-3 h-3 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(metric.achievement, 100)} 
                    className="h-2.5"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Alerts & Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Performance Alerts */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Performance Alerts
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Recent system notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {performanceAlerts.map((alert, index) => {
                const AlertIcon = getAlertIcon(alert.type)
                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <AlertIcon className={cn("w-4 h-4 mt-0.5", getAlertColor(alert.type))} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card className="lg:col-span-2 border-0 shadow-lg bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <LineChart className="w-5 h-5 text-indigo-600" />
                Performance Overview
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Real-time performance metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>
        </motion.div>
      </TooltipProvider>
      </div>
    </EnhancedDashboardLayout>
  )
}