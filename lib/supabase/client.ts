import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { env, validateEnvVars } from '@/lib/env'

// Validate environment variables (only in runtime)
if (typeof window !== 'undefined') {
  validateEnvVars()
}

// Client-side Supabase client
export const supabase = createClient<Database>(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
)