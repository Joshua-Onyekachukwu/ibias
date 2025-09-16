export interface User {
  id: string
  email: string
  full_name: string
  role: 'owner' | 'admin' | 'analyst' | 'user' | 'viewer'
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}