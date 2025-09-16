'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'


export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 10
    setIsScrolled(prev => prev !== scrolled ? scrolled : prev)
  }, [])

  useEffect(() => {
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', throttledScroll, { passive: true })
    
    // Prefetch auth routes for faster navigation
    const prefetchTimer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const link1 = document.createElement('link')
        link1.rel = 'prefetch'
        link1.href = '/auth?mode=signin'
        document.head.appendChild(link1)
        
        const link2 = document.createElement('link')
        link2.rel = 'prefetch'
        link2.href = '/auth?mode=signup'
        document.head.appendChild(link2)
      }
    }, 1000)
    
    return () => {
      window.removeEventListener('scroll', throttledScroll)
      clearTimeout(prefetchTimer)
    }
  }, [handleScroll])

  const navigation = useMemo(() => [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Pricing', href: '#pricing' },
  ], [])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  const headerClasses = useMemo(() => {
    return `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg' 
        : 'bg-background/90 backdrop-blur-sm'
    }`
  }, [isScrolled])

  return (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">IB</span>
              </div>
              <span className="text-2xl font-bold text-foreground">IBIAS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth?mode=signin"
              className="text-foreground hover:text-muted-foreground transition-all duration-200 font-medium px-6 py-2.5 border-2 border-border rounded-lg hover:border-muted-foreground hover:bg-accent backdrop-blur-sm"
            >
              Sign In
            </Link>
            <Link
              href="/auth?mode=signup"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-primary/50 hover:border-primary/70 hover:scale-105"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-background/95 backdrop-blur-md border-t border-border shadow-lg"
        >
          <div className="px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium py-2"
                onClick={closeMobileMenu}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-3">
              <Link
                href="/auth?mode=signin"
                className="block text-foreground hover:text-muted-foreground transition-all duration-200 font-medium py-2.5 border-2 border-border rounded-lg px-4 hover:border-muted-foreground hover:bg-accent text-center"
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>
              <Link
                href="/auth?mode=signup"
                className="block bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-center shadow-lg border-2 border-primary/50 hover:border-primary/70"
                onClick={closeMobileMenu}
              >
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}