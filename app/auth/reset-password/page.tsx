'use client'

import { useRouter } from 'next/navigation'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { ThemeToggle } from '@/components/ui/theme-toggle'

// Força renderização apenas no cliente
export const dynamic = 'force-dynamic'

export default function ResetPasswordPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // Redirecionamento será feito pelo próprio componente
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header com toggle de tema */}
      <header className="container mx-auto px-4 py-4 flex justify-end">
        <ThemeToggle />
      </header>

      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              MagApp
            </h1>
            <p className="mt-2 text-muted-foreground">
              Redefinir sua senha
            </p>
          </div>
          
          <ResetPasswordForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  )
}