"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Plus, Search, Filter, Clock, Trophy, Gamepad2, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Dados de exemplo
const jogosExemplo = []

const statusConfig = {
  jogando: { label: "Jogando", color: "bg-special text-special-foreground", icon: Gamepad2 },
  completo: { label: "Completo", color: "bg-green-500 text-white", icon: Trophy },
  pausado: { label: "Pausado", color: "bg-yellow-500 text-white", icon: Clock },
  dropado: { label: "Dropado", color: "bg-red-500 text-white", icon: X },
}

export default function JogosPage() {
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [busca, setBusca] = useState("")

  const jogosFiltrados = jogosExemplo.filter((jogo) => {
    const matchStatus = filtroStatus === "todos" || jogo.status === filtroStatus
    const matchBusca = jogo.titulo.toLowerCase().includes(busca.toLowerCase())
    return matchStatus && matchBusca
  })

  const estatisticas = {
    total: jogosExemplo.length,
    jogando: jogosExemplo.filter((j) => j.status === "jogando").length,
    completos: jogosExemplo.filter((j) => j.status === "completo").length,
    pausados: jogosExemplo.filter((j) => j.status === "pausado").length,
    dropados: jogosExemplo.filter((j) => j.status === "dropado").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-4xl text-special mb-2">Meus Jogos</h1>
            <p className="text-muted-foreground">Gerencie sua coleção de jogos</p>
          </div>
          <Button asChild size="lg" className="mt-4 md:mt-0 bg-special hover:bg-special/90 text-special-foreground">
            <Link href="/jogos/novo">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Jogo
            </Link>
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-special">{estatisticas.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-special">{estatisticas.jogando}</div>
              <div className="text-sm text-muted-foreground">Jogando</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{estatisticas.completos}</div>
              <div className="text-sm text-muted-foreground">Completos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{estatisticas.pausados}</div>
              <div className="text-sm text-muted-foreground">Pausados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{estatisticas.dropados}</div>
              <div className="text-sm text-muted-foreground">Dropados</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar jogos..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="jogando">Jogando</SelectItem>
              <SelectItem value="completo">Completos</SelectItem>
              <SelectItem value="pausado">Pausados</SelectItem>
              <SelectItem value="dropado">Dropados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid de Jogos */}
        {jogosFiltrados.length === 0 ? (
          <Card className="p-12 text-center">
            <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Nenhum jogo encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {busca || filtroStatus !== "todos"
                ? "Tente ajustar os filtros de busca"
                : "Comece adicionando seu primeiro jogo à coleção"}
            </p>
            <Button asChild className="bg-special hover:bg-special/90 text-special-foreground">
              <Link href="/jogos/novo">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Jogo
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {jogosFiltrados.map((jogo) => {
              const StatusIcon = statusConfig[jogo.status].icon
              const progresso = jogo.horasTotal > 0 ? (jogo.horasJogadas / jogo.horasTotal) * 100 : 0

              return (
                <Card key={jogo.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <div className="aspect-[3/4] overflow-hidden">
                      <Image
                        src={jogo.capa || "/placeholder.svg?height=400&width=300&query=game cover"}
                        alt={jogo.titulo}
                        width={300}
                        height={400}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <Badge className={`absolute top-2 right-2 ${statusConfig[jogo.status].color}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusConfig[jogo.status].label}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-special transition-colors">
                      {jogo.titulo}
                    </h3>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Plataforma:</span>
                        <span className="font-medium">{jogo.plataforma}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Horas jogadas:</span>
                        <span className="font-medium">{jogo.horasJogadas}h</span>
                      </div>

                      {jogo.horasTotal > 0 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Progresso:</span>
                            <span className="font-medium">{Math.round(progresso)}%</span>
                          </div>
                          <Progress value={progresso} className="h-2" />
                        </div>
                      )}

                      {jogo.status === "jogando" && (
                        <div className="flex items-center justify-between">
                          <span>Horas restantes:</span>
                          <span className="font-medium text-special">
                            {jogo.horasTotal > 0 ? `~${jogo.horasTotal - jogo.horasJogadas}h` : "N/A"}
                          </span>
                        </div>
                      )}
                    </div>

                    {jogo.notas && (
                      <p className="text-xs text-muted-foreground mt-3 line-clamp-2 italic">"{jogo.notas}"</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
