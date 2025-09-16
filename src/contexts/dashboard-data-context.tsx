'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react'
import { formatTime } from '@/lib/utils'
import { 
  UnifiedDashboardData, 
  generateUnifiedDashboardData, 
  formatCurrency as formatCurrencyUtil,
  formatNumber as formatNumberUtil,
  formatPercentage as formatPercentageUtil,
  formatTimeAgo,
  updateLiveMetrics
} from '@/lib/unified-dashboard-data'

interface KPIData {
  id: string
  title: string
  value: string
  change: number
  trend: 'up' | 'down' | 'neutral'
  icon: string
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'orange' | 'indigo' | 'emerald' | 'amber' | 'cyan' | 'teal'
  hasAlert?: boolean
  alertMessage?: string
  description?: string
}

interface DashboardDataContextType {
  data: UnifiedDashboardData
  kpiData: KPIData[]
  refreshData: () => void
  isRefreshing: boolean
  isLoading: boolean
  error: string | null
  selectedTimeframe: string
  setSelectedTimeframe: (timeframe: string) => void
  // Enhanced live sync capabilities
  enableLiveSync: () => void
  disableLiveSync: () => void
  validateDataConsistency: () => boolean
  getDataValidationReport: () => { isValid: boolean; errors: string[] }
  // Export and reporting capabilities
  exportData: (format: 'pdf' | 'csv' | 'excel', filters?: any) => Promise<void>
  generateReport: (options: any) => Promise<void>
}

const DashboardDataContext = createContext<DashboardDataContextType | undefined>(undefined)

// Use unified data source for live activities
const generateLiveActivities = () => {
  const unifiedData = generateUnifiedDashboardData()
  return unifiedData.liveActivities
}

// Use unified data source for mock data
const generateMockData = (previousData?: UnifiedDashboardData): UnifiedDashboardData => {
  return generateUnifiedDashboardData()
}

// Generate KPI data from unified data source
const generateKPIData = (data: UnifiedDashboardData): KPIData[] => {
  return data.kpiData.map(kpi => ({
    id: kpi.id,
    title: kpi.title,
    value: kpi.value,
    change: parseFloat(kpi.change.replace('%', '')) || 0,
    trend: kpi.trend === 'stable' ? 'neutral' : kpi.trend as 'up' | 'down' | 'neutral',
    icon: kpi.icon,
    color: kpi.color as 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'orange' | 'indigo' | 'emerald' | 'amber' | 'cyan' | 'teal',
    description: kpi.description
  }))
}

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<UnifiedDashboardData>(() => generateMockData())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d')
  const [isLiveSyncEnabled, setIsLiveSyncEnabled] = useState(true)

  // Generate KPI data based on current data
  const kpiData = useMemo(() => generateKPIData(data), [data])

  // Live data refresh effect
  useEffect(() => {
    if (!isLiveSyncEnabled) return

    const interval = setInterval(() => {
      setData(prevData => {
        const updatedData = updateLiveMetrics({
          activeSessions: prevData.liveMetrics.activeSessions,
          revenueToday: prevData.liveMetrics.revenueToday,
          conversionRate: prevData.liveMetrics.conversionRate,
          customerSatisfaction: prevData.liveMetrics.customerSatisfaction
        })
        return {
          ...prevData,
          liveMetrics: {
            ...prevData.liveMetrics,
            ...updatedData,
            lastUpdated: new Date().toISOString()
          }
        }
      })
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isLiveSyncEnabled])

  const refreshData = useCallback(async () => {
    setIsRefreshing(true)
    setError(null)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newData = generateMockData()
      setData(newData)
    } catch (err) {
      setError('Failed to refresh data')
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  const enableLiveSync = useCallback(() => {
    setIsLiveSyncEnabled(true)
  }, [])

  const disableLiveSync = useCallback(() => {
    setIsLiveSyncEnabled(false)
  }, [])

  const validateDataConsistency = useCallback(() => {
    if (!data) return false
    
    // Check if customer segments add up to total customers
    const segmentTotal = data.customerDistribution.segments.reduce((sum, segment) => sum + segment.value, 0)
    const customerTotal = data.businessSummary.totalCustomers
    const segmentVariance = Math.abs(segmentTotal - customerTotal) / customerTotal
    
    // Check if conversion funnel percentages are logical
    const overallConversion = data.conversionAnalytics.overallConversion
    
    return segmentVariance < 0.05 && overallConversion > 0
  }, [data])

  const getDataValidationReport = useCallback(() => {
    if (!data) return { isValid: false, errors: ['No data available'] }
    
    const errors: string[] = []
    
    // Check customer segment consistency
    const segmentTotal = data.customerDistribution.segments.reduce((sum, segment) => sum + segment.value, 0)
    const customerTotal = data.businessSummary.totalCustomers
    if (Math.abs(segmentTotal - customerTotal) > customerTotal * 0.05) {
      errors.push('Customer segment totals do not match total customers')
    }
    
    // Check conversion funnel logic
    const conversionRate = data.conversionAnalytics.overallConversion
    if (conversionRate <= 0 || conversionRate > 100) {
      errors.push('Invalid conversion rate detected')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }, [data])

  const exportData = useCallback(async (format: 'pdf' | 'csv' | 'excel', filters?: any) => {
    // Simulate export functionality
    console.log(`Exporting data as ${format}`, { data, filters })
    await new Promise(resolve => setTimeout(resolve, 2000))
  }, [data])

  const generateReport = useCallback(async (options: any) => {
    // Simulate report generation
    console.log('Generating report', { data, options })
    await new Promise(resolve => setTimeout(resolve, 3000))
  }, [data])

  const contextValue: DashboardDataContextType = {
    data,
    kpiData,
    refreshData,
    isRefreshing,
    isLoading,
    error,
    selectedTimeframe,
    setSelectedTimeframe,
    enableLiveSync,
    disableLiveSync,
    validateDataConsistency,
    getDataValidationReport,
    exportData,
    generateReport
  }

  return (
    <DashboardDataContext.Provider value={contextValue}>
      {children}
    </DashboardDataContext.Provider>
  )
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext)
  if (context === undefined) {
    throw new Error('useDashboardData must be used within a DashboardDataProvider')
  }
  return context
}

// Re-export utility functions from unified data source
export const formatCurrency = formatCurrencyUtil
export const formatNumber = formatNumberUtil
export const formatPercentage = formatPercentageUtil

// Additional helper function
export const formatFullNumber = (num: number): string => {
  return num.toLocaleString();
}