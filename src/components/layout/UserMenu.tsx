'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Settings,
  LogOut,
  Shield,
  CreditCard,
  Crown,
  HelpCircle,
  User,
  Moon,
  Sun,
  Monitor,
  Bell,
  Activity,
  Zap,
  Star,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function UserMenu() {
  const { user, supabaseUser, signOut } = useAuth()
  const { subscription } = useSubscription()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      router.push('/auth?mode=signin')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
    }
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    toast.success(`Theme changed to ${newTheme}`)
  }

  const getStatusColor = () => {
    // Simulate user status - in real app this would come from user data
    return 'bg-green-500' // online status
  }

  const getUserInitials = () => {
    const name = supabaseUser?.user_metadata?.full_name || user?.email || 'U'
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
      case 'scale':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
      case 'growth':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
      default:
        return 'bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-lg'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-blue-500/20 transition-all duration-200 group">
          <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-gray-700 shadow-lg group-hover:shadow-xl transition-shadow">
            <AvatarImage src={supabaseUser?.user_metadata?.avatar_url} alt={user?.email} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          {/* Status Indicator */}
          <div className={cn(
            'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 transition-colors',
            getStatusColor()
          )} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 p-0" align="end" forceMount>
        {/* User Profile Header */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-b">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 ring-2 ring-white dark:ring-gray-700 shadow-md">
                <AvatarImage src={supabaseUser?.user_metadata?.avatar_url} alt={user?.email} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className={cn(
                'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800',
                getStatusColor()
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {supabaseUser?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.email}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Activity className="h-3 w-3 text-green-500" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
              </div>
            </div>
          </div>
          {subscription && (
            <div className="mt-3">
              <Badge className={cn('text-xs font-medium px-3 py-1 rounded-full w-fit shadow-sm', getPlanBadgeColor(subscription.plan_type))}>
                <Crown className="h-3 w-3 mr-1" />
                {subscription.plan_type.charAt(0).toUpperCase() + subscription.plan_type.slice(1)} Plan
              </Badge>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-2">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2 py-1 mb-1">Quick Actions</div>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="cursor-pointer flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-blue-600" />
                <div>
                  <span className="font-medium text-sm">Profile</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage your account</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings" className="cursor-pointer flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-blue-600" />
                <div>
                  <span className="font-medium text-sm">Settings</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Preferences & privacy</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/billing" className="cursor-pointer flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-blue-600" />
                <div>
                  <span className="font-medium text-sm">Billing</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Subscription & invoices</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
            </Link>
          </DropdownMenuItem>
        </div>

        {/* Theme Toggle */}
        <div className="p-2 border-t">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2 py-1 mb-1">Appearance</div>
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <Button
              variant={theme === 'light' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleThemeChange('light')}
              className="flex-1 h-8 text-xs"
            >
              <Sun className="h-3 w-3 mr-1" />
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleThemeChange('dark')}
              className="flex-1 h-8 text-xs"
            >
              <Moon className="h-3 w-3 mr-1" />
              Dark
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleThemeChange('system')}
              className="flex-1 h-8 text-xs"
            >
              <Monitor className="h-3 w-3 mr-1" />
              Auto
            </Button>
          </div>
        </div>

        {/* Additional Options */}
        <div className="p-2 border-t">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2 py-1 mb-1">More</div>
          {user?.role === 'admin' && (
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-purple-600 group-hover:text-purple-700" />
                  <div>
                    <span className="font-medium text-sm">Admin Panel</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">System management</p>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5">Admin</Badge>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link href="/pricing" className="cursor-pointer flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <div className="flex items-center gap-3">
                <Crown className="h-4 w-4 text-amber-500 group-hover:text-amber-600" />
                <div>
                  <span className="font-medium text-sm">Upgrade Plan</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Unlock premium features</p>
                </div>
              </div>
              <Zap className="h-4 w-4 text-amber-500" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/help" className="cursor-pointer flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-blue-600" />
                <div>
                  <span className="font-medium text-sm">Help & Support</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Get assistance</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
            </Link>
          </DropdownMenuItem>
        </div>

        {/* Sign Out */}
        <div className="p-2 border-t">
          <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 transition-colors group">
            <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <div>
              <span className="font-medium text-sm">Sign out</span>
              <p className="text-xs text-red-500 dark:text-red-400">End your session</p>
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default React.memo(UserMenu)