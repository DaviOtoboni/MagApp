'use client'

import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'

interface ConditionalRenderProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  loadingFallback?: React.ReactNode
  showWhenAuthenticated?: boolean
  showWhenUnauthenticated?: boolean
  requireEmailConfirmed?: boolean
}

/**
 * Component that conditionally renders content based on authentication state
 */
export function ConditionalRender({
  children,
  fallback = null,
  loadingFallback,
  showWhenAuthenticated = true,
  showWhenUnauthenticated = false,
  requireEmailConfirmed = false
}: ConditionalRenderProps) {
  const { user, loading } = useAuth()

  // Show loading state
  if (loading) {
    return <>{loadingFallback || <DefaultLoadingSkeleton />}</>
  }

  const isAuthenticated = !!user
  const isEmailConfirmed = user?.email_confirmed_at ? true : false

  // Check authentication requirements
  if (showWhenAuthenticated && !isAuthenticated) {
    return <>{fallback}</>
  }

  if (showWhenUnauthenticated && isAuthenticated) {
    return <>{fallback}</>
  }

  // Check email confirmation requirement
  if (requireEmailConfirmed && isAuthenticated && !isEmailConfirmed) {
    return <>{fallback}</>
  }

  // All conditions met, show children
  return <>{children}</>
}

/**
 * Show content only when user is authenticated
 */
export function ShowWhenAuthenticated({ 
  children, 
  fallback, 
  loadingFallback 
}: Pick<ConditionalRenderProps, 'children' | 'fallback' | 'loadingFallback'>) {
  return (
    <ConditionalRender
      showWhenAuthenticated={true}
      showWhenUnauthenticated={false}
      fallback={fallback}
      loadingFallback={loadingFallback}
    >
      {children}
    </ConditionalRender>
  )
}

/**
 * Show content only when user is NOT authenticated
 */
export function ShowWhenUnauthenticated({ 
  children, 
  fallback, 
  loadingFallback 
}: Pick<ConditionalRenderProps, 'children' | 'fallback' | 'loadingFallback'>) {
  return (
    <ConditionalRender
      showWhenAuthenticated={false}
      showWhenUnauthenticated={true}
      fallback={fallback}
      loadingFallback={loadingFallback}
    >
      {children}
    </ConditionalRender>
  )
}

/**
 * Show content only when user is authenticated AND email is confirmed
 */
export function ShowWhenEmailConfirmed({ 
  children, 
  fallback, 
  loadingFallback 
}: Pick<ConditionalRenderProps, 'children' | 'fallback' | 'loadingFallback'>) {
  return (
    <ConditionalRender
      showWhenAuthenticated={true}
      requireEmailConfirmed={true}
      fallback={fallback}
      loadingFallback={loadingFallback}
    >
      {children}
    </ConditionalRender>
  )
}

/**
 * Default loading skeleton
 */
function DefaultLoadingSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}

/**
 * Hook for conditional rendering logic
 */
export function useConditionalRender() {
  const { user, loading } = useAuth()

  const isAuthenticated = !!user
  const isEmailConfirmed = user?.email_confirmed_at ? true : false

  return {
    user,
    loading,
    isAuthenticated,
    isEmailConfirmed,
    shouldShowWhenAuthenticated: isAuthenticated,
    shouldShowWhenUnauthenticated: !isAuthenticated,
    shouldShowWhenEmailConfirmed: isAuthenticated && isEmailConfirmed
  }
}