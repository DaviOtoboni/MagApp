// Sistema de armazenamento local para mangás, animes e jogos

export interface BaseItem {
  id: string
  titulo: string
  capa: string
  status: "lendo" | "assistindo" | "jogando" | "completo" | "pausado" | "dropado"
  finalizado: boolean
  pretendeContinuar: boolean
  notas: string
  createdAt: string
  updatedAt: string
}

export interface Manga extends BaseItem {
  status: "lendo" | "completo" | "pausado" | "dropado"
  capitulosTotal: number
  capituloAtual: number
}

export interface Anime extends BaseItem {
  status: "assistindo" | "completo" | "pausado" | "dropado"
  episodiosTotal: number
  episodioAtual: number
}

export interface Jogo extends BaseItem {
  status: "jogando" | "completo" | "pausado" | "dropado"
  horasTotal: number
  horasJogadas: number
  plataforma: string
}

type StorageKey = "mangas" | "animes" | "jogos"

class LocalStorage {
  private getItems<T>(key: StorageKey): T[] {
    if (typeof window === "undefined") return []

    try {
      const items = localStorage.getItem(key)
      return items ? JSON.parse(items) : []
    } catch (error) {
      console.error(`Erro ao carregar ${key}:`, error)
      return []
    }
  }

  private setItems<T>(key: StorageKey, items: T[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(key, JSON.stringify(items))
    } catch (error) {
      console.error(`Erro ao salvar ${key}:`, error)
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Métodos genéricos CRUD
  getAll<T>(key: StorageKey): T[] {
    return this.getItems<T>(key)
  }

  getById<T extends BaseItem>(key: StorageKey, id: string): T | null {
    const items = this.getItems<T>(key)
    return items.find((item) => item.id === id) || null
  }

  create<T extends Omit<BaseItem, "id" | "createdAt" | "updatedAt">>(key: StorageKey, data: T): BaseItem & T {
    const items = this.getItems<BaseItem & T>(key)
    const now = new Date().toISOString()

    const newItem: BaseItem & T = {
      ...data,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    } as BaseItem & T

    items.push(newItem)
    this.setItems(key, items)

    return newItem
  }

  update<T extends BaseItem>(key: StorageKey, id: string, data: Partial<Omit<T, "id" | "createdAt">>): T | null {
    const items = this.getItems<T>(key)
    const index = items.findIndex((item) => item.id === id)

    if (index === -1) return null

    const updatedItem: T = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    items[index] = updatedItem
    this.setItems(key, items)

    return updatedItem
  }

  delete(key: StorageKey, id: string): boolean {
    const items = this.getItems<BaseItem>(key)
    const filteredItems = items.filter((item) => item.id !== id)

    if (filteredItems.length === items.length) return false

    this.setItems(key, filteredItems)
    return true
  }

  // Métodos específicos para estatísticas
  getStats(key: StorageKey) {
    const items = this.getItems<BaseItem>(key)

    return {
      total: items.length,
      completos: items.filter((item) => item.status === "completo").length,
      pausados: items.filter((item) => item.status === "pausado").length,
      dropados: items.filter((item) => item.status === "dropado").length,
      ativos: items.filter(
        (item) => item.status === "lendo" || item.status === "assistindo" || item.status === "jogando",
      ).length,
    }
  }

  // Método para inicializar dados de exemplo (apenas na primeira vez)
  initializeExampleData() {
    if (typeof window === "undefined") return

    // Verificar se já existem dados
    const hasMangas = this.getItems("mangas").length > 0
    const hasAnimes = this.getItems("animes").length > 0
    const hasJogos = this.getItems("jogos").length > 0

    if (hasMangas && hasAnimes && hasJogos) return

    // Dados de exemplo para mangás
    if (!hasMangas) {
      const mangasExemplo: Omit<Manga, "id" | "createdAt" | "updatedAt">[] = [
        {
          titulo: "One Piece",
          capa: "/one-piece-manga-cover.png",
          capitulosTotal: 1100,
          capituloAtual: 850,
          status: "lendo",
          finalizado: false,
          pretendeContinuar: true,
          notas: "Saga incrível! Esperando ansiosamente pelos próximos capítulos.",
        },
        {
          titulo: "Attack on Titan",
          capa: "/attack-on-titan-manga-cover.png",
          capitulosTotal: 139,
          capituloAtual: 139,
          status: "completo",
          finalizado: true,
          pretendeContinuar: false,
          notas: "Final épico! Uma das melhores histórias que já li.",
        },
        {
          titulo: "Demon Slayer",
          capa: "/demon-slayer-manga-cover.png",
          capitulosTotal: 205,
          capituloAtual: 100,
          status: "pausado",
          finalizado: true,
          pretendeContinuar: true,
          notas: "Pausei para assistir o anime primeiro.",
        },
      ]

      mangasExemplo.forEach((manga) => this.create("mangas", manga))
    }

    // Dados de exemplo para animes
    if (!hasAnimes) {
      const animesExemplo: Omit<Anime, "id" | "createdAt" | "updatedAt">[] = [
        {
          titulo: "Attack on Titan",
          capa: "/attack-on-titan-anime-cover.png",
          episodiosTotal: 75,
          episodioAtual: 75,
          status: "completo",
          finalizado: true,
          pretendeContinuar: false,
          notas: "Adaptação perfeita do mangá. Animação espetacular!",
        },
        {
          titulo: "Demon Slayer",
          capa: "/demon-slayer-manga-cover.png",
          episodiosTotal: 44,
          episodioAtual: 30,
          status: "assistindo",
          finalizado: false,
          pretendeContinuar: true,
          notas: "Animação da Ufotable é de outro nível!",
        },
      ]

      animesExemplo.forEach((anime) => this.create("animes", anime))
    }

    // Dados de exemplo para jogos
    if (!hasJogos) {
      const jogosExemplo: Omit<Jogo, "id" | "createdAt" | "updatedAt">[] = [
        {
          titulo: "The Legend of Zelda: Breath of the Wild",
          capa: "/zelda-botw-cover.png",
          horasJogadas: 120,
          horasTotal: 150,
          status: "jogando",
          finalizado: true,
          pretendeContinuar: true,
          plataforma: "Nintendo Switch",
          notas: "Jogo incrível com mundo aberto fantástico!",
        },
        {
          titulo: "Persona 5 Royal",
          capa: "/persona5-royal-cover.png",
          horasJogadas: 80,
          horasTotal: 100,
          status: "completo",
          finalizado: true,
          pretendeContinuar: false,
          plataforma: "PlayStation 5",
          notas: "História envolvente e personagens marcantes.",
        },
        {
          titulo: "Elden Ring",
          capa: "/elden-ring-cover.png",
          horasJogadas: 45,
          horasTotal: 80,
          status: "pausado",
          finalizado: true,
          pretendeContinuar: true,
          plataforma: "PC",
          notas: "Muito difícil, mas vale a pena.",
        },
      ]

      jogosExemplo.forEach((jogo) => this.create("jogos", jogo))
    }
  }
}

export const storage = new LocalStorage()
