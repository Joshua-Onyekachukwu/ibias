'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const onboardingSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  job_title: z.string().optional(),
  company_name: z.string().min(2, 'Company name must be at least 2 characters'),
  company_size: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']),
  industry: z.string().min(2, 'Please select an industry')
})

type OnboardingForm = z.infer<typeof onboardingSchema>

const industries = [
  'E-commerce',
  'SaaS/Technology',
  'Retail',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Real Estate',
  'Marketing/Advertising',
  'Consulting',
  'Other'
]

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const { user, supabaseUser, refreshProfile } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      full_name: supabaseUser?.user_metadata?.full_name || '',
      job_title: '',
      company_name: '',
      company_size: '1-10',
      industry: ''
    }
  })

  useEffect(() => {
    // Redirect if user already has a profile
    if (user && user.full_name) {
      router.push('/')
    }
  }, [user, router])

  const onSubmit = async (data: OnboardingForm) => {
    if (!supabaseUser) return
    
    setLoading(true)
    try {
      // Create company first
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: data.company_name,
          slug: data.company_name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
          industry: data.industry,
          company_size: data.company_size,
          subscription_plan: 'starter', // Free tier
          subscription_status: 'active'
        })
        .select()
        .single()

      if (companyError) throw companyError

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: supabaseUser.id,
          company_id: company.id,
          full_name: data.full_name,
          job_title: data.job_title,
          role: 'admin' // First user becomes admin
        })

      if (profileError) throw profileError

      // Create initial subscription record
      const { error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: supabaseUser.id,
          plan_type: 'starter',
          status: 'active',
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
        })

      if (subscriptionError) {
        console.warn('Could not create subscription record:', subscriptionError)
        // Don't throw error as this might be due to missing table
      }

      setStep(2)
      
      // Refresh profile data
      await refreshProfile()
      
      // Redirect to landing page after a short delay
      setTimeout(() => {
        router.push('/')
      }, 2000)
      
    } catch (error) {
      console.error('Onboarding error:', error)
      // Handle error - could show toast notification
    } finally {
      setLoading(false)
    }
  }

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to IBIAS!</h2>
              <p className="text-gray-600 mb-4">
                Your account has been set up successfully. You're starting with our free Starter plan.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to the main page...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome to IBIAS</CardTitle>
          <CardDescription className="text-center">
            Let's set up your account and get you started with AI-powered business intelligence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  {...form.register('full_name')}
                  placeholder="John Doe"
                />
                {form.formState.errors.full_name && (
                  <p className="text-sm text-red-600">{form.formState.errors.full_name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title</Label>
                <Input
                  id="job_title"
                  {...form.register('job_title')}
                  placeholder="CEO, Marketing Manager, etc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                {...form.register('company_name')}
                placeholder="Your Company Inc."
              />
              {form.formState.errors.company_name && (
                <p className="text-sm text-red-600">{form.formState.errors.company_name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_size">Company Size *</Label>
                <Select onValueChange={(value) => form.setValue('company_size', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-1000">201-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select onValueChange={(value) => form.setValue('industry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.industry && (
                  <p className="text-sm text-red-600">{form.formState.errors.industry.message}</p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">🎉 Starting with Starter Plan (Free)</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Connect up to 2 data sources</li>
                <li>• 5 AI insights per month</li>
                <li>• 3 months of historical data</li>
                <li>• 1 team member</li>
                <li>• Basic analytics panel</li>
              </ul>
              <p className="text-xs text-blue-600 mt-2">
                You can upgrade anytime to unlock more features and higher limits.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up your account...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}