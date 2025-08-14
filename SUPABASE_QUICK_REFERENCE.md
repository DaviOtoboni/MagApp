# Supabase Quick Reference

## 🚀 Quick Setup Checklist

### 1. Environment Variables (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Supabase Dashboard Configuration

#### Authentication Settings
- **Site URL**: `http://localhost:3000` (dev) / `https://your-domain.com` (prod)
- **Redirect URLs**: 
  - `http://localhost:3000/auth/callback`
  - `https://your-domain.com/auth/callback`

#### Email Templates
- **Confirm signup**: `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup`
- **Reset password**: `{{ .SiteURL }}/auth/reset-password?token_hash={{ .TokenHash }}&type=recovery`

### 3. Database Migration
Execute in Supabase SQL Editor:
```sql
-- Copy content from supabase/migrations/001_initial_schema.sql
```

## 📁 File Structure
```
lib/supabase/
├── client.ts          # Client-side Supabase instance
├── server.ts          # Server-side Supabase instance
├── config-validator.ts # Environment validation
└── validation.ts      # Setup validation

types/
├── database.ts        # Database type definitions
└── auth.ts           # Authentication types

supabase/migrations/
└── 001_initial_schema.sql # Database schema

middleware.ts          # Route protection
SUPABASE_SETUP.md     # Detailed setup guide
```

## 🔧 Commands
```bash
# Validate setup
pnpm run setup:supabase

# Start development
pnpm dev

# Install dependencies (if needed)
pnpm install
```

## 🛡️ Security Notes
- ✅ RLS enabled on profiles table
- ✅ Users can only access their own data
- ❌ Never expose service_role key in frontend
- ✅ Use different projects for dev/prod

## 🔗 Important URLs
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase Docs](https://supabase.com/docs)
- [Authentication Guide](https://supabase.com/docs/guides/auth)

## 🐛 Common Issues
1. **"Invalid API key"** → Check .env.local values
2. **"Email not confirmed"** → Check email templates
3. **"Invalid redirect URL"** → Update redirect URLs in dashboard
4. **CORS errors** → Verify domain configuration