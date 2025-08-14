# Supabase Setup Guide

Este guia explica como configurar o Supabase para o MagApp.

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha sua organização
5. Configure:
   - **Name**: MagApp (ou nome de sua preferência)
   - **Database Password**: Use uma senha forte
   - **Region**: Escolha a região mais próxima dos seus usuários
6. Clique em "Create new project"

## 2. Configurar Autenticação Email/Senha

1. No dashboard do Supabase, vá para **Authentication > Settings**
2. Em **Auth Providers**, certifique-se que **Email** está habilitado
3. Configure as seguintes opções:
   - **Enable email confirmations**: ✅ Habilitado
   - **Enable email change confirmations**: ✅ Habilitado
   - **Enable secure email change**: ✅ Habilitado

## 3. Configurar Templates de Email

### Email de Confirmação
1. Vá para **Authentication > Email Templates**
2. Selecione **Confirm signup**
3. Personalize o template conforme necessário:

```html
<h2>Confirme seu email</h2>
<p>Obrigado por se cadastrar no MagApp!</p>
<p>Clique no link abaixo para confirmar seu email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirmar Email</a></p>
```

### Email de Reset de Senha
1. Selecione **Reset password**
2. Personalize o template:

```html
<h2>Reset de Senha</h2>
<p>Você solicitou um reset de senha para sua conta no MagApp.</p>
<p>Clique no link abaixo para definir uma nova senha:</p>
<p><a href="{{ .ConfirmationURL }}">Resetar Senha</a></p>
<p>Se você não solicitou este reset, ignore este email.</p>
```

## 4. Configurar URLs de Redirect

1. Vá para **Authentication > URL Configuration**
2. Configure as URLs:
   - **Site URL**: `http://localhost:3000` (desenvolvimento)
   - **Redirect URLs**: 
     - `http://localhost:3000/auth/callback`
     - `https://your-app.railway.app/auth/callback` (produção)

## 5. Obter Chaves da API

1. Vá para **Settings > API**
2. Copie as seguintes chaves:
   - **Project URL**: Sua URL do projeto
   - **anon public**: Chave pública (anon key)
   - **service_role**: Chave de serviço (apenas para server-side)

## 6. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

2. Configure as variáveis no `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 7. Criar Schema do Banco de Dados

Execute o seguinte SQL no **SQL Editor** do Supabase:

```sql
-- Criar tabela de perfis
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para executar a função
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

## 8. Configuração para Produção (Railway)

1. No Railway, configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (URL do seu app no Railway)

2. No Supabase, adicione a URL de produção nas **Redirect URLs**

## 9. Testar a Configuração

1. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

2. Verifique se não há erros de configuração no console
3. Teste a conexão com o banco de dados

## Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se o arquivo `.env.local` existe e contém todas as variáveis
- Reinicie o servidor de desenvolvimento após adicionar variáveis

### Erro: "Invalid URL format"
- Verifique se as URLs estão no formato correto
- A URL do Supabase deve começar com `https://`

### Emails não estão sendo enviados
- Verifique se a confirmação por email está habilitada
- Configure um provedor SMTP personalizado em **Settings > Auth**
- Para desenvolvimento, você pode desabilitar a confirmação por email temporariamente