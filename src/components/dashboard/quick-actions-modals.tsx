'use client'

import React from 'react'
import { useQuickActions } from '@/contexts/quick-actions-context'
import { GenerateReportModal } from './generate-report-modal'
import { ExportDataModal } from './export-data-modal'
import { ScheduleMeetingModal } from './schedule-meeting-modal'
import { UploadDataModal } from './upload-data-modal'
import { MonitorSystemModal } from './monitor-system-modal'
import { SecurityStatusModal } from './security-status-modal'
import { NetworkStatusModal } from './network-status-modal'

export function QuickActionsModals() {
  const {
    showReportModal,
    setShowReportModal,
    showExportModal,
    setShowExportModal,
    showScheduleMeetingModal,
    setShowScheduleMeetingModal,
    showUploadDataModal,
    setShowUploadDataModal,
    showMonitorSystemModal,
    setShowMonitorSystemModal,
    showSecurityStatusModal,
    setShowSecurityStatusModal,
    showNetworkStatusModal,
    setShowNetworkStatusModal,
  } = useQuickActions()

  return (
    <>
      <GenerateReportModal 
        isOpen={showReportModal} 
        onClose={() => setShowReportModal(false)} 
      />
      <ExportDataModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />
      <ScheduleMeetingModal 
        isOpen={showScheduleMeetingModal} 
        onClose={() => setShowScheduleMeetingModal(false)} 
      />
      <UploadDataModal 
        isOpen={showUploadDataModal} 
        onClose={() => setShowUploadDataModal(false)} 
      />
      <MonitorSystemModal 
        isOpen={showMonitorSystemModal} 
        onClose={() => setShowMonitorSystemModal(false)} 
      />
      <SecurityStatusModal 
        isOpen={showSecurityStatusModal} 
        onClose={() => setShowSecurityStatusModal(false)} 
      />
      <NetworkStatusModal 
        isOpen={showNetworkStatusModal} 
        onClose={() => setShowNetworkStatusModal(false)} 
      />
    </>
  )
}