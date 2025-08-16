'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

// Força renderização apenas no cliente
export const dynamic = 'force-dynamic'

type CallbackState = 'loading' | 'success' | 'error'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, setState] = useState<CallbackState>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Skip durante SSR/build
      if (typeof window === 'undefined') {
        return
      }

      try {
        const token_hash = searchParams?.get('token_hash')
        const type = searchParams?.get('type')
        const next = searchParams?.get('next') || '/dashboard'

        if (!token_hash || !type) {
          throw new Error('Token ou tipo de confirmação inválido')
        }

        // Verify the token hash
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any
        })

        if (error) {
          throw error
        }

        if (data.user) {
          setState('success')
          
          if (type === 'signup') {
            toast.success('Email confirmado com sucesso! Bem-vindo ao MagApp!')
          } else if (type === 'recovery') {
            toast.success('Email verificado! Você pode redefinir sua senha.')
            router.push('/auth/reset-password')
            return
          }

          // Redirect after a short delay
          setTimeout(() => {
            router.push(next)
          }, 2000)
        } else {
          throw new Error('Falha na verificação do usuário')
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setState('error')
        
        const errorMessage = err instanceof Error ? err.message : 'Erro na confirmação'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    }

    handleAuthCallback()
  }, [searchParams, router])

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <CardTitle>Confirmando email...</CardTitle>
            <CardDescription>
              Aguarde enquanto verificamos sua confirmação
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (state === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>Email confirmado!</CardTitle>
            <CardDescription>
              Sua conta foi ativada com sucesso. Redirecionando...
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center">
            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              Ir para o dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle>Erro na confirmação</CardTitle>
          <CardDescription>
            {error || 'Não foi possível confirmar seu email'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground text-center space-y-2">
            <p>Possíveis causas:</p>
            <ul className="list-disc list-inside space-y-1 text-left">
              <li>Link de confirmação expirado</li>
              <li>Link já foi usado anteriormente</li>
              <li>Link inválido ou corrompido</li>
            </ul>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => router.push('/register')}
              variant="outline"
              className="w-full"
            >
              Tentar novamente
            </Button>
            
            <Button
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Ir para login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}