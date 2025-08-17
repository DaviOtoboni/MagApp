'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!email) {
        setError('Por favor, digite seu email')
        return
      }

      // Send reset email with Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        throw new Error(error.message)
      }

      setSent(true)
    } catch (err) {
      setError('Erro ao enviar email. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full bg-white bg-opacity-5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        </div>
        
        <div className="relative w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center mb-6">
              <Send className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Email enviado!
            </h1>
            <p className="text-gray-600 mb-2">
              Enviamos um link de recuperação para:
            </p>
            <p className="text-blue-600 font-semibold mb-8">
              {email}
            </p>

            <div className="space-y-4 text-sm text-gray-600 mb-8">
              <p>Verifique sua caixa de entrada e clique no link para redefinir sua senha.</p>
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="font-medium text-blue-800 mb-2">Não recebeu o email?</p>
                <ul className="text-left space-y-1 text-blue-700">
                  <li>• Verifique sua pasta de spam</li>
                  <li>• Aguarde alguns minutos</li>
                  <li>• Verifique se o email está correto</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setSent(false)}
                className="w-full py-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                Tentar outro email
              </button>
              
              <Link 
                href="/login"
                className="w-full flex justify-center py-4 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-gray-400 hover:text-gray-900 transition-all duration-200 hover:shadow-md"
              >
                Voltar ao login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-white bg-opacity-5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-20 bg-white rounded-2xl shadow-2xl mb-6">
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
              Mag
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Esqueceu a senha?
          </h1>
          <p className="text-white/80 text-lg">
            Não se preocupe, vamos te ajudar
          </p>
        </div>

        {/* Reset Form Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email da conta
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                  placeholder="Digite seu email"
                />
              </div>
              <p className="text-sm text-gray-500">
                Enviaremos um link de recuperação para este email
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Enviar link de recuperação
                </div>
              )}
            </button>
          </form>
          
          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Lembrou da senha?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link 
            href="/login"
            className="w-full flex justify-center py-3 px-4 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-gray-400 hover:text-gray-900 transition-all duration-200 hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar ao login
          </Link>
        </div>

        {/* Footer Links */}
        <div className="text-center mt-8">
          <Link 
            href="/" 
            className="text-white/60 hover:text-white/80 text-sm transition-colors"
          >
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}