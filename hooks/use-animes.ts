"use client"

import { useState, useEffect } from "react"
import { storage, type Anime } from "@/lib/storage"

export function useAnimes() {
  const [animes, setAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)

  const loadAnimes = () => {
    const data = storage.getAll<Anime>("animes")
    setAnimes(data)
    setLoading(false)
  }

  useEffect(() => {
    // Inicializar dados de exemplo na primeira vez
    storage.initializeExampleData()
    loadAnimes()
  }, [])

  const addAnime = (animeData: Omit<Anime, "id" | "createdAt" | "updatedAt">) => {
    const newAnime = storage.create<Omit<Anime, "id" | "createdAt" | "updatedAt">>("animes", animeData)
    loadAnimes()
    return newAnime
  }

  const updateAnime = (id: string, animeData: Partial<Omit<Anime, "id" | "createdAt">>) => {
    const updatedAnime = storage.update<Anime>("animes", id, animeData)
    if (updatedAnime) {
      loadAnimes()
    }
    return updatedAnime
  }

  const deleteAnime = (id: string) => {
    const success = storage.delete("animes", id)
    if (success) {
      loadAnimes()
    }
    return success
  }

  const getAnimeById = (id: string) => {
    return storage.getById<Anime>("animes", id)
  }

  const getStats = () => {
    return {
      ...storage.getStats("animes"),
      assistindo: animes.filter((a) => a.status === "assistindo").length,
    }
  }

  return {
    animes,
    loading,
    addAnime,
    updateAnime,
    deleteAnime,
    getAnimeById,
    getStats,
    refresh: loadAnimes,
  }
}
