import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClientProviders } from '@/components/providers/ClientProviders'
import { ErrorBoundary } from '@/lib/errors/error-boundary'
import { Header } from '@/components/layout/Header'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MagApp - Sua Aplicação Completa',
  description: 'Aplicação moderna com autenticação Supabase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ErrorBoundary>
          <ClientProviders>
            <div className="min-h-screen bg-background">
              <Header />
              <main>
                {children}
              </main>
            </div>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
              }}
            />
          </ClientProviders>
        </ErrorBoundary>
      </body>
    </html>
  )
}