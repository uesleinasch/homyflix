# Arquitetura de Gerenciamento de Estado

## Visão Geral

Este projeto implementa uma arquitetura de gerenciamento de estado seguindo padrões enterprise com separação clara de responsabilidades.

## Estrutura

### 1. **Services Layer** (`/core/services/`)
- Responsável por toda comunicação com a API
- Encapsula a lógica de chamadas HTTP
- Trata erros de forma centralizada
- Exemplo: `movieService.ts`

### 2. **Redux Slices** (`/store/slices/`)
- Gerencia apenas o estado da aplicação
- Usa os services para operações assíncronas
- Define actions, reducers e selectors
- Exemplo: `movieSlice.ts`

### 3. **Custom Hooks** (`/hooks/`)
- Encapsula a lógica de uso do Redux
- Fornece interface simplificada para componentes
- Gerencia loading states adicionais
- Exemplo: `useMovieOperations.ts`

### 4. **Components**
- Focados apenas em UI e apresentação
- Usam hooks customizados para lógica
- Implementam memoization para performance

## Fluxo de Dados

```
Component → Custom Hook → Redux Action → Service → API
    ↑                                                 ↓
    └──────── Redux State ← Reducer ← Response ←─────┘
```

## Exemplo de Uso

```typescript
// No componente
import { useMovieOperations } from '../hooks/useMovieOperations';

const MovieList = () => {
  const { movies, loading, error, loadMovies } = useMovieOperations();
  
  useEffect(() => {
    loadMovies();
  }, [loadMovies]);
  
  // Renderizar UI baseado no estado
};
```

## Benefícios

1. **Separação de Responsabilidades**: Cada camada tem uma responsabilidade única
2. **Testabilidade**: Cada parte pode ser testada isoladamente
3. **Manutenibilidade**: Mudanças na API não afetam componentes
4. **Reutilização**: Services e hooks podem ser usados em múltiplos lugares
5. **Type Safety**: TypeScript em todas as camadas

## Padrões Implementados

- **Service Layer Pattern**: Abstração da comunicação com API
- **Repository Pattern** (no backend): Abstração do acesso a dados
- **Custom Hooks**: Encapsulamento de lógica complexa
- **Selector Pattern**: Acesso otimizado ao estado
- **Error Boundary Pattern**: Tratamento de erros em componentes 