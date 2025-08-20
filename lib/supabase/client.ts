import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

console.log('🔧 [SUPABASE] Configurando cliente...')
console.log('🔧 [SUPABASE] URL:', supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'NÃO DEFINIDA')
console.log('🔧 [SUPABASE] Chave anônima:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NÃO DEFINIDA')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ [SUPABASE] Variáveis de ambiente do Supabase estão faltando!')
  console.error('❌ [SUPABASE] NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'definida' : 'NÃO DEFINIDA')
  console.error('❌ [SUPABASE] NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'definida' : 'NÃO DEFINIDA')
  console.error('❌ [SUPABASE] Crie um arquivo .env.local com essas variáveis')
} else {
  console.log('✅ [SUPABASE] Variáveis de ambiente carregadas com sucesso')
}

// Create client with error handling
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

console.log('✅ [SUPABASE] Cliente criado com sucesso')

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Types for our application
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export interface AuthUser {
  id: string
  email: string
  name?: string
  nickname?: string
}