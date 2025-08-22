"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Play, Eye, Pause, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Tipos para animes
type AnimeStatus = "assistindo" | "completo" | "pausado" | "dropado"

interface Anime {
  id: string
  titulo: string
  capa: string
  episodiosTotal: number
  episodioAtual: number
  status: AnimeStatus
  finalizado: boolean
  pretendeContinuar: boolean
}

// Dados de exemplo (será substituído por dados reais depois)
const animesExemplo: Anime[] = []

const statusConfig = {
  assistindo: { label: "Assistindo", color: "bg-accent text-accent-foreground", icon: Eye },
  completo: { label: "Completo", color: "bg-green-500 text-white", icon: Play },
  pausado: { label: "Pausado", color: "bg-yellow-500 text-white", icon: Pause },
  dropado: { label: "Dropado", color: "bg-red-500 text-white", icon: X },
}

export default function AnimesPage() {
  const [animes] = useState<Anime[]>(animesExemplo)
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [busca, setBusca] = useState("")

  const animesFiltrados = animes.filter((anime) => {
    const matchStatus = filtroStatus === "todos" || anime.status === filtroStatus
    const matchBusca = anime.titulo.toLowerCase().includes(busca.toLowerCase())
    return matchStatus && matchBusca
  })

  const contadorStatus = {
    todos: animes.length,
    assistindo: animes.filter((a) => a.status === "assistindo").length,
    completo: animes.filter((a) => a.status === "completo").length,
    pausado: animes.filter((a) => a.status === "pausado").length,
    dropado: animes.filter((a) => a.status === "dropado").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-2 text-accent">Minha Lista de Animes</h1>
            <p className="text-muted-foreground">{animes.length} séries na sua coleção</p>
          </div>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="mt-4 md:mt-0 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Link href="/animes/novo">
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Anime
            </Link>
          </Button>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar animes..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos ({contadorStatus.todos})</SelectItem>
              <SelectItem value="assistindo">Assistindo ({contadorStatus.assistindo})</SelectItem>
              <SelectItem value="completo">Completo ({contadorStatus.completo})</SelectItem>
              <SelectItem value="pausado">Pausado ({contadorStatus.pausado})</SelectItem>
              <SelectItem value="dropado">Dropado ({contadorStatus.dropado})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid de Animes */}
        {animesFiltrados.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Play className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-heading font-semibold text-lg mb-2">
                {busca || filtroStatus !== "todos" ? "Nenhum anime encontrado" : "Sua lista está vazia"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {busca || filtroStatus !== "todos"
                  ? "Tente ajustar os filtros ou busca"
                  : "Comece adicionando seus primeiros animes à coleção"}
              </p>
              {!busca && filtroStatus === "todos" && (
                <Button asChild variant="secondary" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/animes/novo">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeiro Anime
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {animesFiltrados.map((anime) => {
              const StatusIcon = statusConfig[anime.status].icon
              const progresso = Math.round((anime.episodioAtual / anime.episodiosTotal) * 100)

              return (
                <Card key={anime.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <Image
                      src={anime.capa || "/placeholder.svg"}
                      alt={`Capa de ${anime.titulo}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={statusConfig[anime.status].color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[anime.status].label}
                      </Badge>
                    </div>
                    {anime.status === "assistindo" && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <div className="w-full bg-white/20 rounded-full h-2 mb-1">
                          <div
                            className="bg-accent h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progresso}%` }}
                          />
                        </div>
                        <p className="text-white text-xs font-medium">
                          {anime.episodioAtual}/{anime.episodiosTotal} ({progresso}%)
                        </p>
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-semibold line-clamp-2 min-h-[2.5rem]">{anime.titulo}</CardTitle>
                    <CardDescription className="text-xs">
                      {anime.finalizado ? "Finalizado" : "Em exibição"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
