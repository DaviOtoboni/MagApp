'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface ConditionalRenderProps {
  children: ReactNode
  fallback?: ReactNode
  requireAuth?: boolean
  requireGuest?: boolean
}

export function ConditionalRender({ 
  children, 
  fallback = null, 
  requireAuth = false, 
  requireGuest = false 
}: ConditionalRenderProps) {
  const { user, loading } = useAuth()

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return fallback
  }

  // Se requer autenticação e usuário não está logado
  if (requireAuth && !user) {
    return fallback
  }

  // Se requer que seja guest e usuário está logado
  if (requireGuest && user) {
    return fallback
  }

  // Renderiza o conteúdo se todas as condições forem atendidas
  return <>{children}</>
}