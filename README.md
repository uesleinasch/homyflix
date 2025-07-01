# Teste técnico JACTO
Este é um projeto exclusivamente para fins de testes técnico mas sinta-se libre para usar como desejar. Você encontrara uma API simples e um front responsivo e intuitivo  para gerenciamento de filmes.

## Como rodar o ambiente 

### 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Docker** (versão 20.10 ou superior)
- **Docker Compose** (versão 2.0 ou superior)
- **Git** para clonar o repositório

### 🚀 Passo a Passo Completo

#### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd homyflix
```

#### 2. Configuração do Backend (API Laravel)

**2.1. Navegue para o diretório da API:**
```bash
cd homyflix-api
```

**2.2. Configure o arquivo de ambiente:**
```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

**2.3. Configure as variáveis de ambiente no arquivo `.env`:**
```env
APP_NAME=HomyFlix
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=homyflix
DB_USERNAME=homyflix
DB_PASSWORD=password

JWT_SECRET=


LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=debug

SESSION_DRIVER=database
SESSION_LIFETIME=120

CACHE_STORE=database

QUEUE_CONNECTION=database

MAIL_MAILER=log
MAIL_FROM_ADDRESS="hello@homyflix.com"
MAIL_FROM_NAME="${APP_NAME}"

VITE_APP_NAME="${APP_NAME}"
```

#### 3. Configuração do Frontend (React)

**3.1. Navegue para o diretório do frontend:**
```bash
cd ../homyflix-web
```

**3.2. Configure o arquivo de ambiente:**
```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

**3.3. Configure a URL da API no arquivo `.env`:**
```env
VITE_API_URL=http://localhost:8000/api
```

#### 4. Subindo o Ambiente com Docker

**4.1. Volte para o diretório raiz do projeto:**
```bash
cd ..
```

**4.2. Suba todos os serviços com Docker Compose:**
```bash
docker compose up -d
```


### 🎯 Acessando a Aplicação

Após seguir todos os passos, você poderá acessar:

- **Frontend:** http://localhost:5173
- **API:** http://localhost:8000
- **🗄️ PostgreSQL:** localhost:5432
  - Database: `homyflix`
  - Username: `homyflix`
  - Password: `password`

### 📝 Comandos Úteis

#### Parar o ambiente:
```bash
docker compose down
```

#### Resetar banco de dados:
```bash
# Recriar todas as tabelas
docker compose exec homyflix-api php artisan migrate:fresh

# Recriar e popular com dados iniciais
docker compose exec homyflix-api php artisan migrate:fresh --seed
```

#### Executar testes:
```bash
# Testes da API
docker compose exec homyflix-api php artisan test

# Testes do Frontend
docker compose exec homyflix-web npm test
```

## Como rodar o ambiente com Makefile

O projeto incluí um Makefile completo que facilita o gerenciamento do ambiente de desenvolvimento. Abaixo estão as instruções para usar tanto no **Linux** quanto no **Windows**.

### 📋 Pré-requisitos para Makefile

#### Linux (Ubuntu/Debian)
```bash
# Instalar make (se não estiver instalado)
sudo apt update
sudo apt install make

# Verificar se make está instalado
make --version
```

#### Windows

**Opção 1: Windows Subsystem for Linux (WSL) - Recomendado**
```bash
# 1. Instalar WSL2
wsl --install

# 2. Abrir terminal WSL
# 3. Instalar make no Ubuntu WSL
sudo apt update
sudo apt install make

# 4. Navegar para o projeto
cd /mnt/c/caminho/para/homyflix
```

**Opção 2: Git Bash (já inclui make)**
```bash
cd /c/caminho/para/homyflix
```


### 🚀 Comandos do Makefile

#### Ajuda e Informações
```bash
# Ver todos os comandos disponíveis
make help
```

#### 🏁 Setup Inicial Completo
```bash
# Linux/WSL/Git Bash
make dev-setup

# Este comando faz tudo automaticamente é tipo um god.
```

#### 🚀 Comandos Principais

```bash
# Subir todo o ambiente (API + Frontend + Banco)
make up

# Parar todo o ambiente
make down

# Instalar todas as dependências
make install

# Ambiente completamente novo (reset total)
make fresh
```

#### 🗄️ Comandos de Banco de Dados

```bash
# Executar migrations
make migrate

# Recriar banco do zero
make migrate-fresh

# Popular banco com dados de exemplo
make seed

# Reset completo do banco com dados
make reset-db
```

## Estrutura Front-end

O frontend foi desenvolvido com o **Vite**, **React 19** + **TypeScript** 

### 🏗️ **Visão Geral da Arquitetura Frontend**

A aplicação segue uma **arquitetura em camadas** com **separação clara de responsabilidades**:
```
┌─────────────────────────────────────────────────────────────┐
│                    🎨 PRESENTATION LAYER                     │
│              (Pages, Components, Layout)                    │
├─────────────────────────────────────────────────────────────┤
│                   🔄 APPLICATION LAYER                       │
│          (Redux Store, Custom Hooks, Services)              │
├─────────────────────────────────────────────────────────────┤
│                    🌐 INFRASTRUCTURE LAYER                   │
│            (API Services, External Libraries)               │
├─────────────────────────────────────────────────────────────┤
│                   🛠️ SHARED/CORE LAYER                      │
│        (Types, Utils, Shared Components, Auth)              │
└─────────────────────────────────────────────────────────────┘
```

#

### 🎯 **Stack**

```json
{
  "frontend": {
    "core": ["React 19", "TypeScript", "Vite"],
    "state": ["Redux Toolkit", "React-Redux"],
    "routing": ["React Router DOM v7"],
    "ui": ["Mantine UI v8", "CSS Modules"],
    "forms": ["React Hook Form", "Zod"],
    "http": ["Axios"],
    "testing": ["Jest", "React Testing Library"],
  }
}
```

### 🏛️ **Padrões Arquiteturais Frontend**

#### **1. Feature-Based Architecture**
Cada funcionalidade (movies, auth, profile) tem sua própria estrutura:
```bash
pages/movies/
├── createMovie/
│   ├── CreateMovie.tsx         
│   ├── style.module.css       
│   ├── createMovie.d.ts       
│   └── __test__/               
├── listMovies/
│   ├── listMovies.tsx
│   └── Components/            
│       ├── movieFilters/
│       └── movieItem/
└── schema/
    └── CreateMovieSchema.ts  
```


## Estrutura backend

O backend do **HomyFlix** foi feito com princípios de **Domain-Driven Design (DDD)** e **Clean Architecture**, com algumas adaptações.

### 🏗️ **Visão Geral da Arquitetura**

O sistema é em **4 camadas principais** que é basicamente o princípio de **Dependency Inversion**:

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 INTERFACE LAYER                        │
│              (Controllers, Requests, Resources)             │
├─────────────────────────────────────────────────────────────┤
│                   📱 APPLICATION LAYER                       │
│               (Use Cases, DTOs, App Services)               │
├─────────────────────────────────────────────────────────────┤
│                    🏛️ DOMAIN LAYER                          │
│        (Entities, Value Objects, Domain Services)           │
├─────────────────────────────────────────────────────────────┤
│                 🏗️ INFRASTRUCTURE LAYER                     │
│           (Repositories, External Services, DB)             │
└─────────────────────────────────────────────────────────────┘
```

### 📋 **Estrutura de Diretórios**

```bash
homyflix-api/app/
├── 🌐 Interface/           # Camada de Interface
│   ├── Http/Controllers/Api/
│   ├── Http/Requests/
│   ├── Http/Resources/
│   └── Http/Middleware/
│
├── 📱 Application/         # Camada de Aplicação
│   ├── Auth/
│   │   ├── DTOs/
│   │   └── UseCases/
│   ├── Movie/
│   │   ├── DTOs/
│   │   ├── Services/
│   │   └── UseCases/
│   └── User/
│       ├── DTOs/
│       └── UseCases/
│
├── 🏛️ Domain/             # Camada de Domínio
│   ├── Auth/Contracts/
│   ├── Movie/
│   │   ├── Contracts/
│   │   ├── Exceptions/
│   │   └── Services/
│   └── User/
│       ├── Contracts/
│       └── Exceptions/
│
├── 🏗️ Infrastructure/     # Camada de Infraestrutura
│   ├── Auth/
│   ├── Movie/Repositories/
│   └── Persistence/Eloquent/
│
└── 📊 Models/             # Modelos Eloquent
    ├── Movie.php
    └── User.php
```

## Project Figma

[VER NO FIGMA](https://www.figma.com/proto/f4iyS7ymzd6D8eF9wwvTgt/HoMyFlx?node-id=127-154&t=y6MEtb4Hn3DGyU4L-1&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=127%3A105&show-proto-sidebar=1)

## Projeto GIT

[VER NO GIT](https://github.com/users/uesleinasch/projects/15)
https://github.com/users/uesleinasch/projects/15



## Funcionalidades

### 🎬 **API**

#### **🔐 Autenticação & Usuários**
- **Login** - Autenticação via email/senha com JWT
- **Registro** - Criação de nova conta de usuário  
- **Logout** - Invalidação segura do token JWT
- **Refresh Token** - Renovação automática de tokens expirados
- **Perfil do Usuário** - Visualização e edição de dados pessoais

#### **🎥 Gerenciamento de Filmes (CRUD Completo)**
- **Listar Filmes** - Busca paginada dos filmes do usuário logado
- **Detalhes do Filme** - Visualização completa de um filme específico
- **Criar Filme** - Cadastro de novo filme com validações
- **Editar Filme** - Atualização de dados de filme existente
- **Excluir Filme** - Remoção permanente de filme

#### **Segurança & Validações**
- **Middleware JWT** - Proteção de rotas autenticadas
- **Validação de Dados** - Form Requests com regras específicas
- **Isolamento por Usuário** - Cada usuário vê apenas seus filmes
- **Tratamento de Erros** - Respostas consistentes em JSON

### **Frontend**

#### **Autenticação & Onboarding**
- **Tela de Login** - Interface responsiva com validação de formulário
- **Tela de Registro** - Cadastro com confirmação de senha
- **Logout Automático** - Redirecionamento em caso de token expirado
- **Rotas Protegidas** - Controle de acesso baseado em autenticação

#### **Gerenciamento de Filmes**
- **Lista de Filmes** - Grid responsivo com todos os filmes do usuário
- **Filtros Avançados** - Busca por título, gênero, ano de lançamento
- **Detalhes do Filme** - Página dedicada com efeitos parallax
- **Criar/Editar Filme** - Formulário inteligente que detecta modo edição
- **Preview de Poster** - Carregamento e validação de URLs de imagem
- **Exclusão Confirmada** - Modal de confirmação antes de excluir

#### **Perfil & Configurações**
- **Página de Perfil** - Visualização e edição de dados pessoais
- **Alteração de Senha** - Formulário seguro para mudança de senha
- **Configurações** - Alternância entre tema claro/escuro
- **Preferências** - Salvamento de configurações no localStorage

#### **UX/UI Avançada**
- **Tema Duplo** - Suporte completo a modo claro/escuro
- **Loading States** - Indicadores visuais durante carregamentos
- **Notificações** - Sistema de feedback para ações do usuário
- **Design Responsivo** - Interface adaptável para mobile/tablet/desktop
- **Animações Suaves** - Transições CSS e efeitos visuais
- **Tratamento de Erros** - Mensagens amigáveis para diferentes cenários

#### **Performance & Estado**
- **Redux Store** - Gerenciamento global de estado
- **Cache Inteligente** - Dados persistidos para melhor performance
- **Lazy Loading** - Carregamento otimizado de componentes
- **Validação Reativa** - Feedback instantâneo em formulários
