'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('Auth loading timeout, redirecting to login')
        router.replace('/login')
      }
    }, 5000) // 5 second timeout

    if (!loading) {
      clearTimeout(timeout)
      if (user) {
        router.replace('/dashboard')
      } else {
        router.replace('/login')
      }
    }

    return () => clearTimeout(timeout)
  }, [user, loading, router])

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
        <p className="text-white/60 text-sm">Carregando...</p>
      </div>
    </div>
  )
}