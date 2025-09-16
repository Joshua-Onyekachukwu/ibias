'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'indigo' | 'pink' | 'gray' | 'emerald' | 'orange' | 'teal' | 'cyan'
  description?: string
  loading?: boolean
  className?: string
  children?: ReactNode
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-500',
    light: 'bg-blue-100 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500 to-blue-600'
  },
  green: {
    bg: 'bg-green-500',
    light: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400',
    gradient: 'from-green-500 to-green-600'
  },
  purple: {
    bg: 'bg-purple-500',
    light: 'bg-purple-100 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
    gradient: 'from-purple-500 to-purple-600'
  },
  red: {
    bg: 'bg-red-500',
    light: 'bg-red-100 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    gradient: 'from-red-500 to-red-600'
  },
  yellow: {
    bg: 'bg-yellow-500',
    light: 'bg-yellow-100 dark:bg-yellow-900/20',
    text: 'text-yellow-600 dark:text-yellow-400',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  indigo: {
    bg: 'bg-indigo-500',
    light: 'bg-indigo-100 dark:bg-indigo-900/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  pink: {
    bg: 'bg-pink-500',
    light: 'bg-pink-100 dark:bg-pink-900/20',
    text: 'text-pink-600 dark:text-pink-400',
    gradient: 'from-pink-500 to-pink-600'
  },
  gray: {
    bg: 'bg-gray-500',
    light: 'bg-muted',
  text: 'text-muted-foreground',
    gradient: 'from-gray-500 to-gray-600'
  },
  emerald: {
    bg: 'bg-emerald-500',
    light: 'bg-emerald-100 dark:bg-emerald-900/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-500 to-emerald-600'
  },
  orange: {
    bg: 'bg-orange-500',
    light: 'bg-orange-100 dark:bg-orange-900/20',
    text: 'text-orange-600 dark:text-orange-400',
    gradient: 'from-orange-500 to-orange-600'
  },
  teal: {
    bg: 'bg-teal-500',
    light: 'bg-teal-100 dark:bg-teal-900/20',
    text: 'text-teal-600 dark:text-teal-400',
    gradient: 'from-teal-500 to-teal-600'
  },
  cyan: {
    bg: 'bg-cyan-500',
    light: 'bg-cyan-100 dark:bg-cyan-900/20',
    text: 'text-cyan-600 dark:text-cyan-400',
    gradient: 'from-cyan-500 to-cyan-600'
  }
}

export default function KPICard({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  color = 'blue',
  description,
  loading = false,
  className,
  children
}: KPICardProps) {
  const colorScheme = colorVariants[color as keyof typeof colorVariants] || colorVariants.blue
  
  const getTrendColor = () => {
    if (trend === 'up') return 'text-success'
    if (trend === 'down') return 'text-destructive'
    return 'text-muted-foreground'
  }

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null

  if (loading) {
    return (
      <div
        className={cn(
          "bg-card rounded-xl shadow-sm border p-6",
          className
        )}
      >
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-3 bg-muted rounded w-32"></div>
            </div>
            <div className="h-12 w-12 bg-muted rounded-xl"></div>
          </div>
          <div className="h-8 bg-muted rounded w-20 mb-3"></div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-16"></div>
            <div className="h-4 bg-muted rounded w-20"></div>
          </div>
          <div className="h-2 bg-muted rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={cn(
        "bg-card rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer",
        className
      )}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300",
          `bg-gradient-to-r ${colorScheme.gradient}`
        )}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="mb-3">
        <p className="text-2xl lg:text-3xl font-bold text-foreground">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>

      {change !== undefined && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {TrendIcon && (
              <TrendIcon className={cn("h-4 w-4", getTrendColor())} />
            )}
            <span className={cn("text-sm font-medium", getTrendColor())}>
              {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-sm text-muted-foreground">
              vs last period
            </span>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {change !== undefined && (
        <div className="mt-4 w-full bg-muted rounded-full h-2">
          <motion.div
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              `bg-gradient-to-r ${colorScheme.gradient}`
            )}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.abs(change) * 5, 100)}%` }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </div>
      )}

      {/* Custom children content */}
      {children && (
        <div className="mt-4 pt-4 border-t border-border">
          {children}
        </div>
      )}
    </motion.div>
  )
}

// Skeleton loader component
export function KPICardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "bg-card rounded-xl shadow-sm border p-6",
      className
    )}>
      <div className="animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-24"></div>
          <div className="h-3 bg-muted rounded w-32"></div>
        </div>
        <div className="h-12 w-12 bg-muted rounded-xl"></div>
      </div>
      <div className="h-8 bg-muted rounded w-20 mb-3"></div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-muted rounded"></div>
        <div className="h-4 bg-muted rounded w-16"></div>
        <div className="h-4 bg-muted rounded w-20"></div>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
    </div>
  )
}

// Grid container for KPI cards
interface KPIGridProps {
  children: ReactNode
  className?: string
}

export function KPIGrid({ children, className }: KPIGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
      className
    )}>
      {children}
    </div>
  )
}