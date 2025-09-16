'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { 
  BarChart3, 
  Menu
} from 'lucide-react'
import Link from 'next/link'
import { NavigationItem } from './NavigationItem'

// Navigation data
const navigation = [
  {
    name: 'Home',
    href: '/',
    icon: require('lucide-react').Home,
    description: 'Return to main page',
    color: 'text-blue-600'
  },
  {
    name: 'Pricing',
    href: '/pricing',
    icon: require('lucide-react').CreditCard,
    description: 'View pricing plans',
    color: 'text-emerald-600'
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: require('lucide-react').User,
    description: 'Manage your profile',
    color: 'text-purple-600'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: require('lucide-react').Settings,
    description: 'Account settings',
    color: 'text-green-600'
  }
]

const bottomNavigation = [
  {
    name: 'Help',
    href: '/help',
    icon: require('lucide-react').HelpCircle,
    description: 'Get help and support',
    color: 'text-pink-600'
  },
  {
    name: 'Admin',
    href: '/admin',
    icon: require('lucide-react').Shield,
    description: 'Admin panel',
    color: 'text-blue-600'
  }
]

export function MobileNavigation() {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden hover:bg-blue-50 transition-colors duration-200">
          <Menu className="h-6 w-6 text-slate-600" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-white/95 backdrop-blur-sm">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-200/60">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">IBIAS</span>
                <span className="text-xs text-slate-500 font-medium">Analytics Platform</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6 space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-4">Main Menu</div>
            {navigation.map((item) => (
              <NavigationItem
                key={item.name}
                item={item}
                isActive={pathname === item.href}
                isMobile
              />
            ))}
          </div>

          {/* Bottom Navigation */}
          <div className="px-4 py-6 border-t border-slate-200/60 space-y-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-4">Settings</div>
            {bottomNavigation.map((item) => (
              <NavigationItem
                key={item.name}
                item={item}
                isActive={pathname === item.href}
                isMobile
              />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default React.memo(MobileNavigation)