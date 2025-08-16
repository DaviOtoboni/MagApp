'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Play, Gamepad2, User, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Bem-vindo, {user.nickname || user.name}!
            </h1>
            <p className="text-muted-foreground">
              Gerencie sua coleção de mangás, animes e jogos
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              {user.email}
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/mangas">
              <CardHeader className="text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>Mangás</CardTitle>
                <CardDescription>
                  Gerencie sua biblioteca de mangás
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Ver Coleção
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/animes">
              <CardHeader className="text-center">
                <Play className="w-12 h-12 mx-auto mb-4 text-accent" />
                <CardTitle>Animes</CardTitle>
                <CardDescription>
                  Acompanhe seus animes favoritos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  Ver Lista
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/jogos">
              <CardHeader className="text-center">
                <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-special" />
                <CardTitle>Jogos</CardTitle>
                <CardDescription>
                  Organize sua coleção de jogos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-special hover:bg-special/90 text-special-foreground">
                  Ver Jogos
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Suas últimas atividades na plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <BookOpen className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">Bem-vindo ao MagApp!</p>
                  <p className="text-sm text-muted-foreground">
                    Comece adicionando seus primeiros itens às suas coleções
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}