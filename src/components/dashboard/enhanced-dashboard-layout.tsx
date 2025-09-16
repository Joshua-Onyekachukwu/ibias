'use client'

import { useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Home,
  FileText,
  Target,
  Zap,
  LogOut,
  User,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Activity,
  CheckCircle,
  AlertTriangle,
  Info,
  CreditCard,
  Plug,
  Brain,
  Star,
  Database,
  Headphones,
  HelpCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { SimpleAlertPopup } from './simple-alert-popup'
import { QuickActionsProvider } from '@/contexts/quick-actions-context'
import { QuickActionsModals } from './quick-actions-modals'
import { DashboardDataProvider } from '@/contexts/dashboard-data-context'

interface DashboardLayoutProps {
  children: ReactNode
}

interface NavigationItem {
  name: string
  href: string
  icon: any
  badge?: string
  description?: string
  category?: string
}

interface KPISummary {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: any
  color: string
}

interface QuickAction {
  title: string
  description: string
  icon: any
  color: string
  action: () => void
}

interface RecentActivity {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  description: string
  time: string
  icon: any
}

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  time: string
  read: boolean
}

export default function EnhancedDashboardLayout({ children }: DashboardLayoutProps) {
  const { user, userProfile, supabaseUser, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeAlert, setActiveAlert] = useState<{
    id: string
    title: string
    message: string
    status: 'warning' | 'error' | 'success'
    position: { x: number; y: number }
  } | null>(null)

  // Enhanced Navigation items with all requested features
  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Main dashboard overview',
      category: 'main'
    },
    {
      name: 'Advanced Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
      description: 'Comprehensive business intelligence with real-time insights',
      category: 'analytics'
    },
    {
      name: 'AI Insights & Suggestions',
      href: '/dashboard/ai-insights',
      icon: Brain,
      badge: 'AI',
      description: 'AI-powered business insights and recommendations',
      category: 'ai'
    },
    {
      name: 'Integration',
      href: '/dashboard/integrations',
      icon: Plug,
      description: 'Connect and manage third-party integrations',
      category: 'tools'
    },
    {
      name: 'Recommendation Tracker',
      href: '/dashboard/recommendations',
      icon: Star,
      description: 'Track and manage AI recommendations',
      category: 'ai'
    },
    {
      name: 'Revenue Analytics',
      href: '/dashboard/revenue',
      icon: DollarSign,
      description: 'Revenue tracking and forecasting',
      category: 'analytics'
    },
    {
      name: 'Customer Analytics',
      href: '/dashboard/customers',
      icon: Users,
      description: 'Customer insights and segmentation',
      category: 'analytics'
    },

    {
      name: 'Reports & Export',
      href: '/dashboard/reports',
      icon: FileText,
      description: 'Generate and export reports',
      category: 'tools'
    },
    {
      name: 'Data Management',
      href: '/dashboard/data',
      icon: Database,
      description: 'Manage data sources and quality',
      category: 'tools'
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      description: 'Account and system settings',
      category: 'account'
    },
    {
      name: 'Billing & Subscription',
      href: '/dashboard/billing',
      icon: CreditCard,
      description: 'Manage billing and subscription',
      category: 'account'
    },
    {
      name: 'Support',
      href: '/dashboard/support',
      icon: Headphones,
      description: 'Get help and support',
      category: 'account'
    }
  ]

  // Enhanced KPI Summary
  const kpiSummary: KPISummary[] = [
    {
      title: 'Revenue',
      value: '$45,231',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Customers',
      value: '2,345',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Conversion',
      value: '3.24%',
      change: '-2.1%',
      trend: 'down',
      icon: Target,
      color: 'text-red-600'
    },
    {
      title: 'AI Score',
      value: '94%',
      change: '+5.3%',
      trend: 'up',
      icon: Brain,
      color: 'text-purple-600'
    }
  ]

  // Quick Actions
  const quickActions: QuickAction[] = [
    {
      title: 'AI Analysis',
      description: 'Get AI insights',
      icon: Brain,
      color: 'bg-purple-500',
      action: () => router.push('/dashboard/ai-insights')
    },
    {
      title: 'New Report',
      description: 'Generate analytics report',
      icon: FileText,
      color: 'bg-blue-500',
      action: () => router.push('/dashboard/reports')
    },
    {
      title: 'Export Data',
      description: 'Download dashboard data',
      icon: TrendingUp,
      color: 'bg-green-500',
      action: () => toast.success('Exporting data...')
    },
    {
      title: 'Add Integration',
      description: 'Connect new service',
      icon: Plug,
      color: 'bg-orange-500',
      action: () => router.push('/dashboard/integrations')
    }
  ]

  // Recent Activity
  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      type: 'success',
      title: 'AI Recommendation Implemented',
      description: 'Revenue optimization suggestion applied',
      time: '2 hours ago',
      icon: Brain
    },
    {
      id: '2',
      type: 'info',
      title: 'New Integration Added',
      description: 'Shopify integration successfully connected',
      time: '1 hour ago',
      icon: Plug
    },
    {
      id: '3',
      type: 'warning',
      title: 'Performance Alert',
      description: 'Conversion rate below target',
      time: '30 minutes ago',
      icon: AlertTriangle
    },
    {
      id: '4',
      type: 'success',
      title: 'Revenue Goal Achieved',
      description: 'Monthly revenue target reached',
      time: '5 minutes ago',
      icon: CheckCircle
    }
  ]

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Mock notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'AI Insight Available',
        message: 'New revenue optimization opportunity detected!',
        type: 'success',
        time: '5 minutes ago',
        read: false
      },
      {
        id: '2',
        title: 'Integration Update',
        message: 'Shopify integration requires attention.',
        type: 'warning',
        time: '1 hour ago',
        read: false
      },
      {
        id: '3',
        title: 'Billing Reminder',
        message: 'Your subscription renews in 3 days.',
        type: 'info',
        time: '2 hours ago',
        read: true
      }
    ]
    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter(n => !n.read).length)
  }, [])

  // Handle notification actions
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  // Handle alert popup
  const showAlert = useCallback((alert: {
    id: string
    title: string
    message: string
    status: 'warning' | 'error' | 'success'
    position: { x: number; y: number }
  }) => {
    setActiveAlert(alert)
  }, [])

  const hideAlert = useCallback(() => {
    setActiveAlert(null)
  }, [])

  const handleSignOut = useCallback(async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      router.push('/auth')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }, [signOut, router])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  const toggleSidebarCollapse = useCallback(() => {
    setSidebarCollapsed(!sidebarCollapsed)
  }, [sidebarCollapsed])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle
      case 'warning':
        return AlertTriangle
      case 'error':
        return X
      default:
        return Info
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'error':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      default:
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
    }
  }

  const filteredNavigation = navigation.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sidebarWidth = sidebarCollapsed ? 'w-20' : 'w-80'
  const sidebarWidthClass = sidebarCollapsed ? 'lg:w-20' : 'lg:w-80'

  return (
    <DashboardDataProvider>
      <QuickActionsProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-xl transform transition-all duration-300 ease-in-out",
        sidebarWidthClass,
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex flex-col h-full max-h-screen">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">IBIAS</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Analytics Panel</p>
                </div>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-white" />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebarCollapse}
                className="hidden lg:flex"
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          {!sidebarCollapsed && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search navigation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
            </div>
          )}

          {/* Navigation - Organized by Categories */}
          <nav className="flex-1 overflow-y-auto min-h-0">
            <div className="p-4 space-y-1 pb-6">
              {!sidebarCollapsed ? (
                // Expanded Navigation with Categories
                <div className="space-y-6">
                  {/* Main Section */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-3">Main</h3>
                    {filteredNavigation.filter(item => item.category === 'main').map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <motion.div
                          key={item.name}
                          whileHover={{ x: 4 }}
                          className={cn(
                            "flex items-center p-3 rounded-lg transition-all cursor-pointer group relative mb-1",
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          )}
                          onClick={() => router.push(item.href)}
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs ml-2">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Analytics Section */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-3">Analytics</h3>
                    {filteredNavigation.filter(item => item.category === 'analytics').map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <motion.div
                          key={item.name}
                          whileHover={{ x: 4 }}
                          className={cn(
                            "flex items-center p-3 rounded-lg transition-all cursor-pointer group relative mb-1",
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          )}
                          onClick={() => router.push(item.href)}
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs ml-2">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* AI Section */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-3">AI & Intelligence</h3>
                    {filteredNavigation.filter(item => item.category === 'ai').map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <motion.div
                          key={item.name}
                          whileHover={{ x: 4 }}
                          className={cn(
                            "flex items-center p-3 rounded-lg transition-all cursor-pointer group relative mb-1",
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          )}
                          onClick={() => router.push(item.href)}
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs ml-2">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Tools Section */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-3">Tools</h3>
                    {filteredNavigation.filter(item => item.category === 'tools').map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <motion.div
                          key={item.name}
                          whileHover={{ x: 4 }}
                          className={cn(
                            "flex items-center p-3 rounded-lg transition-all cursor-pointer group relative mb-1",
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          )}
                          onClick={() => router.push(item.href)}
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs ml-2">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Account Section */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-3">Account</h3>
                    {filteredNavigation.filter(item => item.category === 'account').map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <motion.div
                          key={item.name}
                          whileHover={{ x: 4 }}
                          className={cn(
                            "flex items-center p-3 rounded-lg transition-all cursor-pointer group relative mb-1",
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          )}
                          onClick={() => router.push(item.href)}
                        >
                          <div className="flex items-center space-x-3 w-full">
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs ml-2">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                // Collapsed Navigation - Simple Icons
                <div className="space-y-2">
                  {filteredNavigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <motion.div
                        key={item.name}
                        className={cn(
                          "flex items-center justify-center p-3 rounded-lg transition-all cursor-pointer group relative",
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        )}
                        onClick={() => router.push(item.href)}
                        title={item.name}
                      >
                        <Icon className="h-5 w-5" />
                        
                        {/* Tooltip for collapsed sidebar */}
                        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                          {item.name}
                          {item.badge && (
                            <span className="ml-1 px-1 py-0.5 bg-blue-500 rounded text-xs">{item.badge}</span>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </nav>


        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300",
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'
      )}>
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <ThemeToggle variant="icon-only" />

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.slice(0, 5).map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-4">
                      <div className="flex items-start justify-between w-full">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center text-sm text-blue-600 hover:text-blue-700">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-blue-500/20 transition-all duration-200">
                    <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-gray-700 shadow-lg">
                      <AvatarImage src={userProfile?.avatar_url || ''} alt={userProfile?.full_name || 'User'} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                        {(userProfile?.full_name || user?.email || 'U')
                          .split(' ')
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)
                        }
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userProfile?.full_name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/billing')}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/support')}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Alert Popup */}
      {activeAlert && (
        <SimpleAlertPopup
          message={`${activeAlert.title}: ${activeAlert.message}`}
          status={activeAlert.status}
          position={activeAlert.position}
          onClose={hideAlert}
        />
      )}
      
      {/* Quick Actions Modals */}
      <QuickActionsModals />
      </div>
      </QuickActionsProvider>
    </DashboardDataProvider>
  )
}