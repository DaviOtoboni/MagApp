'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { useAuth } from '@/hooks/useAuth'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard')
    }
  }, [user, loading, router])

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            MagApp
          </h1>
          <p className="mt-2 text-muted-foreground">
            Recuperação de senha
          </p>
        </div>
        
        <ForgotPasswordForm className="w-full" />
      </div>
    </div>
  )
}