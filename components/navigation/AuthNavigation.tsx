'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { UserAvatar } from '@/components/profile/UserAvatar'
import { useAuth } from '@/hooks/useAuth'
import { useUserDisplay } from '@/hooks/useUser'
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  ChevronDown,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

interface AuthNavigationProps {
  className?: string
}

export function AuthNavigation({ className }: AuthNavigationProps) {
  const { user, signOut, loading } = useAuth()
  const { displayName, email } = useUserDisplay()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setIsSigningOut(true)
    
    try {
      await signOut()
      toast.success('Logout realizado com sucesso!')
      router.push('/')
    } catch (error) {
      toast.error('Erro ao fazer logout')
      console.error('Sign out error:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className={className}>
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  // Show login/register buttons for unauthenticated users
  if (!user) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button variant="ghost" asChild>
          <Link href="/login">Entrar</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Cadastrar</Link>
        </Button>
      </div>
    )
  }

  // Show user menu for authenticated users
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2 px-2">
            <UserAvatar size="sm" />
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium">{displayName}</span>
              <span className="text-xs text-muted-foreground">{email}</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">{email}</p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/security" className="flex items-center">
              <Shield className="mr-2 h-4 w-4" />
              Segurança
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="text-red-600 focus:text-red-600"
          >
            {isSigningOut ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}