/**
 * Environment configuration utility
 * Validates and provides typed access to environment variables
 */

interface EnvironmentConfig {
  supabase: {
    url: string
    anonKey: string
    serviceRoleKey?: string
  }
  app: {
    url: string
    environment: 'development' | 'production' | 'test'
  }
}

function validateEnvironmentVariables(): EnvironmentConfig {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const nodeEnv = process.env.NODE_ENV || 'development'

  // Validate required environment variables
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
  }

  if (!supabaseAnonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
  }

  // Validate URL format
  try {
    new URL(supabaseUrl)
    new URL(appUrl)
  } catch (error) {
    throw new Error('Invalid URL format in environment variables')
  }

  return {
    supabase: {
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
      serviceRoleKey: supabaseServiceRoleKey,
    },
    app: {
      url: appUrl,
      environment: nodeEnv as 'development' | 'production' | 'test',
    },
  }
}

export const env = validateEnvironmentVariables()

export function isProduction(): boolean {
  return env.app.environment === 'production'
}

export function isDevelopment(): boolean {
  return env.app.environment === 'development'
}