# Deployment Guide - Railway

Este guia explica como fazer deploy do MagApp no Railway com Supabase.

## Pré-requisitos

1. Projeto Supabase configurado (veja [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))
2. Conta no Railway
3. Repositório Git com o código

## 1. Configurar Projeto no Railway

1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project"
4. Selecione "Deploy from GitHub repo"
5. Escolha o repositório do MagApp
6. Railway detectará automaticamente que é um projeto Next.js

## 2. Configurar Variáveis de Ambiente

No dashboard do Railway, vá para a aba **Variables** e adicione:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.railway.app
NODE_ENV=production
```

### Como obter a URL do Railway:
1. Após o primeiro deploy, Railway gerará uma URL
2. Vá para **Settings > Domains** para ver a URL
3. Atualize a variável `NEXT_PUBLIC_APP_URL` com essa URL

## 3. Configurar Domínio Personalizado (Opcional)

1. No Railway, vá para **Settings > Domains**
2. Clique em "Custom Domain"
3. Adicione seu domínio
4. Configure os registros DNS conforme instruído
5. Atualize `NEXT_PUBLIC_APP_URL` com seu domínio personalizado

## 4. Atualizar Configurações do Supabase

No dashboard do Supabase:

1. Vá para **Authentication > URL Configuration**
2. Atualize as **Redirect URLs**:
   - Adicione: `https://your-app.railway.app/auth/callback`
   - Ou seu domínio personalizado: `https://yourdomain.com/auth/callback`

3. Atualize a **Site URL**:
   - Para: `https://your-app.railway.app`
   - Ou seu domínio personalizado

## 5. Verificar Deploy

1. Railway fará o build e deploy automaticamente
2. Verifique os logs em **Deployments** para erros
3. Teste a aplicação na URL gerada
4. Verifique se a autenticação está funcionando

## 6. Configurações de Produção

### Segurança
- Todas as variáveis sensíveis devem estar nas variáveis de ambiente
- Nunca commite chaves de API no código
- Use HTTPS em produção (Railway fornece automaticamente)

### Performance
- Railway usa CDN automaticamente
- Next.js otimizações estão habilitadas
- Imagens são otimizadas automaticamente

### Monitoramento
- Use os logs do Railway para debugging
- Configure alertas se necessário
- Monitore uso de recursos

## 7. Atualizações

Para atualizar a aplicação:

1. Faça push das mudanças para o repositório
2. Railway detectará e fará redeploy automaticamente
3. Monitore os logs durante o deploy

## 8. Rollback

Se algo der errado:

1. Vá para **Deployments** no Railway
2. Encontre um deploy anterior que funcionava
3. Clique em "Redeploy" nesse deploy

## Troubleshooting

### Build Failures
- Verifique os logs de build no Railway
- Certifique-se que todas as dependências estão no package.json
- Verifique se as variáveis de ambiente estão configuradas

### Runtime Errors
- Verifique os logs de runtime
- Teste localmente com as mesmas variáveis de ambiente
- Verifique se as URLs do Supabase estão corretas

### Authentication Issues
- Verifique se as Redirect URLs estão configuradas no Supabase
- Confirme que a Site URL está correta
- Teste o fluxo de autenticação passo a passo

### Environment Variables
- Variáveis que começam com `NEXT_PUBLIC_` são expostas no client
- Variáveis sem esse prefixo são apenas server-side
- Reinicie o serviço após alterar variáveis de ambiente