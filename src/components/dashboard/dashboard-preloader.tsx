'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, BarChart3 } from 'lucide-react'

interface DashboardPreloaderProps {
  isLoading: boolean
  onComplete?: () => void
}

export default function DashboardPreloader({ isLoading, onComplete }: DashboardPreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [showPreloader, setShowPreloader] = useState(isLoading)

  useEffect(() => {
    if (!isLoading) {
      setShowPreloader(false)
      onComplete?.()
      return
    }

    // Fast progress animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setShowPreloader(false)
            onComplete?.()
          }, 200)
          return 100
        }
        return prev + 20 // Fast increment for quick loading
      })
    }, 50) // Very fast interval

    return () => clearInterval(interval)
  }, [isLoading, onComplete])

  if (!showPreloader) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex items-center justify-center"
      >
        <div className="text-center">
          {/* Logo and Loading Animation */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 1, repeat: Infinity, ease: "linear" },
              scale: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Zap className="h-8 w-8 text-white" />
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
          >
            IBIAS
          </motion.h1>

          {/* Loading Text */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 dark:text-gray-400 mb-6"
          >
            Loading your dashboard...
          </motion.p>

          {/* Progress Bar */}
          <div className="w-64 mx-auto">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-500 dark:text-gray-400 mt-2"
            >
              {progress}%
            </motion.p>
          </div>

          {/* Loading Dots */}
          <div className="flex justify-center space-x-1 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
                className="w-2 h-2 bg-blue-500 rounded-full"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Hook for managing dashboard loading state
export function useDashboardLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fast loading - remove if not needed
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800) // Very short duration - remove entirely if instant

    return () => clearTimeout(timer)
  }, [])

  return { isLoading, setIsLoading }
}