"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BookOpen, Play, Gamepad2, Home } from "lucide-react"

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/mangas",
    label: "Mangás",
    icon: BookOpen,
  },
  {
    href: "/animes",
    label: "Animes",
    icon: Play,
  },
  {
    href: "/jogos",
    label: "Jogos",
    icon: Gamepad2,
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">MC</span>
            </div>
            <h1 className="font-heading font-bold text-xl">Minha Coleção</h1>
          </div>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Button
                  key={item.href}
                  asChild
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn("flex items-center space-x-2", isActive && "bg-primary text-primary-foreground")}
                >
                  <Link href={item.href}>
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
