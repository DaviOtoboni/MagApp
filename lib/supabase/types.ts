export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          nickname: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          nickname?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          nickname?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      safe_profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          nickname: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
      }
    }
    Functions: {
      get_user_profile: {
        Args: { user_id: string }
        Returns: Database['public']['Tables']['profiles']['Row']
      }
      get_user_by_nickname: {
        Args: { user_nickname: string }
        Returns: Database['public']['Tables']['profiles']['Row']
      }
    }
  }
}