import { Metadata } from 'next'
import { Suspense } from 'react'
import EnhancedDashboardLayout from '@/components/dashboard/enhanced-dashboard-layout'
import Dashboard from '@/components/dashboard/dashboard'
import { SimpleDashboardSkeleton } from '@/components/dashboard/fast-dashboard-skeleton'

export const metadata: Metadata = {
  title: 'Dashboard | IBIAS',
  description: 'IBIAS Analytics Dashboard - Monitor your business metrics and performance in real-time',
  keywords: ['dashboard', 'analytics', 'business intelligence', 'metrics', 'KPI'],
}

export default function DashboardPage() {
  return (
    <EnhancedDashboardLayout>
      <Suspense fallback={<SimpleDashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </EnhancedDashboardLayout>
  )
}