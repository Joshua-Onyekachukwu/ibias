'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SimpleAlertPopupProps {
  message: string
  status: 'success' | 'warning' | 'error' | 'info'
  position: { x: number; y: number }
  onClose: () => void
}

export function SimpleAlertPopup({
  message,
  status,
  position,
  onClose
}: SimpleAlertPopupProps) {
  // Auto-close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)
    
    return () => clearTimeout(timer)
  }, [onClose])

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return 'border-green-500/30 bg-green-50/95 dark:bg-green-950/95 shadow-green-500/20'
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-50/95 dark:bg-yellow-950/95 shadow-yellow-500/20'
      case 'error':
        return 'border-red-500/30 bg-red-50/95 dark:bg-red-950/95 shadow-red-500/20'
      case 'info':
        return 'border-blue-500/30 bg-blue-50/95 dark:bg-blue-950/95 shadow-blue-500/20'
      default:
        return 'border-blue-500/30 bg-blue-50/95 dark:bg-blue-950/95 shadow-blue-500/20'
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          'fixed z-[9999] min-w-[280px] max-w-[400px] p-4 rounded-xl border backdrop-blur-sm shadow-xl',
          getStatusStyles()
        )}
        style={{
          left: Math.min(position.x, window.innerWidth - 320), // Ensure it doesn't go off-screen
          top: Math.min(position.y, window.innerHeight - 100),
        }}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getStatusIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
              {message}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex-shrink-0 h-6 w-6 p-0 hover:bg-black/10 dark:hover:bg-white/10"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        {/* Progress bar for auto-close */}
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 5, ease: 'linear' }}
          className={cn(
            'absolute bottom-0 left-0 h-1 rounded-b-xl',
            status === 'success' ? 'bg-green-500' :
            status === 'warning' ? 'bg-yellow-500' :
            status === 'error' ? 'bg-red-500' :
            'bg-blue-500'
          )}
        />
      </motion.div>
    </AnimatePresence>
  )
}