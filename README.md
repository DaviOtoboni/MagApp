# MagApp - Aplicação Completa com Autenticação Supabase

Uma aplicação moderna construída com Next.js 15, React 19 e Supabase, implementando autenticação completa com email/senha, gerenciamento de perfil e interface responsiva.

## 🚀 Funcionalidades

### Autenticação Completa
- ✅ Login com email e senha
- ✅ Cadastro de usuários
- ✅ Confirmação por email
- ✅ Reset de senha
- ✅ Logout seguro
- ✅ Gerenciamento de sessões

### Gerenciamento de Perfil
- ✅ Visualização de perfil
- ✅ Edição de informações pessoais
- ✅ Alteração de senha
- ✅ Upload de avatar (URL)

### Interface e UX
- ✅ Design responsivo
- ✅ Estados de loading
- ✅ Validação em tempo real
- ✅ Notificações toast
- ✅ Tratamento de erros
- ✅ Navegação condicional

### Segurança
- ✅ Row Level Security (RLS)
- ✅ Validação client/server-side
- ✅ Proteção de rotas
- ✅ Middleware de autenticação
- ✅ Senhas seguras

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **Forms**: React Hook Form + Zod
- **State**: React Context API
- **Notifications**: Sonner

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd MagApp
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure o ambiente**
```bash
cp .env.example .env.local
```

4. **Configure o Supabase**
- Siga o guia em `SUPABASE_SETUP.md`
- Execute a migração em `supabase/migrations/001_initial_schema.sql`
- Configure as variáveis de ambiente

5. **Valide a configuração**
```bash
pnpm run setup:supabase
```

6. **Execute o projeto**
```bash
pnpm dev
```

## 🔧 Configuração do Supabase

### 1. Criar Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote as credenciais (URL e chaves)

### 2. Configurar Autenticação
- Site URL: `http://localhost:3000` (dev)
- Redirect URLs: `http://localhost:3000/auth/callback`

### 3. Executar Migração
Execute o SQL em `supabase/migrations/001_initial_schema.sql` no SQL Editor

### 4. Configurar Templates de Email
- Confirm signup: `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup`
- Reset password: `{{ .SiteURL }}/auth/reset-password?token_hash={{ .TokenHash }}&type=recovery`

## 📁 Estrutura do Projeto

```
MagApp/
├── app/                          # App Router (Next.js 15)
│   ├── auth/                     # Páginas de autenticação
│   ├── dashboard/                # Dashboard protegido
│   ├── login/                    # Página de login
│   ├── profile/                  # Gerenciamento de perfil
│   └── register/                 # Página de cadastro
├── components/                   # Componentes React
│   ├── auth/                     # Componentes de autenticação
│   ├── layout/                   # Layout e navegação
│   ├── navigation/               # Navegação
│   ├── profile/                  # Componentes de perfil
│   └── ui/                       # Componentes base (shadcn/ui)
├── contexts/                     # React Contexts
│   └── AuthContext.tsx           # Context de autenticação
├── hooks/                        # Custom hooks
│   ├── useAuth.ts               # Hook de autenticação
│   ├── useSession.ts            # Hook de sessão
│   └── useUser.ts               # Hook de usuário
├── lib/                         # Utilitários
│   ├── auth/                    # Utilitários de auth
│   ├── errors/                  # Tratamento de erros
│   └── supabase/                # Configuração Supabase
├── supabase/                    # Migrações e schemas
│   └── migrations/              # Migrações SQL
├── types/                       # Definições TypeScript
│   ├── auth.ts                  # Tipos de autenticação
│   └── database.ts              # Tipos do banco
└── middleware.ts                # Middleware de proteção
```

## 🔐 Segurança

### Implementado
- Row Level Security (RLS) no Supabase
- Validação de entrada client/server-side
- Proteção CSRF via SameSite cookies
- Senhas com requisitos de segurança
- Sanitização de inputs
- Tratamento seguro de erros

### Recomendações para Produção
- Implementar 2FA
- Rate limiting adicional
- Monitoramento de segurança
- Auditoria de logs
- Backup regular

## 🧪 Testes

```bash
# Validar configuração
pnpm run setup:supabase

# Executar testes (quando implementados)
pnpm test

# Build para produção
pnpm build
```

## 📚 Documentação

- `SUPABASE_SETUP.md` - Guia completo de configuração
- `SUPABASE_QUICK_REFERENCE.md` - Referência rápida
- `SECURITY.md` - Diretrizes de segurança

## 🚀 Deploy

### Railway
1. Configure as variáveis de ambiente
2. Atualize URLs no Supabase
3. Deploy automático via Git

### Vercel
1. Conecte o repositório
2. Configure environment variables
3. Deploy automático

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

## 🆘 Suporte

- Documentação: Consulte os arquivos .md na raiz
- Issues: Use o sistema de issues do GitHub
- Supabase: [Documentação oficial](https://supabase.com/docs)

---

**Desenvolvido com ❤️ usando Next.js e Supabase**