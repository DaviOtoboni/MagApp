'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useUserDisplay } from '@/hooks/useUser'
import { CalendarDays, Mail, User, Shield } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ProfileDisplayProps {
  showEmail?: boolean
  showJoinDate?: boolean
  showStatus?: boolean
  className?: string
}

export function ProfileDisplay({ 
  showEmail = true, 
  showJoinDate = true, 
  showStatus = true,
  className 
}: ProfileDisplayProps) {
  const { displayName, email, avatarUrl, initials, isLoading } = useUserDisplay()

  if (isLoading) {
    return <ProfileDisplaySkeleton className={className} />
  }

  return (
    <Card className={className}>
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl || undefined} alt={displayName} />
            <AvatarFallback className="text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="space-y-2">
          <CardTitle className="text-xl">{displayName}</CardTitle>
          {showEmail && (
            <CardDescription className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              {email}
            </CardDescription>
          )}
        </div>

        {showStatus && (
          <div className="flex justify-center">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Usuário ativo
            </Badge>
          </div>
        )}
      </CardHeader>

      {showJoinDate && (
        <CardContent className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>Membro desde {formatDistanceToNow(new Date(), { locale: ptBR })}</span>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export function ProfileDisplaySkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <Skeleton className="h-20 w-20 rounded-full" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-6 w-32 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>

        <div className="flex justify-center">
          <Skeleton className="h-6 w-24" />
        </div>
      </CardHeader>

      <CardContent className="text-center">
        <Skeleton className="h-4 w-40 mx-auto" />
      </CardContent>
    </Card>
  )
}