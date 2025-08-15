import type { AuthError, AuthErrorType } from '@/types/auth'

/**
 * Authentication error handling utilities
 */

export const AUTH_ERROR_MESSAGES: Record<AuthErrorType, string> = {
  network_error: 'Erro de conexão. Verifique sua internet e tente novamente.',
  invalid_credentials: 'Email ou senha incorretos. Verifique suas credenciais.',
  session_expired: 'Sua sessão expirou. Faça login novamente.',
  email_not_confirmed: 'Por favor, confirme seu email antes de fazer login.',
  weak_password: 'A senha deve ter pelo menos 6 caracteres com letras e números.',
  email_already_exists: 'Este email já está cadastrado. Tente fazer login.',
  profile_update_failed: 'Erro ao atualizar perfil. Tente novamente.',
  password_reset_failed: 'Erro ao enviar email de recuperação. Tente novamente.',
  unknown_error: 'Ocorreu um erro inesperado. Tente novamente.'
}

export const AUTH_ERROR_TITLES: Record<AuthErrorType, string> = {
  network_error: 'Problema de Conexão',
  invalid_credentials: 'Credenciais Inválidas',
  session_expired: 'Sessão Expirada',
  email_not_confirmed: 'Email Não Confirmado',
  weak_password: 'Senha Fraca',
  email_already_exists: 'Email Já Cadastrado',
  profile_update_failed: 'Erro na Atualização',
  password_reset_failed: 'Erro no Reset',
  unknown_error: 'Erro Inesperado'
}

/**
 * Create a standardized auth error
 */
export function createAuthError(
  type: AuthErrorType,
  message?: string,
  details?: any
): AuthError {
  return {
    type,
    message: message || AUTH_ERROR_MESSAGES[type],
    details
  }
}

/**
 * Map Supabase error to our AuthError type
 */
export function mapSupabaseError(error: any): AuthError {
  const message = error?.message || 'Erro desconhecido'
  const code = error?.code || error?.error_code

  // Map specific Supabase error codes and messages
  if (message.includes('Invalid login credentials') || code === 'invalid_credentials') {
    return createAuthError('invalid_credentials', undefined, error)
  }

  if (message.includes('Email not confirmed') || code === 'email_not_confirmed') {
    return createAuthError('email_not_confirmed', undefined, error)
  }

  if (message.includes('Password should be at least') || code === 'weak_password') {
    return createAuthError('weak_password', undefined, error)
  }

  if (message.includes('User already registered') || code === 'signup_disabled') {
    return createAuthError('email_already_exists', undefined, error)
  }

  if (message.includes('JWT expired') || message.includes('refresh_token_not_found') || code === 'token_expired') {
    return createAuthError('session_expired', undefined, error)
  }

  if (message.includes('Network') || message.includes('fetch') || code === 'network_error') {
    return createAuthError('network_error', undefined, error)
  }

  // Default to unknown error
  return createAuthError('unknown_error', message, error)
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: AuthError | Error | string): string {
  if (typeof error === 'string') {
    return error
  }

  if ('type' in error && error.type) {
    return AUTH_ERROR_MESSAGES[error.type] || error.message
  }

  if ('message' in error) {
    return error.message
  }

  return AUTH_ERROR_MESSAGES.unknown_error
}

/**
 * Get error title for display
 */
export function getErrorTitle(error: AuthError): string {
  return AUTH_ERROR_TITLES[error.type] || 'Erro'
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: AuthError): boolean {
  const retryableTypes: AuthErrorType[] = [
    'network_error',
    'unknown_error'
  ]
  
  return retryableTypes.includes(error.type)
}

/**
 * Check if error requires user action
 */
export function requiresUserAction(error: AuthError): boolean {
  const actionRequiredTypes: AuthErrorType[] = [
    'invalid_credentials',
    'email_not_confirmed',
    'weak_password',
    'session_expired'
  ]
  
  return actionRequiredTypes.includes(error.type)
}

/**
 * Get suggested action for error
 */
export function getSuggestedAction(error: AuthError): string | null {
  const actions: Partial<Record<AuthErrorType, string>> = {
    invalid_credentials: 'Verifique seu email e senha',
    email_not_confirmed: 'Verifique seu email e clique no link de confirmação',
    weak_password: 'Use uma senha com pelo menos 6 caracteres, incluindo letras e números',
    session_expired: 'Faça login novamente',
    email_already_exists: 'Tente fazer login ou use outro email',
    network_error: 'Verifique sua conexão com a internet',
    password_reset_failed: 'Tente novamente ou entre em contato com o suporte'
  }
  
  return actions[error.type] || null
}

/**
 * Log error for debugging (in development)
 */
export function logAuthError(error: AuthError, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔐 Auth Error${context ? ` (${context})` : ''}`)
    console.error('Type:', error.type)
    console.error('Message:', error.message)
    if (error.details) {
      console.error('Details:', error.details)
    }
    console.groupEnd()
  }
}