'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

// Força renderização apenas no cliente
export const dynamic = 'force-dynamic'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)

  // Check if we have the required token parameters
  useEffect(() => {
    // Skip validation during SSR/build
    if (typeof window === 'undefined') {
      return
    }

    try {
      const token_hash = searchParams?.get('token_hash')
      const type = searchParams?.get('type')

      // If we have token parameters, it's a valid reset request
      if (token_hash && type === 'recovery') {
        setIsValidToken(true)
      } else if (!loading && !user) {
        // If no token and no user, it's an invalid access
        setIsValidToken(false)
      } else if (!loading && user) {
        // If user is logged in, they can change password
        setIsValidToken(true)
      }
    } catch (error) {
      console.error('Erro ao verificar token:', error)
      setIsValidToken(false)
    }
  }, [searchParams, user, loading])

  // Show loading while checking auth state and token
  if (loading || isValidToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Invalid token or unauthorized access
  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle>Link inválido</CardTitle>
            <CardDescription>
              Este link de redefinição de senha é inválido ou expirou
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground text-center space-y-2">
              <p>Possíveis causas:</p>
              <ul className="list-disc list-inside space-y-1 text-left">
                <li>Link de redefinição expirado (válido por 1 hora)</li>
                <li>Link já foi usado anteriormente</li>
                <li>Link inválido ou corrompido</li>
              </ul>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => router.push('/auth/forgot-password')}
                className="w-full"
              >
                Solicitar novo link
              </Button>
              
              <Button
                onClick={() => router.push('/login')}
                variant="outline"
                className="w-full"
              >
                Voltar ao login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleResetSuccess = () => {
    router.push('/login')
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
            Nova senha
          </h1>
          <p className="text-white/80 text-lg">
            Defina uma nova senha para sua conta
          </p>
        </div>
        
        <ResetPasswordForm 
          onSuccess={handleResetSuccess}
          className="w-full"
        />
        
        {/* Footer Links */}
        <div className="text-center mt-8">
          <button 
            onClick={() => router.push('/login')}
            className="text-white/60 hover:text-white/80 text-sm transition-colors"
          >
            ← Voltar ao login
          </button>
        </div>
      </div>
    </div>
  )
}