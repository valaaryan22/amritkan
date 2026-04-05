'use client'

import { Header } from './Header'
import { Navigation } from './Navigation'
import { SkipToContent } from '@/components/ui/SkipToContent'
import { cn } from '@/lib/utils'

interface MainLayoutProps {
  children: React.ReactNode
  className?: string
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SkipToContent />
      
      {/* Header */}
      <Header />

      <div className="flex">
        {/* Sidebar Navigation - Desktop */}
        <Navigation />

        {/* Main Content */}
        <main
          id="main-content"
          className={cn(
            'flex-1',
            // Add padding for mobile bottom nav
            'pb-20 md:pb-0',
            // Add padding for desktop sidebar
            'md:ml-0',
            // Responsive width constraints
            'w-full',
            className
          )}
        >
          <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 md:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
