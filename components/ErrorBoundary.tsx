'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Filter out extension-related errors
    if (
      error.message.includes('chrome-extension') ||
      error.message.includes('Extension') ||
      error.stack?.includes('chrome-extension')
    ) {
      console.warn('Browser extension error ignored:', error.message)
      this.setState({ hasError: false })
      return
    }

    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Don't show error for extension-related issues
      if (
        this.state.error.message.includes('chrome-extension') ||
        this.state.error.message.includes('Extension')
      ) {
        return this.props.children
      }

      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Algo deu errado</h2>
              <p className="text-white/60 mb-4">Tente recarregar a página</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
              >
                Recarregar
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}