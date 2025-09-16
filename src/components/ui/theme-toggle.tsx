'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  variant?: 'default' | 'compact' | 'icon-only'
  className?: string
}

export function ThemeToggle({ variant = 'default', className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn('w-9 h-9', className)}
        disabled
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    )
  }

  const toggleTheme = () => {
    // Simple toggle between light and dark
    if (resolvedTheme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  const getThemeIcon = () => {
    return resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
  }

  if (variant === 'icon-only') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className={cn(
          'w-9 h-9 transition-all duration-200 hover:scale-105',
          className
        )}
      >
        {getThemeIcon()}
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  if (variant === 'compact') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className={cn(
          'h-8 px-3 transition-all duration-200 hover:scale-105 flex items-center gap-2',
          className
        )}
      >
        {getThemeIcon()}
        <span className="text-xs">{resolvedTheme === 'dark' ? 'Light' : 'Dark'}</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        'h-9 px-4 transition-all duration-200 hover:scale-105 flex items-center gap-2',
        className
      )}
    >
      {getThemeIcon()}
      <span className="text-sm">{resolvedTheme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}</span>
    </Button>
  )
}

export default ThemeToggle