import { Metadata } from 'next'
import { Suspense } from 'react'
import EnhancedAuth from '@/components/auth/enhanced-auth'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Authentication | IBIAS',
  description: 'Sign in to your IBIAS account or create a new one to get started with our business intelligence platform.',
  keywords: ['login', 'signup', 'authentication', 'IBIAS', 'business intelligence'],
}

function AuthPageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-600">Loading authentication...</p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthPageSkeleton />}>
      <EnhancedAuth />
    </Suspense>
  )
}