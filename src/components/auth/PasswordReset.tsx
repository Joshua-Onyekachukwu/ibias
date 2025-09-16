'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const resetSchema = z.object({
  email: z.string().email('Please enter a valid email address')
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type ResetForm = z.infer<typeof resetSchema>
type ChangePasswordForm = z.infer<typeof changePasswordSchema>

interface PasswordResetProps {
  mode?: 'reset' | 'change'
  onSuccess?: () => void
  onCancel?: () => void
}

export function PasswordReset({ mode = 'reset', onSuccess, onCancel }: PasswordResetProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  const resetForm = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: ''
    }
  })

  const changeForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  const handlePasswordReset = async (data: ResetForm) => {
    setIsLoading(true)
    setMessage(null)

    try {
      // TODO: Implement Supabase password reset
      // const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      //   redirectTo: `${window.location.origin}/auth/reset-password`
      // })
      
      // if (error) throw error
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setEmailSent(true)
      setMessage({
        type: 'success',
        text: 'Password reset email sent! Check your inbox for further instructions.'
      })
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to send reset email. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (data: ChangePasswordForm) => {
    setIsLoading(true)
    setMessage(null)

    try {
      // TODO: Implement Supabase password change
      // First verify current password
      // const { error: signInError } = await supabase.auth.signInWithPassword({
      //   email: user.email,
      //   password: data.currentPassword
      // })
      
      // if (signInError) throw new Error('Current password is incorrect')
      
      // Then update password
      // const { error } = await supabase.auth.updateUser({
      //   password: data.newPassword
      // })
      
      // if (error) throw error
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage({
        type: 'success',
        text: 'Password updated successfully!'
      })
      
      changeForm.reset()
      onSuccess?.()
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update password. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (mode === 'reset') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/auth" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <CardTitle className="text-2xl">Reset Password</CardTitle>
          </div>
          <CardDescription>
            {emailSent 
              ? "We've sent you a password reset link"
              : "Enter your email address and we'll send you a reset link"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!emailSent ? (
            <form onSubmit={resetForm.handleSubmit(handlePasswordReset)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...resetForm.register('email')}
                  disabled={isLoading}
                />
                {resetForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {resetForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              {message && (
                <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Reset Email
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              {message && (
                <Alert>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEmailSent(false)
                    resetForm.reset()
                    setMessage(null)
                  }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Enter your current password and choose a new one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={changeForm.handleSubmit(handlePasswordChange)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              {...changeForm.register('currentPassword')}
              disabled={isLoading}
            />
            {changeForm.formState.errors.currentPassword && (
              <p className="text-sm text-destructive">
                {changeForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              {...changeForm.register('newPassword')}
              disabled={isLoading}
            />
            {changeForm.formState.errors.newPassword && (
              <p className="text-sm text-destructive">
                {changeForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...changeForm.register('confirmPassword')}
              disabled={isLoading}
            />
            {changeForm.formState.errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {changeForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            )}
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}