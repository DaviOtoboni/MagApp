'use client'

// Força renderização apenas no cliente
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu dashboard!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-card rounded-lg border">
          <h3 className="font-semibold">Total de Usuários</h3>
          <p className="text-2xl font-bold text-primary">1,234</p>
        </div>
        <div className="p-6 bg-card rounded-lg border">
          <h3 className="font-semibold">Atividade Hoje</h3>
          <p className="text-2xl font-bold text-primary">89</p>
        </div>
        <div className="p-6 bg-card rounded-lg border">
          <h3 className="font-semibold">Crescimento</h3>
          <p className="text-2xl font-bold text-primary">23.5%</p>
        </div>
        <div className="p-6 bg-card rounded-lg border">
          <h3 className="font-semibold">Relatórios</h3>
          <p className="text-2xl font-bold text-primary">45</p>
        </div>
      </div>
    </div>
  )
}