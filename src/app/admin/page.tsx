'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Shield,
  Settings,
  Database,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Crown,
  Zap,
  Brain,
  Target,
  MessageSquare,
  FileText,
  Globe,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  CreditCard,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
  Star,
  ThumbsUp,
  ThumbsDown,
  Loader2
} from 'lucide-react'

interface User {
  id: string
  email: string
  full_name: string
  company: string
  plan: 'free' | 'basic' | 'pro' | 'enterprise'
  status: 'active' | 'suspended' | 'pending'
  created_at: string
  last_login: string
  total_revenue: number
  usage_stats: {
    api_calls: number
    data_sources: number
    reports_generated: number
    ai_insights_used: number
  }
}

interface SystemMetric {
  name: string
  value: number
  unit: string
  change: number
  status: 'good' | 'warning' | 'critical'
}

interface AIModel {
  id: string
  name: string
  version: string
  accuracy: number
  last_trained: string
  status: 'active' | 'training' | 'deprecated'
  recommendations_generated: number
  success_rate: number
  avg_user_rating: number
}

const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@company.com',
    full_name: 'John Doe',
    company: 'Tech Corp',
    plan: 'enterprise',
    status: 'active',
    created_at: '2024-01-15',
    last_login: '2024-01-30',
    total_revenue: 2400,
    usage_stats: {
      api_calls: 15420,
      data_sources: 8,
      reports_generated: 45,
      ai_insights_used: 234
    }
  },
  {
    id: '2',
    email: 'sarah.smith@startup.io',
    full_name: 'Sarah Smith',
    company: 'Startup Inc',
    plan: 'pro',
    status: 'active',
    created_at: '2024-01-20',
    last_login: '2024-01-29',
    total_revenue: 588,
    usage_stats: {
      api_calls: 8750,
      data_sources: 5,
      reports_generated: 28,
      ai_insights_used: 156
    }
  },
  {
    id: '3',
    email: 'mike.wilson@business.com',
    full_name: 'Mike Wilson',
    company: 'Business Solutions',
    plan: 'basic',
    status: 'active',
    created_at: '2024-01-25',
    last_login: '2024-01-28',
    total_revenue: 156,
    usage_stats: {
      api_calls: 3200,
      data_sources: 3,
      reports_generated: 12,
      ai_insights_used: 45
    }
  },
  {
    id: '4',
    email: 'lisa.brown@enterprise.org',
    full_name: 'Lisa Brown',
    company: 'Enterprise Org',
    plan: 'enterprise',
    status: 'suspended',
    created_at: '2024-01-10',
    last_login: '2024-01-25',
    total_revenue: 3600,
    usage_stats: {
      api_calls: 22100,
      data_sources: 12,
      reports_generated: 67,
      ai_insights_used: 345
    }
  },
  {
    id: '5',
    email: 'david.lee@freelance.com',
    full_name: 'David Lee',
    company: 'Freelance',
    plan: 'free',
    status: 'active',
    created_at: '2024-01-28',
    last_login: '2024-01-30',
    total_revenue: 0,
    usage_stats: {
      api_calls: 450,
      data_sources: 1,
      reports_generated: 3,
      ai_insights_used: 8
    }
  }
]

const systemMetrics: SystemMetric[] = [
  { name: 'Server Uptime', value: 99.9, unit: '%', change: 0.1, status: 'good' },
  { name: 'API Response Time', value: 145, unit: 'ms', change: -12, status: 'good' },
  { name: 'Database Load', value: 67, unit: '%', change: 5, status: 'warning' },
  { name: 'Error Rate', value: 0.2, unit: '%', change: -0.1, status: 'good' },
  { name: 'Active Sessions', value: 1247, unit: '', change: 89, status: 'good' },
  { name: 'Storage Usage', value: 78, unit: '%', change: 3, status: 'warning' }
]

const aiModels: AIModel[] = [
  {
    id: '1',
    name: 'Revenue Predictor',
    version: 'v2.1.4',
    accuracy: 89.2,
    last_trained: '2024-01-28',
    status: 'active',
    recommendations_generated: 1247,
    success_rate: 87.3,
    avg_user_rating: 4.2
  },
  {
    id: '2',
    name: 'Customer Churn Detector',
    version: 'v1.8.2',
    accuracy: 92.1,
    last_trained: '2024-01-25',
    status: 'active',
    recommendations_generated: 856,
    success_rate: 91.5,
    avg_user_rating: 4.5
  },
  {
    id: '3',
    name: 'Market Trend Analyzer',
    version: 'v3.0.1',
    accuracy: 85.7,
    last_trained: '2024-01-30',
    status: 'training',
    recommendations_generated: 2134,
    success_rate: 83.2,
    avg_user_rating: 4.0
  },
  {
    id: '4',
    name: 'Pricing Optimizer',
    version: 'v1.5.3',
    accuracy: 78.9,
    last_trained: '2024-01-20',
    status: 'deprecated',
    recommendations_generated: 445,
    success_rate: 76.8,
    avg_user_rating: 3.6
  }
]

export default function AdminPanel() {
  const { user, profile, loading } = useAuth()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const router = useRouter()

  // Check if user is admin
  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      router.push('/')
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user || profile?.role !== 'admin') {
    return null
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlan = selectedPlan === 'all' || user.plan === selectedPlan
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
    return matchesSearch && matchesPlan && matchesStatus
  })

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800'
      case 'pro': return 'bg-blue-100 text-blue-800'
      case 'basic': return 'bg-green-100 text-green-800'
      case 'free': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'training': return 'bg-blue-100 text-blue-800'
      case 'deprecated': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleUserStatusChange = (userId: string, newStatus: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus as any } : user
    ))
  }

  const totalUsers = users.length
  const activeUsers = users.filter(u => u.status === 'active').length
  const totalRevenue = users.reduce((sum, user) => sum + user.total_revenue, 0)
  const avgRevenue = totalRevenue / totalUsers

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">IBIAS Admin Panel</h1>
                <p className="text-sm text-gray-600">System administration and user management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button size="sm">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
              <p className="text-xs text-gray-500 mt-1">{((activeUsers/totalUsers)*100).toFixed(1)}% active rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">+18% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Revenue/User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">${avgRevenue.toFixed(0)}</div>
              <p className="text-xs text-green-600 mt-1">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="system">System Health</TabsTrigger>
            <TabsTrigger value="ai-models">AI Models</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={selectedPlan === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPlan('all')}
                >
                  All Plans
                </Button>
                <Button
                  variant={selectedPlan === 'enterprise' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPlan('enterprise')}
                >
                  Enterprise
                </Button>
                <Button
                  variant={selectedPlan === 'pro' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPlan('pro')}
                >
                  Pro
                </Button>
                <Button
                  variant={selectedPlan === 'basic' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPlan('basic')}
                >
                  Basic
                </Button>
                <Button
                  variant={selectedPlan === 'free' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPlan('free')}
                >
                  Free
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={selectedStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus('all')}
                >
                  All Status
                </Button>
                <Button
                  variant={selectedStatus === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus('active')}
                >
                  Active
                </Button>
                <Button
                  variant={selectedStatus === 'suspended' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus('suspended')}
                >
                  Suspended
                </Button>
              </div>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Users ({filteredUsers.length})</CardTitle>
                <CardDescription>Manage user accounts and subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {user.full_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{user.full_name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500">{user.company}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge className={getPlanColor(user.plan)}>
                            {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            ${user.total_revenue.toLocaleString()} revenue
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <Badge className={getStatusColor(user.status)}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            Last login: {new Date(user.last_login).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.status === 'active' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleUserStatusChange(user.id, 'suspended')}
                            >
                              <Lock className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleUserStatusChange(user.id, 'active')}
                            >
                              <Unlock className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{metric.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-2xl font-bold ${getMetricStatusColor(metric.status)}`}>
                          {metric.value}{metric.unit}
                        </div>
                        <p className={`text-xs mt-1 ${
                          metric.change > 0 ? 'text-green-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {metric.change > 0 ? '+' : ''}{metric.change}{metric.unit} from last hour
                        </p>
                      </div>
                      <div className={`p-2 rounded-full ${
                        metric.status === 'good' ? 'bg-green-100' :
                        metric.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        {metric.status === 'good' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : metric.status === 'warning' ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Recent system events and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Database backup completed successfully</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">High CPU usage detected on server-02</p>
                      <p className="text-xs text-gray-500">15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">AI model training completed: Revenue Predictor v2.1.4</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Models Tab */}
          <TabsContent value="ai-models" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {aiModels.map((model) => (
                <Card key={model.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-blue-600" />
                          {model.name}
                        </CardTitle>
                        <CardDescription>Version {model.version}</CardDescription>
                      </div>
                      <Badge className={getModelStatusColor(model.status)}>
                        {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Accuracy</p>
                          <div className="flex items-center gap-2">
                            <Progress value={model.accuracy} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{model.accuracy}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Success Rate</p>
                          <div className="flex items-center gap-2">
                            <Progress value={model.success_rate} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{model.success_rate}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold">{model.recommendations_generated}</div>
                          <p className="text-xs text-gray-600">Recommendations</p>
                        </div>
                        <div>
                          <div className="text-lg font-bold flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            {model.avg_user_rating}
                          </div>
                          <p className="text-xs text-gray-600">User Rating</p>
                        </div>
                        <div>
                          <div className="text-lg font-bold">
                            {new Date(model.last_trained).toLocaleDateString()}
                          </div>
                          <p className="text-xs text-gray-600">Last Trained</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {model.status === 'active' && (
                          <>
                            <Button size="sm" className="flex-1">
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Retrain
                            </Button>
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {model.status === 'training' && (
                          <Button disabled size="sm" className="flex-1">
                            <Clock className="h-4 w-4 mr-2" />
                            Training in Progress
                          </Button>
                        )}
                        {model.status === 'deprecated' && (
                          <Button variant="outline" size="sm" className="flex-1">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Archive
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New user registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">This Month</span>
                      <span className="font-medium">+24 users</span>
                    </div>
                    <Progress value={80} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Last Month</span>
                      <span className="font-medium">+18 users</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">2 Months Ago</span>
                      <span className="font-medium">+15 users</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Plan</CardTitle>
                  <CardDescription>Monthly recurring revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Enterprise</span>
                      <span className="font-medium text-purple-600">$6,000</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pro</span>
                      <span className="font-medium text-blue-600">$1,764</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Basic</span>
                      <span className="font-medium text-green-600">$468</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Feature Usage</CardTitle>
                  <CardDescription>Most popular features across all users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Analytics Panel</span>
                      <span className="font-medium">98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Export</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AI Insights</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">API Access</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support Metrics</CardTitle>
                  <CardDescription>Customer support performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Response Time</span>
                      <span className="font-medium text-green-600">2.3 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Resolution Rate</span>
                      <span className="font-medium text-green-600">94%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Customer Satisfaction</span>
                      <span className="font-medium text-green-600">4.7/5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Open Tickets</span>
                      <span className="font-medium text-yellow-600">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}