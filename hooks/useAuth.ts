'use client'

import { useState, useEffect } from 'react'
import { supabase, type AuthUser, type Profile } from '@/lib/supabase/client'

interface AuthState {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, nickname: string, email: string, password: string) => Promise<boolean>
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Get user profile from database
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              name: profile.name || undefined,
              nickname: profile.nickname || undefined
            })
          }
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Get user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              name: profile.name || undefined,
              nickname: profile.nickname || undefined
            })
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Login error:', error.message)
        return false
      }

      return !!data.user
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const register = async (name: string, nickname: string, email: string, password: string): Promise<boolean> => {
    try {
      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            nickname,
            full_name: name
          }
        }
      })

      if (error) {
        console.error('Registration error:', error.message)
        
        // Handle specific error messages
        if (error.message.includes('User already registered')) {
          throw new Error('Este email já está cadastrado')
        }
        if (error.message.includes('already been taken')) {
          throw new Error('Este nickname já está em uso')
        }
        if (error.message.includes('Password')) {
          throw new Error('Senha deve ter pelo menos 6 caracteres')
        }
        if (error.message.includes('Invalid email')) {
          throw new Error('Email inválido')
        }
        
        throw new Error('Erro ao criar conta: ' + error.message)
      }

      // If user was created successfully, the trigger will handle profile creation
      return !!data.user
    } catch (error) {
      console.error('Registration failed:', error)
      
      // Re-throw the error so the component can handle it
      if (error instanceof Error) {
        throw error
      }
      
      throw new Error('Erro ao criar conta. Tente novamente.')
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return { user, loading, login, logout, register }
}