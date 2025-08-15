'use client'

import { useEffect, useState } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'

interface ClientProvidersProps {
  children: React.ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Renderizar versão simples durante SSR/build
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <main>
          {children}
        </main>
      </div>
    )
  }

  // Renderizar versão completa no cliente
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <main>
            {children}
          </main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}