import { DashboardDataProvider } from '@/contexts/dashboard-data-context'
import { DashboardProvider } from '@/contexts/DashboardContext'
import { QuickActionsProvider } from '@/contexts/quick-actions-context'
import { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <DashboardProvider>
      <DashboardDataProvider>
        <QuickActionsProvider>
          {children}
        </QuickActionsProvider>
      </DashboardDataProvider>
    </DashboardProvider>
  )
}