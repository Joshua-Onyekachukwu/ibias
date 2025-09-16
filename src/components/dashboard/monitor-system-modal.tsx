'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Activity, 
  Server, 
  Database, 
  Wifi, 
  HardDrive, 
  Cpu, 
  MemoryStick, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatTime } from '@/lib/utils'
import { toast } from 'sonner'

interface MonitorSystemModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SystemMetric {
  id: string
  name: string
  value: number
  unit: string
  status: 'healthy' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
  icon: React.ComponentType<{ className?: string }>
  description: string
}

interface ServiceStatus {
  id: string
  name: string
  status: 'online' | 'offline' | 'degraded'
  uptime: string
  responseTime: number
  lastCheck: Date
}

export function MonitorSystemModal({ isOpen, onClose }: MonitorSystemModalProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      id: 'cpu',
      name: 'CPU Usage',
      value: 45,
      unit: '%',
      status: 'healthy',
      trend: 'stable',
      icon: Cpu,
      description: 'Current processor utilization'
    },
    {
      id: 'memory',
      name: 'Memory Usage',
      value: 68,
      unit: '%',
      status: 'warning',
      trend: 'up',
      icon: MemoryStick,
      description: 'RAM utilization across all processes'
    },
    {
      id: 'disk',
      name: 'Disk Usage',
      value: 32,
      unit: '%',
      status: 'healthy',
      trend: 'stable',
      icon: HardDrive,
      description: 'Storage space utilization'
    },
    {
      id: 'network',
      name: 'Network I/O',
      value: 156,
      unit: 'Mbps',
      status: 'healthy',
      trend: 'down',
      icon: Wifi,
      description: 'Current network throughput'
    }
  ])

  const [services, setServices] = useState<ServiceStatus[]>([
    {
      id: 'api',
      name: 'API Server',
      status: 'online',
      uptime: '99.9%',
      responseTime: 145,
      lastCheck: new Date()
    },
    {
      id: 'database',
      name: 'Database',
      status: 'online',
      uptime: '99.8%',
      responseTime: 23,
      lastCheck: new Date()
    },
    {
      id: 'cache',
      name: 'Cache Server',
      status: 'degraded',
      uptime: '98.5%',
      responseTime: 89,
      lastCheck: new Date()
    },
    {
      id: 'cdn',
      name: 'CDN',
      status: 'online',
      uptime: '99.9%',
      responseTime: 67,
      lastCheck: new Date()
    }
  ])

  const refreshData = async () => {
    setIsRefreshing(true)
    
    try {
      // Simulate API call to refresh system metrics
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update metrics with random values
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 20)),
        status: Math.random() > 0.8 ? 'warning' : 'healthy',
        trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
      })))
      
      // Update services
      setServices(prev => prev.map(service => ({
        ...service,
        responseTime: Math.max(10, service.responseTime + (Math.random() - 0.5) * 50),
        lastCheck: new Date()
      })))
      
      setLastUpdated(new Date())
      toast.success('System metrics refreshed successfully')
    } catch (error) {
      toast.error('Failed to refresh system metrics')
    } finally {
      setIsRefreshing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      case 'warning':
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'critical':
      case 'offline':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'online':
        return <CheckCircle className="h-4 w-4" />
      case 'warning':
      case 'degraded':
        return <AlertTriangle className="h-4 w-4" />
      case 'critical':
      case 'offline':
        return <X className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-red-500" />
      case 'down':
        return <TrendingDown className="h-3 w-3 text-green-500" />
      default:
        return null
    }
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!isOpen) return
    
    const interval = setInterval(() => {
      if (!isRefreshing) {
        refreshData()
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [isOpen, isRefreshing])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  System Monitor
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Real-time system performance and health monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[calc(90vh-140px)] overflow-y-auto">
            {/* Last Updated */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Last updated: {formatTime(lastUpdated)}</span>
              <span>Auto-refresh: 30s</span>
            </div>

            {/* System Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                System Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {metrics.map((metric) => {
                  const IconComponent = metric.icon
                  return (
                    <Card key={metric.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            <CardTitle className="text-base">{metric.name}</CardTitle>
                          </div>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(metric.trend)}
                            <Badge className={getStatusColor(metric.status)}>
                              {getStatusIcon(metric.status)}
                              <span className="ml-1 capitalize">{metric.status}</span>
                            </Badge>
                          </div>
                        </div>
                        <CardDescription>{metric.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                              {metric.value.toFixed(1)}{metric.unit}
                            </span>
                          </div>
                          <Progress 
                            value={metric.value} 
                            className="h-2"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Service Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Service Status
              </h3>
              <div className="space-y-3">
                {services.map((service) => (
                  <Card key={service.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Server className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {service.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Last checked: {formatTime(service.lastCheck)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {service.responseTime}ms
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Response time
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {service.uptime}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Uptime
                            </p>
                          </div>
                          <Badge className={getStatusColor(service.status)}>
                            {getStatusIcon(service.status)}
                            <span className="ml-1 capitalize">{service.status}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* System Alerts */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Alerts
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Memory usage above 65% threshold
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      2 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Database connection restored
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      5 minutes ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default MonitorSystemModal