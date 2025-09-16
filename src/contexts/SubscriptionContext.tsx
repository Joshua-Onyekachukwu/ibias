'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/utils/supabase/client'

interface UserSubscription {
  id: string
  user_id: string
  plan_type: 'starter' | 'professional' | 'enterprise'
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

interface PlanFeature {
  id: string
  plan_type: string
  feature_name: string
  feature_limit: number | null
  is_unlimited: boolean
}

interface SubscriptionContextType {
  subscription: UserSubscription | null
  planFeatures: PlanFeature[]
  isLoading: boolean
  error: string | null
  currentPlan: string
  refreshSubscription: () => Promise<void>
  upgradePlan: (planType: string) => Promise<void>
  hasFeature: (featureName: string) => boolean
  getFeatureLimit: (featureName: string) => number | null
  isFeatureUnlimited: (featureName: string) => boolean
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [subscription, setSubscription] = useState<UserSubscription | null>(null)
  const [planFeatures, setPlanFeatures] = useState<PlanFeature[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null)
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Fetch user subscription
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        throw subscriptionError
      }

      setSubscription(subscriptionData || null)

      // Fetch plan features
      const planType = subscriptionData?.plan_type || 'starter'
      const { data: featuresData, error: featuresError } = await supabase
        .from('plan_features')
        .select('*')
        .eq('plan_type', planType)

      if (featuresError) {
        throw featuresError
      }

      setPlanFeatures(featuresData || [])
    } catch (err) {
      console.error('Error fetching subscription:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshSubscription = async () => {
    await fetchSubscription()
  }

  const hasFeature = (featureName: string): boolean => {
    return planFeatures.some(feature => feature.feature_name === featureName)
  }

  const getFeatureLimit = (featureName: string): number | null => {
    const feature = planFeatures.find(f => f.feature_name === featureName)
    return feature?.feature_limit || null
  }

  const isFeatureUnlimited = (featureName: string): boolean => {
    const feature = planFeatures.find(f => f.feature_name === featureName)
    return feature?.is_unlimited || false
  }

  const currentPlan = subscription?.plan_type || 'starter'

  const upgradePlan = async (planType: string) => {
    if (!user) {
      throw new Error('User must be authenticated to upgrade plan')
    }

    try {
      setIsLoading(true)
      setError(null)

      // Update subscription in database
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          plan_type: planType as 'starter' | 'professional' | 'enterprise',
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          cancel_at_period_end: false,
          updated_at: new Date().toISOString()
        })

      if (updateError) {
        throw updateError
      }

      // Refresh subscription data
      await fetchSubscription()
    } catch (err) {
      console.error('Error upgrading plan:', err)
      setError(err instanceof Error ? err.message : 'Failed to upgrade plan')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      fetchSubscription()
    }
  }, [user, authLoading])

  // Set up real-time subscription for subscription changes
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_subscriptions',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchSubscription()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const value = {
    subscription,
    planFeatures,
    isLoading,
    error,
    currentPlan,
    refreshSubscription,
    upgradePlan,
    hasFeature,
    getFeatureLimit,
    isFeatureUnlimited
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export default SubscriptionContext