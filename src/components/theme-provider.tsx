'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes'

interface IBIASThemeProviderProps extends Omit<ThemeProviderProps, 'attribute' | 'defaultTheme'> {
  children: React.ReactNode
  defaultTheme?: 'light' | 'dark' | 'system'
  storageKey?: string
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'light',
  storageKey = 'ibias-theme',
  ...props 
}: IBIASThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem
      disableTransitionOnChange={false}
      storageKey={storageKey}
      themes={['light', 'dark', 'system']}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

export { useTheme } from 'next-themes'