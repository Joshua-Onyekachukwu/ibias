'use client'

import { ReactNode } from 'react'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lock, Zap, Crown, Building } from 'lucide-react'
import Link from 'next/link'

interface FeatureGateProps {
  feature: string
  children: ReactNode
  fallback?: ReactNode
  showUpgrade?: boolean
  requiredPlan?: 'starter' | 'professional' | 'enterprise'
}

const planIcons = {
  starter: <Zap className="h-4 w-4" />,
  professional: <Crown className="h-4 w-4" />,
  enterprise: <Building className="h-4 w-4" />
}

const planColors = {
  starter: 'bg-blue-500',
  professional: 'bg-purple-500', 
  enterprise: 'bg-gray-900'
}

const planPrices = {
  starter: 'Free',
  professional: '$59/month',
  enterprise: 'Custom pricing'
}

export function FeatureGate({ 
  feature, 
  children, 
  fallback, 
  showUpgrade = true,
  requiredPlan = 'professional'
}: FeatureGateProps) {
  const { hasFeature, currentPlan } = useSubscription()
  
  const hasAccess = hasFeature(feature)
  
  if (hasAccess) {
    return <>{children}</>
  }
  
  if (fallback) {
    return <>{fallback}</>
  }
  
  if (!showUpgrade) {
    return null
  }
  
  return (
    <Card className="border-dashed border-2 border-gray-300">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Lock className="h-6 w-6 text-gray-600" />
        </div>
        <CardTitle className="text-lg">Premium Feature</CardTitle>
        <CardDescription>
          This feature requires a {requiredPlan} plan or higher
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Badge 
            variant="secondary" 
            className={`${planColors[requiredPlan]} text-white`}
          >
            {planIcons[requiredPlan]}
            {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} Plan
          </Badge>
          <span className="text-sm text-gray-600">{planPrices[requiredPlan]}</span>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Current plan: <Badge variant="outline">{currentPlan}</Badge>
          </p>
          
          <div className="flex gap-2 justify-center">
            <Button asChild size="sm">
              <Link href="/pricing">
                Upgrade Plan
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/pricing">
                View Plans
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Usage limit gate for features with usage limits
interface UsageLimitGateProps {
  featureType: string
  children: ReactNode
  fallback?: ReactNode
  showUpgrade?: boolean
}

export function UsageLimitGate({ 
  featureType, 
  children, 
  fallback, 
  showUpgrade = true 
}: UsageLimitGateProps) {
  const { getFeatureLimit, currentPlan } = useSubscription()
  
  const limit = getFeatureLimit(featureType)
  // For now, we'll assume no limit is reached since we don't have usage tracking
  const limitReached = false
  const currentUsage = 0
  
  if (!limitReached) {
    return <>{children}</>
  }
  
  if (fallback) {
    return <>{fallback}</>
  }
  
  if (!showUpgrade) {
    return null
  }
  
  return (
    <Card className="border-dashed border-2 border-orange-300 bg-orange-50">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
          <Zap className="h-6 w-6 text-orange-600" />
        </div>
        <CardTitle className="text-lg text-orange-900">Usage Limit Reached</CardTitle>
        <CardDescription className="text-orange-700">
          You've used {currentUsage} of {limit} {featureType.replace('_', ' ')} this month
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="w-full bg-orange-200 rounded-full h-2">
          <div 
            className="bg-orange-500 h-2 rounded-full" 
            style={{ width: limit ? `${Math.min((currentUsage / limit) * 100, 100)}%` : '100%' }}
          />
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-orange-700">
            Current plan: <Badge variant="outline">{currentPlan}</Badge>
          </p>
          
          <div className="flex gap-2 justify-center">
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700" asChild>
              <Link href="/pricing">
                Upgrade for More
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/pricing">
                View Plans
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Inline feature gate for smaller UI elements
interface InlineFeatureGateProps {
  feature: string
  children: ReactNode
  fallback?: ReactNode
  requiredPlan?: 'starter' | 'professional' | 'enterprise'
}

export function InlineFeatureGate({ 
  feature, 
  children, 
  fallback,
  requiredPlan = 'professional'
}: InlineFeatureGateProps) {
  const { hasFeature } = useSubscription()
  
  const hasAccess = hasFeature(feature)
  
  if (hasAccess) {
    return <>{children}</>
  }
  
  if (fallback) {
    return <>{fallback}</>
  }
  
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <Lock className="h-4 w-4" />
      <span className="text-sm">
        Requires {requiredPlan} plan
      </span>
      <Button size="sm" variant="outline" asChild>
        <Link href="/pricing">
          Upgrade
        </Link>
      </Button>
    </div>
  )
}