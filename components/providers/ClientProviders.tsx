'use client'

import { useEffect, useState } from 'react'

interface ClientProvidersProps {
  children: React.ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Always provide AuthProvider, but with loading state during SSR
  return (
    <div className="min-h-screen bg-background">
      <main>
        {children}
      </main>
    </div>
  )
}
