'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Wifi, 
  WifiOff, 
  Globe, 
  Server, 
  Router, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Database,
  Cloud,
  Monitor,
  Smartphone,
  Laptop
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

interface NetworkStatusModalProps {
  isOpen: boolean
  onClose: () => void
}

interface NetworkMetric {
  id: string
  name: string
  value: number
  unit: string
  status: 'good' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
  icon: React.ComponentType<{ className?: string }>
  description: string
}

interface NetworkDevice {
  id: string
  name: string
  type: 'server' | 'router' | 'switch' | 'firewall' | 'endpoint'
  status: 'online' | 'offline' | 'warning'
  ip: string
  latency: number
  uptime: string
  lastSeen: Date
}

interface TrafficData {
  timestamp: Date
  inbound: number
  outbound: number
  total: number
}

interface ConnectionInfo {
  id: string
  source: string
  destination: string
  protocol: string
  port: number
  status: 'active' | 'closed' | 'listening'
  bandwidth: number
}

export function NetworkStatusModal({ isOpen, onClose }: NetworkStatusModalProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [activeTab, setActiveTab] = useState('overview')
  
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetric[]>([
    {
      id: 'bandwidth',
      name: 'Bandwidth Usage',
      value: 67,
      unit: '%',
      status: 'warning',
      trend: 'up',
      icon: Activity,
      description: 'Current network bandwidth utilization'
    },
    {
      id: 'latency',
      name: 'Average Latency',
      value: 23,
      unit: 'ms',
      status: 'good',
      trend: 'stable',
      icon: Zap,
      description: 'Network response time'
    },
    {
      id: 'throughput',
      name: 'Throughput',
      value: 156,
      unit: 'Mbps',
      status: 'good',
      trend: 'up',
      icon: TrendingUp,
      description: 'Data transfer rate'
    },
    {
      id: 'packet-loss',
      name: 'Packet Loss',
      value: 0.2,
      unit: '%',
      status: 'good',
      trend: 'down',
      icon: TrendingDown,
      description: 'Network packet loss rate'
    },
    {
      id: 'connections',
      name: 'Active Connections',
      value: 1247,
      unit: '',
      status: 'good',
      trend: 'stable',
      icon: Globe,
      description: 'Current active network connections'
    },
    {
      id: 'uptime',
      name: 'Network Uptime',
      value: 99.8,
      unit: '%',
      status: 'good',
      trend: 'stable',
      icon: CheckCircle,
      description: 'Network availability percentage'
    }
  ])

  const [networkDevices, setNetworkDevices] = useState<NetworkDevice[]>([
    {
      id: '1',
      name: 'Main Router',
      type: 'router',
      status: 'online',
      ip: '192.168.1.1',
      latency: 1,
      uptime: '99.9%',
      lastSeen: new Date()
    },
    {
      id: '2',
      name: 'Core Switch',
      type: 'switch',
      status: 'online',
      ip: '192.168.1.2',
      latency: 2,
      uptime: '99.8%',
      lastSeen: new Date()
    },
    {
      id: '3',
      name: 'Web Server',
      type: 'server',
      status: 'online',
      ip: '192.168.1.10',
      latency: 15,
      uptime: '99.7%',
      lastSeen: new Date()
    },
    {
      id: '4',
      name: 'Database Server',
      type: 'server',
      status: 'warning',
      ip: '192.168.1.11',
      latency: 45,
      uptime: '98.5%',
      lastSeen: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: '5',
      name: 'Firewall',
      type: 'firewall',
      status: 'online',
      ip: '192.168.1.254',
      latency: 3,
      uptime: '99.9%',
      lastSeen: new Date()
    }
  ])

  const [activeConnections, setActiveConnections] = useState<ConnectionInfo[]>([
    {
      id: '1',
      source: '192.168.1.100',
      destination: '8.8.8.8',
      protocol: 'HTTPS',
      port: 443,
      status: 'active',
      bandwidth: 2.5
    },
    {
      id: '2',
      source: '192.168.1.101',
      destination: '192.168.1.10',
      protocol: 'HTTP',
      port: 80,
      status: 'active',
      bandwidth: 1.2
    },
    {
      id: '3',
      source: '192.168.1.102',
      destination: '192.168.1.11',
      protocol: 'MySQL',
      port: 3306,
      status: 'active',
      bandwidth: 0.8
    },
    {
      id: '4',
      source: '0.0.0.0',
      destination: '192.168.1.10',
      protocol: 'SSH',
      port: 22,
      status: 'listening',
      bandwidth: 0
    }
  ])

  const refreshNetworkData = async () => {
    setIsRefreshing(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update metrics with realistic variations
      setNetworkMetrics(prev => prev.map(metric => {
        let newValue = metric.value
        switch (metric.id) {
          case 'bandwidth':
            newValue = Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 20))
            break
          case 'latency':
            newValue = Math.max(1, metric.value + (Math.random() - 0.5) * 10)
            break
          case 'throughput':
            newValue = Math.max(0, metric.value + (Math.random() - 0.5) * 50)
            break
          case 'packet-loss':
            newValue = Math.max(0, Math.min(5, metric.value + (Math.random() - 0.5) * 0.5))
            break
          case 'connections':
            newValue = Math.max(0, metric.value + Math.floor((Math.random() - 0.5) * 200))
            break
          default:
            newValue = Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 5))
        }
        
        return {
          ...metric,
          value: newValue,
          status: newValue > 80 ? 'warning' : newValue > 95 ? 'critical' : 'good',
          trend: newValue > metric.value ? 'up' : newValue < metric.value ? 'down' : 'stable'
        }
      }))
      
      // Update device latencies
      setNetworkDevices(prev => prev.map(device => ({
        ...device,
        latency: Math.max(1, device.latency + (Math.random() - 0.5) * 10),
        lastSeen: new Date()
      })))
      
      setLastUpdated(new Date())
      toast.success('Network status refreshed successfully')
    } catch (error) {
      toast.error('Failed to refresh network status')
    } finally {
      setIsRefreshing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
      case 'online':
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'critical':
      case 'offline':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      case 'listening':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
      case 'online':
      case 'active':
        return <CheckCircle className="h-4 w-4" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />
      case 'critical':
      case 'offline':
        return <X className="h-4 w-4" />
      case 'listening':
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'router':
        return <Router className="h-5 w-5" />
      case 'server':
        return <Server className="h-5 w-5" />
      case 'switch':
        return <Activity className="h-5 w-5" />
      case 'firewall':
        return <Globe className="h-5 w-5" />
      case 'endpoint':
        return <Monitor className="h-5 w-5" />
      default:
        return <Server className="h-5 w-5" />
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
        refreshNetworkData()
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
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Wifi className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Network Status
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Real-time network monitoring and device management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshNetworkData}
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
          <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="metrics">Network Metrics</TabsTrigger>
                <TabsTrigger value="devices">Devices</TabsTrigger>
                <TabsTrigger value="connections">Connections</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Network Health Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {networkDevices.filter(d => d.status === 'online').length}
                          </p>
                          <p className="text-sm text-gray-500">Online Devices</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Activity className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {networkMetrics.find(m => m.id === 'throughput')?.value.toFixed(0)}
                          </p>
                          <p className="text-sm text-gray-500">Mbps Throughput</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Zap className="h-8 w-8 text-yellow-600" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {networkMetrics.find(m => m.id === 'latency')?.value.toFixed(0)}
                          </p>
                          <p className="text-sm text-gray-500">ms Latency</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Globe className="h-8 w-8 text-purple-600" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {activeConnections.filter(c => c.status === 'active').length}
                          </p>
                          <p className="text-sm text-gray-500">Active Connections</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Last Updated */}
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {lastUpdated.toLocaleString()} • Auto-refresh: 30s
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {networkMetrics.map((metric) => {
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
                                {metric.value.toFixed(metric.id === 'packet-loss' ? 1 : 0)}{metric.unit}
                              </span>
                            </div>
                            {metric.unit === '%' && (
                              <Progress value={metric.value} className="h-2" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="devices" className="space-y-4">
                <div className="space-y-3">
                  {networkDevices.map((device) => (
                    <Card key={device.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                              {getDeviceIcon(device.type)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {device.name}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {device.ip} • {device.type}
                              </p>
                              <p className="text-xs text-gray-400">
                                Last seen: {device.lastSeen.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {device.latency.toFixed(0)}ms
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Latency
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {device.uptime}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Uptime
                              </p>
                            </div>
                            <Badge className={getStatusColor(device.status)}>
                              {getStatusIcon(device.status)}
                              <span className="ml-1 capitalize">{device.status}</span>
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="connections" className="space-y-4">
                <div className="space-y-3">
                  {activeConnections.map((connection) => (
                    <Card key={connection.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                              <Globe className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {connection.source} → {connection.destination}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {connection.protocol} • Port {connection.port}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {connection.bandwidth > 0 && (
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {connection.bandwidth.toFixed(1)} Mbps
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Bandwidth
                                </p>
                              </div>
                            )}
                            <Badge className={getStatusColor(connection.status)}>
                              {getStatusIcon(connection.status)}
                              <span className="ml-1 capitalize">{connection.status}</span>
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
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

export default NetworkStatusModal