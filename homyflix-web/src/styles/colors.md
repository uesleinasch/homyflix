# 🎨 Paleta de Cores - Homyflix

## Visão Geral

A paleta de cores do Homyflix foi construída com base na cor primária `#ff8c00` (laranja vibrante), criando um sistema de design consistente e acessível.

## 🎯 Cores Principais

### Primária (Laranja)
- **Base**: `#ff8c00` - `var(--primary-500)`
- **Uso**: Botões principais, links, elementos de destaque
- **Variações**: `--primary-50` até `--primary-950`

### Secundária (Azul)
- **Base**: `#3b82f6` - `var(--secondary-500)`
- **Uso**: Botões secundários, informações, elementos complementares
- **Variações**: `--secondary-50` até `--secondary-950`

### Neutras (Cinza)
- **Base**: `#71717a` - `var(--neutral-500)`
- **Uso**: Textos, bordas, backgrounds
- **Variações**: `--neutral-50` até `--neutral-950`

## 🚦 Cores de Estado

| Estado | Cor | Variável | Uso |
|--------|-----|----------|-----|
| Sucesso | `#22c55e` | `var(--success-500)` | Mensagens de sucesso, confirmações |
| Aviso | `#f59e0b` | `var(--warning-500)` | Alertas, avisos importantes |
| Erro | `#ef4444` | `var(--error-500)` | Erros, validações falhas |
| Informação | `#3b82f6` | `var(--info-500)` | Dicas, informações gerais |

## 🎨 Cores Semânticas

### Texto
```css
var(--text-primary)    /* Texto principal - escuro */
var(--text-secondary)  /* Texto secundário - médio */
var(--text-tertiary)   /* Texto terciário - claro */
var(--text-inverse)    /* Texto invertido - branco */
var(--text-disabled)   /* Texto desabilitado */
```

### Background
```css
var(--bg-primary)      /* Background principal - branco/escuro */
var(--bg-secondary)    /* Background secundário */
var(--bg-tertiary)     /* Background terciário */
var(--bg-inverse)      /* Background invertido */
var(--bg-overlay)      /* Overlay transparente */
```

### Bordas
```css
var(--border-primary)   /* Borda padrão */
var(--border-secondary) /* Borda secundária */
var(--border-focus)     /* Borda em foco */
var(--border-error)     /* Borda de erro */
```

## 🔘 Cores de Botões

### Botão Primário
```css
background: var(--btn-primary-bg);      /* #ff8c00 */
color: var(--btn-primary-text);         /* white */

/* Estados */
:hover { background: var(--btn-primary-hover); }    /* #ea580c */
:active { background: var(--btn-primary-active); }  /* #c2410c */
```

### Botão Secundário
```css
background: var(--btn-secondary-bg);    /* #3b82f6 */
color: var(--btn-secondary-text);       /* white */
```

### Botão Outline
```css
background: var(--btn-outline-bg);      /* transparent */
border: 1px solid var(--btn-outline-border); /* #ff8c00 */
color: var(--btn-outline-text);         /* #ff8c00 */
```

### Botão Ghost
```css
background: var(--btn-ghost-bg);        /* transparent */
color: var(--btn-ghost-text);           /* #3f3f46 */
```

## 📱 Cores Específicas do Homyflix

```css
var(--movie-card-bg)     /* Background dos cards de filme */
var(--movie-card-hover)  /* Hover dos cards de filme */
var(--movie-rating)      /* Cor da avaliação dos filmes */
var(--movie-genre)       /* Cor dos gêneros dos filmes */
```

## 🌈 Gradientes

```css
var(--gradient-primary)    /* Gradiente laranja */
var(--gradient-secondary)  /* Gradiente azul */
var(--gradient-hero)       /* Gradiente hero (laranja → azul) */
var(--gradient-overlay)    /* Gradiente overlay escuro */
```

## 🌑 Dark Mode

O sistema suporta dark mode automático e manual:

```css
/* Automático baseado na preferência do sistema */
@media (prefers-color-scheme: dark) { ... }

/* Manual */
.dark { ... }   /* Força dark mode */
.light { ... }  /* Força light mode */
```

## 🛠️ Classes Utilitárias

### Texto
```css
.text-primary     /* Cor de texto principal */
.text-secondary   /* Cor de texto secundário */
.text-brand       /* Cor da marca (#ff8c00) */
.text-success     /* Texto verde */
.text-warning     /* Texto amarelo */
.text-error       /* Texto vermelho */
```

### Background
```css
.bg-primary       /* Background principal */
.bg-brand         /* Background da marca */
.bg-brand-light   /* Background da marca claro */
.bg-success       /* Background verde */
.bg-warning       /* Background amarelo */
.bg-error         /* Background vermelho */
```

### Bordas
```css
.border-primary   /* Borda padrão */
.border-brand     /* Borda da marca */
.border-success   /* Borda verde */
.border-error     /* Borda vermelha */
```

### Efeitos
```css
.gradient-primary   /* Gradiente primário */
.gradient-hero      /* Gradiente hero */
.shadow-sm          /* Sombra pequena */
.shadow-md          /* Sombra média */
.shadow-lg          /* Sombra grande */
.shadow-primary     /* Sombra com cor primária */
```

## 📖 Exemplos de Uso

### Botão Primário
```jsx
<button className="bg-brand text-white hover:bg-primary-600 px-4 py-2 rounded">
  Assistir Filme
</button>
```

### Card de Filme
```jsx
<div className="bg-white border border-primary shadow-md rounded-lg overflow-hidden hover:shadow-lg">
  <div className="p-4">
    <h3 className="text-primary font-bold">Título do Filme</h3>
    <p className="text-secondary">Descrição...</p>
    <span className="text-warning">★ 4.5</span>
  </div>
</div>
```

### Formulário
```jsx
<input 
  className="border border-primary focus:border-focus bg-white text-primary"
  style={{
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--input-border)',
    color: 'var(--input-text)'
  }}
/>
```

## ♿ Acessibilidade

- Todas as cores atendem aos padrões WCAG 2.1 AA
- Contraste mínimo de 4.5:1 para texto normal
- Contraste mínimo de 3:1 para texto grande
- Suporte completo a dark mode
- Cores não são o único meio de transmitir informação

## 🎨 Ferramentas Recomendadas

- **Contrast Checker**: Para verificar acessibilidade
- **Color Oracle**: Para simular daltonismo
- **DevTools**: Para testar em diferentes dispositivos

---

**💡 Dica**: Use sempre as variáveis CSS ao invés de valores hardcoded para manter consistência e facilitar manutenção! 