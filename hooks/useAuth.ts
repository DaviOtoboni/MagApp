'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name?: string
}

interface AuthState {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
}

// Conta de teste
const TEST_USER = {
  id: '1',
  email: 'teste@magapp.com',
  name: 'Usuário Teste'
}

const TEST_CREDENTIALS = {
  email: 'teste@magapp.com',
  password: '123456'
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (localStorage)
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('magapp_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('magapp_user')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check test credentials
      if (email === TEST_CREDENTIALS.email && password === TEST_CREDENTIALS.password) {
        setUser(TEST_USER)
        localStorage.setItem('magapp_user', JSON.stringify(TEST_USER))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo, just create a new user
      const newUser = {
        id: Date.now().toString(),
        email,
        name
      }
      
      setUser(newUser)
      localStorage.setItem('magapp_user', JSON.stringify(newUser))
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('magapp_user')
  }

  return { user, loading, login, logout, register }
}