'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AuthNavigation } from './AuthNavigation'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface NavigationItem {
  href: string
  label: string
  requiresAuth?: boolean
}

const navigationItems: NavigationItem[] = [
  { href: '/', label: 'Início' },
  { href: '/dashboard', label: 'Dashboard', requiresAuth: true },
  { href: '/profile', label: 'Perfil', requiresAuth: true },
]

interface MainNavigationProps {
  className?: string
}

export function MainNavigation({ className }: MainNavigationProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  // Filter navigation items based on auth state
  const visibleItems = navigationItems.filter(item => {
    if (item.requiresAuth && !user) return false
    return true
  })

  return (
    <nav className={cn('flex items-center justify-between', className)}>
      {/* Logo */}
      <div className="flex items-center space-x-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <span className="font-bold text-xl">MagApp</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {visibleItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? 'default' : 'ghost'}
              size="sm"
              asChild
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Auth Navigation */}
      <AuthNavigation />
    </nav>
  )
}