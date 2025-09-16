'use client'

import { usePathname } from 'next/navigation'
import MainNav, { QuickNav } from './main-nav'

export default function ConditionalNav() {
  const pathname = usePathname()
  
  // Hide navigation on dashboard pages
  const isDashboardPage = pathname?.startsWith('/dashboard')
  
  if (isDashboardPage) {
    return null
  }
  
  return (
    <>
      <MainNav />
      <QuickNav />
    </>
  )
}