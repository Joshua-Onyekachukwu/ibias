'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Completing sign in...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          setMessage(error.message || 'Authentication failed')
          // Redirect to auth page after 3 seconds
          setTimeout(() => router.push('/auth'), 3000)
          return
        }

        if (data.session) {
          setStatus('success')
          setMessage('Sign in successful! Redirecting...')
          // Redirect to dashboard after successful auth
          setTimeout(() => router.push('/dashboard'), 1500)
        } else {
          // No session, redirect to auth
          router.push('/auth')
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred')
        setTimeout(() => router.push('/auth'), 3000)
      }
    }

    handleAuthCallback()
  }, [router])

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
      case 'success':
        return <CheckCircle className="h-8 w-8 mx-auto mb-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-gray-900'
      case 'success':
        return 'text-green-900'
      case 'error':
        return 'text-red-900'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        {getIcon()}
        <h2 className={`text-lg font-semibold mb-2 ${getStatusColor()}`}>{message}</h2>
        <p className="text-gray-600">
          {status === 'loading' && 'Please wait while we set up your account.'}
          {status === 'success' && 'Taking you to your dashboard...'}
          {status === 'error' && 'Redirecting back to sign in...'}
        </p>
      </div>
    </div>
  )
}