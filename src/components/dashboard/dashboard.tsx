'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  ShoppingCart,
  Target,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  Settings,
  BarChart3,
  PieChart,
  FileText,
  Video,
  Brain,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Globe,
  Database,
  Lightbulb,
  Plus,
  Bell,
  Star,
  Bookmark,
  Filter,
  Search,
  Eye,
  TrendingUp as Growth,
  BarChart2,
  LineChart,
  Percent,
  MousePointer,
  Repeat,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Layers,
  Gauge,
  Timer,
  Wifi,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Plug
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import KPICard, { KPIGrid, KPICardSkeleton } from './kpi-card'
import RevenueChart, { RevenueChartSkeleton } from './revenue-chart'
import { WelcomeBanner } from './welcome-banner'
import { EnhancedKPICard } from './enhanced-kpi-card'
import { RevenueOverview } from './revenue-overview'
import { TopProducts, LiveActivity, CustomerSegments, ConversionFunnel, QuickActions, SystemPerformance } from './dashboard-sections'
import { QuickActionDiv } from './quick-action-div'
import { dashboardData, primaryKPIs, secondaryKPIs, additionalKPIs } from '@/lib/dummy-data'
import { DashboardDataProvider, useDashboardData, formatCurrency, formatNumber, formatPercentage } from '../../contexts/dashboard-data-context'
import { AlertProvider, useAlert } from '../../contexts/alert-context'
import { SimpleAlertPopup } from './simple-alert-popup'

interface DashboardProps {
  className?: string
}

function DashboardContent({ className }: DashboardProps) {
  const { user, userProfile } = useAuth()
  const { data, kpiData, isLoading, error, refreshData, isRefreshing, selectedTimeframe, setSelectedTimeframe } = useDashboardData()
  const { activeAlert, showAlert, hideAlert } = useAlert()
  // Use unified data for quality score and live status
  const dataQualityScore = data.dataQuality?.overallScore || 95
  const liveDataStatus = data.liveMetrics?.isLiveDataActive || false
  const [currentTime, setCurrentTime] = useState(new Date())
  // Use unified data for system performance
  const systemPerformance = {
    apiResponseTime: data.systemPerformance?.responseTime || 150,
    renderTime: data.systemPerformance?.responseTime || 150,
    memoryUsage: data.systemPerformance?.memoryUsage || 65
  }

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Map icon names to actual icon components for KPI data
  const mappedKpiData = useMemo(() => {
    return kpiData.map((kpi, index) => {
      let IconComponent
      switch (kpi.icon) {
        case 'DollarSign':
          IconComponent = DollarSign
          break
        case 'Users':
          IconComponent = Users
          break
        case 'Target':
          IconComponent = Target
          break
        case 'Activity':
          IconComponent = Activity
          break
        case 'ShoppingCart':
          IconComponent = ShoppingCart
          break
        case 'TrendingUp':
          IconComponent = TrendingUp
          break
        case 'TrendingDown':
          IconComponent = TrendingDown
          break
        case 'BarChart3':
          IconComponent = BarChart3
          break
        case 'Repeat':
          IconComponent = Repeat
          break
        case 'Star':
          IconComponent = Star
          break
        default:
          IconComponent = BarChart3
      }
    
      return {
        ...kpi,
        icon: IconComponent,
        index,
        validationStatus: 'valid' as const,
        lastUpdated: 'Just now',
        comparisonPeriod: 'vs last month'
      }
    })
  }, [kpiData])

  const handleRefresh = useCallback(async () => {
    try {
      await refreshData()
      toast.success('Dashboard data refreshed successfully')
    } catch (error) {
      toast.error('Failed to refresh dashboard data')
    }
  }, [refreshData])

  const handleExport = useCallback(() => {
    toast.success('Export started - you will receive an email when ready')
  }, [])

  return (
    <div className={cn("space-y-6 p-6", className)}>
      <TooltipProvider>
        {/* Redesigned Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl mb-8 overflow-hidden"
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
              className="absolute bottom-6 left-12 w-40 h-40 bg-purple-400/25 rounded-full blur-xl mix-blend-multiply"
            />
          </div>
          
          {/* Black Overlay */}
          <div className="absolute inset-0 bg-black/10 z-0" />
          
          {/* Content with proper z-index */}
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              {/* Left Side - Welcome Info */}
              <div className="flex-1">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-3xl lg:text-4xl font-bold mb-3"
                >
                  Welcome back, {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}! 👋
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-lg text-blue-100 mb-6"
                >
                  Real-time business intelligence with validated data insights
                </motion.p>
                
                {/* Data Indicators in Same Line */}
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
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-medium">Live Data</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-300" />
                    <span className="font-medium">Data Quality:</span>
                    <div className="bg-white/20 rounded-full px-3 py-1">
                      <span className="text-sm font-bold">{dataQualityScore}%</span>
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
                {/* Glassmorphism Timeframe Selector */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <label className="block text-sm font-medium mb-2">Time Period</label>
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
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

        {/* Enhanced KPI Cards with Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8"
        >
          {mappedKpiData.map((kpi, index) => {
            // Mock alert data for demonstration
            const hasAlert = index === 1 || index === 3; // Add alerts to some cards
            const alertMessage = index === 1 
              ? "Revenue target 15% below expected for this period" 
              : "Conversion rate has dropped 2.3% from last week";
            
            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
                className="relative"
              >
                <EnhancedKPICard
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                  trend={kpi.trend}
                  icon={kpi.icon}
                  color={kpi.color}
                  description={kpi.description}
                  hasAlert={hasAlert}
                  alertMessage={alertMessage}
                  onShowAlert={showAlert}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Nested Revenue Overview Structure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="col-span-full"
        >
          {/* Outer Box - Revenue Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mt-12 pt-10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-indigo-500" />
                Revenue Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Track your key performance indicators with validated live data
              </p>
            </div>
            
            {/* Inner Box - Business Metrics Overview */}
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-100 dark:border-gray-600 p-6">

              
              {/* Revenue Chart Component */}
              <div className="mb-6">
                <RevenueOverview />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Sections Grid - Top Products (2/3) & Live Activity (1/3) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Top Products - 2/3 Width */}
          <div className="lg:col-span-2">
            <TopProducts />
          </div>
          
          {/* Live Activity - 1/3 Width */}
          <div className="lg:col-span-1">
            <LiveActivity />
          </div>
        </motion.div>

        {/* Customer Analytics Grid - Customer Segments (1.5/3) & Conversion Funnel (1.5/3) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Customer Segments - 1.5/3 Width */}
          <CustomerSegments />
          
          {/* Conversion Funnel - 1.5/3 Width */}
          <ConversionFunnel />
        </motion.div>

        {/* Quick Actions - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <QuickActionDiv variant="dashboard" />
        </motion.div>

        {/* System Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.85 }}
        >
          <SystemPerformance />
        </motion.div>
        
        {/* Alert Popup - Rendered outside cards for better visibility */}
        {activeAlert && (
          <SimpleAlertPopup
            message={activeAlert.message}
            status={activeAlert.status}
            position={activeAlert.position}
            onClose={hideAlert}
          />
        )}
      </TooltipProvider>
    </div>
  )
}

export default function Dashboard({ className }: DashboardProps) {
  return (
    <DashboardDataProvider>
      <AlertProvider>
        <DashboardContent className={className} />
      </AlertProvider>
    </DashboardDataProvider>
  )
}

// Dashboard Skeleton Component
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Welcome Banner Skeleton */}
      <div className="h-32 bg-muted rounded-lg animate-pulse" />
      
      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
      
      {/* Charts Skeleton */}
      <div className="h-96 bg-muted rounded-lg animate-pulse" />
      <div className="h-64 bg-muted rounded-lg animate-pulse" />
      
      {/* Sections Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  )
}