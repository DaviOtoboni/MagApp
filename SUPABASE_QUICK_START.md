# Supabase Quick Start Guide

Este guia rápido te ajudará a configurar o Supabase para o MagApp em poucos minutos.

## ⚡ Setup Rápido

### 1. Verificar Configuração
```bash
pnpm run setup:supabase
```

### 2. Criar Projeto Supabase
1. Acesse [supabase.com](https://supabase.com) e faça login
2. Clique em "New Project"
3. Configure:
   - **Name**: MagApp
   - **Database Password**: Use uma senha forte
   - **Region**: Escolha a mais próxima
4. Aguarde a criação (2-3 minutos)

### 3. Obter Credenciais
1. No dashboard, vá para **Settings > API**
2. Copie:
   - **Project URL**
   - **anon public key**
   - **service_role key**

### 4. Configurar Variáveis
1. Abra `.env.local`
2. Substitua os placeholders pelas suas credenciais:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
```

### 5. Configurar Banco de Dados
1. No Supabase, vá para **SQL Editor**
2. Copie e execute o conteúdo de `supabase/migrations/001_initial_schema.sql`

### 6. Configurar Autenticação
1. Vá para **Authentication > Settings**
2. Certifique-se que **Email** está habilitado
3. Em **URL Configuration**, adicione:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: `http://localhost:3000/auth/callback`

### 7. Configurar Templates de Email (Opcional)
1. Vá para **Authentication > Email Templates**
2. Use os templates em `supabase/email-templates/` como referência

### 8. Testar
```bash
pnpm dev
```

## ✅ Verificação

Se tudo estiver correto, você deve ver no console:
```
✅ Supabase configuration is valid
```

## 🚨 Problemas Comuns

### "Missing Supabase environment variables"
- Verifique se `.env.local` existe e tem as credenciais corretas
- Reinicie o servidor: `Ctrl+C` e `pnpm dev`

### "Invalid URL format"
- Certifique-se que a URL do Supabase começa com `https://`
- Não inclua barras no final da URL

### Emails não chegam
- Verifique spam/lixo eletrônico
- Para desenvolvimento, você pode desabilitar confirmação por email temporariamente

## 📚 Documentação Completa

Para configuração avançada, consulte:
- `docs/SUPABASE_SETUP.md` - Guia completo
- `docs/AUTHENTICATION.md` - Documentação de autenticação

## 🆘 Suporte

Se precisar de ajuda:
1. Verifique os logs no console do navegador
2. Consulte a documentação do Supabase
3. Execute `pnpm run setup:supabase` para diagnóstico