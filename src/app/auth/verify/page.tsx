'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')
      const type = searchParams.get('type')

      if (!token) {
        setStatus('error')
        setMessage('Invalid verification link. Please check your email and try again.')
        return
      }

      try {
        // TODO: Implement Supabase email verification
        // const { error } = await supabase.auth.verifyOtp({
        //   token_hash: token,
        //   type: type as any || 'signup'
        // })
        
        // if (error) {
        //   if (error.message.includes('expired')) {
        //     setStatus('expired')
        //     setMessage('Verification link has expired. Please request a new one.')
        //   } else {
        //     setStatus('error')
        //     setMessage(error.message || 'Failed to verify email. Please try again.')
        //   }
        //   return
        // }
        
        // Simulate verification process
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Simulate random success/failure for demo
        const isSuccess = Math.random() > 0.3
        
        if (isSuccess) {
          setStatus('success')
          setMessage('Your email has been successfully verified! You can now access all features.')
          
          // Redirect to landing page after successful verification
          setTimeout(() => {
            router.push('/')
          }, 3000)
        } else {
          setStatus('error')
          setMessage('Failed to verify email. The link may be invalid or expired.')
        }
      } catch (error: any) {
        setStatus('error')
        setMessage(error.message || 'An unexpected error occurred during verification.')
      }
    }

    verifyEmail()
  }, [searchParams, router])

  const handleResendVerification = async () => {
    try {
      // TODO: Implement resend verification email
      // const { error } = await supabase.auth.resend({
      //   type: 'signup',
      //   email: userEmail
      // })
      
      // if (error) throw error
      
      setMessage('Verification email sent! Please check your inbox.')
    } catch (error: any) {
      setMessage(error.message || 'Failed to resend verification email.')
    }
  }

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-600" />
      case 'error':
      case 'expired':
        return <XCircle className="h-12 w-12 text-red-600" />
      default:
        return <Mail className="h-12 w-12 text-gray-400" />
    }
  }

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return 'Verifying Your Email...'
      case 'success':
        return 'Email Verified!'
      case 'error':
        return 'Verification Failed'
      case 'expired':
        return 'Link Expired'
      default:
        return 'Email Verification'
    }
  }

  const getDescription = () => {
    switch (status) {
      case 'loading':
        return 'Please wait while we verify your email address.'
      case 'success':
        return 'Your account is now fully activated. Redirecting to main page...'
      case 'error':
        return 'We encountered an issue verifying your email address.'
      case 'expired':
        return 'The verification link has expired. Please request a new one.'
      default:
        return 'Click the link in your email to verify your account.'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          <CardTitle className="text-2xl">{getTitle()}</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert variant={status === 'success' ? 'default' : 'destructive'}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === 'loading' && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                This may take a few moments...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Redirecting you to the main page in a few seconds...
              </p>
              <Button asChild className="w-full">
                <Link href="/">Go to Main Page</Link>
              </Button>
            </div>
          )}

          {(status === 'error' || status === 'expired') && (
            <div className="space-y-3">
              {status === 'expired' && (
                <Button onClick={handleResendVerification} className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </Button>
              )}
              <div className="flex gap-2">
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/auth">Back to Login</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/">Go Home</Link>
                </Button>
              </div>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center">
              <Button asChild variant="outline">
                <Link href="/auth">Back to Login</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}