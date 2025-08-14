'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { ShowWhenAuthenticated } from '@/components/auth/ConditionalRender'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUserDisplay } from '@/hooks/useUser'
import { BarChart3, Users, Activity, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <DashboardHeader />
        <DashboardStats />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <DashboardContent />
          </div>
          <div className="space-y-6">
            <ProfileCard showEditButton={false} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

function DashboardHeader() {
  const { displayName } = useUserDisplay()

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold tracking-tight">
        <ShowWhenAuthenticated
          loadingFallback={<div className="h-9 w-64 bg-muted animate-pulse rounded" />}
        >
          Bem-vindo, {displayName}!
        </ShowWhenAuthenticated>
      </h1>
      <p className="text-muted-foreground">
        Aqui está um resumo da sua atividade hoje.
      </p>
    </div>
  )
}

function DashboardStats() {
  const stats = [
    {
      title: 'Total de Usuários',
      value: '1,234',
      change: '+12%',
      icon: Users,
      trend: 'up'
    },
    {
      title: 'Atividade Hoje',
      value: '89',
      change: '+5%',
      icon: Activity,
      trend: 'up'
    },
    {
      title: 'Crescimento',
      value: '23.5%',
      change: '+2.1%',
      icon: TrendingUp,
      trend: 'up'
    },
    {
      title: 'Relatórios',
      value: '45',
      change: '-3%',
      icon: BarChart3,
      trend: 'down'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${
              stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change} em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function DashboardContent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>
            Suas ações mais recentes na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'Login realizado', time: '2 minutos atrás' },
              { action: 'Perfil atualizado', time: '1 hora atrás' },
              { action: 'Senha alterada', time: '2 dias atrás' },
              { action: 'Conta criada', time: '1 semana atrás' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="text-sm">{activity.action}</span>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as funcionalidades mais usadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Gerenciar Usuários
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              Ver Relatórios
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Activity className="h-6 w-6 mb-2" />
              Monitorar Sistema
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              Análises
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}