import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from './database'

export interface AuthUser extends User {
  profile?: Profile
}

export interface AuthSession extends Session {
  user: AuthUser
}

export interface AuthContextType {
  user: AuthUser | null
  profile: Profile | null
  session: AuthSession | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<void>
  refreshSession: () => Promise<void>
  signInAsTestUser: () => void
}

export enum AuthErrorType {
  NETWORK_ERROR = 'network_error',
  INVALID_CREDENTIALS = 'invalid_credentials',
  SESSION_EXPIRED = 'session_expired',
  EMAIL_NOT_CONFIRMED = 'email_not_confirmed',
  WEAK_PASSWORD = 'weak_password',
  EMAIL_ALREADY_EXISTS = 'email_already_exists',
  PROFILE_UPDATE_FAILED = 'profile_update_failed',
  PASSWORD_RESET_FAILED = 'password_reset_failed',
  UNKNOWN_ERROR = 'unknown_error'
}

export interface AuthError {
  type: AuthErrorType
  message: string
  details?: any
}

export interface SignUpData {
  email: string
  password: string
  name?: string
}

export interface SignInData {
  email: string
  password: string
  remember?: boolean
}

export interface ProfileUpdateData {
  name?: string
  avatar_url?: string
}