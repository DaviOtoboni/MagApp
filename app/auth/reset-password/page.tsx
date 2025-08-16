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
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            MagApp
          </h1>
          <p className="mt-2 text-muted-foreground">
            Redefinir sua senha
          </p>
        </div>
        
        <ResetPasswordForm 
          onSuccess={handleResetSuccess}
          className="w-full"
        />
      </div>
    </div>
  )
}