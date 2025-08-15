'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShowWhenAuthenticated, ShowWhenUnauthenticated } from '@/components/auth/ConditionalRender'
import { useUserDisplay } from '@/hooks/useUser'
import { Shield, Zap, Users, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 space-y-16">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </div>
  )
}

function HeroSection() {
  const { displayName } = useUserDisplay()

  return (
    <section className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Bem-vindo ao{' '}
          <span className="text-primary">MagApp</span>
        </h1>
        
        <ShowWhenAuthenticated>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Olá, {displayName}! Que bom ter você de volta.
          </p>
        </ShowWhenAuthenticated>
        
        <ShowWhenUnauthenticated>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sua aplicação completa com autenticação segura e interface moderna.
          </p>
        </ShowWhenUnauthenticated>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <ShowWhenAuthenticated>
          <Button size="lg" asChild>
            <Link href="/dashboard">
              Ir para Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/profile">Ver Perfil</Link>
          </Button>
        </ShowWhenAuthenticated>

        <ShowWhenUnauthenticated>
          <Button size="lg" asChild>
            <Link href="/register">
              Começar Agora
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Fazer Login</Link>
          </Button>
        </ShowWhenUnauthenticated>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Segurança Avançada',
      description: 'Autenticação robusta com Supabase, incluindo confirmação por email e reset de senha.'
    },
    {
      icon: Zap,
      title: 'Performance Otimizada',
      description: 'Construído com Next.js 15 e React 19 para máxima velocidade e eficiência.'
    },
    {
      icon: Users,
      title: 'Experiência do Usuário',
      description: 'Interface moderna e intuitiva com feedback em tempo real e estados de loading.'
    }
  ]

  return (
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
        {features.map((feature, index) => (
          <Card key={index} className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <ShowWhenUnauthenticated>
      <section className="text-center space-y-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">
              Pronto para começar?
            </CardTitle>
            <CardDescription>
              Crie sua conta gratuita e explore todas as funcionalidades.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/register">Criar Conta Gratuita</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Sem compromisso. Cancele quando quiser.
            </p>
          </CardContent>
        </Card>
      </section>
    </ShowWhenUnauthenticated>
  )
}