// Performance optimization configuration
export const PERFORMANCE_CONFIG = {
  // Authentication timeouts
  AUTH_TIMEOUT: 1500, // Reduced from 3000ms
  
  // Dashboard loading delays
  DASHBOARD_INIT_DELAY: 100, // Minimal delay for critical data
  LIVE_DATA_START_DELAY: 8000, // Delay live updates
  LIVE_DATA_UPDATE_INTERVAL: 20000, // Update every 20 seconds
  
  // Subscription loading
  SUBSCRIPTION_LOAD_DELAY: 500, // Delay subscription data loading
  
  // Component lazy loading
  COMPONENT_LAZY_LOAD_DELAY: 200,
  
  // Cache settings
  CACHE_DURATION: {
    USER_PROFILE: 5 * 60 * 1000, // 5 minutes
    DASHBOARD_DATA: 2 * 60 * 1000, // 2 minutes
    SUBSCRIPTION_DATA: 10 * 60 * 1000, // 10 minutes
  },
  
  // Performance thresholds
  THRESHOLDS: {
    DASHBOARD_LOAD_TIME: 2000, // 2 seconds target
    AUTH_LOAD_TIME: 1000, // 1 second target
    COMPONENT_RENDER_TIME: 100, // 100ms target
  },
  
  // Feature flags for performance
  FEATURES: {
    ENABLE_LIVE_DATA: true,
    ENABLE_PERFORMANCE_MONITORING: process.env.NODE_ENV === 'development',
    ENABLE_LAZY_LOADING: true,
    ENABLE_PREFETCHING: true,
  },
  
  // Optimization strategies
  STRATEGIES: {
    // Reduce initial bundle size
    LAZY_LOAD_COMPONENTS: [
      'RevenueChart',
      'AnalyticsChart',
      'UserActivityChart',
      'PerformanceMetrics'
    ],
    
    // Preload critical resources
    PRELOAD_ROUTES: [
      '/dashboard',
      '/auth'
    ],
    
    // Defer non-critical operations
    DEFER_OPERATIONS: [
      'subscription-sync',
      'analytics-tracking',
      'feature-usage-logging'
    ]
  }
}

// Performance monitoring utilities
export const performanceUtils = {
  // Mark performance milestones
  mark: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(name)
    }
  },
  
  // Measure performance between marks
  measure: (name: string, startMark: string, endMark?: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      try {
        window.performance.measure(name, startMark, endMark)
        const measure = window.performance.getEntriesByName(name)[0]
        return measure.duration
      } catch (error) {
        console.warn('Performance measurement failed:', error)
        return 0
      }
    }
    return 0
  },
  
  // Log performance metrics
  logMetrics: (operation: string, duration: number) => {
    if (PERFORMANCE_CONFIG.FEATURES.ENABLE_PERFORMANCE_MONITORING) {
      console.log(`🚀 Performance: ${operation} completed in ${duration.toFixed(2)}ms`)
      
      // Check against thresholds
      const threshold = PERFORMANCE_CONFIG.THRESHOLDS.COMPONENT_RENDER_TIME
      if (duration > threshold) {
        console.warn(`⚠️ Performance Warning: ${operation} exceeded threshold (${threshold}ms)`)
      }
    }
  },
  
  // Debounce function for performance
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },
  
  // Throttle function for performance
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
}

// Performance optimization hooks
export const usePerformanceOptimization = () => {
  const startOperation = (name: string) => {
    performanceUtils.mark(`${name}-start`)
    return performance.now()
  }
  
  const endOperation = (name: string, startTime: number) => {
    const endTime = performance.now()
    const duration = endTime - startTime
    performanceUtils.mark(`${name}-end`)
    performanceUtils.measure(name, `${name}-start`, `${name}-end`)
    performanceUtils.logMetrics(name, duration)
    return duration
  }
  
  return { startOperation, endOperation }
}