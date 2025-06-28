# Mapeamento Frontend-Backend

## Visão Geral

Este documento descreve o mapeamento entre o frontend React e o backend Laravel da aplicação Homyflix.

## Endpoints da API

### Autenticação

#### POST /api/auth/login
**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "token_type": "bearer",
  "expires_in": 3600
}
```
**Nota:** O backend NÃO retorna os dados do usuário no login.

#### POST /api/auth/register
**Request:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "password_confirmation": "string"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "string",
  "email": "string",
  "created_at": "2024-01-01T00:00:00.000000Z",
  "updated_at": "2024-01-01T00:00:00.000000Z"
}
```
**Nota:** O register retorna o usuário criado, mas NÃO retorna o token. É necessário fazer login após o registro.

### Movies

#### GET /api/movies
**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "string",
      "release_year": 2024,
      "genre": "string",
      "synopsis": "string",
      "poster_url": "string|null",
      "created_at": "2024-01-01 00:00:00",
      "updated_at": "2024-01-01 00:00:00"
    }
  ],
  "links": {...},
  "meta": {...}
}
```

#### POST /api/movies
**Request:**
```json
{
  "title": "string (max: 255)",
  "release_year": "integer (min: 1888)",
  "genre": "string (max: 100)",
  "synopsis": "string",
  "poster_url": "string|null (url válida)"
}
```

**Response:** Mesmo formato de um filme individual

## Diferenças Importantes

### 1. Campos do Movie

**Backend tem:**
- title
- release_year
- genre
- synopsis
- poster_url
- user_id (adicionado automaticamente)
- created_at
- updated_at

**Frontend removeu (não existem no backend):**
- director
- duration_in_minutes

### 2. Autenticação

- O backend não tem endpoint `/auth/me` para buscar dados do usuário atual
- O login retorna apenas o token, não os dados do usuário
- O register retorna o usuário mas não o token
- O frontend armazena os dados do usuário no localStorage após o registro

### 3. Tipos de Dados

- `release_year`: Backend pode retornar como string, frontend converte para number
- `poster_url`: Pode ser null no backend
- Datas são retornadas como strings no formato ISO

## Configuração de Ambiente

O frontend precisa da seguinte variável de ambiente:

```
VITE_API_URL=http://localhost:8000/api
```

## Headers Necessários

Todas as requisições autenticadas devem incluir:
```
Authorization: Bearer {token}
```

## Tratamento de Erros

O backend retorna erros no formato:
```json
{
  "success": false,
  "message": "Mensagem de erro",
  "errors": {
    "campo": ["erro 1", "erro 2"]
  }
}
``` 