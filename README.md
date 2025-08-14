# MagApp

Uma aplicação Next.js moderna com TypeScript, Tailwind CSS e Radix UI.

## 🚀 Deploy no Railway

Este projeto está configurado para deploy automático no Railway.

### Pré-requisitos
- Conta no [Railway](https://railway.app)
- Repositório no GitHub

### Passos para Deploy

1. **Conecte seu repositório ao Railway:**
   - Acesse [railway.app](https://railway.app)
   - Faça login com sua conta GitHub
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha este repositório

2. **Configuração automática:**
   - O Railway detectará automaticamente que é um projeto Next.js
   - As configurações estão no arquivo `railway.json`

3. **Variáveis de ambiente (se necessário):**
   - Configure as variáveis no painel do Railway
   - Use o arquivo `.env.example` como referência

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
pnpm install

# Executar em modo desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Executar build de produção
pnpm start
```

## 📦 Tecnologias

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- React Hook Form
- Zod