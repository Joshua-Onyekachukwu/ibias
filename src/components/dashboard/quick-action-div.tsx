'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Settings, 
  FileText, 
  Plus,
  Eye,
  Download,
  Filter,
  Calendar,
  Target,
  Zap,
  PieChart,
  Activity
} from 'lucide-react'
import { useQuickActions } from '@/contexts/quick-actions-context'
import { CustomersModal } from '@/components/modals/CustomersModal'
import { OrdersModal } from '@/components/modals/OrdersModal'
import { ReportsModal } from '@/components/modals/ReportsModal'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  color: string
  bgColor: string
}

interface QuickActionDivProps {
  variant?: 'dashboard' | 'analytics'
  className?: string
}

export function QuickActionDiv({ variant = 'dashboard', className = '' }: QuickActionDivProps) {
  const router = useRouter()
  const { trackAction } = useQuickActions()
  
  // Modal states
  const [isCustomersModalOpen, setIsCustomersModalOpen] = useState(false)
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false)
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false)

  const getDashboardActions = (): QuickAction[] => [
    {
      id: 'view-analytics',
      title: 'View Analytics',
      description: 'Detailed insights',
      icon: BarChart3,
      href: '/dashboard/analytics',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      id: 'manage-customers',
      title: 'Customers',
      description: 'Manage users',
      icon: Users,
      href: '#',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      id: 'view-orders',
      title: 'Orders',
      description: 'Track sales',
      icon: ShoppingCart,
      href: '#',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      id: 'ai-insights',
      title: 'AI Insights',
      description: 'Smart recommendations',
      icon: Zap,
      href: '/dashboard/ai-insights',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    {
      id: 'add-integration',
      title: 'Add Integration',
      description: 'Connect services',
      icon: Plus,
      href: '/dashboard/integrations',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10'
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'Generate reports',
      icon: FileText,
      href: '#',
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10'
    }
  ]

  const getAnalyticsActions = (): QuickAction[] => [
    {
      id: 'create-report',
      title: 'New Report',
      description: 'Create custom report',
      icon: Plus,
      href: '/dashboard/analytics/reports/new',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10'
    },
    {
      id: 'view-insights',
      title: 'AI Insights',
      description: 'Smart recommendations',
      icon: Zap,
      href: '/dashboard/analytics/insights',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    },
    {
      id: 'export-data',
      title: 'Export Data',
      description: 'Download reports',
      icon: Download,
      href: '/dashboard/analytics/export',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
    {
      id: 'filter-data',
      title: 'Filter Data',
      description: 'Customize view',
      icon: Filter,
      href: '/dashboard/analytics/filters',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10'
    },
    {
      id: 'schedule-reports',
      title: 'Schedule',
      description: 'Automated reports',
      icon: Calendar,
      href: '/dashboard/analytics/schedule',
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10'
    },
    {
      id: 'set-goals',
      title: 'Set Goals',
      description: 'Track targets',
      icon: Target,
      href: '/dashboard/analytics/goals',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10'
    }
  ]

  const actions = variant === 'dashboard' ? getDashboardActions() : getAnalyticsActions()

  const handleActionClick = (action: QuickAction) => {
    trackAction(action.id, { variant, timestamp: new Date().toISOString() })
    
    // Handle modal actions
    if (action.id === 'manage-customers') {
      setIsCustomersModalOpen(true)
      return
    }
    if (action.id === 'view-orders') {
      setIsOrdersModalOpen(true)
      return
    }
    if (action.id === 'reports') {
      setIsReportsModalOpen(true)
      return
    }
    
    // Handle navigation for other actions
    if (action.href !== '#') {
      router.push(action.href)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-br from-white via-slate-50/40 to-white dark:from-gray-900 dark:via-slate-800/20 dark:to-gray-900 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/60 via-blue-50/40 to-slate-50/60 dark:from-slate-800/40 dark:via-blue-950/20 dark:to-slate-800/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Quick Actions
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {variant === 'dashboard' 
                ? 'Access key features and navigate your dashboard efficiently' 
                : 'Powerful analytics tools and data insights at your fingertips'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Inner Container */}
      <div className="p-6">
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl border border-slate-200/40 dark:border-slate-700/40 p-6 backdrop-blur-sm">
          {/* Actions Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {actions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleActionClick(action)}
                className="group relative overflow-hidden rounded-lg border border-slate-200/40 dark:border-slate-600/40 bg-white/80 dark:bg-slate-700/80 p-4 text-left transition-all duration-300 hover:border-slate-300/60 dark:hover:border-slate-500/60 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {/* Action Icon */}
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${action.bgColor} transition-all duration-300 group-hover:scale-110`}>
                  <action.icon className={`h-5 w-5 ${action.color} transition-colors duration-300`} />
                </div>

                {/* Action Content */}
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                    {action.description}
                  </p>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-emerald-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <CustomersModal 
        isOpen={isCustomersModalOpen} 
        onClose={() => setIsCustomersModalOpen(false)} 
      />
      <OrdersModal 
        isOpen={isOrdersModalOpen} 
        onClose={() => setIsOrdersModalOpen(false)} 
      />
      <ReportsModal 
        isOpen={isReportsModalOpen} 
        onClose={() => setIsReportsModalOpen(false)} 
      />
    </motion.div>
  )
}