'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoginForm } from '@/components/auth/LoginForm'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render form if user is authenticated (will redirect)
  if (user) {
    return null
  }

  const handleLoginSuccess = () => {
    router.push(redirectTo)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            MagApp
          </h1>
          <p className="mt-2 text-muted-foreground">
            Bem-vindo de volta
          </p>
        </div>
        
        <LoginForm 
          onSuccess={handleLoginSuccess}
          redirectTo={redirectTo}
          className="w-full"
        />
      </div>
    </div>
  )
}