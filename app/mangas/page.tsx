"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, BookOpen, Eye, Pause, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Tipos para mangás
type MangaStatus = "lendo" | "completo" | "pausado" | "dropado"

interface Manga {
  id: string
  titulo: string
  capa: string
  capitulosTotal: number
  capituloAtual: number
  status: MangaStatus
  finalizado: boolean
  pretendeContinuar: boolean
}

// Dados de exemplo (será substituído por dados reais depois)
const mangasExemplo: Manga[] = [
  {
    id: "1",
    titulo: "One Piece",
    capa: "/one-piece-manga-cover.png",
    capitulosTotal: 1100,
    capituloAtual: 850,
    status: "lendo",
    finalizado: false,
    pretendeContinuar: true,
  },
  {
    id: "2",
    titulo: "Attack on Titan",
    capa: "/attack-on-titan-manga-cover.png",
    capitulosTotal: 139,
    capituloAtual: 139,
    status: "completo",
    finalizado: true,
    pretendeContinuar: false,
  },
  {
    id: "3",
    titulo: "Demon Slayer",
    capa: "/demon-slayer-manga-cover.png",
    capitulosTotal: 205,
    capituloAtual: 45,
    status: "pausado",
    finalizado: true,
    pretendeContinuar: true,
  },
]

const statusConfig = {
  lendo: { label: "Lendo", color: "bg-primary text-primary-foreground", icon: Eye },
  completo: { label: "Completo", color: "bg-green-500 text-white", icon: BookOpen },
  pausado: { label: "Pausado", color: "bg-yellow-500 text-white", icon: Pause },
  dropado: { label: "Dropado", color: "bg-red-500 text-white", icon: X },
}

export default function MangasPage() {
  const [mangas] = useState<Manga[]>(mangasExemplo)
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [busca, setBusca] = useState("")

  const mangasFiltrados = mangas.filter((manga) => {
    const matchStatus = filtroStatus === "todos" || manga.status === filtroStatus
    const matchBusca = manga.titulo.toLowerCase().includes(busca.toLowerCase())
    return matchStatus && matchBusca
  })

  const contadorStatus = {
    todos: mangas.length,
    lendo: mangas.filter((m) => m.status === "lendo").length,
    completo: mangas.filter((m) => m.status === "completo").length,
    pausado: mangas.filter((m) => m.status === "pausado").length,
    dropado: mangas.filter((m) => m.status === "dropado").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-2 text-primary">
              Minha Biblioteca de Mangás
            </h1>
            <p className="text-muted-foreground">{mangas.length} títulos na sua coleção</p>
          </div>
          <Button asChild size="lg" className="mt-4 md:mt-0">
            <Link href="/mangas/novo">
              <Plus className="w-5 h-5 mr-2" />
              Adicionar Mangá
            </Link>
          </Button>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar mangás..."
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
              <SelectItem value="lendo">Lendo ({contadorStatus.lendo})</SelectItem>
              <SelectItem value="completo">Completo ({contadorStatus.completo})</SelectItem>
              <SelectItem value="pausado">Pausado ({contadorStatus.pausado})</SelectItem>
              <SelectItem value="dropado">Dropado ({contadorStatus.dropado})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid de Mangás */}
        {mangasFiltrados.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-heading font-semibold text-lg mb-2">
                {busca || filtroStatus !== "todos" ? "Nenhum mangá encontrado" : "Sua biblioteca está vazia"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {busca || filtroStatus !== "todos"
                  ? "Tente ajustar os filtros ou busca"
                  : "Comece adicionando seus primeiros mangás à coleção"}
              </p>
              {!busca && filtroStatus === "todos" && (
                <Button asChild>
                  <Link href="/mangas/novo">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeiro Mangá
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {mangasFiltrados.map((manga) => {
              const StatusIcon = statusConfig[manga.status].icon
              const progresso = Math.round((manga.capituloAtual / manga.capitulosTotal) * 100)

              return (
                <Card key={manga.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <Image
                      src={manga.capa || "/placeholder.svg"}
                      alt={`Capa de ${manga.titulo}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={statusConfig[manga.status].color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[manga.status].label}
                      </Badge>
                    </div>
                    {manga.status === "lendo" && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <div className="w-full bg-white/20 rounded-full h-2 mb-1">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progresso}%` }}
                          />
                        </div>
                        <p className="text-white text-xs font-medium">
                          {manga.capituloAtual}/{manga.capitulosTotal} ({progresso}%)
                        </p>
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-semibold line-clamp-2 min-h-[2.5rem]">{manga.titulo}</CardTitle>
                    <CardDescription className="text-xs">
                      {manga.finalizado ? "Finalizado" : "Em publicação"}
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
