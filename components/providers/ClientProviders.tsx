'use client'

import { useEffect, useState } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { Header } from '@/components/layout/Header'

interface ClientProvidersProps {
  children: React.ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <main>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}
