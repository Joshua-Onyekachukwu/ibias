'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Key, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Users,
  Database,
  Globe,
  Server,
  Wifi,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

interface SecurityStatusModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SecurityMetric {
  id: string
  name: string
  status: 'secure' | 'warning' | 'critical'
  score: number
  description: string
  lastCheck: Date
  icon: React.ComponentType<{ className?: string }>
}

interface SecurityEvent {
  id: string
  type: 'login' | 'access' | 'threat' | 'update'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: Date
  resolved: boolean
}

interface ComplianceItem {
  id: string
  name: string
  status: 'compliant' | 'partial' | 'non-compliant'
  description: string
  lastAudit: Date
}

export function SecurityStatusModal({ isOpen, onClose }: SecurityStatusModalProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [activeTab, setActiveTab] = useState('overview')
  
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([
    {
      id: 'firewall',
      name: 'Firewall Protection',
      status: 'secure',
      score: 98,
      description: 'Network firewall is active and blocking threats',
      lastCheck: new Date(),
      icon: Shield
    },
    {
      id: 'encryption',
      name: 'Data Encryption',
      status: 'secure',
      score: 95,
      description: 'All data encrypted with AES-256',
      lastCheck: new Date(),
      icon: Lock
    },
    {
      id: 'authentication',
      name: 'Authentication',
      status: 'warning',
      score: 78,
      description: 'Some users without 2FA enabled',
      lastCheck: new Date(),
      icon: Key
    },
    {
      id: 'access-control',
      name: 'Access Control',
      status: 'secure',
      score: 92,
      description: 'Role-based access control active',
      lastCheck: new Date(),
      icon: Users
    },
    {
      id: 'vulnerability',
      name: 'Vulnerability Scan',
      status: 'warning',
      score: 85,
      description: '2 medium-risk vulnerabilities found',
      lastCheck: new Date(),
      icon: Eye
    },
    {
      id: 'backup',
      name: 'Data Backup',
      status: 'secure',
      score: 96,
      description: 'Automated backups running successfully',
      lastCheck: new Date(),
      icon: Database
    }
  ])

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'threat',
      severity: 'high',
      message: 'Suspicious login attempt blocked from IP 192.168.1.100',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      resolved: true
    },
    {
      id: '2',
      type: 'access',
      severity: 'medium',
      message: 'Admin user accessed sensitive data outside business hours',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolved: false
    },
    {
      id: '3',
      type: 'update',
      severity: 'low',
      message: 'Security patches applied successfully',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      resolved: true
    },
    {
      id: '4',
      type: 'login',
      severity: 'low',
      message: 'New device login detected for user john@company.com',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      resolved: true
    }
  ])

  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([
    {
      id: 'soc2',
      name: 'SOC 2 Type II',
      status: 'compliant',
      description: 'Security controls meet SOC 2 requirements',
      lastAudit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'gdpr',
      name: 'GDPR Compliance',
      status: 'compliant',
      description: 'Data protection measures meet GDPR standards',
      lastAudit: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'iso27001',
      name: 'ISO 27001',
      status: 'partial',
      description: 'Information security management system partially implemented',
      lastAudit: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'pci-dss',
      name: 'PCI DSS',
      status: 'compliant',
      description: 'Payment card data security standards met',
      lastAudit: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
    }
  ])

  const refreshSecurityData = async () => {
    setIsRefreshing(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update metrics with slight variations
      setSecurityMetrics(prev => prev.map(metric => ({
        ...metric,
        score: Math.max(70, Math.min(100, metric.score + (Math.random() - 0.5) * 10)),
        lastCheck: new Date()
      })))
      
      setLastUpdated(new Date())
      toast.success('Security status refreshed successfully')
    } catch (error) {
      toast.error('Failed to refresh security status')
    } finally {
      setIsRefreshing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure':
      case 'compliant':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      case 'warning':
      case 'partial':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'critical':
      case 'non-compliant':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'secure':
      case 'compliant':
        return <ShieldCheck className="h-4 w-4" />
      case 'warning':
      case 'partial':
        return <ShieldAlert className="h-4 w-4" />
      case 'critical':
      case 'non-compliant':
        return <Shield className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30'
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <Key className="h-4 w-4" />
      case 'access':
        return <Eye className="h-4 w-4" />
      case 'threat':
        return <AlertTriangle className="h-4 w-4" />
      case 'update':
        return <RefreshCw className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const overallSecurityScore = Math.round(
    securityMetrics.reduce((sum, metric) => sum + metric.score, 0) / securityMetrics.length
  )

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Security Status
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Comprehensive security monitoring and compliance overview
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshSecurityData}
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
                <TabsTrigger value="metrics">Security Metrics</TabsTrigger>
                <TabsTrigger value="events">Security Events</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Overall Security Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                      Overall Security Score
                    </CardTitle>
                    <CardDescription>
                      Comprehensive security posture assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-bold text-green-600">
                        {overallSecurityScore}%
                      </div>
                      <div className="flex-1">
                        <Progress value={overallSecurityScore} className="h-3" />
                        <p className="text-sm text-gray-500 mt-1">
                          Last updated: {lastUpdated.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {securityMetrics.filter(m => m.status === 'secure').length}
                          </p>
                          <p className="text-sm text-gray-500">Secure Components</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-8 w-8 text-yellow-600" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {securityEvents.filter(e => !e.resolved).length}
                          </p>
                          <p className="text-sm text-gray-500">Active Alerts</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {complianceItems.filter(c => c.status === 'compliant').length}
                          </p>
                          <p className="text-sm text-gray-500">Compliant Standards</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="metrics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {securityMetrics.map((metric) => {
                    const IconComponent = metric.icon
                    return (
                      <Card key={metric.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                              <CardTitle className="text-base">{metric.name}</CardTitle>
                            </div>
                            <Badge className={getStatusColor(metric.status)}>
                              {getStatusIcon(metric.status)}
                              <span className="ml-1 capitalize">{metric.status}</span>
                            </Badge>
                          </div>
                          <CardDescription>{metric.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                {metric.score}%
                              </span>
                              <span className="text-sm text-gray-500">
                                {metric.lastCheck.toLocaleTimeString()}
                              </span>
                            </div>
                            <Progress value={metric.score} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="events" className="space-y-4">
                <div className="space-y-3">
                  {securityEvents.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            {getEventIcon(event.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getSeverityColor(event.severity)}>
                                {event.severity.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {event.timestamp.toLocaleString()}
                              </span>
                              {event.resolved && (
                                <Badge className="text-green-600 bg-green-100 dark:bg-green-900/30">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Resolved
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {event.message}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-4">
                <div className="space-y-3">
                  {complianceItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {item.description}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Last audit: {item.lastAudit.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusIcon(item.status)}
                            <span className="ml-1 capitalize">{item.status}</span>
                          </Badge>
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

export default SecurityStatusModal