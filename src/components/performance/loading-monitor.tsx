'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface LoadingMetrics {
  startTime: number
  endTime?: number
  duration?: number
  route: string
}

export function useLoadingMonitor() {
  const [metrics, setMetrics] = useState<LoadingMetrics[]>([])
  const router = useRouter()

  useEffect(() => {
    const startTime = performance.now()
    const route = window.location.pathname

    // Track initial page load
    const handleLoad = () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      setMetrics(prev => [...prev, {
        startTime,
        endTime,
        duration,
        route
      }])

      // Log performance metrics
      console.log(`🚀 Page Load Performance:`, {
        route,
        duration: `${duration.toFixed(2)}ms`,
        timestamp: new Date().toISOString()
      })

      // Track Core Web Vitals
      if ('web-vitals' in window) {
        // @ts-ignore
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          getCLS(console.log)
          getFID(console.log)
          getFCP(console.log)
          getLCP(console.log)
          getTTFB(console.log)
        })
      }
    }

    // Track when page is fully loaded
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  return { metrics }
}

// Performance monitoring component
export default function LoadingMonitor({ children }: { children: React.ReactNode }) {
  const { metrics } = useLoadingMonitor()
  const [showMetrics, setShowMetrics] = useState(false)

  // Show metrics in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'P') {
          setShowMetrics(prev => !prev)
        }
      }
      
      window.addEventListener('keydown', handleKeyPress)
      return () => window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    <>
      {children}
      
      {/* Performance metrics overlay (development only) */}
      {process.env.NODE_ENV === 'development' && showMetrics && (
        <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">Performance Metrics</h3>
            <button 
              onClick={() => setShowMetrics(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-1 max-h-40 overflow-y-auto">
            {metrics.slice(-5).map((metric, i) => (
              <div key={i} className="border-b border-gray-700 pb-1">
                <div className="text-blue-400">{metric.route}</div>
                <div className="text-green-400">
                  {metric.duration ? `${metric.duration.toFixed(2)}ms` : 'Loading...'}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-2 text-gray-400 text-xs">
            Press Ctrl+Shift+P to toggle
          </div>
        </div>
      )}
    </>
  )
}

// Hook for tracking specific operations
export function useOperationTimer() {
  const [timers, setTimers] = useState<Record<string, number>>({})

  const startTimer = (operation: string) => {
    const startTime = performance.now()
    setTimers(prev => ({ ...prev, [operation]: startTime }))
    return startTime
  }

  const endTimer = (operation: string) => {
    const endTime = performance.now()
    const startTime = timers[operation]
    
    if (startTime) {
      const duration = endTime - startTime
      console.log(`⏱️ ${operation}: ${duration.toFixed(2)}ms`)
      
      // Clean up timer
      setTimers(prev => {
        const { [operation]: _, ...rest } = prev
        return rest
      })
      
      return duration
    }
    
    return 0
  }

  return { startTimer, endTimer }
}