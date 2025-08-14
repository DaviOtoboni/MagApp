'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signOut as authSignOut, 
  resetPassword as authResetPassword,
  updatePassword as authUpdatePassword,
  updateProfile as authUpdateProfile,
  getCurrentSession,
  refreshSession
} from '@/lib/auth/auth-utils'
import type { AuthContextType, AuthUser, AuthSession, AuthError, SignInData, SignUpData, ProfileUpdateData } from '@/types/auth'
import type { Profile } from '@/types/database'
import type { User, Session } from '@supabase/supabase-js'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user profile from database
  const loadUserProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error loading user profile:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error loading user profile:', error)
      return null
    }
  }, [])

  // Update user state with profile data
  const updateUserState = useCallback(async (authUser: User | null, authSession: Session | null) => {
    if (authUser && authSession) {
      const userProfile = await loadUserProfile(authUser.id)
      
      const enhancedUser: AuthUser = {
        ...authUser,
        profile: userProfile || undefined
      }

      const enhancedSession: AuthSession = {
        ...authSession,
        user: enhancedUser
      }

      setUser(enhancedUser)
      setProfile(userProfile)
      setSession(enhancedSession)
    } else {
      setUser(null)
      setProfile(null)
      setSession(null)
    }
  }, [loadUserProfile])

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        const { session: currentSession } = await getCurrentSession()
        
        if (mounted) {
          await updateUserState(currentSession?.user || null, currentSession)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('Auth state changed:', event, session?.user?.email)

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await updateUserState(session?.user || null, session)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          setSession(null)
        }

        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [updateUserState])

  // Sign in function
  const signIn = useCallback(async (email: string, password: string): Promise<void> => {
    setLoading(true)
    
    try {
      const { user: authUser, error } = await signInWithEmail({ email, password })
      
      if (error) {
        throw new Error(error.message)
      }

      // User state will be updated by the auth state change listener
    } catch (error) {
      setLoading(false)
      throw error
    }
  }, [])

  // Sign up function
  const signUp = useCallback(async (email: string, password: string, name?: string): Promise<void> => {
    setLoading(true)
    
    try {
      const { user: authUser, error } = await signUpWithEmail({ email, password, name })
      
      if (error) {
        throw new Error(error.message)
      }

      // User state will be updated by the auth state change listener
    } catch (error) {
      setLoading(false)
      throw error
    }
  }, [])

  // Sign out function
  const signOut = useCallback(async (): Promise<void> => {
    setLoading(true)
    
    try {
      const { error } = await authSignOut()
      
      if (error) {
        throw new Error(error.message)
      }

      // User state will be updated by the auth state change listener
    } catch (error) {
      setLoading(false)
      throw error
    }
  }, [])

  // Reset password function
  const resetPassword = useCallback(async (email: string): Promise<void> => {
    const { error } = await authResetPassword(email)
    
    if (error) {
      throw new Error(error.message)
    }
  }, [])

  // Update password function
  const updatePassword = useCallback(async (password: string): Promise<void> => {
    const { error } = await authUpdatePassword(password)
    
    if (error) {
      throw new Error(error.message)
    }
  }, [])

  // Update profile function
  const updateProfile = useCallback(async (data: Partial<Profile>): Promise<void> => {
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    try {
      // Update auth metadata
      if (data.name || data.avatar_url) {
        const { error: authError } = await authUpdateProfile({
          name: data.name || undefined,
          avatar_url: data.avatar_url || undefined
        })

        if (authError) {
          throw new Error(authError.message)
        }
      }

      // Update profile in database
      const { error: dbError } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (dbError) {
        throw new Error('Erro ao atualizar perfil no banco de dados')
      }

      // Reload user profile
      const updatedProfile = await loadUserProfile(user.id)
      if (updatedProfile) {
        setProfile(updatedProfile)
        setUser(prev => prev ? { ...prev, profile: updatedProfile } : null)
      }
    } catch (error) {
      throw error
    }
  }, [user, loadUserProfile])

  // Refresh session function
  const refreshSessionFn = useCallback(async (): Promise<void> => {
    const { session: newSession, error } = await refreshSession()
    
    if (error) {
      throw new Error(error.message)
    }

    if (newSession) {
      await updateUserState(newSession.user, newSession)
    }
  }, [updateUserState])

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshSession: refreshSessionFn
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}