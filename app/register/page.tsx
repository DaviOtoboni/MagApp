'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle } from 'lucide-react'

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              MagApp
            </h1>
          </div>
          
          <Card className="w-full">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Conta criada com sucesso!
              </CardTitle>
              <CardDescription>
                Enviamos um email de confirmação para você
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="text-center space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Mail className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-blue-800">
                    Verifique sua caixa de entrada e clique no link de confirmação 
                    para ativar sua conta.
                  </p>
                </div>
                
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Não recebeu o email?</p>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    <li>Verifique sua pasta de spam</li>
                    <li>Aguarde alguns minutos</li>
                    <li>Verifique se o email está correto</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={() => setShowConfirmation(false)}
                  variant="outline"
                  className="w-full"
                >
                  Voltar ao cadastro
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
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            MagApp
          </h1>
          <p className="mt-2 text-muted-foreground">
            Crie sua conta gratuita
          </p>
        </div>
        
        <RegisterForm 
          onSuccess={handleRegistrationSuccess}
          className="w-full"
        />
      </div>
    </div>
  )
}