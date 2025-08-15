'use client'

import Link from 'next/link'

// Força renderização apenas no cliente
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 space-y-16">
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Bem-vindo ao{' '}
            <span className="text-primary">MagApp</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sua aplicação completa com autenticação segura e interface moderna.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/register"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Começar Agora
          </Link>
          <Link 
            href="/login"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Fazer Login
          </Link>
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">
            Por que escolher o MagApp?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Desenvolvido com as melhores práticas e tecnologias modernas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-card rounded-lg border">
            <h3 className="font-semibold mb-2">Segurança Avançada</h3>
            <p className="text-muted-foreground text-sm">
              Autenticação robusta com Supabase, incluindo confirmação por email e reset de senha.
            </p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg border">
            <h3 className="font-semibold mb-2">Performance Otimizada</h3>
            <p className="text-muted-foreground text-sm">
              Construído com Next.js 15 e React 19 para máxima velocidade e eficiência.
            </p>
          </div>
          <div className="text-center p-6 bg-card rounded-lg border">
            <h3 className="font-semibold mb-2">Experiência do Usuário</h3>
            <p className="text-muted-foreground text-sm">
              Interface moderna e intuitiva com feedback em tempo real e estados de loading.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}