'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, type AuthUser, type Profile, isSupabaseConfigured } from '@/lib/supabase/client'

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
  const mountedRef = useRef(true)
  const sessionCheckedRef = useRef(false)

  // Função para buscar perfil do usuário
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      console.log('📊 [AUTH] Buscando perfil do usuário...')
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.warn('⚠️ [AUTH] Erro ao buscar perfil:', profileError)
        console.log('🔄 [AUTH] Usando dados básicos do auth como fallback')
        return null
      }

      console.log('✅ [AUTH] Perfil encontrado:', { id: profile.id, name: profile.name, nickname: profile.nickname })
      return profile
    } catch (error) {
      console.error('❌ [AUTH] Erro ao buscar perfil:', error)
      return null
    }
  }, [])

  // Função para criar usuário a partir de dados básicos
  const createBasicUser = useCallback((sessionUser: any): AuthUser => {
    return {
      id: sessionUser.id,
      email: sessionUser.email || '',
      name: sessionUser.user_metadata?.name || sessionUser.user_metadata?.full_name,
      nickname: sessionUser.user_metadata?.nickname
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    sessionCheckedRef.current = false

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 [AUTH] Verificando sessão inicial...')
        
        // Check if Supabase is configured
        if (!isSupabaseConfigured) {
          console.warn('⚠️ [AUTH] Supabase não configurado, pulando verificação de auth')
          if (mountedRef.current) setLoading(false)
          return
        }

        console.log('✅ [AUTH] Supabase configurado, buscando sessão...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('❌ [AUTH] Erro ao buscar sessão:', sessionError)
          if (mountedRef.current) setLoading(false)
          return
        }
        
        if (session?.user && mountedRef.current) {
          console.log('👤 [AUTH] Usuário encontrado na sessão:', { id: session.user.id, email: session.user.email })
          
          const profile = await fetchUserProfile(session.user.id)
          if (profile && mountedRef.current) {
            setUser({
              id: profile.id,
              email: profile.email,
              name: profile.name || undefined,
              nickname: profile.nickname || undefined
            })
          } else if (mountedRef.current) {
            setUser(createBasicUser(session.user))
          }
        } else {
          console.log('ℹ️ [AUTH] Nenhuma sessão ativa encontrada')
        }
      } catch (error) {
        console.error('❌ [AUTH] Erro ao obter sessão:', error)
      } finally {
        if (mountedRef.current) {
          setLoading(false)
          sessionCheckedRef.current = true
        }
      }
    }

    getInitialSession()

    // Listen for auth changes
    console.log('👂 [AUTH] Configurando listener de mudanças de auth...')
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mountedRef.current) return
        
        console.log('🔄 [AUTH] Mudança de estado detectada:', event, session ? 'com sessão' : 'sem sessão')
        
        try {
          if (event === 'SIGNED_IN' && session?.user) {
            console.log('✅ [AUTH] Usuário fez login:', { id: session.user.id, email: session.user.email })
            
            const profile = await fetchUserProfile(session.user.id)
            if (profile && mountedRef.current) {
              setUser({
                id: profile.id,
                email: profile.email,
                name: profile.name || undefined,
                nickname: profile.nickname || undefined
              })
            } else if (mountedRef.current) {
              setUser(createBasicUser(session.user))
            }
          } else if (event === 'SIGNED_OUT') {
            console.log('👋 [AUTH] Usuário fez logout')
            if (mountedRef.current) {
              setUser(null)
            }
          }
        } catch (error) {
          console.error('❌ [AUTH] Erro na mudança de estado:', error)
        }
      }
    )

    return () => {
      console.log('🧹 [AUTH] Limpando listener de auth...')
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [fetchUserProfile, createBasicUser])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 [LOGIN] Iniciando processo de login...')
      console.log('📧 [LOGIN] Email:', email)
      console.log('🔑 [LOGIN] Senha:', password ? '***' : 'não fornecida')
      
      console.log('📡 [LOGIN] Fazendo requisição para Supabase Auth...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('❌ [LOGIN] Erro retornado pelo Supabase:', error)
        console.error('❌ [LOGIN] Código do erro:', error.status)
        console.error('❌ [LOGIN] Mensagem do erro:', error.message)
        return false
      }

      if (data.user) {
        console.log('✅ [LOGIN] Login bem-sucedido!')
        console.log('👤 [LOGIN] Dados do usuário:', {
          id: data.user.id,
          email: data.user.email,
          metadata: data.user.user_metadata
        })
        console.log('🔑 [LOGIN] Sessão criada:', !!data.session)
        return true
      } else {
        console.warn('⚠️ [LOGIN] Login retornou sem usuário')
        return false
      }
    } catch (error) {
      console.error('❌ [LOGIN] Exceção durante login:', error)
      return false
    }
  }, [])

  const register = useCallback(async (name: string, nickname: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log('📝 [REGISTER] Iniciando processo de registro...')
      console.log('👤 [REGISTER] Nome:', name)
      console.log('🏷️ [REGISTER] Nickname:', nickname)
      console.log('📧 [REGISTER] Email:', email)
      console.log('🔑 [REGISTER] Senha:', password ? '***' : 'não fornecida')
      
      // Register user with Supabase Auth
      console.log('📡 [REGISTER] Fazendo requisição para Supabase Auth...')
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
        console.error('❌ [REGISTER] Erro retornado pelo Supabase:', error)
        console.error('❌ [REGISTER] Código do erro:', error.status)
        console.error('❌ [REGISTER] Mensagem do erro:', error.message)
        
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

      if (data.user) {
        console.log('✅ [REGISTER] Registro bem-sucedido!')
        console.log('👤 [REGISTER] Dados do usuário:', {
          id: data.user.id,
          email: data.user.email,
          metadata: data.user.user_metadata
        })
        console.log('📧 [REGISTER] Confirmação necessária:', data.user.email_confirmed_at ? 'não' : 'sim')
      }

      // If user was created successfully, the trigger will handle profile creation
      return !!data.user
    } catch (error) {
      console.error('❌ [REGISTER] Exceção durante registro:', error)
      
      // Re-throw the error so the component can handle it
      if (error instanceof Error) {
        throw error
      }
      
      throw new Error('Erro ao criar conta. Tente novamente.')
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      console.log('👋 [LOGOUT] Iniciando logout...')
      await supabase.auth.signOut()
      console.log('✅ [LOGOUT] Logout bem-sucedido')
      if (mountedRef.current) {
        setUser(null)
      }
    } catch (error) {
      console.error('❌ [LOGOUT] Erro durante logout:', error)
    }
  }, [])

  return { user, loading, login, logout, register }
}