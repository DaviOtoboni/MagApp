'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard')
    }
  }, [user, loading, router])

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    )
  }

  // Don't render form if user is authenticated (will redirect)
  if (user) {
    return null
  }

  const handleRegistrationSuccess = () => {
    setShowConfirmation(true)
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-white bg-opacity-5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        </div>
        
        <div className="relative w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Conta criada!
            </h1>
            <p className="text-gray-600 mb-8">
              Bem-vindo ao MagApp! Sua conta foi criada com sucesso.
            </p>

            <div className="space-y-4">
              <Button
                onClick={() => router.push('/login')}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                Fazer Login
              </Button>
              
              <Button
                onClick={() => setShowConfirmation(false)}
                variant="outline"
                className="w-full py-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:text-purple-600 transition-all duration-200"
              >
                Voltar ao cadastro
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-white bg-opacity-5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-2xl mb-6">
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Junte-se ao MagApp
          </h1>
          <p className="text-white/80 text-lg">
            Crie sua conta gratuita
          </p>
        </div>

        {/* Register Form Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <RegisterForm 
            onSuccess={handleRegistrationSuccess}
            className="w-full"
          />
          
          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Já tem uma conta?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link 
            href="/login"
            className="w-full flex justify-center py-3 px-4 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-purple-300 hover:text-purple-600 transition-all duration-200 hover:shadow-md"
          >
            Fazer login
          </Link>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-8">
          <Link 
            href="/" 
            className="text-white/60 hover:text-white/80 text-sm transition-colors"
          >
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}