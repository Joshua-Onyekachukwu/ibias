'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Check, Zap, Crown, Building, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for getting started with AI-powered analytics',
    price: { monthly: 0, yearly: 0 },
    icon: <Zap className="h-6 w-6" />,
    color: 'border-gray-200',
    buttonColor: 'bg-gray-900 hover:bg-gray-800',
    popular: false,
    features: [
      '2 data source connections',
      '5 AI insights per month',
      '3 months historical data',
      '1 team member',
      'Basic analytics panel',
      'Email support'
    ],
    limitations: [
      'No API access',
      'No custom panels',
      'No advanced AI features'
    ]
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'Scale your analytics with unlimited insights',
    price: { monthly: 59, yearly: 590 },
    icon: <Zap className="h-6 w-6" />,
    color: 'border-blue-200 ring-2 ring-blue-500',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    popular: true,
    features: [
      '10 data source connections',
      'Unlimited AI insights',
      '12 months historical data',
      '5 team members',
      '10 custom panels',
      'API access',
      'White-label options',
      'Priority email support'
    ],
    limitations: [
      'No advanced AI features',
      'No SSO integration'
    ]
  },
  {
    id: 'scale',
    name: 'Scale',
    description: 'Advanced AI and enterprise features',
    price: { monthly: 149, yearly: 1490 },
    icon: <Crown className="h-6 w-6" />,
    color: 'border-purple-200',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    popular: false,
    features: [
      'Unlimited data sources',
      'Unlimited AI insights',
      '24 months historical data',
      '25 team members',
      'Unlimited custom panels',
      'Advanced AI features',
      'SSO integration',
      'Audit logs',
      'Priority chat support'
    ],
    limitations: []
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: { monthly: 'Custom', yearly: 'Custom' },
    icon: <Building className="h-6 w-6" />,
    color: 'border-gray-300',
    buttonColor: 'bg-gray-900 hover:bg-gray-800',
    popular: false,
    features: [
      'Everything in Scale',
      'Unlimited team members',
      'Custom integrations',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom training',
      'SLA guarantees',
      'On-premise deployment options'
    ],
    limitations: []
  }
]

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const { user } = useAuth()
  const { currentPlan, upgradePlan } = useSubscription()
  const router = useRouter()

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      router.push('/auth?mode=signin')
      return
    }

    if (planId === currentPlan) return

    setLoading(planId)
    try {
      if (planId === 'enterprise') {
        // Redirect to contact form for enterprise
        window.open('mailto:sales@ibias.com?subject=Enterprise Plan Inquiry', '_blank')
        return
      }

      await upgradePlan(planId)
      // Show success message or redirect
      router.push('/?upgraded=true')
    } catch (error) {
      console.error('Upgrade failed:', error)
      // Show error message
    } finally {
      setLoading(null)
    }
  }

  const getButtonText = (plan: any) => {
    if (plan.id === currentPlan) return 'Current Plan'
    if (plan.id === 'starter') return 'Get Started Free'
    if (plan.id === 'enterprise') return 'Contact Sales'
    return `Upgrade to ${plan.name}`
  }

  const getPrice = (plan: any) => {
    if (typeof plan.price.monthly === 'string') return plan.price.monthly
    if (plan.price.monthly === 0) return 'Free'
    
    const price = isYearly ? plan.price.yearly : plan.price.monthly
    const period = isYearly ? 'year' : 'month'
    
    return (
      <>
        <span className="text-3xl font-bold">${price}</span>
        <span className="text-gray-600">/{period}</span>
        {isYearly && plan.price.monthly > 0 && (
          <div className="text-sm text-green-600 font-medium">
            Save ${(plan.price.monthly * 12) - plan.price.yearly}/year
          </div>
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start free and scale as you grow. All plans include our core AI analytics features.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isYearly ? 'font-semibold' : 'text-gray-600'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={`text-sm ${isYearly ? 'font-semibold' : 'text-gray-600'}`}>
              Yearly
            </span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Save up to 17%
            </Badge>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.color} ${plan.popular ? 'scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  {plan.icon}
                </div>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-sm">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  {getPrice(plan)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Button
                  className={`w-full ${plan.buttonColor}`}
                  disabled={plan.id === currentPlan || loading === plan.id}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    getButtonText(plan)
                  )}
                </Button>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-900">Features included:</h4>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {plan.limitations.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <h4 className="font-semibold text-sm text-gray-600">Not included:</h4>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="text-sm text-gray-500">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What happens to my data if I downgrade?</h3>
              <p className="text-gray-600">Your data is always safe. If you downgrade, some features may become unavailable, but your historical data remains intact.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">We offer a 30-day money-back guarantee for all paid plans. Contact support if you're not satisfied.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">Yes! Our Starter plan is completely free forever. You can also try any paid plan free for 14 days.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-6">
            Join thousands of businesses already using IBIAS to make data-driven decisions.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href={user ? '/' : '/auth'}>
                {user ? 'Go to Main Page' : 'Start Free Trial'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="mailto:sales@ibias.com">
                Contact Sales
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}