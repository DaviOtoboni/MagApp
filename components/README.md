# Componentes

## DashboardNavbar

Um componente de navbar fixa para o dashboard com funcionalidades de pesquisa global e gerenciamento de usuário.

### Características

- **Navbar Fixa**: Posicionada no topo da página com `position: fixed`
- **Responsiva**: Adapta-se a diferentes tamanhos de tela (mobile-first)
- **Barra de Pesquisa Global**: Permite pesquisar por animes, mangás e jogos
- **Perfil do Usuário**: Menu dropdown com opções de perfil, configurações e logout
- **Acessibilidade**: Inclui textos alternativos e navegação por teclado

### Uso

```tsx
import { DashboardNavbar } from '@/components/DashboardNavbar'

export default function MinhaPagina() {
  return (
    <div>
      <DashboardNavbar />
      {/* Conteúdo da página com padding-top para acomodar a navbar */}
      <div className="pt-16">
        {/* Seu conteúdo aqui */}
      </div>
    </div>
  )
}
```

### Funcionalidades

#### Barra de Pesquisa
- Pesquisa em tempo real com resultados filtrados
- Autocomplete com sugestões
- Navegação por teclado (ESC para fechar)
- Fechamento automático ao clicar fora

#### Perfil do Usuário
- Avatar com fallback para iniciais
- Menu dropdown responsivo
- Opções: Perfil, Configurações, Logout
- Integração com o hook `useAuth`

#### Responsividade
- **Desktop**: Barra de pesquisa sempre visível
- **Mobile**: Botão de pesquisa que abre overlay
- Layout adaptativo para diferentes tamanhos de tela

### Personalização

O componente usa as variáveis CSS do tema:
- `--primary`: Cor principal para mangás
- `--accent`: Cor de destaque para animes
- `--background`: Cor de fundo da navbar
- `--border`: Cor da borda inferior

### Dependências

- `@/hooks/useAuth` - Para autenticação do usuário
- `@/components/ui/*` - Componentes de UI (Button, Input, Avatar, etc.)
- `lucide-react` - Ícones
- `@/lib/utils` - Função utilitária `cn` para classes CSS
