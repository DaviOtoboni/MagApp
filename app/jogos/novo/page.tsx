"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload, Save } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function NovoJogoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    titulo: "",
    capa: "",
    horasTotal: "",
    horasJogadas: "",
    plataforma: "",
    status: "jogando" as const,
    finalizado: false,
    pretendeContinuar: true,
    notas: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui será implementada a lógica para salvar o jogo
    console.log("Dados do jogo:", formData)
    // Redirecionar para a página de jogos após salvar
    router.push("/jogos")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Aqui seria implementada a lógica de upload da imagem
      const imageUrl = URL.createObjectURL(file)
      setFormData({ ...formData, capa: imageUrl })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button asChild variant="ghost" size="sm" className="mr-4">
            <Link href="/jogos">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="font-heading font-bold text-3xl text-special">Adicionar Novo Jogo</h1>
            <p className="text-muted-foreground">Preencha as informações do jogo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados principais do jogo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload da Capa */}
              <div className="space-y-2">
                <Label htmlFor="capa">Capa do Jogo</Label>
                <div className="flex items-start space-x-4">
                  <div className="w-32 h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center bg-muted/10 overflow-hidden">
                    {formData.capa ? (
                      <Image
                        src={formData.capa || "/placeholder.svg"}
                        alt="Preview da capa"
                        width={128}
                        height={192}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Clique para adicionar capa</p>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Input id="capa" type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
                    <p className="text-xs text-muted-foreground">
                      Formatos aceitos: JPG, PNG, WebP. Tamanho recomendado: 200x300px
                    </p>
                  </div>
                </div>
              </div>

              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ex: The Legend of Zelda, Persona 5, Elden Ring..."
                  required
                />
              </div>

              {/* Plataforma */}
              <div className="space-y-2">
                <Label htmlFor="plataforma">Plataforma</Label>
                <Input
                  id="plataforma"
                  value={formData.plataforma}
                  onChange={(e) => setFormData({ ...formData, plataforma: e.target.value })}
                  placeholder="Ex: PlayStation 5, Nintendo Switch, PC, Xbox Series X..."
                />
              </div>

              {/* Horas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="horasTotal">Horas Totais (Estimativa)</Label>
                  <Input
                    id="horasTotal"
                    type="number"
                    min="1"
                    value={formData.horasTotal}
                    onChange={(e) => setFormData({ ...formData, horasTotal: e.target.value })}
                    placeholder="Ex: 100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horasJogadas">Horas Jogadas</Label>
                  <Input
                    id="horasJogadas"
                    type="number"
                    min="0"
                    value={formData.horasJogadas}
                    onChange={(e) => setFormData({ ...formData, horasJogadas: e.target.value })}
                    placeholder="Ex: 45"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status e Preferências</CardTitle>
              <CardDescription>Configure o status atual e suas intenções</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status do Jogo</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jogando">Jogando</SelectItem>
                    <SelectItem value="completo">Completo</SelectItem>
                    <SelectItem value="pausado">Pausado</SelectItem>
                    <SelectItem value="dropado">Dropado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Switches */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="finalizado">Jogo Finalizado</Label>
                    <p className="text-xs text-muted-foreground">O jogo já foi lançado completamente?</p>
                  </div>
                  <Switch
                    id="finalizado"
                    checked={formData.finalizado}
                    onCheckedChange={(checked) => setFormData({ ...formData, finalizado: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pretendeContinuar">Pretende Continuar</Label>
                    <p className="text-xs text-muted-foreground">Você planeja continuar jogando este jogo?</p>
                  </div>
                  <Switch
                    id="pretendeContinuar"
                    checked={formData.pretendeContinuar}
                    onCheckedChange={(checked) => setFormData({ ...formData, pretendeContinuar: checked })}
                  />
                </div>
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <Label htmlFor="notas">Notas Pessoais (Opcional)</Label>
                <Textarea
                  id="notas"
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  placeholder="Suas impressões, dicas, lembretes ou comentários sobre o jogo..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex space-x-4">
            <Button type="submit" size="lg" className="flex-1 bg-special hover:bg-special/90 text-special-foreground">
              <Save className="w-4 h-4 mr-2" />
              Salvar Jogo
            </Button>
            <Button asChild type="button" variant="outline" size="lg">
              <Link href="/jogos">Cancelar</Link>
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
