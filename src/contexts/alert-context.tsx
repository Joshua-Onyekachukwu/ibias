'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface AlertData {
  id: string
  title: string
  message: string
  status: 'success' | 'warning' | 'error' | 'info'
  position: {
    x: number
    y: number
  }
}

interface AlertContextType {
  activeAlert: AlertData | null
  showAlert: (alert: AlertData) => void
  hideAlert: () => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: ReactNode }) {
  const [activeAlert, setActiveAlert] = useState<AlertData | null>(null)

  const showAlert = useCallback((alert: AlertData) => {
    setActiveAlert(alert)
  }, [])

  const hideAlert = useCallback(() => {
    setActiveAlert(null)
  }, [])

  return (
    <AlertContext.Provider value={{ activeAlert, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}