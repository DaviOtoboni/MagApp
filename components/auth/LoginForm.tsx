'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

interface LoginFormProps {
  onSuccess?: () => void
  redirectTo?: string
  className?: string
}

export function LoginForm({ onSuccess, redirectTo = '/dashboard', className }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('📝 [LOGIN_FORM] Formulário submetido')
    setLoading(true)
    setError('')

    try {
      if (!email || !password) {
        console.warn('⚠️ [LOGIN_FORM] Campos vazios detectados')
        setError('Por favor, preencha todos os campos')
        return
      }

      console.log('✅ [LOGIN_FORM] Validação dos campos passou')
      console.log('📧 [LOGIN_FORM] Email validado:', email)
      console.log('🔑 [LOGIN_FORM] Senha validada:', password ? '***' : 'não fornecida')
      
      console.log('🔄 [LOGIN_FORM] Chamando hook useAuth.login...')
      const success = await login(email, password)
      
      console.log('📊 [LOGIN_FORM] Resposta do login:', success ? 'sucesso' : 'falha')
      
      if (success) {
        console.log('🎉 [LOGIN_FORM] Login bem-sucedido, redirecionando...')
        if (onSuccess) {
          console.log('🔄 [LOGIN_FORM] Executando callback onSuccess')
          onSuccess()
        } else {
          console.log('🔄 [LOGIN_FORM] Redirecionando para:', redirectTo)
          router.push(redirectTo)
        }
      } else {
        console.warn('⚠️ [LOGIN_FORM] Login falhou, exibindo erro')
        setError('Email ou senha incorretos')
      }
    } catch (err) {
      console.error('❌ [LOGIN_FORM] Exceção durante login:', err)
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      console.log('🏁 [LOGIN_FORM] Finalizando processo de login')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-6">
        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
            Email
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
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
            Senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
              placeholder="Digite sua senha"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Entrando...
            </div>
          ) : (
            'Entrar na conta'
          )}
        </button>
      </div>
    </form>
  )
}