'use client'

import { useEffect, useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

// Performance optimization utilities
class PerformanceOptimizer {
  private static instance: PerformanceOptimizer
  private prefetchedRoutes = new Set<string>()
  private componentCache = new Map<string, any>()
  private router: any

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer()
    }
    return PerformanceOptimizer.instance
  }

  setRouter(router: any) {
    this.router = router
  }

  // Prefetch critical dashboard routes
  prefetchDashboardRoutes() {
    const criticalRoutes = [
      '/dashboard',
      '/dashboard/analytics',
      '/dashboard/reports',
      '/dashboard/settings',
      '/dashboard/profile'
    ]

    criticalRoutes.forEach(route => {
      if (!this.prefetchedRoutes.has(route) && this.router) {
        this.router.prefetch(route)
        this.prefetchedRoutes.add(route)
      }
    })
  }

  // Preload dashboard components with error handling
  preloadComponents() {
    // Reduced aggressive preloading to prevent ERR_ABORTED errors
    const componentPromises: Promise<any>[] = [
      // Only preload critical components
      // import('./dashboard'),
      // import('./revenue-chart'),
    ]

    if (componentPromises.length > 0) {
      componentPromises.forEach((promise, index) => {
        promise.then((component: any) => {
          this.componentCache.set(`component-${index}`, component)
        }).catch((err: Error) => {
          // Silently handle preload failures - they're not critical
          if (process.env.NODE_ENV === 'development') {
            console.debug('Component preload skipped:', err.message)
          }
        })
      })
    }
  }

  // Optimize images and assets
  preloadCriticalAssets() {
    const criticalImages: string[] = [
      // Add any critical images here
    ]

    criticalImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
  }

  // Memory cleanup
  cleanup() {
    this.componentCache.clear()
  }
}

// Performance monitoring hook
export function usePerformanceMonitor() {
  const router = useRouter()
  const optimizer = useMemo(() => PerformanceOptimizer.getInstance(), [])

  useEffect(() => {
    optimizer.setRouter(router)
    
    // Initialize performance optimizations with reduced aggressiveness
    const initOptimizations = () => {
      // Only prefetch routes if user is likely to navigate
      if (document.visibilityState === 'visible') {
        optimizer.prefetchDashboardRoutes()
      }
      // Delay component preloading to avoid conflicts
      setTimeout(() => {
        optimizer.preloadComponents()
        optimizer.preloadCriticalAssets()
      }, 1000)
    }

    // Run optimizations after page is fully loaded
    const timeoutId = setTimeout(initOptimizations, 500)

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId)
      optimizer.cleanup()
    }
  }, [router, optimizer])

  // Fast navigation function
  const fastNavigate = useCallback((path: string) => {
    // Use replace for faster navigation without history stack
    router.push(path)
  }, [router])

  return { fastNavigate }
}

// Intersection Observer for lazy loading
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [elementRef, options])

  return isIntersecting
}

// Optimized motion components
export const OptimizedMotionDiv = motion.div
export const OptimizedMotionButton = motion.button

// Performance-optimized variants
export const fastVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.15, ease: 'easeOut' }
}

export const instantVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.1 }
}

// Debounced search hook for fast filtering
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Virtual scrolling for large datasets
export function useVirtualScroll({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 5
}: {
  itemCount: number
  itemHeight: number
  containerHeight: number
  overscan?: number
}) {
  const [scrollTop, setScrollTop] = useState(0)

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    itemCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = useMemo(() => {
    const items = []
    for (let i = startIndex; i <= endIndex; i++) {
      items.push({
        index: i,
        offsetTop: i * itemHeight
      })
    }
    return items
  }, [startIndex, endIndex, itemHeight])

  const totalHeight = itemCount * itemHeight

  return {
    visibleItems,
    totalHeight,
    setScrollTop
  }
}

// Main performance optimizer component
export default function PerformanceOptimizerProvider({
  children
}: {
  children: React.ReactNode
}) {
  usePerformanceMonitor()

  return (
    <>
      {children}
      {/* Performance monitoring script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Performance monitoring
            if (typeof window !== 'undefined') {
              // Monitor Core Web Vitals
              function measureWebVitals() {
                if ('web-vital' in window) {
                  // Measure FCP, LCP, FID, CLS
                  new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                      console.log('Performance metric:', entry.name, entry.value)
                    }
                  }).observe({ entryTypes: ['measure', 'navigation', 'paint'] })
                }
              }
              
              // Optimize resource loading
              function optimizeResources() {
                // Preconnect to external domains
                const preconnectDomains = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com']
                preconnectDomains.forEach(domain => {
                  const link = document.createElement('link')
                  link.rel = 'preconnect'
                  link.href = domain
                  document.head.appendChild(link)
                })
              }
              
              // Initialize optimizations
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                  measureWebVitals()
                  optimizeResources()
                })
              } else {
                measureWebVitals()
                optimizeResources()
              }
            }
          `
        }}
      />
    </>
  )
}

// Fast loading skeleton component
export function FastSkeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  )
}

// Optimized image component
export function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  ...props
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
  [key: string]: any
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !error && (
        <FastSkeleton className="absolute inset-0" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        {...props}
      />
    </div>
  )
}

// Export performance utilities
export { PerformanceOptimizer }