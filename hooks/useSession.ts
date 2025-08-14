'use client'

import { useAuth } from './useAuth'
import type { AuthSession } from '@/types/auth'

/**
 * Hook to access session data
 */
export function useSession(): {
  session: AuthSession | null
  isLoading: boolean
  isValid: boolean
  expiresAt: Date | null
  refreshToken: string | null
} {
  const { session, loading } = useAuth()
  
  const expiresAt = session?.expires_at ? new Date(session.expires_at * 1000) : null
  const isValid = session ? (expiresAt ? expiresAt > new Date() : true) : false
  
  return {
    session,
    isLoading: loading,
    isValid,
    expiresAt,
    refreshToken: session?.refresh_token || null
  }
}

/**
 * Hook to check if session is expiring soon (within 5 minutes)
 */
export function useSessionExpiry(): {
  isExpiringSoon: boolean
  minutesUntilExpiry: number | null
  shouldRefresh: boolean
} {
  const { session } = useSession()
  
  if (!session?.expires_at) {
    return {
      isExpiringSoon: false,
      minutesUntilExpiry: null,
      shouldRefresh: false
    }
  }
  
  const expiresAt = new Date(session.expires_at * 1000)
  const now = new Date()
  const minutesUntilExpiry = Math.floor((expiresAt.getTime() - now.getTime()) / (1000 * 60))
  
  const isExpiringSoon = minutesUntilExpiry <= 5 && minutesUntilExpiry > 0
  const shouldRefresh = minutesUntilExpiry <= 10 && minutesUntilExpiry > 0
  
  return {
    isExpiringSoon,
    minutesUntilExpiry,
    shouldRefresh
  }
}