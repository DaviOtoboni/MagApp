import { supabase } from '@/lib/supabase/client'
import { supabaseAdmin } from '@/lib/supabase/server'
import { 
  Profile, 
  ProfileInsert, 
  ProfileUpdate, 
  DatabaseResult, 
  AuthError, 
  AuthErrorType 
} from '@/types/database'
import { DatabaseOperationOptions, TypedSupabaseClient } from '@/types/supabase'

/**
 * Database operation utilities with comprehensive error handling
 */

// Default operation options
const DEFAULT_OPTIONS: DatabaseOperationOptions = {
  retries: 3,
  timeout: 10000,
  throwOnError: false,
}

// Error mapping utility
function mapSupabaseError(error: any): AuthError {
  if (!error) {
    return {
      type: AuthErrorType.UNKNOWN_ERROR,
      message: 'Erro desconhecido',
    }
  }

  // Map common Supabase errors to our error types
  switch (error.code) {
    case 'PGRST116':
      return {
        type: AuthErrorType.INVALID_CREDENTIALS,
        message: 'Perfil não encontrado',
        details: error,
      }
    case '23505': // Unique constraint violation
      return {
        type: AuthErrorType.EMAIL_ALREADY_EXISTS,
        message: 'Email já está em uso',
        details: error,
      }
    case '23514': // Check constraint violation
      return {
        type: AuthErrorType.INVALID_EMAIL,
        message: 'Dados inválidos fornecidos',
        details: error,
      }
    default:
      return {
        type: AuthErrorType.UNKNOWN_ERROR,
        message: error.message || 'Erro na operação do banco de dados',
        details: error,
      }
  }
}

// Retry utility with exponential backoff
async function withRetry<T>(
  operation: () => Promise<T>,
  options: DatabaseOperationOptions = DEFAULT_OPTIONS
): Promise<T> {
  const { retries = 3, timeout = 10000 } = options
  let lastError: any

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Add timeout to the operation
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Operação expirou')), timeout)
      })

      const result = await Promise.race([operation(), timeoutPromise])
      return result as T
    } catch (error) {
      lastError = error
      
      // Don't retry on the last attempt
      if (attempt === retries) break
      
      // Exponential backoff: wait 2^attempt * 100ms
      const delay = Math.pow(2, attempt) * 100
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

/**
 * Profile Operations
 */
export class ProfileOperations {
  private client: TypedSupabaseClient
  private adminClient: TypedSupabaseClient

  constructor(client?: TypedSupabaseClient, adminClient?: TypedSupabaseClient) {
    this.client = client || supabase
    this.adminClient = adminClient || supabaseAdmin
  }

  /**
   * Get user profile by ID
   */
  async getProfile(
    userId: string, 
    options: DatabaseOperationOptions = DEFAULT_OPTIONS
  ): Promise<DatabaseResult<Profile>> {
    try {
      const result = await withRetry(async () => {
        const { data, error } = await this.client
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) throw error
        return data
      }, options)

      return { data: result, error: null }
    } catch (error) {
      const authError = mapSupabaseError(error)
      
      if (options.throwOnError) {
        throw authError
      }

      return { data: null, error: authError.message }
    }
  }

  /**
   * Create new user profile
   */
  async createProfile(
    profileData: ProfileInsert,
    options: DatabaseOperationOptions = DEFAULT_OPTIONS
  ): Promise<DatabaseResult<Profile>> {
    try {
      const result = await withRetry(async () => {
        const { data, error } = await this.client
          .from('profiles')
          .insert(profileData)
          .select()
          .single()

        if (error) throw error
        return data
      }, options)

      return { data: result, error: null }
    } catch (error) {
      const authError = mapSupabaseError(error)
      
      if (options.throwOnError) {
        throw authError
      }

      return { data: null, error: authError.message }
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    updates: ProfileUpdate,
    options: DatabaseOperationOptions = DEFAULT_OPTIONS
  ): Promise<DatabaseResult<Profile>> {
    try {
      const result = await withRetry(async () => {
        const { data, error } = await this.client
          .from('profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId)
          .select()
          .single()

        if (error) throw error
        return data
      }, options)

      return { data: result, error: null }
    } catch (error) {
      const authError = mapSupabaseError(error)
      
      if (options.throwOnError) {
        throw authError
      }

      return { data: null, error: authError.message }
    }
  }

  /**
   * Delete user profile (admin only)
   */
  async deleteProfile(
    userId: string,
    options: DatabaseOperationOptions = DEFAULT_OPTIONS
  ): Promise<DatabaseResult<boolean>> {
    try {
      const result = await withRetry(async () => {
        const { error } = await this.adminClient
          .from('profiles')
          .delete()
          .eq('id', userId)

        if (error) throw error
        return true
      }, options)

      return { data: result, error: null }
    } catch (error) {
      const authError = mapSupabaseError(error)
      
      if (options.throwOnError) {
        throw authError
      }

      return { data: null, error: authError.message }
    }
  }

  /**
   * Get profile using the safe function
   */
  async getProfileSafe(
    userId: string,
    options: DatabaseOperationOptions = DEFAULT_OPTIONS
  ): Promise<DatabaseResult<Profile>> {
    try {
      const result = await withRetry(async () => {
        const { data, error } = await this.client
          .rpc('get_user_profile', { user_id: userId })

        if (error) throw error
        return data
      }, options)

      return { data: result, error: null }
    } catch (error) {
      const authError = mapSupabaseError(error)
      
      if (options.throwOnError) {
        throw authError
      }

      return { data: null, error: authError.message }
    }
  }

  /**
   * Check if email exists
   */
  async emailExists(
    email: string,
    options: DatabaseOperationOptions = DEFAULT_OPTIONS
  ): Promise<DatabaseResult<boolean>> {
    try {
      const result = await withRetry(async () => {
        const { data, error } = await this.client
          .from('profiles')
          .select('id')
          .eq('email', email)
          .limit(1)

        if (error) throw error
        return data && data.length > 0
      }, options)

      return { data: result, error: null }
    } catch (error) {
      const authError = mapSupabaseError(error)
      
      if (options.throwOnError) {
        throw authError
      }

      return { data: null, error: authError.message }
    }
  }

  /**
   * Validate email format using database function
   */
  async validateEmail(
    email: string,
    options: DatabaseOperationOptions = DEFAULT_OPTIONS
  ): Promise<DatabaseResult<boolean>> {
    try {
      const result = await withRetry(async () => {
        const { data, error } = await this.client
          .rpc('is_valid_email', { email })

        if (error) throw error
        return data
      }, options)

      return { data: result, error: null }
    } catch (error) {
      const authError = mapSupabaseError(error)
      
      if (options.throwOnError) {
        throw authError
      }

      return { data: null, error: authError.message }
    }
  }
}

// Export singleton instance
export const profileOperations = new ProfileOperations()

/**
 * Database health check utility
 */
export async function checkDatabaseHealth(): Promise<DatabaseResult<boolean>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (error) throw error
    
    return { data: true, error: null }
  } catch (error) {
    const authError = mapSupabaseError(error)
    return { data: false, error: authError.message }
  }
}

/**
 * Database connection test
 */
export async function testDatabaseConnection(): Promise<{
  connected: boolean
  latency: number
  error?: string
}> {
  const startTime = Date.now()
  
  try {
    await supabase.from('profiles').select('count').limit(1)
    const latency = Date.now() - startTime
    
    return { connected: true, latency }
  } catch (error) {
    const latency = Date.now() - startTime
    const authError = mapSupabaseError(error)
    
    return { 
      connected: false, 
      latency, 
      error: authError.message 
    }
  }
}