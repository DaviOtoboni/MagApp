"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Play, Gamepad2, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useMangas } from "@/hooks/use-mangas"
import { useAnimes } from "@/hooks/use-animes"
import { useJogos } from "@/hooks/use-jogos"

export default function Dashboard() {
  const { getStats: getMangaStats } = useMangas()
  const { getStats: getAnimeStats } = useAnimes()
  const { getStats: getJogoStats } = useJogos()

  const mangaStats = getMangaStats()
  const animeStats = getAnimeStats()
  const jogoStats = getJogoStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Bem-vindo à sua Coleção Otaku
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Organize e acompanhe seus mangás, animes e jogos favoritos em um só lugar
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mangás</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mangaStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {mangaStats.lendo} lendo • {mangaStats.completos} completos
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Animes</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{animeStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {animeStats.assistindo} assistindo • {animeStats.completos} completos
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-special">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jogos</CardTitle>
              <Gamepad2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jogoStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {jogoStats.jogando} jogando • {jogoStats.completos} completos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Mangás</CardTitle>
                  <CardDescription>Gerencie sua biblioteca de mangás</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button asChild size="sm" className="flex-1">
                  <Link href="/mangas">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Ver Coleção
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/mangas/novo">
                    <Plus className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <Play className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Animes</CardTitle>
                  <CardDescription>Acompanhe suas séries favoritas</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button asChild size="sm" variant="secondary" className="flex-1">
                  <Link href="/animes">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Ver Coleção
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/animes/novo">
                    <Plus className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-special/10 rounded-lg group-hover:bg-special/20 transition-colors">
                  <Gamepad2 className="h-6 w-6 text-special" />
                </div>
                <div>
                  <CardTitle className="text-lg">Jogos</CardTitle>
                  <CardDescription>Controle seu progresso nos games</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="flex-1 bg-special/10 hover:bg-special/20 text-special border-special/20"
                >
                  <Link href="/jogos">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Ver Coleção
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/jogos/novo">
                    <Plus className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Atividade Recente</CardTitle>
            <CardDescription>Suas últimas adições e atualizações aparecerão aqui</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma atividade ainda</p>
              <p className="text-sm">Comece adicionando alguns títulos à sua coleção!</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
