'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/use-toast'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  // MFA related functions (to be implemented when tables are ready)
  setupMFA: () => Promise<{ secret: string; qrCode: string; backupCodes: string[] }>
  verifyMFA: (token: string) => Promise<boolean>
  enableMFA: (token: string) => Promise<boolean>
  disableMFA: (password: string) => Promise<boolean>
  getMFAStatus: () => Promise<{ enabled: boolean; backupCodesCount: number }>
  regenerateBackupCodes: () => Promise<string[]>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            toast({
              title: 'Welcome back!',
              description: 'You have been successfully signed in.',
            })
            break
          case 'SIGNED_OUT':
            toast({
              title: 'Signed out',
              description: 'You have been successfully signed out.',
            })
            break
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed successfully')
            break
          case 'USER_UPDATED':
            toast({
              title: 'Profile updated',
              description: 'Your profile has been updated successfully.',
            })
            break
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast({
          title: 'Error signing out',
          description: error.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: 'Error signing out',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        console.error('Error refreshing session:', error)
      } else {
        setSession(data.session)
        setUser(data.session?.user ?? null)
      }
    } catch (error) {
      console.error('Error in refreshSession:', error)
    }
  }

  // MFA functions (placeholder implementations until tables are ready)
  const setupMFA = async () => {
    // TODO: Implement when user_mfa_settings table is ready
    throw new Error('MFA setup not yet implemented - database tables pending')
  }

  const verifyMFA = async (token: string) => {
    // TODO: Implement when user_mfa_settings table is ready
    console.log('MFA verification not yet implemented:', token)
    return false
  }

  const enableMFA = async (token: string) => {
    // TODO: Implement when user_mfa_settings table is ready
    console.log('MFA enable not yet implemented:', token)
    return false
  }

  const disableMFA = async (password: string) => {
    // TODO: Implement when user_mfa_settings table is ready
    console.log('MFA disable not yet implemented:', password)
    return false
  }

  const getMFAStatus = async () => {
    // TODO: Implement when user_mfa_settings table is ready
    return { enabled: false, backupCodesCount: 0 }
  }

  const regenerateBackupCodes = async () => {
    // TODO: Implement when user_mfa_settings table is ready
    return []
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signOut,
    refreshSession,
    setupMFA,
    verifyMFA,
    enableMFA,
    disableMFA,
    getMFAStatus,
    regenerateBackupCodes,
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

export { AuthContext }