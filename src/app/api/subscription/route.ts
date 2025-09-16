import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Get user's current subscription
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (subError && subError.code !== 'PGRST116') {
      console.error('Error fetching subscription:', subError)
      return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 })
    }

    // Get plan features
    const { data: planFeatures, error: featuresError } = await supabase
      .from('plan_features')
      .select('*')
      .eq('plan_type', subscription?.plan_type || 'starter')

    if (featuresError) {
      console.error('Error fetching plan features:', featuresError)
      return NextResponse.json({ error: 'Failed to fetch plan features' }, { status: 500 })
    }

    // Get current month's usage
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    const endOfMonth = new Date(startOfMonth)
    endOfMonth.setMonth(endOfMonth.getMonth() + 1)

    const { data: featureUsage, error: usageError } = await supabase
      .from('feature_usage')
      .select('*')
      .eq('user_id', user.id)
      .gte('period_start', startOfMonth.toISOString())
      .lt('period_end', endOfMonth.toISOString())

    if (usageError) {
      console.error('Error fetching feature usage:', usageError)
      return NextResponse.json({ error: 'Failed to fetch feature usage' }, { status: 500 })
    }

    return NextResponse.json({
      subscription: subscription || {
        plan_type: 'starter',
        status: 'active'
      },
      planFeatures: planFeatures || [],
      featureUsage: featureUsage || []
    })

  } catch (error) {
    console.error('Subscription API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update subscription (upgrade/downgrade)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { plan_type } = await request.json()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['starter', 'growth', 'scale', 'enterprise'].includes(plan_type)) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
    }

    // Get current subscription
    const { data: currentSub } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const now = new Date().toISOString()
    const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()

    if (currentSub) {
      // Update existing subscription
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
          plan_type,
          updated_at: now
        })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Error updating subscription:', updateError)
        return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 })
      }

      // Log the change
      await supabase
        .from('subscription_audit_log')
        .insert({
          user_id: user.id,
          action: 'upgraded',
          old_plan_type: currentSub.plan_type,
          new_plan_type: plan_type,
          metadata: { upgraded_at: now }
        })
    } else {
      // Create new subscription
      const { error: insertError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_type,
          status: 'active',
          current_period_start: now,
          current_period_end: nextYear
        })

      if (insertError) {
        console.error('Error creating subscription:', insertError)
        return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
      }

      // Log the creation
      await supabase
        .from('subscription_audit_log')
        .insert({
          user_id: user.id,
          action: 'created',
          new_plan_type: plan_type,
          metadata: { created_at: now }
        })
    }

    return NextResponse.json({ success: true, plan_type })

  } catch (error) {
    console.error('Subscription update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}