'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  Menu,
  X,
  Home,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Zap,
  Shield,
  Bell,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { usePerformanceMonitor } from '@/components/dashboard/performance-optimizer'
import { cn } from '@/lib/utils'

interface NavItem {
  name: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
  external?: boolean
}

const navigation: NavItem[] = [
  { name: 'Features', href: '/#features' },
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'Testimonials', href: '/#testimonials' },
  { name: 'Pricing', href: '/#pricing' },
]

const authenticatedNavigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Analytics', href: '/dashboard/analytics' },
  { name: 'Integrations', href: '/dashboard/integrations' },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

interface MainNavProps {
  className?: string
  variant?: 'default' | 'dashboard'
}

export default function MainNav({ className, variant = 'default' }: MainNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, userProfile, signOut, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { fastNavigate } = usePerformanceMonitor()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      // Handle anchor links
      const element = document.querySelector(href.substring(1))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      } else {
        fastNavigate(href)
      }
    } else {
      fastNavigate(href)
    }
    setIsOpen(false)
  }

  const isDashboard = variant === 'dashboard' || pathname?.startsWith('/dashboard')

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || isDashboard
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
          : 'bg-transparent',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">IB</span>
            </motion.div>
            <span className={cn(
              'text-2xl font-bold transition-colors',
              isScrolled || isDashboard ? 'text-gray-900' : 'text-white'
            )}>
              IBIAS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {(user ? authenticatedNavigation : navigation).map((item) => {
              const isActive = pathname === item.href || 
                (item.href === '/dashboard' && pathname?.startsWith('/dashboard'))
              
              return (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  whileHover={{ y: -2 }}
                  className={cn(
                    'relative flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-blue-600'
                      : isScrolled || isDashboard
                      ? 'text-gray-700 hover:text-blue-600'
                      : 'text-white/90 hover:text-white'
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-50 rounded-md -z-10"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'relative',
                    isScrolled || isDashboard
                      ? 'text-gray-700 hover:text-blue-600'
                      : 'text-white/90 hover:text-white'
                  )}
                >
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                    3
                  </Badge>
                </Button>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-blue-500/20 transition-all duration-200"
                    >
                      <Avatar className="h-10 w-10 border-2 border-white/20">
                        <AvatarImage src="" alt={user.full_name || user.email} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold text-sm">
                          {(user.full_name || user.email)
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 mb-2">
                      <Avatar className="h-12 w-12 border-2 border-white/50">
                        <AvatarImage src="" alt={user.full_name || user.email} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white font-semibold">
                          {(user.full_name || user.email)
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                        <div className="flex items-center mt-1">
                          <div className="h-2 w-2 bg-green-500 rounded-full mr-1" />
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem onClick={() => fastNavigate('/dashboard')} className="rounded-md p-3 cursor-pointer">
                      <BarChart3 className="mr-3 h-4 w-4 text-blue-600" />
                      <div className="flex-1">
                        <span className="font-medium">Dashboard</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">View analytics & insights</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => fastNavigate('/settings')} className="rounded-md p-3 cursor-pointer">
                      <Settings className="mr-3 h-4 w-4 text-gray-600" />
                      <div className="flex-1">
                        <span className="font-medium">Settings</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Manage preferences</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => fastNavigate('/profile')} className="rounded-md p-3 cursor-pointer">
                      <User className="mr-3 h-4 w-4 text-purple-600" />
                      <div className="flex-1">
                        <span className="font-medium">Profile</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Edit personal info</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem onClick={handleSignOut} className="rounded-md p-3 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50">
                      <LogOut className="mr-3 h-4 w-4" />
                      <div className="flex-1">
                        <span className="font-medium">Sign out</span>
                        <p className="text-xs text-red-500 dark:text-red-400">End your session</p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => fastNavigate('/auth?mode=signin')}
                  className={cn(
                    'font-medium border-2 px-4 py-2 rounded-lg transition-all duration-200',
                    isScrolled || isDashboard
                      ? 'text-gray-900 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      : 'text-white border-white hover:border-gray-200 hover:bg-white/10'
                  )}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => fastNavigate('/auth?mode=signup')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg border-2 border-blue-400/50 hover:border-blue-300/70"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                isScrolled || isDashboard
                  ? 'text-gray-700'
                  : 'text-white'
              )}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="px-4 py-6 space-y-4">
              {(user ? authenticatedNavigation : navigation).map((item) => {
                const isActive = pathname === item.href ||
                  (item.href === '/dashboard' && pathname?.startsWith('/dashboard'))
                
                return (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'flex items-center space-x-3 w-full px-3 py-2 rounded-md text-left font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </motion.button>
                )
              })}
              
              <div className="border-t border-gray-200 pt-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user.full_name || user.email} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                          {(user.full_name || user.email)
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2)
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {user.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        fastNavigate('/dashboard')
                        setIsOpen(false)
                      }}
                      className="w-full justify-start"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        fastNavigate('/dashboard/settings')
                        setIsOpen(false)
                      }}
                      className="w-full justify-start"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        fastNavigate('/auth?mode=signin')
                        setIsOpen(false)
                      }}
                      className="w-full text-gray-900 hover:text-gray-700 transition-all duration-200 font-medium py-2.5 border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 text-center"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        fastNavigate('/auth?mode=signup')
                        setIsOpen(false)
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-center shadow-lg border-2 border-blue-400/50 hover:border-blue-300/70"
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// Quick access component for dashboard navigation
export function QuickNav() {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const { fastNavigate } = usePerformanceMonitor()

  if (!user || !pathname?.startsWith('/dashboard')) return null

  const quickActions = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Reports', href: '/dashboard/reports', icon: Search },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:block"
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-2">
        {quickActions.map((action) => {
          const isActive = pathname === action.href
          return (
            <motion.button
              key={action.name}
              onClick={() => fastNavigate(action.href)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                'w-10 h-10 rounded-md flex items-center justify-center mb-2 last:mb-0 transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
              title={action.name}
            >
              <action.icon className="h-5 w-5" />
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}