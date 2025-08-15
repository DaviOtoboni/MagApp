'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { ProfileEditForm } from '@/components/profile/ProfileEditForm'
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais e configurações de segurança.
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Informações Pessoais</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {isEditing ? (
                <ProfileEditForm
                  onSuccess={() => setIsEditing(false)}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <ProfileCard
                  onEdit={() => setIsEditing(true)}
                  showEditButton={true}
                />
              )}
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <ChangePasswordForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}