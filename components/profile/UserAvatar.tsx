'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserDisplay } from '@/hooks/useUser'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showName?: boolean
  showEmail?: boolean
  showStatus?: boolean
  className?: string
  onClick?: () => void
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
}

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg'
}

export function UserAvatar({ 
  size = 'md',
  showName = false,
  showEmail = false,
  showStatus = false,
  className,
  onClick
}: UserAvatarProps) {
  const { displayName, email, avatarUrl, initials, isLoading } = useUserDisplay()

  if (isLoading) {
    return <UserAvatarSkeleton size={size} showName={showName} showEmail={showEmail} className={className} />
  }

  const avatarElement = (
    <Avatar 
      className={cn(sizeClasses[size], onClick && 'cursor-pointer hover:opacity-80 transition-opacity', className)}
      onClick={onClick}
    >
      <AvatarImage src={avatarUrl || undefined} alt={displayName} />
      <AvatarFallback className={cn('font-semibold', textSizeClasses[size])}>
        {initials}
      </AvatarFallback>
    </Avatar>
  )

  if (!showName && !showEmail && !showStatus) {
    return avatarElement
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {avatarElement}
      
      <div className="flex-1 min-w-0">
        {showName && (
          <div className="flex items-center gap-2">
            <p className={cn('font-medium truncate', textSizeClasses[size])}>
              {displayName}
            </p>
            {showStatus && (
              <Badge variant="secondary" className="text-xs">
                Online
              </Badge>
            )}
          </div>
        )}
        
        {showEmail && (
          <p className={cn('text-muted-foreground truncate', 
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}>
            {email}
          </p>
        )}
      </div>
    </div>
  )
}

export function UserAvatarSkeleton({ 
  size = 'md', 
  showName = false, 
  showEmail = false,
  className 
}: { 
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showName?: boolean
  showEmail?: boolean
  className?: string 
}) {
  if (!showName && !showEmail) {
    return <Skeleton className={cn(sizeClasses[size], 'rounded-full', className)} />
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Skeleton className={cn(sizeClasses[size], 'rounded-full')} />
      
      <div className="flex-1 space-y-1">
        {showName && (
          <Skeleton className="h-4 w-24" />
        )}
        
        {showEmail && (
          <Skeleton className="h-3 w-32" />
        )}
      </div>
    </div>
  )
}