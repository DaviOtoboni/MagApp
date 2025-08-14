import { SupabaseClient, User, Session } from '@supabase/supabase-js'
import { Database, Profile, AuthError } from './database'

// Extended Supabase client type
export type TypedSupabaseClient = SupabaseClient<Database>

// Authentication state interface
export interface AuthState {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  error: AuthError | null
}

// Authentication context interface
export interface AuthContextType extends AuthState {
  // Authentication methods
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  
  // Profile methods
  updateProfile: (data: Partial<Profile>) => Promise<void>
  refreshProfile: () => Promise<void>
  
  // Utility methods
  clearError: () => void
  checkSession: () => Promise<void>
}

// Supabase configuration interface
export interface SupabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
  options?: {
    auth: {
      autoRefreshToken: boolean
      persistSession: boolean
      detectSessionInUrl: boolean
      flowType?: 'implicit' | 'pkce'
    }
    global?: {
      headers?: Record<string, string>
    }
  }
}

// Database operation interfaces
export interface DatabaseOperationOptions {
  retries?: number
  timeout?: number
  throwOnError?: boolean
}

export interface ProfileOperations {
  getProfile: (userId: string, options?: DatabaseOperationOptions) => Promise<Profile | null>
  updateProfile: (userId: string, data: Partial<Profile>, options?: DatabaseOperationOptions) => Promise<Profile | null>
  createProfile: (data: Profile, options?: DatabaseOperationOptions) => Promise<Profile | null>
  deleteProfile: (userId: string, options?: DatabaseOperationOptions) => Promise<boolean>
}

// Real-time subscription interfaces
export interface RealtimeSubscription {
  channel: string
  event: string
  callback: (payload: any) => void
}

export interface ProfileSubscription extends RealtimeSubscription {
  callback: (payload: { new: Profile; old: Profile; eventType: 'INSERT' | 'UPDATE' | 'DELETE' }) => void
}

// Authentication event types
export type AuthEventType = 
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'TOKEN_REFRESHED'
  | 'USER_UPDATED'
  | 'PASSWORD_RECOVERY'

export interface AuthEvent {
  type: AuthEventType
  session: Session | null
  user: User | null
  timestamp: Date
}

// Middleware interfaces for route protection
export interface RouteProtectionConfig {
  requireAuth: boolean
  allowedRoles?: string[]
  redirectTo?: string
  onUnauthorized?: (reason: string) => void
}

export interface ProtectedRouteProps {
  children: React.ReactNode
  config?: RouteProtectionConfig
  fallback?: React.ReactNode
  loading?: React.ReactNode
}

// Server-side authentication interfaces
export interface ServerAuthResult {
  user: User | null
  session: Session | null
  error: AuthError | null
}

export interface ServerAuthOptions {
  cookieName?: string
  cookieOptions?: {
    maxAge?: number
    httpOnly?: boolean
    secure?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
  }
}

// Email template interfaces
export interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

export interface EmailTemplates {
  confirmation: EmailTemplate
  passwordReset: EmailTemplate
  emailChange: EmailTemplate
}

// Validation result interfaces
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}

export interface FormValidationResult extends ValidationResult {
  fieldErrors: Record<string, string[]>
}

// API response interfaces
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Hook return types
export interface UseAuthReturn extends AuthContextType {}

export interface UseProfileReturn {
  profile: Profile | null
  loading: boolean
  error: AuthError | null
  updateProfile: (data: Partial<Profile>) => Promise<void>
  refreshProfile: () => Promise<void>
}

export interface UseSessionReturn {
  session: Session | null
  loading: boolean
  error: AuthError | null
  refreshSession: () => Promise<void>
}

// Storage interfaces for client-side persistence
export interface AuthStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

export interface StorageAdapter {
  auth: AuthStorage
  preferences: AuthStorage
}