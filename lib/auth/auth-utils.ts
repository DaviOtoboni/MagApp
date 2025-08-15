import { supabase } from '@/lib/supabase/client'
import type { AuthError, AuthErrorType, SignUpData, SignInData, ProfileUpdateData } from '@/types/auth'
import type { User } from '@supabase/supabase-js'

/**
 * Authentication utility functions for Supabase
 */

/**
 * Sign in with email and password
 */
export async function signInWithEmail(data: SignInData): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      return {
        user: null,
        error: mapSupabaseError(error)
      }
    }

    return {
      user: authData.user,
      error: null
    }
  } catch (error) {
    return {
      user: null,
      error: {
        type: 'network_error' as AuthErrorType,
        message: 'Erro de conexão. Tente novamente.',
        details: error
      }
    }
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(data: SignUpData): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    console.log('Attempting to sign up with:', { email: data.email, hasPassword: !!data.password })
    
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name || '',
        }
      }
    })

    console.log('Supabase signUp response:', { authData, error })

    if (error) {
      return {
        user: null,
        error: mapSupabaseError(error)
      }
    }

    return {
      user: authData.user,
      error: null
    }
  } catch (error) {
    console.error('SignUp catch error:', error)
    return {
      user: null,
      error: {
        type: 'network_error' as AuthErrorType,
        message: 'Erro de conexão. Tente novamente.',
        details: error
      }
    }
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        error: mapSupabaseError(error)
      }
    }

    return { error: null }
  } catch (error) {
    return {
      error: {
        type: 'network_error' as AuthErrorType,
        message: 'Erro ao fazer logout. Tente novamente.',
        details: error
      }
    }
  }
}

/**
 * Reset password for email
 */
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      return {
        error: mapSupabaseError(error)
      }
    }

    return { error: null }
  } catch (error) {
    return {
      error: {
        type: 'password_reset_failed' as AuthErrorType,
        message: 'Erro ao enviar email de reset. Tente novamente.',
        details: error
      }
    }
  }
}

/**
 * Update user password
 */
export async function updatePassword(password: string): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      return {
        error: mapSupabaseError(error)
      }
    }

    return { error: null }
  } catch (error) {
    return {
      error: {
        type: 'profile_update_failed' as AuthErrorType,
        message: 'Erro ao atualizar senha. Tente novamente.',
        details: error
      }
    }
  }
}

/**
 * Update user profile
 */
export async function updateProfile(data: ProfileUpdateData): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      data: data
    })

    if (error) {
      return {
        error: mapSupabaseError(error)
      }
    }

    return { error: null }
  } catch (error) {
    return {
      error: {
        type: 'profile_update_failed' as AuthErrorType,
        message: 'Erro ao atualizar perfil. Tente novamente.',
        details: error
      }
    }
  }
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      return {
        session: null,
        error: mapSupabaseError(error)
      }
    }

    return {
      session,
      error: null
    }
  } catch (error) {
    return {
      session: null,
      error: {
        type: 'session_expired' as AuthErrorType,
        message: 'Erro ao verificar sessão.',
        details: error
      }
    }
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      return {
        user: null,
        error: mapSupabaseError(error)
      }
    }

    return {
      user,
      error: null
    }
  } catch (error) {
    return {
      user: null,
      error: {
        type: 'session_expired' as AuthErrorType,
        message: 'Erro ao verificar usuário.',
        details: error
      }
    }
  }
}

/**
 * Refresh current session
 */
export async function refreshSession() {
  try {
    const { data, error } = await supabase.auth.refreshSession()
    
    if (error) {
      return {
        session: null,
        error: mapSupabaseError(error)
      }
    }

    return {
      session: data.session,
      error: null
    }
  } catch (error) {
    return {
      session: null,
      error: {
        type: 'session_expired' as AuthErrorType,
        message: 'Erro ao renovar sessão.',
        details: error
      }
    }
  }
}

/**
 * Map Supabase errors to our AuthError type
 */
function mapSupabaseError(error: any): AuthError {
  const message = error.message || 'Erro desconhecido'

  // Map common Supabase error messages to our error types
  if (message.includes('Invalid login credentials')) {
    return {
      type: 'invalid_credentials' as AuthErrorType,
      message: 'Email ou senha incorretos.',
      details: error
    }
  }

  if (message.includes('Email not confirmed')) {
    return {
      type: 'email_not_confirmed' as AuthErrorType,
      message: 'Por favor, confirme seu email antes de fazer login.',
      details: error
    }
  }

  if (message.includes('Password should be at least')) {
    return {
      type: 'weak_password' as AuthErrorType,
      message: 'A senha deve ter pelo menos 6 caracteres.',
      details: error
    }
  }

  if (message.includes('User already registered')) {
    return {
      type: 'email_already_exists' as AuthErrorType,
      message: 'Este email já está cadastrado.',
      details: error
    }
  }

  if (message.includes('JWT expired') || message.includes('refresh_token_not_found')) {
    return {
      type: 'session_expired' as AuthErrorType,
      message: 'Sua sessão expirou. Faça login novamente.',
      details: error
    }
  }

  // Default to unknown error
  return {
    type: 'unknown_error' as AuthErrorType,
    message: message,
    details: error
  }
}