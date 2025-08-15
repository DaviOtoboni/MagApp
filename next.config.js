/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static optimization for pages that use Supabase
  experimental: {
    // Enable if needed for better performance
    // optimizePackageImports: ['@supabase/supabase-js']
  },
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Disable static generation for auth-dependent pages during build
  generateBuildId: async () => {
    // Use timestamp to ensure fresh builds
    return `build-${Date.now()}`
  },

  // Handle build-time environment issues
  webpack: (config, { isServer, dev }) => {
    // Don't fail build if env vars are missing during build
    if (!dev && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.warn('⚠️  Supabase environment variables not found during build. Using placeholders.')
    }
    
    return config
  }
}

module.exports = nextConfig