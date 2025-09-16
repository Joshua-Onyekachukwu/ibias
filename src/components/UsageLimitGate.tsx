'use client'

import { ReactNode } from 'react'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Lock, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface UsageLimitGateProps {
  feature: string
  children: ReactNode
  fallback?: ReactNode
}

// Define usage limits for each plan
const USAGE_LIMITS = {
  starter: {
    api_calls: 1000,
    data_sources: 2,
    ai_insights: 10,
    reports: 5,
    integrations: 3
  },
  growth: {
    api_calls: 10000,
    data_sources: 5,
    ai_insights: 50,
    reports: 25,
    integrations: 10
  },
  scale: {
    api_calls: 100000,
    data_sources: 15,
    ai_insights: 200,
    reports: 100,
    integrations: 25
  },
  enterprise: {
    api_calls: -1, // unlimited
    data_sources: -1,
    ai_insights: -1,
    reports: -1,
    integrations: -1
  }
}

// Mock current usage - in real app this would come from the subscription context
const CURRENT_USAGE = {
  api_calls: 750,
  data_sources: 1,
  ai_insights: 8,
  reports: 3,
  integrations: 2
}

export function UsageLimitGate({ feature, children, fallback }: UsageLimitGateProps) {
  const { subscription, isLoading } = useSubscription()

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    )
  }

  const plan = subscription?.plan_type || 'starter'
  const limit = USAGE_LIMITS[plan as keyof typeof USAGE_LIMITS]?.[feature as keyof typeof USAGE_LIMITS.starter]
  const usage = CURRENT_USAGE[feature as keyof typeof CURRENT_USAGE] || 0

  // If unlimited (enterprise) or no limit defined, allow access
  if (limit === -1 || limit === undefined) {
    return <>{children}</>
  }

  // Check if usage is within limit
  const isWithinLimit = usage < limit
  const usagePercentage = Math.min((usage / limit) * 100, 100)

  if (isWithinLimit) {
    return <>{children}</>
  }

  // Show fallback or default limit reached message
  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-lg text-amber-800">
            Usage Limit Reached
          </CardTitle>
        </div>
        <CardDescription className="text-amber-700">
          You've reached your monthly limit for {feature.replace('_', ' ')}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-amber-700">Current Usage</span>
            <span className="font-medium text-amber-800">
              {usage.toLocaleString()} / {limit.toLocaleString()}
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-amber-700 border-amber-300">
            {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
          </Badge>
          <span className="text-sm text-amber-600">
            Resets on the 1st of each month
          </span>
        </div>

        <div className="pt-2">
          <Link href="/pricing">
            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
              <Zap className="h-4 w-4 mr-2" />
              Upgrade Plan
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper hook to check usage limits
export function useUsageLimit(feature: string) {
  const { subscription } = useSubscription()
  
  const plan = subscription?.plan_type || 'starter'
  const limit = USAGE_LIMITS[plan as keyof typeof USAGE_LIMITS]?.[feature as keyof typeof USAGE_LIMITS.starter]
  const usage = CURRENT_USAGE[feature as keyof typeof CURRENT_USAGE] || 0
  
  return {
    limit,
    usage,
    isWithinLimit: limit === -1 || usage < limit,
    usagePercentage: limit === -1 ? 0 : Math.min((usage / limit) * 100, 100),
    remaining: limit === -1 ? Infinity : Math.max(limit - usage, 0)
  }
}