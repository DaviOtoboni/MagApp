'use client'

// Força renderização apenas no cliente
export const dynamic = 'force-dynamic'

export default function ResetPasswordPage() {
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
        
        <div className="p-6 bg-card rounded-lg border">
          <p className="text-center text-muted-foreground">
            Página de redefinição em desenvolvimento...
          </p>
        </div>
      </div>
    </div>
  )
}