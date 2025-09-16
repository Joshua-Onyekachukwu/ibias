'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Plug,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
  Trash2,
  RefreshCw,
  ExternalLink,
  Download,
  Upload,
  Database,
  Globe,
  Smartphone,
  Mail,
  MessageSquare,
  ShoppingCart,
  BarChart3,
  Users,
  CreditCard,
  Calendar,
  FileText,
  Zap,
  Star,
  Shield,
  Key,
  Link,
  Activity,
  Wifi,
  WifiOff
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface Integration {
  id: string
  name: string
  description: string
  category: string
  icon: any
  status: 'connected' | 'disconnected' | 'error' | 'pending'
  isActive: boolean
  lastSync?: Date
  syncFrequency?: string
  dataPoints?: number
  version?: string
  provider: string
  features: string[]
  pricing?: string
  popularity: number
  rating: number
  setupComplexity: 'easy' | 'medium' | 'complex'
  documentation?: string
}

interface ConnectionLog {
  id: string
  integrationId: string
  timestamp: Date
  type: 'sync' | 'error' | 'connect' | 'disconnect'
  message: string
  status: 'success' | 'error' | 'warning'
}

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isConnecting, setIsConnecting] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)

  // Mock integrations data
  const integrations: Integration[] = [
    {
      id: '1',
      name: 'Shopify',
      description: 'E-commerce platform integration for sales and inventory data',
      category: 'E-commerce',
      icon: ShoppingCart,
      status: 'connected',
      isActive: true,
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      syncFrequency: 'Every 15 minutes',
      dataPoints: 15420,
      version: '2.1.0',
      provider: 'Shopify Inc.',
      features: ['Sales Data', 'Inventory Sync', 'Customer Data', 'Order Management'],
      pricing: 'Free',
      popularity: 95,
      rating: 4.8,
      setupComplexity: 'easy',
      documentation: 'https://docs.shopify.com/api'
    },
    {
      id: '2',
      name: 'Google Analytics',
      description: 'Web analytics and traffic insights integration',
      category: 'Analytics',
      icon: BarChart3,
      status: 'connected',
      isActive: true,
      lastSync: new Date(Date.now() - 5 * 60 * 1000),
      syncFrequency: 'Every hour',
      dataPoints: 8934,
      version: '4.0.2',
      provider: 'Google',
      features: ['Traffic Analytics', 'Conversion Tracking', 'Audience Insights', 'Goal Tracking'],
      pricing: 'Free',
      popularity: 98,
      rating: 4.9,
      setupComplexity: 'medium',
      documentation: 'https://developers.google.com/analytics'
    },
    {
      id: '3',
      name: 'Stripe',
      description: 'Payment processing and financial data integration',
      category: 'Payments',
      icon: CreditCard,
      status: 'connected',
      isActive: true,
      lastSync: new Date(Date.now() - 10 * 60 * 1000),
      syncFrequency: 'Real-time',
      dataPoints: 5672,
      version: '3.2.1',
      provider: 'Stripe Inc.',
      features: ['Payment Data', 'Subscription Management', 'Refund Tracking', 'Customer Billing'],
      pricing: '2.9% + 30¢',
      popularity: 92,
      rating: 4.7,
      setupComplexity: 'easy',
      documentation: 'https://stripe.com/docs/api'
    },
    {
      id: '4',
      name: 'Mailchimp',
      description: 'Email marketing and campaign management integration',
      category: 'Marketing',
      icon: Mail,
      status: 'error',
      isActive: false,
      lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
      syncFrequency: 'Daily',
      dataPoints: 3241,
      version: '1.8.5',
      provider: 'Mailchimp',
      features: ['Email Campaigns', 'Subscriber Management', 'Analytics', 'Automation'],
      pricing: 'Free up to 2,000 contacts',
      popularity: 87,
      rating: 4.5,
      setupComplexity: 'medium',
      documentation: 'https://mailchimp.com/developer/'
    },
    {
      id: '5',
      name: 'Slack',
      description: 'Team communication and notification integration',
      category: 'Communication',
      icon: MessageSquare,
      status: 'connected',
      isActive: true,
      lastSync: new Date(Date.now() - 1 * 60 * 1000),
      syncFrequency: 'Real-time',
      dataPoints: 892,
      version: '2.0.3',
      provider: 'Slack Technologies',
      features: ['Notifications', 'Alerts', 'Team Updates', 'Bot Integration'],
      pricing: 'Free',
      popularity: 89,
      rating: 4.6,
      setupComplexity: 'easy',
      documentation: 'https://api.slack.com/'
    },
    {
      id: '6',
      name: 'HubSpot',
      description: 'CRM and marketing automation platform integration',
      category: 'CRM',
      icon: Users,
      status: 'disconnected',
      isActive: false,
      provider: 'HubSpot Inc.',
      features: ['Contact Management', 'Lead Tracking', 'Sales Pipeline', 'Marketing Automation'],
      pricing: 'Free tier available',
      popularity: 85,
      rating: 4.4,
      setupComplexity: 'complex',
      documentation: 'https://developers.hubspot.com/'
    },
    {
      id: '7',
      name: 'Zapier',
      description: 'Automation platform for connecting apps and workflows',
      category: 'Automation',
      icon: Zap,
      status: 'pending',
      isActive: false,
      provider: 'Zapier Inc.',
      features: ['Workflow Automation', 'App Connections', 'Triggers', 'Actions'],
      pricing: 'Free tier available',
      popularity: 91,
      rating: 4.7,
      setupComplexity: 'medium',
      documentation: 'https://zapier.com/developer/'
    },
    {
      id: '8',
      name: 'Salesforce',
      description: 'Enterprise CRM and sales management integration',
      category: 'CRM',
      icon: Database,
      status: 'disconnected',
      isActive: false,
      provider: 'Salesforce Inc.',
      features: ['Sales Management', 'Lead Tracking', 'Opportunity Management', 'Reporting'],
      pricing: 'Starting at $25/user/month',
      popularity: 88,
      rating: 4.3,
      setupComplexity: 'complex',
      documentation: 'https://developer.salesforce.com/'
    }
  ]

  // Mock connection logs
  const connectionLogs: ConnectionLog[] = [
    {
      id: '1',
      integrationId: '1',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'sync',
      message: 'Successfully synced 245 new orders from Shopify',
      status: 'success'
    },
    {
      id: '2',
      integrationId: '2',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      type: 'sync',
      message: 'Google Analytics data updated with latest traffic metrics',
      status: 'success'
    },
    {
      id: '3',
      integrationId: '4',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'error',
      message: 'Mailchimp API authentication failed - token expired',
      status: 'error'
    },
    {
      id: '4',
      integrationId: '3',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      type: 'sync',
      message: 'Stripe payment data synchronized successfully',
      status: 'success'
    }
  ]

  const categories = ['all', 'E-commerce', 'Analytics', 'Payments', 'Marketing', 'Communication', 'CRM', 'Automation']
  const statuses = ['all', 'connected', 'disconnected', 'error', 'pending']

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <WifiOff className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'easy':
        return 'text-success'
      case 'medium':
        return 'text-warning'
      case 'complex':
        return 'text-destructive'
      default:
        return 'text-muted-foreground'
    }
  }

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = searchQuery === '' || 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || integration.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleConnect = async (integrationId: string) => {
    setIsConnecting(integrationId)
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConnecting(null)
    toast.success('Integration connected successfully!')
  }

  const handleDisconnect = async (integrationId: string) => {
    toast.success('Integration disconnected')
  }

  const handleToggleActive = (integrationId: string, isActive: boolean) => {
    toast.success(`Integration ${isActive ? 'activated' : 'deactivated'}`)
  }

  const handleSync = async (integrationId: string) => {
    toast.success('Manual sync initiated')
  }

  const connectedCount = integrations.filter(i => i.status === 'connected').length
  const errorCount = integrations.filter(i => i.status === 'error').length
  const totalDataPoints = integrations.reduce((sum, i) => sum + (i.dataPoints || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Plug className="h-7 w-7 text-blue-600" />
            Integrations
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect and manage third-party integrations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Config
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Integration</DialogTitle>
                <DialogDescription>
                  Browse and connect new integrations to enhance your dashboard
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Integration Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select integration type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="payments">Payments</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="crm">CRM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>API Endpoint</Label>
                  <Input placeholder="https://api.example.com" />
                </div>
                <div>
                  <Label>API Key</Label>
                  <Input type="password" placeholder="Enter API key" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="Brief description of this integration" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowAddDialog(false)}>
                  Connect Integration
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-2xl font-bold text-green-600">{connectedCount}</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Wifi className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Errors</p>
                <p className="text-2xl font-bold text-red-600">{errorCount}</p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Data Points</p>
                <p className="text-2xl font-bold text-blue-600">{totalDataPoints.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
                <p className="text-2xl font-bold text-purple-600">{integrations.length}</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Plug className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map(status => (
              <SelectItem key={status} value={status}>
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Integrations Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Integrations</TabsTrigger>
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredIntegrations.map((integration, index) => {
              const Icon = integration.icon
              return (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <Icon className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            <CardDescription className="text-sm">{integration.provider}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(integration.status)}>
                            {getStatusIcon(integration.status)}
                            <span className="ml-1">{integration.status}</span>
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {integration.status === 'connected' ? (
                                <>
                                  <DropdownMenuItem onClick={() => handleSync(integration.id)}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Sync Now
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDisconnect(integration.id)}>
                                    <WifiOff className="mr-2 h-4 w-4" />
                                    Disconnect
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <DropdownMenuItem onClick={() => handleConnect(integration.id)}>
                                  <Wifi className="mr-2 h-4 w-4" />
                                  Connect
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Configure
                              </DropdownMenuItem>
                              {integration.documentation && (
                                <DropdownMenuItem>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Documentation
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{integration.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                          <p className="font-medium text-gray-900 dark:text-white">{integration.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Pricing</p>
                          <p className="font-medium text-gray-900 dark:text-white">{integration.pricing}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Setup</p>
                          <p className={cn("font-medium", getComplexityColor(integration.setupComplexity))}>
                            {integration.setupComplexity.charAt(0).toUpperCase() + integration.setupComplexity.slice(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium text-gray-900 dark:text-white">{integration.rating}</span>
                          </div>
                        </div>
                      </div>

                      {integration.status === 'connected' && (
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Active</span>
                            <Switch 
                              checked={integration.isActive} 
                              onCheckedChange={(checked) => handleToggleActive(integration.id, checked)}
                            />
                          </div>
                          {integration.lastSync && (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Last Sync</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {integration.lastSync.toLocaleString()}
                              </p>
                            </div>
                          )}
                          {integration.dataPoints && (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Data Points</p>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {integration.dataPoints.toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mb-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Features</p>
                        <div className="flex flex-wrap gap-1">
                          {integration.features.slice(0, 3).map((feature, featureIndex) => (
                            <Badge key={featureIndex} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {integration.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{integration.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Progress value={integration.popularity} className="w-20" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {integration.popularity}% popular
                          </span>
                        </div>
                        {integration.status === 'connected' ? (
                          <Button size="sm" variant="outline" onClick={() => handleSync(integration.id)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleConnect(integration.id)}
                            disabled={isConnecting === integration.id}
                          >
                            {isConnecting === integration.id ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Connecting...
                              </>
                            ) : (
                              <>
                                <Plug className="h-4 w-4 mr-2" />
                                Connect
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="connected" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredIntegrations.filter(i => i.status === 'connected').map((integration, index) => {
              const Icon = integration.icon
              return (
                <Card key={integration.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-green-600" />
                        <div>
                          <CardTitle>{integration.name}</CardTitle>
                          <CardDescription>Connected and syncing</CardDescription>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <Activity className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Sync Frequency</span>
                        <span className="text-sm font-medium">{integration.syncFrequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Data Points</span>
                        <span className="text-sm font-medium">{integration.dataPoints?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Last Sync</span>
                        <span className="text-sm font-medium">
                          {integration.lastSync?.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {filteredIntegrations.filter(i => i.status === 'disconnected').map((integration, index) => {
              const Icon = integration.icon
              return (
                <Card key={integration.id} className="text-center">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
                        <Icon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{integration.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{integration.description}</p>
                      <div className="flex items-center gap-1 mb-4">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{integration.rating}</span>
                        <span className="text-sm text-gray-500">({integration.popularity}% use this)</span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleConnect(integration.id)}
                        disabled={isConnecting === integration.id}
                        className="w-full"
                      >
                        {isConnecting === integration.id ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Integration
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>Recent integration activity and sync history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connectionLogs.map((log) => {
                  const integration = integrations.find(i => i.id === log.integrationId)
                  const Icon = integration?.icon || Activity
                  return (
                    <div key={log.id} className="flex items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className={cn(
                        "p-2 rounded-lg",
                        log.status === 'success' ? 'bg-green-100 dark:bg-green-900/20' :
                        log.status === 'error' ? 'bg-red-100 dark:bg-red-900/20' :
                        'bg-yellow-100 dark:bg-yellow-900/20'
                      )}>
                        <Icon className={cn(
                          "h-4 w-4",
                          log.status === 'success' ? 'text-green-600' :
                          log.status === 'error' ? 'text-red-600' :
                          'text-yellow-600'
                        )} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {integration?.name || 'Unknown Integration'}
                          </h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {log.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{log.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {log.type}
                          </Badge>
                          <Badge className={cn(
                            "text-xs",
                            log.status === 'success' ? 'bg-green-100 text-green-800' :
                            log.status === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          )}>
                            {log.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}