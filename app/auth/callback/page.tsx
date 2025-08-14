'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Força renderização apenas no cliente
export const dynamic = 'force-dynamic'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Skip durante SSR/build
    if (typeof window === 'undefined') {
      return
    }

    // Simular processamento e redirecionar
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Processando...</p>
      </div>
    </div>
  )
}