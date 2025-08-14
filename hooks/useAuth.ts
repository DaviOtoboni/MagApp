'use client'

import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'
import type { AuthContextType } from '@/types/auth'

/**
 * Hook to access authentication context
 * Provides access to user state, authentication methods, and loading states
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { user } = useAuth()
  return !!user
}

/**
 * Hook to check if authentication is loading
 */
export function useAuthLoading(): boolean {
  const { loading } = useAuth()
  return loading
}