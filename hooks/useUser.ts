'use client'

import { useAuth } from './useAuth'
import type { AuthUser } from '@/types/auth'
import type { Profile } from '@/types/database'

/**
 * Hook to access current user data
 */
export function useUser(): {
  user: AuthUser | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
} {
  const { user, profile, loading } = useAuth()
  
  return {
    user,
    profile,
    isLoading: loading,
    isAuthenticated: !!user
  }
}

/**
 * Hook to get user profile data
 */
export function useProfile(): {
  profile: Profile | null
  isLoading: boolean
  hasProfile: boolean
} {
  const { profile, loading } = useAuth()
  
  return {
    profile,
    isLoading: loading,
    hasProfile: !!profile
  }
}

/**
 * Hook to get user display information
 */
export function useUserDisplay(): {
  displayName: string
  email: string
  avatarUrl: string | null
  initials: string
  isLoading: boolean
} {
  const { user, profile, loading } = useAuth()
  
  const displayName = profile?.name || user?.email?.split('@')[0] || 'Usuário'
  const email = user?.email || ''
  const avatarUrl = profile?.avatar_url || null
  
  // Generate initials from display name
  const initials = displayName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  return {
    displayName,
    email,
    avatarUrl,
    initials,
    isLoading: loading
  }
}