/**
 * Supabase Configuration Validator
 * Validates that all required environment variables are present and properly formatted
 */

interface SupabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
  appUrl: string
}

export function validateSupabaseConfig(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  // Check required variables
  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
  }

  if (!anonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
  }

  if (!appUrl) {
    throw new Error('NEXT_PUBLIC_APP_URL is required')
  }

  // Validate URL format
  try {
    new URL(url)
  } catch {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL must be a valid URL')
  }

  try {
    new URL(appUrl)
  } catch {
    throw new Error('NEXT_PUBLIC_APP_URL must be a valid URL')
  }

  // Check for placeholder values
  const placeholders = [
    'your_supabase_project_url',
    'your_supabase_anon_key',
    'your_supabase_service_role_key'
  ]

  if (placeholders.some(placeholder => url.includes(placeholder) || anonKey.includes(placeholder))) {
    throw new Error(
      'Supabase configuration contains placeholder values. Please update your .env.local file with actual credentials.'
    )
  }

  return {
    url,
    anonKey,
    serviceRoleKey,
    appUrl
  }
}

export function getSupabaseConfig(): SupabaseConfig {
  try {
    return validateSupabaseConfig()
  } catch (error) {
    console.error('Supabase configuration error:', error)
    throw error
  }
}