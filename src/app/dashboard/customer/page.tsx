'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  UserPlus,
  UserMinus,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  RefreshCw,
  Target,
  Activity,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
  Database,
  CheckCircle,
  Clock,
  Star,
  Repeat,
  Eye
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
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { EnhancedKPICard } from '@/components/dashboard/enhanced-kpi-card'

interface CustomerKPI {
  title: string
  value: string
  change: number
  trend: 'up' | 'down' | 'neutral'
  icon: any
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'orange' | 'indigo' | 'emerald' | 'amber' | 'cyan' | 'teal'
  description: string
}

export default function CustomerAnalyticsPage() {
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

  // Customer KPI data
  const customerKPIs: CustomerKPI[] = [
    {
      title: 'Total Customers',
      value: '24,847',
      change: 15.3,
      trend: 'up',
      icon: Users,
      color: 'blue',
      description: 'active customers'
    },
    {
      title: 'New Customers',
      value: '1,247',
      change: 8.7,
      trend: 'up',
      icon: UserPlus,
      color: 'green',
      description: 'this month'
    },
    {
      title: 'Returning Rate',
      value: '68.4%',
      change: 4.2,
      trend: 'up',
      icon: Repeat,
      color: 'purple',
      description: 'customer retention'
    },
    {
      title: 'Churn Rate',
      value: '2.8%',
      change: -1.3,
      trend: 'down',
      icon: UserMinus,
      color: 'red',
      description: 'monthly churn'
    }
  ]

  // Customer segments data
  const customerSegments = [
    {
      segment: 'Enterprise',
      count: 1247,
      percentage: 5.0,
      revenue: 1847293,
      avgValue: 1482,
      color: 'bg-blue-500',
      growth: 18.5
    },
    {
      segment: 'Professional',
      count: 4891,
      percentage: 19.7,
      revenue: 892456,
      avgValue: 182,
      color: 'bg-green-500',
      growth: 12.3
    },
    {
      segment: 'Small Business',
      count: 9234,
      percentage: 37.2,
      revenue: 456789,
      avgValue: 49,
      color: 'bg-purple-500',
      growth: 25.7
    },
    {
      segment: 'Individual',
      count: 9475,
      percentage: 38.1,
      revenue: 189234,
      avgValue: 20,
      color: 'bg-orange-500',
      growth: 8.9
    }
  ]

  // Customer acquisition over time data
  const acquisitionData = [
    { month: 'Jan', newCustomers: 1245, churnedCustomers: 234, netGrowth: 1011 },
    { month: 'Feb', newCustomers: 1367, churnedCustomers: 189, netGrowth: 1178 },
    { month: 'Mar', newCustomers: 1489, churnedCustomers: 267, netGrowth: 1222 },
    { month: 'Apr', newCustomers: 1234, churnedCustomers: 298, netGrowth: 936 },
    { month: 'May', newCustomers: 1567, churnedCustomers: 234, netGrowth: 1333 },
    { month: 'Jun', newCustomers: 1247, churnedCustomers: 189, netGrowth: 1058 }
  ]

  // Customer lifetime value by segment
  const lifetimeValueData = [
    { segment: 'Enterprise', ltv: 24750, acquisitionCost: 2400, ratio: 10.3 },
    { segment: 'Professional', ltv: 4890, acquisitionCost: 480, ratio: 10.2 },
    { segment: 'Small Business', ltv: 1247, acquisitionCost: 120, ratio: 10.4 },
    { segment: 'Individual', ltv: 389, acquisitionCost: 35, ratio: 11.1 }
  ]

  // Active users data
  const activeUsersData = [
    { period: 'Daily Active Users', count: 8947, change: 5.2, trend: 'up' },
    { period: 'Weekly Active Users', count: 18234, change: 8.7, trend: 'up' },
    { period: 'Monthly Active Users', count: 24847, change: 12.3, trend: 'up' }
  ]

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setLastUpdated(new Date())
      toast.success('Customer data refreshed successfully')
    } catch (error) {
      toast.error('Failed to refresh customer data')
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  const handleExport = useCallback(() => {
    toast.success('Export started - you will receive an email when ready')
  }, [])

  return (
    <EnhancedDashboardLayout>
      <div className="space-y-6 p-6">
      <TooltipProvider>
        {/* Header Section - Matching Dashboard Style */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl mb-8 overflow-hidden"
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
              className="absolute top-4 right-8 w-32 h-32 bg-blue-400/30 rounded-full blur-xl mix-blend-multiply"
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
              className="absolute bottom-6 left-12 w-40 h-40 bg-indigo-400/25 rounded-full blur-xl mix-blend-multiply"
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
                  Customer Analytics
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-lg text-blue-100 mb-6"
                >
                  Understand your audience and their behavior
                </motion.p>
                
                {/* Data Indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-wrap items-center gap-6 text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-blue-300" />
                    <span className="font-medium">{currentTime.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="font-medium">Live Data</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-300" />
                    <span className="font-medium">Last updated:</span>
                    <div className="bg-white/20 rounded-full px-3 py-1">
                      <span className="text-sm font-bold">{lastUpdated.toLocaleTimeString()}</span>
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
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="1y">Last year</SelectItem>
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
          {customerKPIs.map((kpi, index) => (
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

        {/* Customer Segments & Acquisition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Customer Segments */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-600" />
                Customer Segments
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Distribution of customers by business segment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {customerSegments.map((segment, index) => (
                <div key={segment.segment} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-4 h-4 rounded-full", segment.color)} />
                      <div>
                        <p className="font-medium">{segment.segment}</p>
                        <p className="text-sm text-muted-foreground">
                          {segment.count.toLocaleString()} customers
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${segment.avgValue}</p>
                      <div className="flex items-center gap-1 text-sm">
                        <ArrowUpRight className="w-3 h-3 text-green-600" />
                        <span className="text-green-600">+{segment.growth}%</span>
                      </div>
                    </div>
                  </div>
                  <Progress value={segment.percentage} className="h-2.5" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Customer Acquisition Over Time */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Customer Acquisition
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Monthly new customer acquisition trends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {acquisitionData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{data.month}</p>
                    <p className="text-sm text-muted-foreground">
                      +{data.newCustomers.toLocaleString()} new
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      -{data.churnedCustomers.toLocaleString()} churned
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      +{data.netGrowth.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">net growth</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Churn Rate Analysis & Active Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Churn Rate Analysis */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserMinus className="w-5 h-5 text-red-600" />
                Churn Rate Analysis
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Customer lifetime value and acquisition costs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {lifetimeValueData.map((data, index) => (
                <div key={data.segment} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{data.segment}</p>
                    <p className="text-sm text-muted-foreground">
                      LTV: ${data.ltv.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      CAC: ${data.acquisitionCost.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {data.ratio}:1
                    </p>
                    <p className="text-sm text-muted-foreground">LTV/CAC</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Users */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Active Users
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                User engagement and activity metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeUsersData.map((data, index) => (
                <div key={data.period} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">{data.period}</p>
                    <p className="text-sm text-muted-foreground">
                      {data.count.toLocaleString()} users
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {data.trend === 'up' ? (
                        <ArrowUpRight className="w-3 h-3 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 text-red-600" />
                      )}
                      <span className={cn(
                        "text-sm font-medium",
                        data.trend === 'up' ? "text-green-600" : "text-red-600"
                      )}>
                        +{data.change}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">vs last period</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Customer Journey Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Customer Journey Analysis
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Comprehensive view of customer behavior and engagement patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <RevenueChart />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </TooltipProvider>
      </div>
    </EnhancedDashboardLayout>
  )
}