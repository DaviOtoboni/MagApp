'use client'

import { MainNavigation } from '@/components/navigation/MainNavigation'
import { cn } from '@/lib/utils'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn(
      'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      className
    )}>
      <div className="container mx-auto px-4 h-16">
        <MainNavigation className="h-full" />
      </div>
    </header>
  )
}