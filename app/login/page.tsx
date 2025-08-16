'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoginForm } from '@/components/auth/LoginForm'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  
  const redirectTo = searchParams?.get('redirectTo') || '/dashboard'

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-red-500 to-pink-500">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-white bg-opacity-5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-20 bg-white rounded-2xl shadow-2xl mb-6">
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Mag
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Bem-vindo
          </h1>
          <p className="text-white/80 text-lg">
            Entre na sua conta
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <LoginForm 
            onSuccess={handleLoginSuccess}
            redirectTo={redirectTo}
            className="w-full"
          />
          
          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Não tem uma conta?</span>
            </div>
          </div>

          {/* Register Link */}
          <Link 
            href="/register"
            className="w-full flex justify-center py-3 px-4 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-gray-400 hover:text-gray-900 transition-all duration-200 hover:shadow-md"
          >
            Criar conta gratuita
          </Link>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-8 space-y-4">
          <Link 
            href="/auth/forgot-password" 
            className="text-white/80 hover:text-white text-sm underline underline-offset-4 transition-colors"
          >
            Esqueceu sua senha?
          </Link>
          <div>
            <Link 
              href="/" 
              className="text-white/60 hover:text-white/80 text-sm transition-colors"
            >
              ← Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}