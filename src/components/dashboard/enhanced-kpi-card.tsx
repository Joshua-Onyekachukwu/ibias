'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon, TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle, AlertCircle, Edit3, Save, X, Star, Award, Lightbulb, ChevronRight, ArrowUpRight, ArrowDownRight, Target, Activity } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AlertPopup } from './alert-popup'

interface BenchmarkData {
  industry: number
  target: number
  status: 'above' | 'below' | 'on-target'
}

interface ActionableInsight {
  recommendation: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
}

interface EnhancedKPICardProps {
  title: string
  value: string
  change: number | string
  trend: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'orange' | 'indigo' | 'emerald' | 'amber' | 'cyan' | 'teal' | 'pink'
  index?: number
  isValidated?: boolean
  validationStatus?: 'valid' | 'warning' | 'error'
  validationMessage?: string
  subtitle?: string
  target?: number
  lastUpdated?: string
  comparisonPeriod?: string
  hasAlert?: boolean
  alertMessage?: string
  description?: string
  benchmark?: BenchmarkData
  insights?: string[]
  actionable?: ActionableInsight
  performanceScore?: number
  onShowAlert?: (alert: {
    id: string
    title: string
    message: string
    status: 'warning' | 'error' | 'success'
    position: { x: number; y: number }
  }) => void
}

// Modern gradient color system following design guidelines
const colorVariants = {
  blue: {
    gradient: 'from-blue-600 via-blue-500 to-cyan-400',
    cardGradient: 'from-blue-50/80 via-white to-cyan-50/60',
    darkCardGradient: 'from-blue-950/40 via-slate-900/60 to-cyan-950/30',
    bg: 'bg-gradient-to-br from-blue-100/60 to-cyan-100/40 dark:from-blue-950/30 dark:to-cyan-950/20',
    text: 'text-blue-600 dark:text-blue-400',
    progress: 'bg-gradient-to-r from-blue-500 to-cyan-400',
    shadow: 'shadow-blue-500/20',
    border: 'border-blue-200/50 dark:border-blue-800/30',
    glow: 'shadow-lg shadow-blue-500/25',
  },
  green: {
    gradient: 'from-emerald-600 via-green-500 to-teal-400',
    cardGradient: 'from-emerald-50/80 via-white to-teal-50/60',
    darkCardGradient: 'from-emerald-950/40 via-slate-900/60 to-teal-950/30',
    bg: 'bg-gradient-to-br from-emerald-100/60 to-teal-100/40 dark:from-emerald-950/30 dark:to-teal-950/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    progress: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    shadow: 'shadow-emerald-500/20',
    border: 'border-emerald-200/50 dark:border-emerald-800/30',
    glow: 'shadow-lg shadow-emerald-500/25',
  },
  purple: {
    gradient: 'from-purple-600 via-violet-500 to-indigo-400',
    cardGradient: 'from-purple-50/80 via-white to-indigo-50/60',
    darkCardGradient: 'from-purple-950/40 via-slate-900/60 to-indigo-950/30',
    bg: 'bg-gradient-to-br from-purple-100/60 to-indigo-100/40 dark:from-purple-950/30 dark:to-indigo-950/20',
    text: 'text-purple-600 dark:text-purple-400',
    progress: 'bg-gradient-to-r from-purple-500 to-indigo-400',
    shadow: 'shadow-purple-500/20',
    border: 'border-purple-200/50 dark:border-purple-800/30',
    glow: 'shadow-lg shadow-purple-500/25',
  },
  red: {
    gradient: 'from-red-600 via-rose-500 to-pink-400',
    cardGradient: 'from-red-50/80 via-white to-pink-50/60',
    darkCardGradient: 'from-red-950/40 via-slate-900/60 to-pink-950/30',
    bg: 'bg-gradient-to-br from-red-100/60 to-pink-100/40 dark:from-red-950/30 dark:to-pink-950/20',
    text: 'text-red-600 dark:text-red-400',
    progress: 'bg-gradient-to-r from-red-500 to-pink-400',
    shadow: 'shadow-red-500/20',
    border: 'border-red-200/50 dark:border-red-800/30',
    glow: 'shadow-lg shadow-red-500/25',
  },
  yellow: {
    gradient: 'from-yellow-600 via-amber-500 to-orange-400',
    cardGradient: 'from-yellow-50/80 via-white to-orange-50/60',
    darkCardGradient: 'from-yellow-950/40 via-slate-900/60 to-orange-950/30',
    bg: 'bg-gradient-to-br from-yellow-100/60 to-orange-100/40 dark:from-yellow-950/30 dark:to-orange-950/20',
    text: 'text-yellow-600 dark:text-yellow-400',
    progress: 'bg-gradient-to-r from-yellow-500 to-orange-400',
    shadow: 'shadow-yellow-500/20',
    border: 'border-yellow-200/50 dark:border-yellow-800/30',
    glow: 'shadow-lg shadow-yellow-500/25',
  },
  orange: {
    gradient: 'from-orange-600 via-amber-500 to-yellow-400',
    cardGradient: 'from-orange-50/80 via-white to-yellow-50/60',
    darkCardGradient: 'from-orange-950/40 via-slate-900/60 to-yellow-950/30',
    bg: 'bg-gradient-to-br from-orange-100/60 to-yellow-100/40 dark:from-orange-950/30 dark:to-yellow-950/20',
    text: 'text-orange-600 dark:text-orange-400',
    progress: 'bg-gradient-to-r from-orange-500 to-yellow-400',
    shadow: 'shadow-orange-500/20',
    border: 'border-orange-200/50 dark:border-orange-800/30',
    glow: 'shadow-lg shadow-orange-500/25',
  },
  indigo: {
    gradient: 'from-indigo-600 via-blue-500 to-purple-400',
    cardGradient: 'from-indigo-50/80 via-white to-purple-50/60',
    darkCardGradient: 'from-indigo-950/40 via-slate-900/60 to-purple-950/30',
    bg: 'bg-gradient-to-br from-indigo-100/60 to-purple-100/40 dark:from-indigo-950/30 dark:to-purple-950/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    progress: 'bg-gradient-to-r from-indigo-500 to-purple-400',
    shadow: 'shadow-indigo-500/20',
    border: 'border-indigo-200/50 dark:border-indigo-800/30',
    glow: 'shadow-lg shadow-indigo-500/25',
  },
  emerald: {
    gradient: 'from-emerald-600 via-green-500 to-lime-400',
    cardGradient: 'from-emerald-50/80 via-white to-lime-50/60',
    darkCardGradient: 'from-emerald-950/40 via-slate-900/60 to-lime-950/30',
    bg: 'bg-gradient-to-br from-emerald-100/60 to-lime-100/40 dark:from-emerald-950/30 dark:to-lime-950/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    progress: 'bg-gradient-to-r from-emerald-500 to-lime-400',
    shadow: 'shadow-emerald-500/20',
    border: 'border-emerald-200/50 dark:border-emerald-800/30',
    glow: 'shadow-lg shadow-emerald-500/25',
  },
  amber: {
    gradient: 'from-amber-600 via-yellow-500 to-lime-400',
    cardGradient: 'from-amber-50/80 via-white to-lime-50/60',
    darkCardGradient: 'from-amber-950/40 via-slate-900/60 to-lime-950/30',
    bg: 'bg-gradient-to-br from-amber-100/60 to-lime-100/40 dark:from-amber-950/30 dark:to-lime-950/20',
    text: 'text-amber-600 dark:text-amber-400',
    progress: 'bg-gradient-to-r from-amber-500 to-lime-400',
    shadow: 'shadow-amber-500/20',
    border: 'border-amber-200/50 dark:border-amber-800/30',
    glow: 'shadow-lg shadow-amber-500/25',
  },
  cyan: {
    gradient: 'from-cyan-600 via-blue-500 to-teal-400',
    cardGradient: 'from-cyan-50/80 via-white to-teal-50/60',
    darkCardGradient: 'from-cyan-950/40 via-slate-900/60 to-teal-950/30',
    bg: 'bg-gradient-to-br from-cyan-100/60 to-teal-100/40 dark:from-cyan-950/30 dark:to-teal-950/20',
    text: 'text-cyan-600 dark:text-cyan-400',
    progress: 'bg-gradient-to-r from-cyan-500 to-teal-400',
    shadow: 'shadow-cyan-500/20',
    border: 'border-cyan-200/50 dark:border-cyan-800/30',
    glow: 'shadow-lg shadow-cyan-500/25',
  },
  teal: {
    gradient: 'from-teal-600 via-emerald-500 to-green-400',
    cardGradient: 'from-teal-50/80 via-white to-green-50/60',
    darkCardGradient: 'from-teal-950/40 via-slate-900/60 to-green-950/30',
    bg: 'bg-gradient-to-br from-teal-100/60 to-green-100/40 dark:from-teal-950/30 dark:to-green-950/20',
    text: 'text-teal-600 dark:text-teal-400',
    progress: 'bg-gradient-to-r from-teal-500 to-green-400',
    shadow: 'shadow-teal-500/20',
    border: 'border-teal-200/50 dark:border-teal-800/30',
    glow: 'shadow-lg shadow-teal-500/25',
  },
  pink: {
    gradient: 'from-pink-600 via-rose-500 to-red-400',
    cardGradient: 'from-pink-50/80 via-white to-red-50/60',
    darkCardGradient: 'from-pink-950/40 via-slate-900/60 to-red-950/30',
    bg: 'bg-gradient-to-br from-pink-100/60 to-red-100/40 dark:from-pink-950/30 dark:to-red-950/20',
    text: 'text-pink-600 dark:text-pink-400',
    progress: 'bg-gradient-to-r from-pink-500 to-red-400',
    shadow: 'shadow-pink-500/20',
    border: 'border-pink-200/50 dark:border-pink-800/30',
    glow: 'shadow-lg shadow-pink-500/25',
  },
}

const validationColors = {
  valid: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
}

export function EnhancedKPICard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
  index = 0,
  isValidated = true,
  validationStatus = 'valid',
  validationMessage,
  subtitle,
  target,
  lastUpdated,
  comparisonPeriod = 'vs last month',
  hasAlert = false,
  alertMessage,
  description,
  benchmark,
  insights,
  actionable,
  performanceScore,
  onShowAlert,
}: EnhancedKPICardProps) {
  // Parse change value to ensure it's a number
  const changeValue = typeof change === 'string' ? parseFloat(change.replace('%', '')) : change
  const [isEditingTarget, setIsEditingTarget] = useState(false)
  const [editTarget, setEditTarget] = useState(target?.toString() || '100')
  const [currentTarget, setCurrentTarget] = useState(target || 100)
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Fallback to blue if color is not found in colorVariants
  const colorConfig = colorVariants[color] || colorVariants.blue
  const isPositive = trend === 'up'
  const isNegative = trend === 'down'
  const changeAbs = Math.abs(changeValue)
  
  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : null
  const progressValue = currentTarget ? Math.min((parseFloat(value.replace(/[^0-9.-]+/g, '')) / currentTarget) * 100, 100) : Math.abs(changeValue)
  const trendColor = isPositive ? 'text-green-600 dark:text-green-400' : isNegative ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
  
  const ValidationIcon = validationStatus === 'valid' ? CheckCircle : 
                        validationStatus === 'warning' ? AlertTriangle : AlertCircle
  
  const handleSaveTarget = () => {
    const newTarget = parseFloat(editTarget)
    if (!isNaN(newTarget) && newTarget > 0) {
      setCurrentTarget(newTarget)
      setIsEditingTarget(false)
    }
  }
  
  const handleCancelEdit = () => {
    setEditTarget(currentTarget.toString())
    setIsEditingTarget(false)
  }

  const getBenchmarkStatus = () => {
    if (!benchmark) return null
    const { status } = benchmark
    if (status === 'above') return { color: 'text-green-600 dark:text-green-400', icon: <ArrowUpRight className="w-3 h-3" />, text: 'Above Target' }
    if (status === 'below') return { color: 'text-red-600 dark:text-red-400', icon: <ArrowDownRight className="w-3 h-3" />, text: 'Below Target' }
    return { color: 'text-blue-600 dark:text-blue-400', icon: <Target className="w-3 h-3" />, text: 'On Target' }
  }

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getImpactColor = (impact: string) => {
    if (impact === 'high') return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    if (impact === 'medium') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
  }
  
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      className="group relative"
    >
      <Card className={cn(
        'relative overflow-hidden border-0 transition-all duration-300 h-full min-h-[280px] flex flex-col',
        'hover:shadow-2xl hover:scale-[1.02]',
        'bg-gradient-to-br from-white via-gray-50/50 to-white',
        'dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900',
        colorConfig.border,
        'group-hover:' + colorConfig.glow,
        // Alert system borders
        hasAlert && 'border-l-4',
        hasAlert && validationStatus === 'warning' && 'border-l-yellow-500',
        hasAlert && validationStatus === 'error' && 'border-l-red-500',
        hasAlert && validationStatus === 'valid' && 'border-l-green-500'
      )}>
        {/* Animated Gradient Background */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-[0.03] dark:opacity-[0.08]',
          'transition-opacity duration-300 group-hover:opacity-[0.06] dark:group-hover:opacity-[0.12]',
          colorConfig.gradient
        )} />
        
        {/* Top Border Accent */}
        <div className={cn(
          'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r',
          colorConfig.gradient
        )} />

        <CardContent className="relative p-6 h-full flex flex-col flex-grow">
          {/* Header with Icon, Alert, and Validation */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className={cn(
                    'p-2.5 rounded-xl bg-gradient-to-br shadow-lg',
                    'transition-all duration-300 group-hover:shadow-xl',
                    colorConfig.gradient
                  )}
                >
                  <Icon className="h-5 w-5 text-white" />
                </motion.div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {title}
                      </h3>
                      {hasAlert && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "w-4 h-4 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200",
                            validationStatus === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' :
                            validationStatus === 'error' ? 'bg-red-500 hover:bg-red-600' :
                            'bg-green-500 hover:bg-green-600'
                          )}
                          onClick={(e) => {
                            if (cardRef.current && onShowAlert && alertMessage) {
                              const rect = cardRef.current.getBoundingClientRect()
                              onShowAlert({
                                id: `alert-${title.toLowerCase().replace(/\s+/g, '-')}`,
                                title: title,
                                message: alertMessage,
                                status: validationStatus === 'error' ? 'error' : validationStatus === 'warning' ? 'warning' : 'success',
                                position: {
                                  x: rect.right + 10,
                                  y: rect.top + rect.height / 2
                                }
                              })
                            }
                          }}
                        >
                          <AlertTriangle className="h-2.5 w-2.5 text-white" />
                        </motion.div>
                      )}
                    </div>
                    {performanceScore && (
                      <div className="flex items-center space-x-1">
                        <Star className={cn("w-3 h-3", getPerformanceColor(performanceScore))} />
                        <span className={cn("text-xs font-medium", getPerformanceColor(performanceScore))}>
                          {performanceScore}/100
                        </span>
                      </div>
                    )}
                  </div>
                  {(subtitle || description) && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {subtitle || description}
                    </p>
                  )}

                </div>
              </div>

            {/* Enhanced Validation Status */}
            {isValidated && (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={cn(
                  'flex items-center space-x-2 px-3 py-1.5 rounded-full',
                  'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm',
                  'border shadow-sm transition-all duration-200',
                  validationStatus === 'valid' ? 'border-green-200 dark:border-green-800' :
                  validationStatus === 'warning' ? 'border-yellow-200 dark:border-yellow-800' :
                  'border-red-200 dark:border-red-800'
                )}
              >
                <ValidationIcon className={cn(
                  'h-3.5 w-3.5',
                  validationStatus === 'valid' ? 'text-green-600 dark:text-green-400' :
                  validationStatus === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                )} />
                <span className={cn(
                  'text-xs font-medium',
                  validationStatus === 'valid' ? 'text-green-700 dark:text-green-300' :
                  validationStatus === 'warning' ? 'text-yellow-700 dark:text-yellow-300' :
                  'text-red-700 dark:text-red-300'
                )}>
                  {validationStatus === 'valid' ? 'Valid' : 
                   validationStatus === 'warning' ? '2 warnings' : 'Error'}
                </span>
              </motion.div>
            )}
          </div>

          {/* Value and Change */}
          <div className="mb-4 flex-grow">
            <div className="flex items-end space-x-2 mb-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                {value}
              </span>
              
              {TrendIcon && (
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold',
                    'backdrop-blur-sm border shadow-sm',
                    trend === 'up' ? 
                      'bg-green-50/80 dark:bg-green-900/30 border-green-200 dark:border-green-800' : 
                      'bg-red-50/80 dark:bg-red-900/30 border-red-200 dark:border-red-800'
                  )}
                >
                  <TrendIcon className={cn('h-3 w-3', trendColor)} />
                  <span className={trendColor}>
                    {changeValue > 0 ? '+' : ''}{Math.abs(changeValue) < 10 ? changeValue.toFixed(2) : changeValue.toFixed(1)}%
                  </span>
                </motion.div>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {comparisonPeriod}
              </p>
              
              {benchmark && getBenchmarkStatus() && (
                <div className={cn(
                  "flex items-center space-x-1 text-xs",
                  getBenchmarkStatus()?.color
                )}>
                  {getBenchmarkStatus()?.icon}
                  <span>{getBenchmarkStatus()?.text}</span>
                </div>
              )}
            </div>
            
            {/* Insights Section */}
            {insights && insights.length > 0 && (
              <div className="space-y-1 mb-3">
                {insights.slice(0, 2).map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2 text-xs">
                    <Lightbulb className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400">{insight}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Actionable Recommendation */}
            {actionable && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg p-3 border border-blue-200 dark:border-blue-800 mb-3">
                <div className="flex items-start space-x-2">
                  <Award className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-blue-900 dark:text-blue-100">Recommendation</span>
                      <Badge className={cn("text-xs px-2 py-0.5", getImpactColor(actionable.impact))}>
                        {actionable.impact} impact
                      </Badge>
                    </div>
                    <p className="text-xs text-blue-800 dark:text-blue-200">{actionable.recommendation}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        Confidence: {actionable.confidence}%
                      </span>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        Apply <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Progress Bar with Target Editing */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Progress to Target
              </span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                {Math.round(progressValue)}%
              </span>
            </div>
            <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressValue}%` }}
                transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
                className={cn(
                  'h-full rounded-full bg-gradient-to-r relative overflow-hidden',
                  colorConfig.progress
                )}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                               animate-pulse" />
              </motion.div>
            </div>
            
            {/* Target Editing Section */}
            <div className="flex items-center justify-between mt-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">Target:</span>
                {isEditingTarget ? (
                  <div className="flex items-center gap-1">
                    <Input
                      value={editTarget}
                      onChange={(e) => setEditTarget(e.target.value)}
                      className="h-6 w-16 text-xs px-1"
                      type="number"
                      min="1"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 p-0 hover:bg-green-100"
                      onClick={handleSaveTarget}
                    >
                      <Save className="h-3 w-3 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 w-5 p-0 hover:bg-red-100"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-3 w-3 text-red-600" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-700 dark:text-gray-300">
                      {currentTarget.toLocaleString()}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setIsEditingTarget(true)}
                    >
                      <Edit3 className="h-3 w-3 text-gray-500" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  {lastUpdated || '2m ago'}
                </span>
              </div>
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-green-50 dark:bg-green-900/20 
                                                   text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                Valid
              </Badge>
              {benchmark && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Industry: {typeof benchmark.industry === 'number' ? benchmark.industry.toFixed(1) : benchmark.industry}%
                </div>
              )}
            </div>
            
            {validationMessage && (
              <div className="flex items-center space-x-1">
                <AlertTriangle className="h-3 w-3 text-yellow-500" />
                <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                  {validationMessage}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      

    </motion.div>
  )
}