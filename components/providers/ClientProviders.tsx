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
    <div className="min-h-screen bg-background">
      <main>
        {children}
      </main>
    </div>
  )
}