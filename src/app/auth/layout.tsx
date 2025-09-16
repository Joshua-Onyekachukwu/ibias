import { Suspense } from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication - IBIAS',
  description: 'Sign in or create your IBIAS account to access powerful business intelligence tools.',
  robots: 'noindex, nofollow'
}

// Fast loading component for auth pages
function AuthLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl border-0 p-8">
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="text-center space-y-2">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
              <div className="h-4 bg-gray-100 rounded w-2/3 mx-auto animate-pulse" />
            </div>
            
            {/* Form skeleton */}
            <div className="space-y-4">
              <div className="h-12 bg-gray-100 rounded animate-pulse" />
              <div className="h-12 bg-gray-100 rounded animate-pulse" />
              <div className="h-12 bg-gray-100 rounded animate-pulse" />
              <div className="h-12 bg-blue-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<AuthLoadingFallback />}>
      {children}
    </Suspense>
  )
}