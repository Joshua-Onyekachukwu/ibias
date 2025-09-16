'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  ArrowLeft,
  Chrome,
  Sparkles,
  Shield,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { toast } from 'sonner'

// Form schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
})

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

type LoginForm = z.infer<typeof loginSchema>
type SignupForm = z.infer<typeof signupSchema>

interface EnhancedAuthProps {
  initialMode?: 'login' | 'signup'
}

export default function EnhancedAuth({ initialMode = 'login' }: EnhancedAuthProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { signIn, signUp, signInWithGoogle, resetPassword, loading, mfaRequired, user } = useAuth()
  
  const [isLogin, setIsLogin] = useState(initialMode === 'login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showMFA, setShowMFA] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [forgotPassword, setForgotPassword] = useState(false)
  const [mfaToken, setMfaToken] = useState('')
  const [pendingCredentials, setPendingCredentials] = useState<{email: string, password: string} | null>(null)

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  })

  // Handle URL parameter changes
  useEffect(() => {
    const mode = searchParams.get('mode')
    if (mode === 'signin' || mode === 'signup') {
      setIsLogin(mode === 'signin')
    }
  }, [searchParams])

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.replace('/dashboard')
    }
  }, [user, router])

  const handleLogin = useCallback(async (data: LoginForm) => {
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      await signIn(data.email, data.password)
      setSuccess('Welcome back! Redirecting to dashboard...')
      toast.success('Successfully signed in!')
      // Let the useEffect handle the redirect when user state updates
    } catch (err: any) {
      if (err.message === 'MFA_REQUIRED') {
        // Store credentials for MFA verification
        setPendingCredentials({ email: data.email, password: data.password })
        setShowMFA(true)
        setError('')
        toast.success('Multi-Factor Authentication Required - Please enter your authentication code to continue.')
      } else {
        const errorMessage = getSupabaseErrorMessage(err)
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }, [signIn, router])

  const handleSignup = useCallback(async (data: SignupForm) => {
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      await signUp(data.email, data.password, data.name)
      setSuccess('Account created successfully! Please sign in to continue.')
      toast.success('Account created successfully! Please sign in to continue.')
      router.replace('/auth?mode=signin')
    } catch (err: any) {
      const errorMessage = getSupabaseErrorMessage(err)
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [signUp, router])

  const handleGoogleSignIn = useCallback(async () => {
    setError('')
    setIsLoading(true)

    try {
      await signInWithGoogle()
      toast.success('Successfully signed in with Google!')
      // Let the useEffect handle the redirect when user state updates
    } catch (err: any) {
      const errorMessage = 'Failed to sign in with Google. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [signInWithGoogle, router])

  const handleForgotPassword = useCallback(async (email: string) => {
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await resetPassword(email)
      setSuccess('Password reset email sent! Check your inbox.')
      toast.success('Password reset email sent!')
      setForgotPassword(false)
    } catch (err: any) {
      const errorMessage = getSupabaseErrorMessage(err)
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [resetPassword])

  const toggleMode = useCallback(() => {
    setIsLogin(!isLogin)
    setError('')
    setSuccess('')
    setForgotPassword(false)
    loginForm.reset()
    signupForm.reset()
  }, [isLogin, loginForm, signupForm])

  const handleMFAVerification = async () => {
    if (!pendingCredentials || !mfaToken.trim()) {
      setError('Please enter your authentication code.')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      await signIn(pendingCredentials.email, pendingCredentials.password, {
        token: mfaToken.trim()
      })
      
      toast.success('Welcome back! You have been successfully signed in.')
      
      // Reset MFA state
      setShowMFA(false)
      setPendingCredentials(null)
      setMfaToken('')
      
      // Let the useEffect handle the redirect when user state updates
    } catch (error: any) {
      const errorMessage = getSupabaseErrorMessage(error)
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const getSupabaseErrorMessage = (error: any): string => {
    const errorMessage = error?.message || error?.error_description || error?.error || 'Unknown error'
    const errorCode = error?.code || ''
    
    // Handle MFA specific errors
    if (errorMessage.includes('invalid mfa') || errorMessage.includes('invalid authentication code')) {
      return 'Invalid authentication code. Please check your authenticator app and try again.'
    }
    
    if (errorMessage === 'MFA_REQUIRED' || errorMessage.includes('mfa_required')) {
      return 'Multi-factor authentication is required for your account.'
    }
    
    // Handle rate limiting with specific messages
    if (errorMessage.includes('Too many requests') && errorMessage.includes('retry after')) {
      return errorMessage // Use the specific rate limit message with time
    }
    
    // Handle Supabase specific errors
    if (errorMessage.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.'
    }
    
    if (errorMessage.includes('Email not confirmed')) {
      return 'Please check your email and click the confirmation link before signing in.'
    }
    
    if (errorMessage.includes('User not found')) {
      return 'No account found with this email address. Please sign up first.'
    }
    
    if (errorMessage.includes('Password should be at least')) {
      return 'Password must be at least 6 characters long.'
    }
    
    if (errorMessage.includes('User already registered') || errorMessage.includes('An account with this email already exists')) {
      return 'An account with this email already exists. Please sign in instead or use a different email address.'
    }
    
    if (errorMessage.includes('Invalid email')) {
      return 'Please enter a valid email address.'
    }
    
    if (errorMessage.includes('Too many') && errorMessage.includes('attempts')) {
      return errorMessage // Use the specific rate limiting message from AuthContext
    }
    
    if (errorMessage.includes('Too many requests')) {
      return 'Too many login attempts. Please wait a few minutes before trying again.'
    }
    
    if (errorMessage.includes('Network request failed') || errorMessage.includes('fetch')) {
      return 'Network error. Please check your internet connection and try again.'
    }
    
    if (errorMessage.includes('Signup requires a valid password')) {
      return 'Please enter a valid password (minimum 6 characters).'
    }
    
    if (errorMessage.includes('Unable to validate email address')) {
      return 'Invalid email format. Please enter a valid email address.'
    }
    
    // Return the original error message if it's descriptive enough
    if (errorMessage && errorMessage.length > 10 && !errorMessage.includes('undefined')) {
      return errorMessage
    }
    
    // Fallback for truly unknown errors
    return 'Authentication failed. Please try again or contact support if the problem persists.'
  }

  if (forgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Reset Password
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Enter your email to receive a password reset link
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              const email = (e.target as any).email.value
              handleForgotPassword(email)
            }}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                    Email Address
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="pl-10 h-12 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>{success}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setForgotPassword(false)}
                  className="w-full h-12 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Sign In
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  // MFA Verification Component
  const MFAVerification = () => (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl mb-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Two-Factor Authentication
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <div className="space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
          >
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </motion.div>
        )}
        
        <div>
          <Label htmlFor="mfa-token" className="text-gray-700 dark:text-gray-300">
            Authentication Code
          </Label>
          <div className="relative mt-1">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="mfa-token"
              type="text"
              placeholder="000000"
              value={mfaToken}
              onChange={(e) => setMfaToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="pl-10 h-12 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 text-center text-lg tracking-widest font-mono"
              maxLength={6}
              autoComplete="one-time-code"
            />
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowMFA(false)
              setPendingCredentials(null)
              setMfaToken('')
              setError('')
            }}
            className="flex-1 h-12 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleMFAVerification}
            disabled={isLoading || mfaToken.length !== 6}
            className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Verify'
            )}
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {showMFA ? (
          <MFAVerification />
        ) : (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin 
                ? 'Sign in to access your IBIAS dashboard' 
                : 'Join IBIAS and start your journey'
              }
            </p>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 flex items-center space-x-2 text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg"
              >
                <CheckCircle className="h-4 w-4" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-12 mb-6 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
          >
            <Chrome className="h-5 w-5 mr-2" />
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                    Email Address
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      {...loginForm.register('email')}
                      type="email"
                      className="pl-10 h-12 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      placeholder="Enter your email"
                    />
                  </div>
                  {loginForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      {...loginForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="pl-10 pr-10 h-12 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      {...loginForm.register('rememberMe')}
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPassword(true)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                  >
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={signupForm.handleSubmit(handleSignup)}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                    Full Name
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      {...signupForm.register('name')}
                      type="text"
                      className="pl-10 h-12 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {signupForm.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                    Email Address
                  </Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      {...signupForm.register('email')}
                      type="email"
                      className="pl-10 h-12 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      placeholder="Enter your email"
                    />
                  </div>
                  {signupForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      {...signupForm.register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="pl-10 pr-10 h-12 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      {...signupForm.register('confirmPassword')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="pl-10 pr-10 h-12 bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {signupForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex items-start">
                  <input
                    {...signupForm.register('terms')}
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                  />
                  <div className="ml-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      I agree to the{' '}
                      <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                    {signupForm.formState.errors.terms && (
                      <p className="text-red-500 text-sm mt-1">
                        {signupForm.formState.errors.terms.message}
                      </p>
                    )}
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              type="button"
              onClick={toggleMode}
              className="ml-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}