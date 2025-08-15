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

export default function NovoMangaPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    titulo: "",
    capa: "",
    capitulosTotal: "",
    capituloAtual: "",
    status: "lendo" as const,
    finalizado: false,
    pretendeContinuar: true,
    notas: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui será implementada a lógica para salvar o mangá
    console.log("Dados do mangá:", formData)
    // Redirecionar para a página de mangás após salvar
    router.push("/mangas")
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
            <Link href="/mangas">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="font-heading font-bold text-3xl text-primary">Adicionar Novo Mangá</h1>
            <p className="text-muted-foreground">Preencha as informações do mangá</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados principais do mangá</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload da Capa */}
              <div className="space-y-2">
                <Label htmlFor="capa">Capa do Mangá</Label>
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
                  placeholder="Ex: One Piece, Naruto, Attack on Titan..."
                  required
                />
              </div>

              {/* Capítulos */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capitulosTotal">Capítulos Totais</Label>
                  <Input
                    id="capitulosTotal"
                    type="number"
                    min="1"
                    value={formData.capitulosTotal}
                    onChange={(e) => setFormData({ ...formData, capitulosTotal: e.target.value })}
                    placeholder="Ex: 1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capituloAtual">Capítulo Atual</Label>
                  <Input
                    id="capituloAtual"
                    type="number"
                    min="0"
                    value={formData.capituloAtual}
                    onChange={(e) => setFormData({ ...formData, capituloAtual: e.target.value })}
                    placeholder="Ex: 850"
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
                <Label htmlFor="status">Status de Leitura</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lendo">Lendo</SelectItem>
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
                    <Label htmlFor="finalizado">Mangá Finalizado</Label>
                    <p className="text-xs text-muted-foreground">O mangá já foi concluído pelo autor?</p>
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
                    <p className="text-xs text-muted-foreground">Você planeja continuar lendo este mangá?</p>
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
                  placeholder="Suas impressões, lembretes ou comentários sobre o mangá..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex space-x-4">
            <Button type="submit" size="lg" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Salvar Mangá
            </Button>
            <Button asChild type="button" variant="outline" size="lg">
              <Link href="/mangas">Cancelar</Link>
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
