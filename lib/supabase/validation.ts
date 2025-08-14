import { supabase } from './client'
import { validateSupabaseConfig } from './config-validator'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validates Supabase configuration and connection
 */
export async function validateSupabaseSetup(): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  }

  try {
    // Validate environment variables
    validateSupabaseConfig()
  } catch (error) {
    result.isValid = false
    result.errors.push(`Configuration error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return result
  }

  try {
    // Test database connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (error) {
      result.isValid = false
      result.errors.push(`Database connection error: ${error.message}`)
    }
  } catch (error) {
    result.isValid = false
    result.errors.push(`Database test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  try {
    // Test auth configuration
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      result.warnings.push(`Auth session check warning: ${error.message}`)
    }
  } catch (error) {
    result.warnings.push(`Auth test warning: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  return result
}

/**
 * Quick validation for development
 */
export function validateEnvironmentVariables(): boolean {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_APP_URL'
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing)
    return false
  }

  const placeholders = [
    'your_supabase_project_url',
    'your_supabase_anon_key',
    'your_supabase_service_role_key'
  ]

  const hasPlaceholders = required.some(key => {
    const value = process.env[key]
    return value && placeholders.some(placeholder => value.includes(placeholder))
  })

  if (hasPlaceholders) {
    console.error('Environment variables contain placeholder values. Please update .env.local with actual Supabase credentials.')
    return false
  }

  return true
}