'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, AlertCircle, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface AlertPopupProps {
  isOpen: boolean
  onClose: () => void
  alertMessage: string
  validationStatus: 'valid' | 'warning' | 'error'
  title: string
  value: string
  target?: number
  position: { x: number; y: number }
}

export function AlertPopup({
  isOpen,
  onClose,
  alertMessage,
  validationStatus,
  title,
  value,
  target,
  position
}: AlertPopupProps) {
  const getStatusIcon = () => {
    switch (validationStatus) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  const getStatusColor = () => {
    switch (validationStatus) {
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-50/95 dark:bg-yellow-950/95'
      case 'error':
        return 'border-red-500/30 bg-red-50/95 dark:bg-red-950/95'
      default:
        return 'border-green-500/30 bg-green-50/95 dark:bg-green-950/95'
    }
  }

  const getBadgeColor = () => {
    switch (validationStatus) {
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30 dark:text-yellow-300'
      case 'error':
        return 'bg-red-500/20 text-red-700 border-red-500/30 dark:text-red-300'
      default:
        return 'bg-green-500/20 text-green-700 border-green-500/30 dark:text-green-300'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Alert Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", duration: 0.3 }}
            className={cn(
              "fixed z-[9999] min-w-[320px] max-w-[400px] rounded-xl border-2 shadow-2xl backdrop-blur-md",
              getStatusColor()
            )}
            style={{
              left: Math.min(position.x, window.innerWidth - 420),
              top: Math.max(position.y - 200, 20)
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-current/20">
              <div className="flex items-center space-x-3">
                {getStatusIcon()}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {validationStatus === 'warning' ? 'Warning Alert' :
                     validationStatus === 'error' ? 'Critical Alert' : 'Success Alert'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{title}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={cn('text-xs px-2 py-1', getBadgeColor())}>
                  {validationStatus?.toUpperCase()}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 hover:bg-black/10 dark:hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                {alertMessage}
              </p>

              {/* Current vs Target Values */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 border border-current/10">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Current Value</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{value}</span>
                </div>
                {target && (
                  <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-3 border border-current/10">
                    <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Target</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{target}%</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    // TODO: Implement investigate action
                    onClose()
                  }}
                >
                  Investigate
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    // TODO: Implement configure action
                    onClose()
                  }}
                >
                  Configure
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}