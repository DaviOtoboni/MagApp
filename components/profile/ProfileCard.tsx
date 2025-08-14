'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { UserAvatar } from './UserAvatar'
import { useUser } from '@/hooks/useUser'
import { Edit, Mail, Calendar, Shield, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ProfileCardProps {
  onEdit?: () => void
  showEditButton?: boolean
  className?: string
}

export function ProfileCard({ onEdit, showEditButton = true, className }: ProfileCardProps) {
  const { user, profile, isLoading } = useUser()

  if (isLoading) {
    return <ProfileCardSkeleton className={className} />
  }

  if (!user) {
    return null
  }

  const joinDate = user.created_at ? new Date(user.created_at) : new Date()
  const lastUpdate = profile?.updated_at ? new Date(profile.updated_at) : null

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil do usuário
            </CardTitle>
            <CardDescription>
              Informações da sua conta
            </CardDescription>
          </div>
          
          {showEditButton && onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* User Avatar and Basic Info */}
        <div className="flex items-center space-x-4">
          <UserAvatar size="lg" />
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">
              {profile?.name || user.email?.split('@')[0] || 'Usuário'}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {user.email}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={user.email_confirmed_at ? 'default' : 'secondary'} className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                {user.email_confirmed_at ? 'Email confirmado' : 'Email pendente'}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Account Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Informações da conta
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Membro desde:</span>
              </div>
              <p className="text-sm font-medium">
                {formatDistanceToNow(joinDate, { 
                  addSuffix: true, 
                  locale: ptBR 
                })}
              </p>
            </div>

            {lastUpdate && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Edit className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Última atualização:</span>
                </div>
                <p className="text-sm font-medium">
                  {formatDistanceToNow(lastUpdate, { 
                    addSuffix: true, 
                    locale: ptBR 
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        {profile && (
          <>
            <Separator />
            
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Detalhes do perfil
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome completo</label>
                  <p className="text-sm mt-1">
                    {profile.name || 'Não informado'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm mt-1">{profile.email}</p>
                </div>
                
                {profile.avatar_url && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Avatar</label>
                    <p className="text-sm mt-1 text-blue-600 hover:underline">
                      <a href={profile.avatar_url} target="_blank" rel="noopener noreferrer">
                        Ver imagem
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function ProfileCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-9 w-20" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <Skeleton className="h-4 w-40" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}