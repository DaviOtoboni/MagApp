'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/auth/LoginForm'
import { ThemeToggle } from '@/components/ui/theme-toggle'

// Força renderização apenas no cliente
export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLoginSuccess = () => {
    router.push('/dashboard')
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header com toggle de tema */}
      <header className="container mx-auto px-4 py-4 flex justify-end">
        <ThemeToggle />
      </header>

      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              MagApp
            </h1>
            <p className="mt-2 text-muted-foreground">
              Faça login em sua conta
            </p>
          </div>
          
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </div>
    </div>
  )
}