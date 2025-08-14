# Sistema de Autenticação - MagApp

Este documento descreve o sistema de autenticação implementado no MagApp usando Supabase.

## Visão Geral

O sistema de autenticação fornece:
- ✅ Login com email/senha
- ✅ Cadastro de usuários
- ✅ Confirmação por email
- ✅ Reset de senha
- ✅ Gerenciamento de sessões
- ✅ Proteção de rotas
- ✅ Gerenciamento de perfil

## Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │───▶│  Supabase Auth  │───▶│  PostgreSQL DB  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Auth Context    │    │ Email Service   │    │ Profiles Table  │
│ & Hooks         │    │ (SMTP)          │    │ (RLS Enabled)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Estrutura de Arquivos

```
lib/
├── supabase/
│   ├── client.ts              # Cliente Supabase (client-side)
│   ├── server.ts              # Cliente Supabase (server-side)
│   └── config-validator.ts    # Validação de configuração
├── config/
│   └── env.ts                 # Configuração de ambiente
types/
├── database.ts                # Tipos do banco de dados
└── auth.ts                    # Tipos de autenticação
docs/
├── SUPABASE_SETUP.md         # Guia de configuração
├── DEPLOYMENT.md             # Guia de deploy
└── AUTHENTICATION.md         # Este arquivo
```

## Configuração

### 1. Variáveis de Ambiente

```env
# Obrigatórias
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Opcionais
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Schema do Banco

```sql
-- Tabela de perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

## Como Usar

### 1. Cliente Supabase

```typescript
import { supabase } from '@/lib/supabase/client'

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Cadastro
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      name: 'Nome do Usuário'
    }
  }
})

// Logout
const { error } = await supabase.auth.signOut()
```

### 2. Validação de Configuração

```typescript
import { validateSupabaseConfig } from '@/lib/supabase/config-validator'

const validation = validateSupabaseConfig()
if (!validation.isValid) {
  console.error('Configuração inválida:', validation.errors)
}
```

### 3. Tipos TypeScript

```typescript
import type { Database, Profile } from '@/types/database'
import type { AuthUser, AuthContextType } from '@/types/auth'

// Uso dos tipos
const user: AuthUser = {
  id: 'uuid',
  email: 'user@example.com',
  profile: {
    id: 'uuid',
    email: 'user@example.com',
    name: 'Nome',
    avatar_url: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
}
```

## Fluxos de Autenticação

### 1. Login
1. Usuário insere email/senha
2. App chama `supabase.auth.signInWithPassword()`
3. Supabase valida credenciais
4. Retorna sessão ou erro
5. App redireciona ou mostra erro

### 2. Cadastro
1. Usuário preenche formulário
2. App chama `supabase.auth.signUp()`
3. Supabase cria usuário
4. Trigger cria perfil automaticamente
5. Email de confirmação é enviado
6. Usuário confirma email
7. Conta é ativada

### 3. Reset de Senha
1. Usuário solicita reset
2. App chama `supabase.auth.resetPasswordForEmail()`
3. Email com link é enviado
4. Usuário clica no link
5. App permite definir nova senha
6. Senha é atualizada

## Segurança

### Row Level Security (RLS)
- Habilitado em todas as tabelas
- Usuários só acessam próprios dados
- Políticas específicas por operação

### Validação
- Client-side: Validação de formulários
- Server-side: Validação no Supabase
- TypeScript: Type safety

### Sessões
- Tokens JWT seguros
- Refresh automático
- Expiração configurável

## Próximos Passos

Esta configuração inicial fornece a base para:

1. **Implementar Context de Autenticação** (Task 4)
2. **Criar Componentes de Login** (Task 5)
3. **Sistema de Cadastro** (Task 6)
4. **Reset de Senha** (Task 7)
5. **Rotas Protegidas** (Task 8)
6. **Gerenciamento de Perfil** (Task 9)

## Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se `.env.local` existe
- Confirme que todas as variáveis estão definidas
- Reinicie o servidor de desenvolvimento

### Erro: "Invalid URL format"
- Verifique formato das URLs
- URL do Supabase deve começar com `https://`

### Problemas de Conexão
- Verifique se o projeto Supabase está ativo
- Confirme as chaves de API
- Teste a conexão no dashboard do Supabase