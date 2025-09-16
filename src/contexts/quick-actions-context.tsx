'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface QuickActionsContextType {
  showReportModal: boolean
  setShowReportModal: (show: boolean) => void
  showExportModal: boolean
  setShowExportModal: (show: boolean) => void
  showScheduleMeetingModal: boolean
  setShowScheduleMeetingModal: (show: boolean) => void
  showUploadDataModal: boolean
  setShowUploadDataModal: (show: boolean) => void
  showMonitorSystemModal: boolean
  setShowMonitorSystemModal: (show: boolean) => void
  showSecurityStatusModal: boolean
  setShowSecurityStatusModal: (show: boolean) => void
  showNetworkStatusModal: boolean
  setShowNetworkStatusModal: (show: boolean) => void
}

const QuickActionsContext = createContext<QuickActionsContextType | undefined>(undefined)

export function QuickActionsProvider({ children }: { children: ReactNode }) {
  const [showReportModal, setShowReportModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showScheduleMeetingModal, setShowScheduleMeetingModal] = useState(false)
  const [showUploadDataModal, setShowUploadDataModal] = useState(false)
  const [showMonitorSystemModal, setShowMonitorSystemModal] = useState(false)
  const [showSecurityStatusModal, setShowSecurityStatusModal] = useState(false)
  const [showNetworkStatusModal, setShowNetworkStatusModal] = useState(false)

  return (
    <QuickActionsContext.Provider
      value={{
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
      }}
    >
      {children}
    </QuickActionsContext.Provider>
  )
}

export function useQuickActions() {
  const context = useContext(QuickActionsContext)
  if (context === undefined) {
    throw new Error('useQuickActions must be used within a QuickActionsProvider')
  }
  return context
}