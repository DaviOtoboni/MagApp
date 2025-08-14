'use client'

// Força renderização apenas no cliente
export const dynamic = 'force-dynamic'

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais.
          </p>
        </div>

        <div className="p-6 bg-card rounded-lg border">
          <h3 className="font-semibold mb-4">Informações do Usuário</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Nome</label>
              <p className="text-sm mt-1">Usuário Exemplo</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-sm mt-1">usuario@exemplo.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}