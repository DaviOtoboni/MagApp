/**
 * Environment utilities for build-time safety
 */

export const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL && !process.env.RAILWAY_ENVIRONMENT_NAME

export const getEnvVar = (key: string, fallback: string = '') => {
  const value = process.env[key]
  
  // During build time, return fallback to prevent build failures
  if (isBuildTime && !value) {
    console.warn(`⚠️  Environment variable ${key} not found during build. Using fallback.`)
    return fallback
  }
  
  return value || fallback
}

export const validateEnvVars = () => {
  // Skip validation during build time
  if (isBuildTime) {
    return true
  }
  
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
  
  return true
}

// Safe environment variables with fallbacks
export const env = {
  NEXT_PUBLIC_SUPABASE_URL: getEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'https://placeholder.supabase.co'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'placeholder-key'),
  SUPABASE_SERVICE_ROLE_KEY: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', 'placeholder-service-key'),
  NEXT_PUBLIC_APP_URL: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
}