'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  RefreshCw, 
  Download, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Wifi
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { dashboardData } from '@/lib/dummy-data'
import { cn } from '@/lib/utils'

interface WelcomeBannerProps {
  userName?: string
  onRefresh?: () => void
  onExport?: () => void
  onTimePeriodChange?: (period: string) => void
}

export function WelcomeBanner({
  userName = dashboardData.user.name,
  onRefresh,
  onExport,
  onTimePeriodChange,
}: WelcomeBannerProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [timePeriod, setTimePeriod] = useState('7d')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  
  const handleRefresh = async () => {
    setIsRefreshing(true)
    setLastUpdated(new Date())
    
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false)
      onRefresh?.()
    }, 1500)
  }
  
  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period)
    onTimePeriodChange?.(period)
  }
  
  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }
  
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Welcome Section */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  Welcome back, {userName} 👋
                </h1>
                <p className="text-muted-foreground text-base lg:text-lg mb-4">
                  Real-time business intelligence with validated data insights
                </p>
                
                {/* Date and Status Row */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{getCurrentDate()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-green-500" />
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Live Data
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {dashboardData.dataQuality.overall}% Quality
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Updated {formatLastUpdated(lastUpdated)}</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Controls Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              {/* Time Period Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  Time Period:
                </span>
                <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">Last 24h</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={cn(
                    'w-4 h-4',
                    isRefreshing && 'animate-spin'
                  )} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExport}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </motion.div>
          </div>
          
          {/* Data Quality Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-4 pt-4 border-t border-border/50"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>Data Completeness: {dashboardData.dataQuality.completeness}%</span>
                <span>Accuracy: {dashboardData.dataQuality.accuracy}%</span>
                <span>Consistency: {dashboardData.dataQuality.consistency}%</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Real-time sync active</span>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}