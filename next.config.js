/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações experimentais
  experimental: {
    // Otimizações de pacote se necessário
    // optimizePackageImports: ['@supabase/supabase-js']
  },
  
  // Variáveis de ambiente são carregadas automaticamente do .env.local

  // Desabilitar prerendering completamente
  trailingSlash: false,
  
  // Configurações do TypeScript
  typescript: {
    // Ignorar erros de tipo durante o build em produção (temporário)
    ignoreBuildErrors: false,
  },

  // Configurações do ESLint
  eslint: {
    // Ignorar erros de lint durante o build (temporário)
    ignoreDuringBuilds: false,
  },

  // Configurações do Webpack
  webpack: (config, { isServer, dev }) => {
    // Avisar sobre variáveis de ambiente ausentes
    if (!dev && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.warn('⚠️  Variáveis de ambiente do Supabase não encontradas durante o build. Usando placeholders.')
    }
    
    // Configurações para resolver problemas do Edge Runtime
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    return config
  },

  // Configurações de servidor
  serverRuntimeConfig: {
    // Configurações apenas do servidor
  },
  
  publicRuntimeConfig: {
    // Configurações públicas
  },

  // Configurações de output
  output: 'standalone',

  // Desabilitar static optimization completamente
  async rewrites() {
    return []
  },

  // Configurações de build
  generateBuildId: async () => {
    return 'build-' + Date.now()
  }
}

module.exports = nextConfig