"use client"

import { useState, useEffect } from "react"
import { storage, type Jogo } from "@/lib/storage"

export function useJogos() {
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [loading, setLoading] = useState(true)

  const loadJogos = () => {
    const data = storage.getAll<Jogo>("jogos")
    setJogos(data)
    setLoading(false)
  }

  useEffect(() => {
    // Inicializar dados de exemplo na primeira vez
    storage.initializeExampleData()
    loadJogos()
  }, [])

  const addJogo = (jogoData: Omit<Jogo, "id" | "createdAt" | "updatedAt">) => {
    const newJogo = storage.create<Omit<Jogo, "id" | "createdAt" | "updatedAt">>("jogos", jogoData)
    loadJogos()
    return newJogo
  }

  const updateJogo = (id: string, jogoData: Partial<Omit<Jogo, "id" | "createdAt">>) => {
    const updatedJogo = storage.update<Jogo>("jogos", id, jogoData)
    if (updatedJogo) {
      loadJogos()
    }
    return updatedJogo
  }

  const deleteJogo = (id: string) => {
    const success = storage.delete("jogos", id)
    if (success) {
      loadJogos()
    }
    return success
  }

  const getJogoById = (id: string) => {
    return storage.getById<Jogo>("jogos", id)
  }

  const getStats = () => {
    return {
      ...storage.getStats("jogos"),
      jogando: jogos.filter((j) => j.status === "jogando").length,
    }
  }

  return {
    jogos,
    loading,
    addJogo,
    updateJogo,
    deleteJogo,
    getJogoById,
    getStats,
    refresh: loadJogos,
  }
}
