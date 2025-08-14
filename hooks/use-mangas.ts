"use client"

import { useState, useEffect } from "react"
import { storage, type Manga } from "@/lib/storage"

export function useMangas() {
  const [mangas, setMangas] = useState<Manga[]>([])
  const [loading, setLoading] = useState(true)

  const loadMangas = () => {
    const data = storage.getAll<Manga>("mangas")
    setMangas(data)
    setLoading(false)
  }

  useEffect(() => {
    // Inicializar dados de exemplo na primeira vez
    storage.initializeExampleData()
    loadMangas()
  }, [])

  const addManga = (mangaData: Omit<Manga, "id" | "createdAt" | "updatedAt">) => {
    const newManga = storage.create<Omit<Manga, "id" | "createdAt" | "updatedAt">>("mangas", mangaData)
    loadMangas()
    return newManga
  }

  const updateManga = (id: string, mangaData: Partial<Omit<Manga, "id" | "createdAt">>) => {
    const updatedManga = storage.update<Manga>("mangas", id, mangaData)
    if (updatedManga) {
      loadMangas()
    }
    return updatedManga
  }

  const deleteManga = (id: string) => {
    const success = storage.delete("mangas", id)
    if (success) {
      loadMangas()
    }
    return success
  }

  const getMangaById = (id: string) => {
    return storage.getById<Manga>("mangas", id)
  }

  const getStats = () => {
    return {
      ...storage.getStats("mangas"),
      lendo: mangas.filter((m) => m.status === "lendo").length,
    }
  }

  return {
    mangas,
    loading,
    addManga,
    updateManga,
    deleteManga,
    getMangaById,
    getStats,
    refresh: loadMangas,
  }
}
