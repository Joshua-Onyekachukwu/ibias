'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CreditCard,
  Calendar,
  Download,
  Receipt,
  AlertCircle,
  CheckCircle,
  Crown,
  Zap,
  Star,
  Building,
  Users,
  TrendingUp,
  Shield,
  Clock,
  RefreshCw,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  DollarSign,
  Package,
  X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'

interface PlanFeature {
  name: string
  included: boolean
  limit?: string
}

interface Plan {
  id: string
  name: string
  price: number
  yearlyPrice: number
  description: string
  features: PlanFeature[]
  popular?: boolean
  current?: boolean
  icon: any
  color: string
}

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'failed'
  description: string
  downloadUrl: string
}

interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'bank'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

interface UsageMetric {
  name: string
  used: number
  limit: number
  unit: string
  color: string
}

export default function BillingPage() {
  const { user, userProfile } = useAuth()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(false)
  const [showAddPayment, setShowAddPayment] = useState(false)
  
  // Mock current subscription
  const currentPlan = {
    name: 'Growth',
    price: 59,
    nextBilling: '2024-02-15',
    status: 'active'
  }

  // Plans configuration
  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 0,
      yearlyPrice: 0,
      description: 'Perfect for getting started',
      icon: Package,
      color: 'text-gray-600',
      features: [
        { name: 'Basic Analytics', included: true },
        { name: 'Up to 1,000 data points', included: true, limit: '1,000' },
        { name: 'Email Support', included: true },
        { name: 'Basic Integrations', included: true, limit: '3' },
        { name: 'AI Insights', included: false },
        { name: 'Advanced Analytics', included: false },
        { name: 'Custom Reports', included: false },
        { name: 'Priority Support', included: false }
      ]
    },
    {
      id: 'growth',
      name: 'Growth',
      price: 59,
      yearlyPrice: 47,
      description: 'Best for growing businesses',
      icon: TrendingUp,
      color: 'text-blue-600',
      popular: true,
      current: true,
      features: [
        { name: 'Advanced Analytics', included: true },
        { name: 'Up to 10,000 data points', included: true, limit: '10,000' },
        { name: 'Priority Email Support', included: true },
        { name: 'All Integrations', included: true, limit: 'Unlimited' },
        { name: 'AI Insights', included: true },
        { name: 'Custom Reports', included: true },
        { name: 'API Access', included: true },
        { name: 'Team Collaboration', included: false }
      ]
    },
    {
      id: 'scale',
      name: 'Scale',
      price: 149,
      yearlyPrice: 119,
      description: 'For scaling businesses',
      icon: Zap,
      color: 'text-purple-600',
      features: [
        { name: 'Everything in Growth', included: true },
        { name: 'Up to 100,000 data points', included: true, limit: '100,000' },
        { name: 'Phone & Chat Support', included: true },
        { name: 'Advanced AI Features', included: true },
        { name: 'Team Collaboration', included: true, limit: '10 users' },
        { name: 'Custom Dashboards', included: true },
        { name: 'White-label Options', included: true },
        { name: 'SLA Guarantee', included: true }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      yearlyPrice: 239,
      description: 'For large organizations',
      icon: Building,
      color: 'text-gold-600',
      features: [
        { name: 'Everything in Scale', included: true },
        { name: 'Unlimited data points', included: true, limit: 'Unlimited' },
        { name: 'Dedicated Support Manager', included: true },
        { name: 'Custom AI Models', included: true },
        { name: 'Unlimited Users', included: true },
        { name: 'On-premise Deployment', included: true },
        { name: 'Custom Integrations', included: true },
        { name: 'Enterprise SLA', included: true }
      ]
    }
  ]

  // Mock usage data
  const usageMetrics: UsageMetric[] = [
    {
      name: 'Data Points',
      used: 7500,
      limit: 10000,
      unit: 'points',
      color: 'bg-blue-500'
    },
    {
      name: 'API Calls',
      used: 2300,
      limit: 5000,
      unit: 'calls',
      color: 'bg-green-500'
    },
    {
      name: 'Integrations',
      used: 5,
      limit: 10,
      unit: 'active',
      color: 'bg-purple-500'
    },
    {
      name: 'Team Members',
      used: 3,
      limit: 10,
      unit: 'users',
      color: 'bg-orange-500'
    }
  ]

  // Mock invoices
  const invoices: Invoice[] = [
    {
      id: 'INV-2024-001',
      date: '2024-01-15',
      amount: 59.00,
      status: 'paid',
      description: 'Growth Plan - Monthly',
      downloadUrl: '#'
    },
    {
      id: 'INV-2023-012',
      date: '2023-12-15',
      amount: 59.00,
      status: 'paid',
      description: 'Growth Plan - Monthly',
      downloadUrl: '#'
    },
    {
      id: 'INV-2023-011',
      date: '2023-11-15',
      amount: 59.00,
      status: 'paid',
      description: 'Growth Plan - Monthly',
      downloadUrl: '#'
    }
  ]

  // Mock payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    },
    {
      id: '2',
      type: 'card',
      brand: 'Mastercard',
      last4: '8888',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false
    }
  ]

  const handlePlanChange = (planId: string) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Plan change initiated. You will be redirected to payment.')
    }, 1000)
  }

  const handleCancelSubscription = () => {
    toast.error('Subscription cancellation requires confirmation. Check your email.')
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    toast.success(`Downloading invoice ${invoiceId}...`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Billing & Subscription</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your subscription and billing information</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-3 py-1">
                Current Plan: {currentPlan.name}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Current Subscription Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="text-2xl font-bold">{currentPlan.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Monthly Cost</p>
                  <p className="text-2xl font-bold">${currentPlan.price}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Next Billing</p>
                  <p className="text-lg font-medium">{currentPlan.nextBilling}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Usage Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Usage This Month</CardTitle>
              <CardDescription>Track your current usage against plan limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {usageMetrics.map((metric, index) => {
                  const percentage = (metric.used / metric.limit) * 100
                  return (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{metric.name}</p>
                        <p className="text-sm text-gray-500">
                          {metric.used.toLocaleString()} / {metric.limit.toLocaleString()} {metric.unit}
                        </p>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <p className="text-xs text-gray-500">
                        {percentage.toFixed(1)}% used
                      </p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="plans" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
              <TabsTrigger value="payment">Payment Methods</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="usage">Usage Details</TabsTrigger>
            </TabsList>

            {/* Plans & Pricing */}
            <TabsContent value="plans" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold">Choose Your Plan</h3>
                  <p className="text-gray-600">Upgrade or downgrade your subscription anytime</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={billingCycle === 'monthly' ? 'font-medium' : 'text-gray-500'}>Monthly</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  >
                    {billingCycle === 'monthly' ? 'Switch to Yearly' : 'Switch to Monthly'}
                  </Button>
                  <span className={billingCycle === 'yearly' ? 'font-medium' : 'text-gray-500'}>Yearly</span>
                  {billingCycle === 'yearly' && (
                    <Badge variant="secondary">Save 20%</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => {
                  const Icon = plan.icon
                  const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.price
                  
                  return (
                    <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''} ${plan.current ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                        </div>
                      )}
                      {plan.current && (
                        <div className="absolute -top-3 right-4">
                          <Badge variant="secondary">Current Plan</Badge>
                        </div>
                      )}
                      
                      <CardHeader className="text-center">
                        <div className={`mx-auto p-3 rounded-lg bg-gray-100 dark:bg-gray-800 w-fit`}>
                          <Icon className={`h-6 w-6 ${plan.color}`} />
                        </div>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="space-y-1">
                          <div className="text-3xl font-bold">
                            ${price}
                            <span className="text-lg font-normal text-gray-500">
                              /{billingCycle === 'yearly' ? 'year' : 'month'}
                            </span>
                          </div>
                          {billingCycle === 'yearly' && plan.price > 0 && (
                            <p className="text-sm text-gray-500">
                              Save ${(plan.price - plan.yearlyPrice) * 12}/year
                            </p>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              {feature.included ? (
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              ) : (
                                <X className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              )}
                              <span className={feature.included ? '' : 'text-gray-500'}>
                                {feature.name}
                                {feature.limit && (
                                  <span className="text-gray-500"> ({feature.limit})</span>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                        
                        <Button
                          className="w-full"
                          variant={plan.current ? 'secondary' : plan.popular ? 'default' : 'outline'}
                          disabled={plan.current || loading}
                          onClick={() => handlePlanChange(plan.id)}
                        >
                          {loading ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : plan.current ? (
                            'Current Plan'
                          ) : plan.price === 0 ? (
                            'Downgrade'
                          ) : (
                            'Upgrade'
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <Card className="mt-8">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-600">Cancel Subscription</h4>
                      <p className="text-sm text-gray-500">You can cancel your subscription at any time</p>
                    </div>
                    <Button variant="destructive" onClick={handleCancelSubscription}>
                      Cancel Subscription
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Methods */}
            <TabsContent value="payment" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Payment Methods</h3>
                  <p className="text-gray-600">Manage your payment methods and billing information</p>
                </div>
                <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Payment Method</DialogTitle>
                      <DialogDescription>
                        Add a new payment method to your account
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Card Number</Label>
                        <Input placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Expiry Date</Label>
                          <Input placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label>CVC</Label>
                          <Input placeholder="123" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Cardholder Name</Label>
                        <Input placeholder="John Doe" />
                      </div>
                      <Button className="w-full" onClick={() => setShowAddPayment(false)}>
                        Add Payment Method
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {paymentMethods.map((method) => (
                  <Card key={method.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {method.brand} •••• {method.last4}
                              </p>
                              {method.isDefault && (
                                <Badge variant="secondary">Default</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              Expires {method.expiryMonth}/{method.expiryYear}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Invoices */}
            <TabsContent value="invoices" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Billing History</h3>
                  <p className="text-gray-600">Download your invoices and view payment history</p>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{invoice.date}</TableCell>
                        <TableCell>{invoice.description}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadInvoice(invoice.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            {/* Usage Details */}
            <TabsContent value="usage" className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold">Detailed Usage</h3>
                <p className="text-gray-600">Monitor your feature usage and plan limits</p>
              </div>

              <div className="grid gap-6">
                {usageMetrics.map((metric, index) => {
                  const percentage = (metric.used / metric.limit) * 100
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{metric.name}</CardTitle>
                          <Badge variant="outline">
                            {metric.used.toLocaleString()} / {metric.limit.toLocaleString()} {metric.unit}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Progress value={percentage} className="h-3" />
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>{percentage.toFixed(1)}% used</span>
                            <span>{(metric.limit - metric.used).toLocaleString()} {metric.unit} remaining</span>
                          </div>
                          {percentage > 80 && (
                            <div className="flex items-center gap-2 text-amber-600">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-sm">Approaching limit - consider upgrading</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}