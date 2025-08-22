'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/login',
  fallback = null 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [redirecting, setRedirecting] = useState(false)

  useEffect(() => {
    // Timeout de segurança para evitar travamento
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ [PROTECTED_ROUTE] Timeout de segurança ativado')
        setRedirecting(true)
        router.replace(redirectTo)
      }
    }, 10000) // 10 segundos

    // Só redireciona quando o loading terminar e não houver usuário
    if (!loading && !user && !redirecting) {
      console.log('🔄 [PROTECTED_ROUTE] Redirecionando para login...')
      setRedirecting(true)
      router.replace(redirectTo)
    }

    return () => clearTimeout(timeoutId)
  }, [user, loading, router, redirectTo, redirecting])

  // Evita renderização desnecessária durante redirecionamento
  if (redirecting) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecionando...</p>
        </div>
      </div>
    )
  }

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Não renderiza se não houver usuário (será redirecionado)
  if (!user) {
    return null
  }

  // Renderiza o conteúdo protegido
  return <>{children}</>
}
