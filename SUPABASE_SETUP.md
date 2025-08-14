# Supabase Setup Guide

Este guia irá te ajudar a configurar o Supabase para autenticação email/senha no MagApp.

## 1. Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha sua organização
5. Preencha os dados do projeto:
   - **Name**: MagApp (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte e anote
   - **Region**: Escolha a região mais próxima (ex: South America - São Paulo)
6. Clique em "Create new project"
7. Aguarde a criação do projeto (pode levar alguns minutos)

## 2. Obter Credenciais do Projeto

1. No dashboard do seu projeto, vá para **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL** (ex: https://xxxxxxxxxxx.supabase.co)
   - **anon public** key (chave pública)
   - **service_role** key (chave de serviço - mantenha secreta!)

## 3. Configurar Variáveis de Ambiente

1. Abra o arquivo `.env.local` na raiz do projeto
2. Substitua os valores placeholder pelas suas credenciais:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_publica_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_aqui

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Executar Migração do Banco de Dados

1. No dashboard do Supabase, vá para **SQL Editor**
2. Clique em "New query"
3. Copie e cole o conteúdo do arquivo `supabase/migrations/001_initial_schema.sql`
4. Clique em "Run" para executar a migração
5. Verifique se a tabela `profiles` foi criada em **Table Editor**

## 5. Configurar Autenticação Email/Senha

1. No dashboard, vá para **Authentication** > **Settings**
2. Em **Site URL**, configure:
   - **Site URL**: `http://localhost:3000` (desenvolvimento)
   - Para produção: `https://seu-dominio.com`
3. Em **Redirect URLs**, adicione:
   - `http://localhost:3000/auth/callback` (desenvolvimento)
   - `https://seu-dominio.com/auth/callback` (produção)

## 6. Configurar Templates de Email

### Email de Confirmação
1. Vá para **Authentication** > **Email Templates**
2. Selecione "Confirm signup"
3. Personalize o template conforme necessário
4. Certifique-se de que o link de confirmação aponta para: `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup`

### Email de Reset de Senha
1. Selecione "Reset password"
2. Personalize o template
3. Certifique-se de que o link aponta para: `{{ .SiteURL }}/auth/reset-password?token_hash={{ .TokenHash }}&type=recovery`

## 7. Configurar SMTP (Opcional)

Por padrão, o Supabase usa seu próprio serviço de email. Para usar seu próprio SMTP:

1. Vá para **Settings** > **Auth**
2. Role até "SMTP Settings"
3. Configure seu provedor SMTP (Gmail, SendGrid, etc.)

## 8. Testar Configuração

1. Execute o script de validação:
```bash
pnpm run setup:supabase
```

2. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

3. Acesse `http://localhost:3000` e teste se não há erros de configuração

## 9. Configuração para Produção (Railway)

### Variáveis de Ambiente no Railway
1. No dashboard do Railway, vá para seu projeto
2. Clique na aba "Variables"
3. Adicione as mesmas variáveis do `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (URL do seu app no Railway)

### Atualizar URLs no Supabase
1. No Supabase, vá para **Authentication** > **Settings**
2. Atualize **Site URL** para sua URL de produção
3. Adicione sua URL de produção em **Redirect URLs**

## 10. Segurança e Boas Práticas

### Row Level Security (RLS)
- ✅ RLS está habilitado na tabela `profiles`
- ✅ Políticas de segurança estão configuradas
- ✅ Usuários só podem ver/editar seus próprios perfis

### Variáveis de Ambiente
- ✅ Chaves públicas podem ser expostas no frontend
- ❌ **NUNCA** exponha a `service_role` key no frontend
- ✅ Use diferentes projetos para dev/staging/prod

### Monitoramento
- Configure alertas no Supabase para uso de recursos
- Monitore logs de autenticação em **Authentication** > **Logs**
- Acompanhe métricas em **Reports**

## Troubleshooting

### Erro: "Invalid API key"
- Verifique se as chaves estão corretas no `.env.local`
- Certifique-se de não ter espaços extras nas variáveis

### Erro: "Email not confirmed"
- Verifique se o usuário confirmou o email
- Teste o template de confirmação

### Erro: "Invalid redirect URL"
- Verifique se a URL está configurada em **Redirect URLs**
- Certifique-se de que a URL está exatamente igual

### Erro de CORS
- Verifique se o domínio está configurado corretamente
- Para desenvolvimento, use `http://localhost:3000`

## Próximos Passos

Após completar esta configuração, você pode:
1. Implementar os componentes de autenticação
2. Criar páginas de login/cadastro
3. Configurar rotas protegidas
4. Implementar gerenciamento de perfil

Para mais informações, consulte a [documentação oficial do Supabase](https://supabase.com/docs).