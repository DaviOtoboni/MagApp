/**
 * Database utilities and operations index
 * Centralized exports for all database-related functionality
 */

// Core operations
export { 
  ProfileOperations, 
  profileOperations, 
  checkDatabaseHealth, 
  testDatabaseConnection 
} from './operations'

// Type exports
export type {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  SafeProfile,
  Database,
  DatabaseResult,
  DatabaseListResult,
  AuthError,
  AuthErrorType,
  UserSession,
  DatabaseStatus,
} from '@/types/database'

export type {
  TypedSupabaseClient,
  AuthState,
  AuthContextType,
  SupabaseConfig,
  DatabaseOperationOptions,
  ProfileOperations as IProfileOperations,
  RealtimeSubscription,
  ProfileSubscription,
  AuthEvent,
  AuthEventType,
  RouteProtectionConfig,
  ProtectedRouteProps,
  ServerAuthResult,
  ServerAuthOptions,
  EmailTemplate,
  EmailTemplates,
  ValidationResult,
  FormValidationResult,
  ApiResponse,
  PaginatedResponse,
  UseAuthReturn,
  UseProfileReturn,
  UseSessionReturn,
  AuthStorage,
  StorageAdapter,
} from '@/types/supabase'

// Validation exports
export {
  validateData,
  validateLogin,
  validateRegister,
  validateForgotPassword,
  validateResetPassword,
  validateProfileEdit,
  validateProfileInsert,
  validateProfileUpdate,
  validateEmailAdvanced,
  checkPasswordStrength,
  fieldValidators,
  // Schemas
  emailSchema,
  nameSchema,
  avatarUrlSchema,
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  profileEditSchema,
  profileInsertSchema,
  profileUpdateSchema,
  enhancedRegisterSchema,
  profilePhotoSchema,
  contactSchema,
  searchSchema,
} from '@/lib/validation/schemas'

// Form data types
export type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  ProfileEditFormData,
} from '@/types/database'

// Supabase client exports
export { supabase } from '@/lib/supabase/client'
export { supabaseAdmin } from '@/lib/supabase/server'
export { 
  validateSupabaseConfig, 
  logConfigValidation 
} from '@/lib/supabase/config-validator'

// Constants and enums
export { AuthErrorType } from '@/types/database'

/**
 * Database utility functions
 */

// Helper to create a typed Supabase client
export function createTypedSupabaseClient() {
  return supabase
}

// Helper to check if user is authenticated
export function isAuthenticated(user: any): boolean {
  return user !== null && user !== undefined
}

// Helper to extract user ID safely
export function getUserId(user: any): string | null {
  return user?.id || null
}

// Helper to format database timestamps
export function formatTimestamp(timestamp: string): Date {
  return new Date(timestamp)
}

// Helper to create safe profile data (excluding sensitive info)
export function createSafeProfile(profile: Profile): SafeProfile {
  return {
    id: profile.id,
    name: profile.name,
    avatar_url: profile.avatar_url,
    created_at: profile.created_at,
  }
}

// Helper to check if profile is complete
export function isProfileComplete(profile: Profile | null): boolean {
  if (!profile) return false
  return !!(profile.name && profile.email)
}

// Helper to generate avatar URL from name
export function generateAvatarUrl(name: string | null, size: number = 100): string {
  if (!name) return `https://ui-avatars.com/api/?name=User&size=${size}&background=random`
  
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=${size}&background=random`
}

// Helper to validate required environment variables
export function validateEnvironment(): {
  isValid: boolean
  missing: string[]
} {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  return {
    isValid: missing.length === 0,
    missing,
  }
}

// Helper to create database error from unknown error
export function createDatabaseError(error: unknown, defaultMessage: string = 'Erro no banco de dados'): AuthError {
  if (error && typeof error === 'object' && 'message' in error) {
    return {
      type: AuthErrorType.UNKNOWN_ERROR,
      message: (error as any).message || defaultMessage,
      details: error,
    }
  }
  
  return {
    type: AuthErrorType.UNKNOWN_ERROR,
    message: defaultMessage,
    details: error,
  }
}

// Helper to retry database operations
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries) break
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
    }
  }
  
  throw lastError
}

// Default export with commonly used utilities
export default {
  operations: profileOperations,
  client: supabase,
  adminClient: supabaseAdmin,
  validate: {
    login: validateLogin,
    register: validateRegister,
    profile: validateProfileEdit,
    email: validateEmailAdvanced,
    password: checkPasswordStrength,
  },
  utils: {
    isAuthenticated,
    getUserId,
    formatTimestamp,
    createSafeProfile,
    isProfileComplete,
    generateAvatarUrl,
    validateEnvironment,
    createDatabaseError,
    retryOperation,
  },
}