'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { Database, UserProfile } from '@/lib/database.types'
import { User } from '@/types/user'
import { mfaService, MFAVerification } from '@/lib/auth/mfa'
import { rateLimiter } from '@/lib/auth/rate-limiter'
import { sessionManager } from '@/lib/auth/session-manager'

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  session: Session | null
  profile: UserProfile | null
  userProfile: UserProfile | null // Alias for profile for backward compatibility
  loading: boolean
  mfaRequired: boolean
  signIn: (email: string, password: string, mfaVerification?: MFAVerification) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  refreshProfile: () => Promise<void>
  refreshUser: () => Promise<void>
  // MFA methods
  setupMFA: () => Promise<{ secret: string; qrCode: string; backupCodes: string[] }>
  verifyMFA: (token: string) => Promise<boolean>
  disableMFA: () => Promise<void>
  isMFAEnabled: () => Promise<boolean>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [mfaRequired, setMfaRequired] = useState(false)
  const supabase = createClient()

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  const createUserFromProfile = (supabaseUser: SupabaseUser, profile: UserProfile | null): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      full_name: profile?.full_name || supabaseUser.user_metadata?.full_name || '',
      role: (profile?.role as User['role']) || 'user',
      created_at: supabaseUser.created_at,
      updated_at: supabaseUser.updated_at || new Date().toISOString()
    }
  }

  const refreshProfile = async () => {
    if (supabaseUser) {
      const profileData = await fetchProfile(supabaseUser.id)
      setProfile(profileData)
      setUser(createUserFromProfile(supabaseUser, profileData))
    }
  }

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      setSupabaseUser(session.user)
      setSession(session)
      const profileData = await fetchProfile(session.user.id)
      setProfile(profileData)
      setUser(createUserFromProfile(session.user, profileData))
    }
  }

  const signIn = async (email: string, password: string, mfaVerification?: MFAVerification) => {
    setLoading(true)
    const clientId = rateLimiter.getClientIdentifier()
    
    try {
      // Check rate limiting
      const rateLimitResult = await rateLimiter.checkRateLimit(email, 'login')
      if (!rateLimitResult.allowed) {
        const error = new Error(`Too many login attempts. Please try again in ${Math.ceil((rateLimitResult.retryAfter || 0) / 60)} minutes.`)
        await rateLimiter.recordAttempt(email, 'login', false, { reason: 'rate_limited' })
        throw error
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        await rateLimiter.recordAttempt(email, 'login', false, { 
          error: error.message,
          client_id: clientId 
        })
        throw error
      }
      
      if (data.user) {
        // Check if MFA is required
        const mfaEnabled = await mfaService.isMFAEnabled(data.user.id)
        
        if (mfaEnabled && !mfaVerification) {
          // MFA is required but not provided
          setMfaRequired(true)
          setSupabaseUser(data.user) // Store user for MFA verification
          await rateLimiter.recordAttempt(email, 'login', false, { 
            reason: 'mfa_required',
            client_id: clientId 
          })
          throw new Error('MFA_REQUIRED')
        }
        
        if (mfaEnabled && mfaVerification) {
          // Verify MFA
          const mfaValid = await mfaService.verifyMFA(data.user.id, mfaVerification)
          if (!mfaValid) {
            await rateLimiter.recordAttempt(email, 'mfa_verification', false, { 
              client_id: clientId 
            })
            throw new Error('Invalid MFA code. Please try again.')
          }
        }
        
        // Successful login
        setSupabaseUser(data.user)
        setSession(data.session)
        setMfaRequired(false)
        
        const profileData = await fetchProfile(data.user.id)
        setProfile(profileData)
        setUser(createUserFromProfile(data.user, profileData))
        
        // Initialize session management
        await sessionManager.createSession(data.user.id, data.session)
        sessionManager.initializeSessionMonitoring()
        
        // Record successful login
        await rateLimiter.recordAttempt(email, 'login', true, { 
          client_id: clientId,
          mfa_used: mfaEnabled 
        })
        
        // Log security event
        await supabase.rpc('log_security_event', {
          p_user_id: data.user.id,
          p_event_type: 'login_success',
          p_event_details: { 
            method: 'password',
            mfa_used: mfaEnabled,
            client_id: clientId 
          },
          p_success: true,
          p_risk_score: 0
        })
      }
    } catch (error: any) {
      console.error('Error signing in:', error)
      
      // Log failed login attempt
      if (supabaseUser) {
        await supabase.rpc('log_security_event', {
          p_user_id: supabaseUser.id,
          p_event_type: 'login_failed',
          p_event_details: { 
            method: 'password',
            error: error.message,
            client_id: clientId 
          },
          p_success: false,
          p_risk_score: 30
        })
      }
      
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    setLoading(true)
    const clientId = rateLimiter.getClientIdentifier()
    
    try {
      // Check rate limiting for signup
      const rateLimitResult = await rateLimiter.checkRateLimit(email, 'signup')
      if (!rateLimitResult.allowed) {
        const error = new Error(`Too many signup attempts. Please try again in ${Math.ceil((rateLimitResult.retryAfter || 0) / 60)} minutes.`)
        await rateLimiter.recordAttempt(email, 'signup', false, { reason: 'rate_limited' })
        throw error
      }

      // Let Supabase handle email uniqueness validation
      // We'll catch and handle the error appropriately

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || ''
          }
        }
      })
      
      if (error) {
        await rateLimiter.recordAttempt(email, 'signup', false, { 
          error: error.message,
          client_id: clientId 
        })
        throw error
      }
      
      // Record successful signup
      await rateLimiter.recordAttempt(email, 'signup', true, { 
        client_id: clientId 
      })
      
      // Log security event
      if (data.user) {
        await supabase.rpc('log_security_event', {
          p_user_id: data.user.id,
          p_event_type: 'signup_success',
          p_event_details: { 
            method: 'email',
            client_id: clientId 
          },
          p_success: true,
          p_risk_score: 0
        })
      }
      
      // Note: User will need to verify email before they can sign in
      // Profile will be created via database trigger after email verification
    } catch (error: any) {
      console.error('Error signing up:', error)
      
      // Log failed signup attempt
      await supabase.rpc('log_security_event', {
        p_user_id: null,
        p_event_type: 'signup_failed',
        p_event_details: { 
          method: 'email',
          email: email,
          error: error.message,
          client_id: clientId 
        },
        p_success: false,
        p_risk_score: 20
      })
      
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })
      
      if (error) throw error
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      // End session before signing out
      if (session && supabaseUser) {
        const sessionId = session.access_token.substring(0, 32)
        await sessionManager.endSession(sessionId)
        
        // Log security event
        await supabase.rpc('log_security_event', {
          p_user_id: supabaseUser.id,
          p_event_type: 'logout',
          p_event_details: { 
            method: 'manual',
            client_id: rateLimiter.getClientIdentifier()
          },
          p_success: true,
          p_risk_score: 0
        })
      }
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setSupabaseUser(null)
      setSession(null)
      setProfile(null)
      setMfaRequired(false)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      
      if (error) throw error
    } catch (error) {
      console.error('Error resetting password:', error)
      throw error
    }
  }

  // Optimized session initialization
  useEffect(() => {
    let mounted = true
    let timeoutId: NodeJS.Timeout

    const getInitialSession = async () => {
      try {
        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (mounted) {
            setLoading(false)
          }
        }, 1000) // Optimized to 1000ms for faster loading

        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          if (mounted) {
            setLoading(false)
          }
          return
        }

        if (mounted && session) {
          setSession(session)
          setSupabaseUser(session.user)
          // Fetch profile in parallel, don't block UI
          fetchProfile(session.user.id).then(profileData => {
            if (mounted) {
              setProfile(profileData)
              setUser(createUserFromProfile(session.user, profileData))
            }
          }).finally(() => {
            if (mounted) {
              setLoading(false)
            }
          })
        } else if (mounted) {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        if (mounted) {
          setLoading(false)
        }
      } finally {
        clearTimeout(timeoutId)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        setSession(session)
        setSupabaseUser(session?.user ?? null)
        
        if (session?.user) {
          // Fetch profile asynchronously without blocking
          fetchProfile(session.user.id).then(profileData => {
            if (mounted) {
              setProfile(profileData)
              setUser(createUserFromProfile(session.user, profileData))
            }
          })
        } else {
          setProfile(null)
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      subscription.unsubscribe()
    }
  }, [])

  // MFA methods
  const setupMFA = async () => {
    if (!supabaseUser) throw new Error('User not authenticated')
    return await mfaService.setupTOTP(supabaseUser.id, supabaseUser.email || '')
  }

  const verifyMFA = async (token: string) => {
    if (!supabaseUser) throw new Error('User not authenticated')
    return await mfaService.verifyMFA(supabaseUser.id, { token })
  }

  const disableMFA = async () => {
    if (!supabaseUser) throw new Error('User not authenticated')
    await mfaService.disableMFA(supabaseUser.id)
  }

  const isMFAEnabled = async () => {
    if (!supabaseUser) return false
    return await mfaService.isMFAEnabled(supabaseUser.id)
  }

  const value = {
    user,
    supabaseUser,
    session,
    profile,
    userProfile: profile, // Alias for backward compatibility
    loading,
    mfaRequired,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    refreshProfile,
    refreshUser,
    // MFA methods
    setupMFA,
    verifyMFA,
    disableMFA,
    isMFAEnabled
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}