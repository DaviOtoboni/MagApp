'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Loader2, User, Mail, Image, Save, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/hooks/useUser'
import { toast } from 'sonner'

const profileEditSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  avatar_url: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal(''))
})

type ProfileEditFormData = z.infer<typeof profileEditSchema>

interface ProfileEditFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

export function ProfileEditForm({ onSuccess, onCancel, className }: ProfileEditFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { updateProfile } = useAuth()
  const { user, profile } = useUser()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      name: profile?.name || '',
      email: user?.email || '',
      avatar_url: profile?.avatar_url || ''
    }
  })

  const avatarUrl = watch('avatar_url')
  const name = watch('name')

  // Generate initials for avatar fallback
  const initials = name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const onSubmit = async (data: ProfileEditFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Only update changed fields
      const updates: any = {}
      
      if (data.name !== profile?.name) {
        updates.name = data.name
      }
      
      if (data.avatar_url !== profile?.avatar_url) {
        updates.avatar_url = data.avatar_url || null
      }

      // Note: Email updates require special handling in Supabase
      // For now, we'll skip email updates as they require email confirmation
      if (data.email !== user?.email) {
        toast.error('Alteração de email não está disponível no momento')
        setIsLoading(false)
        return
      }

      if (Object.keys(updates).length === 0) {
        toast.info('Nenhuma alteração foi feita')
        setIsLoading(false)
        return
      }

      await updateProfile(updates)
      
      toast.success('Perfil atualizado com sucesso!')
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar perfil'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const loading = isLoading || isSubmitting

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Editar perfil
        </CardTitle>
        <CardDescription>
          Atualize suas informações pessoais
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Avatar Preview */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatarUrl || undefined} alt={name || 'Avatar'} />
              <AvatarFallback className="text-lg font-semibold">
                {initials || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-medium">Foto do perfil</p>
              <p className="text-xs text-muted-foreground">
                Adicione uma URL de imagem para seu avatar
              </p>
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  className="pl-10"
                  disabled={loading}
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10"
                  disabled={true} // Email editing disabled for now
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Para alterar seu email, entre em contato com o suporte
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar_url">URL do avatar (opcional)</Label>
              <div className="relative">
                <Image className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="avatar_url"
                  type="url"
                  placeholder="https://exemplo.com/sua-foto.jpg"
                  className="pl-10"
                  disabled={loading}
                  {...register('avatar_url')}
                />
              </div>
              {errors.avatar_url && (
                <p className="text-sm text-destructive">{errors.avatar_url.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Cole a URL de uma imagem para usar como avatar
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={loading || !isDirty}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar alterações
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}