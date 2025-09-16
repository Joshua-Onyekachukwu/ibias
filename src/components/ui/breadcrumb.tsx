'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center space-x-1 text-sm', className)} aria-label="Breadcrumb">
      <div className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
        <Home className="h-4 w-4 mr-2" />
        <Link href="/dashboard" className="font-medium text-gray-900 dark:text-gray-100">
          IBIAS
        </Link>
      </div>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="text-gray-400 dark:text-gray-500">/</span>
          {item.href && !item.current ? (
            <Link 
              href={item.href}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className={cn(
                'font-medium',
                item.current 
                  ? 'text-gray-900 dark:text-gray-100' 
                  : 'text-gray-500 dark:text-gray-400'
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// Breadcrumb separator component
export function BreadcrumbSeparator({ className }: { className?: string }) {
  return (
    <ChevronRight className={cn('h-4 w-4 text-gray-400 dark:text-gray-500', className)} />
  )
}

// Breadcrumb item component
export function BreadcrumbItem({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <span className={cn('text-gray-500 dark:text-gray-400', className)}>
      {children}
    </span>
  )
}

// Breadcrumb link component
export function BreadcrumbLink({ 
  href, 
  children, 
  className 
}: { 
  href: string
  children: React.ReactNode
  className?: string 
}) {
  return (
    <Link 
      href={href}
      className={cn(
        'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors',
        className
      )}
    >
      {children}
    </Link>
  )
}

// Current page component
export function BreadcrumbPage({ 
  children, 
  className 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <span 
      className={cn('font-medium text-gray-900 dark:text-gray-100', className)}
      aria-current="page"
    >
      {children}
    </span>
  )
}