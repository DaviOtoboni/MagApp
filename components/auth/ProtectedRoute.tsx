'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Lock } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
  requireEmailConfirmed?: boolean
  showFallback?: boolean
}

export function ProtectedRoute({ 
  children, 
  fallback, 
  redirectTo = '/login',
  requireEmailConfirmed = false,
  showFallback = true
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(pathname)
      router.push(`${redirectTo}?redirectTo=${returnUrl}`)
    }
  }, [user, loading, router, redirectTo, pathname])

  // Show loading state
  if (loading) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // User not authenticated
  if (!user) {
    if (!showFallback) {
      return null
    }

    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle>Acesso restrito</CardTitle>
            <CardDescription>
              Você precisa estar logado para acessar esta página
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`)}
                className="w-full"
              >
                Fazer login
              </Button>
              
              <Button
                onClick={() => router.push('/register')}
                variant="outline"
                className="w-full"
              >
                Criar conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check email confirmation if required
  if (requireEmailConfirmed && !user.email_confirmed_at) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-yellow-600" />
            </div>
            <CardTitle>Email não confirmado</CardTitle>
            <CardDescription>
              Você precisa confirmar seu email para acessar esta página
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              <p>
                Enviamos um email de confirmação para <strong>{user.email}</strong>. 
                Clique no link do email para confirmar sua conta.
              </p>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="w-full"
              >
                Voltar ao dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User is authenticated and meets all requirements
  return <>{children}</>
}

/**
 * Higher-order component version of ProtectedRoute
 */
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

/**
 * Hook to check if current route should be protected
 */
export function useProtectedRoute(options?: {
  redirectTo?: string
  requireEmailConfirmed?: boolean
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isAuthenticated = !!user
  const isEmailConfirmed = user?.email_confirmed_at ? true : false
  const canAccess = isAuthenticated && (!options?.requireEmailConfirmed || isEmailConfirmed)

  const redirectToLogin = () => {
    const returnUrl = encodeURIComponent(pathname)
    router.push(`${options?.redirectTo || '/login'}?redirectTo=${returnUrl}`)
  }

  return {
    user,
    loading,
    isAuthenticated,
    isEmailConfirmed,
    canAccess,
    redirectToLogin
  }
}