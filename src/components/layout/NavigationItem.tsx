'use client'

import React, { useMemo } from 'react'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { Crown } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface NavigationItemProps {
  item: {
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    description: string
    color?: string
    requiresFeature?: string
  }
  isActive: boolean
  isMobile?: boolean
}

export const NavigationItem = React.memo(({ item, isActive, isMobile = false }: NavigationItemProps) => {
  const { hasFeature } = useSubscription()
  
  const hasAccess = !item.requiresFeature || hasFeature(item.requiresFeature)
  const Icon = item.icon

  const content = useMemo(() => (
    <div className={cn(
      'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out',
      isActive
        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]'
        : hasAccess
        ? 'text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:text-blue-700 hover:shadow-md hover:transform hover:scale-[1.01]'
        : 'text-slate-400 cursor-not-allowed',
      isMobile && 'w-full'
    )}>
      <Icon className={cn(
        'h-5 w-5 transition-colors duration-200',
        isActive ? 'text-white' : hasAccess ? item.color || 'text-slate-600' : 'text-slate-400'
      )} />
      <span className="flex-1 font-medium">{item.name}</span>
      {!hasAccess && (
        <Crown className="h-4 w-4 text-amber-500 animate-pulse" />
      )}
      {isActive && (
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      )}
    </div>
  ), [item, isActive, hasAccess, isMobile])

  if (!hasAccess) {
    return (
      <div className="relative group">
        {content}
        <div className="absolute left-0 top-full mt-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 whitespace-nowrap shadow-xl">
          <div className="absolute -top-1 left-4 w-2 h-2 bg-slate-900 rotate-45"></div>
          Upgrade to access this feature
        </div>
      </div>
    )
  }

  return (
    <Link href={item.href} className="block">
      {content}
    </Link>
  )
})

NavigationItem.displayName = 'NavigationItem'

export default NavigationItem