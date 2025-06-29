# 🧪 Guia de Testes - HomyFlix API

Este guia explica como configurar e executar testes no ambiente Docker do HomyFlix.

## 📋 Índice

- [Configuração do Ambiente](#configuração-do-ambiente)
- [Estrutura de Testes](#estrutura-de-testes)
- [Executando Testes](#executando-testes)
- [Comandos Make](#comandos-make)
- [Configurações Específicas](#configurações-específicas)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Configuração do Ambiente

### 1. Arquivos de Configuração

O ambiente de teste utiliza os seguintes arquivos:

- **`.env.testing`** - Variáveis de ambiente específicas para testes
- **`phpunit.xml`** - Configuração do PHPUnit
- **`docker/docker-compose.test.yml`** - Docker Compose para ambiente de teste
- **`docker/postgres/init-test-db.sql`** - Script de inicialização do banco de teste

### 2. Banco de Dados de Teste

- **Banco separado**: `homyflix_test`
- **Container dedicado**: `homyflix-postgres-test` (porta 5433)
- **Configuração automática**: Script de inicialização cria o banco automaticamente

### 3. Estrutura do Banco

```
PostgreSQL Container:
├── homyflix (banco principal - porta 5432)
└── homyflix_test (banco de teste - porta 5433)
```

---

## 📁 Estrutura de Testes

```
tests/
├── Feature/           # Testes de integração/endpoint
│   ├── Auth/         # Testes de autenticação
│   ├── MovieApiTest.php
│   └── UserProfileTest.php
├── Unit/             # Testes unitários
│   ├── Application/  # Testes de Use Cases
│   ├── Domain/       # Testes de Domain Services
│   └── Infrastructure/
├── TestCase.php      # Classe base para testes
└── CreatesApplication.php
```

### Classe Base TestCase

A classe `TestCase` fornece:

- ✅ Configuração automática do ambiente de teste
- ✅ Conexão com banco PostgreSQL de teste
- ✅ Transações automáticas (rollback após cada teste)
- ✅ Helpers para autenticação JWT
- ✅ Métodos utilitários para requisições API

---

## 🚀 Executando Testes

### Opção 1: Usando Make (Recomendado)

```bash
# Ver todos os comandos disponíveis
make help

# Executar todos os testes
make test

# Executar apenas testes unitários
make test-unit

# Executar apenas testes de feature
make test-feature

# Executar testes com coverage
make test-coverage

# Configurar ambiente dedicado para testes
make test-env-up
make test-env-run
make test-env-down
```

### Opção 2: Docker Compose Direto

```bash
# Executar no container principal
docker-compose exec homyflix-api ./docker/scripts/run-tests.sh

# Executar testes específicos
docker-compose exec homyflix-api ./docker/scripts/run-tests.sh --testsuite=Unit
docker-compose exec homyflix-api ./docker/scripts/run-tests.sh --filter=MovieTest
```

### Opção 3: PHPUnit Direto

```bash
# Acessar o container
docker-compose exec homyflix-api bash

# Dentro do container
vendor/bin/phpunit
vendor/bin/phpunit --testsuite=Unit
vendor/bin/phpunit --filter=test_can_create_movie
```

---

## 🛠️ Comandos Make Detalhados

### Comandos de Ambiente

```bash
make up              # Subir ambiente de desenvolvimento
make down            # Parar ambiente
make shell           # Acessar shell do container
make logs            # Ver logs da API
```

### Comandos de Banco de Dados

```bash
make migrate         # Executar migrations
make migrate-fresh   # Recriar banco
make seed           # Executar seeders
make reset-db       # Resetar banco com seeders
```

### Comandos de Teste

```bash
make test           # Todos os testes
make test-unit      # Testes unitários
make test-feature   # Testes de feature
make test-coverage  # Testes com coverage
make test-watch     # Modo watch (observa mudanças)
make test-parallel  # Execução paralela
```

### Comandos de Ambiente de Teste Dedicado

```bash
make test-env-up    # Subir ambiente só para testes
make test-env-down  # Parar ambiente de teste
make test-env-shell # Shell no container de teste
make test-env-run   # Executar testes no ambiente dedicado
```

### Comandos de Limpeza

```bash
make clean          # Limpar cache da aplicação
make clean-all      # Limpeza completa (containers, volumes)
```

---

## ⚙️ Configurações Específicas

### Variáveis de Ambiente (.env.testing)

```env
APP_ENV=testing
APP_DEBUG=false
DB_DATABASE=homyflix_test
CACHE_STORE=array
SESSION_DRIVER=array
MAIL_MAILER=array
QUEUE_CONNECTION=sync
BCRYPT_ROUNDS=4
LOG_LEVEL=error
```

### PHPUnit (phpunit.xml)

- ✅ Configurado para PostgreSQL
- ✅ Transações automáticas
- ✅ Cache em array
- ✅ Otimizações de performance

### TestCase Helpers

```php
// Criar usuário autenticado
$user = $this->createAuthenticatedUser();

// Fazer requisição autenticada
$response = $this->authenticatedJson('POST', '/api/movies', $data);

// Criar token JWT
$token = $this->createJwtTokenForUser($user);

// Headers para API
$headers = $this->getApiHeaders($token);
```

---

## 🔍 Exemplos de Uso

### 1. Teste de Feature (API)

```php
use Tests\TestCase;

class MovieApiTest extends TestCase
{
    /** @test */
    public function user_can_create_movie()
    {
        // Arrange
        $movieData = [
            'titulo' => 'Test Movie',
            'ano_lancamento' => 2023,
            'genero' => 'Action',
            'sinopse' => 'Test synopsis'
        ];

        // Act
        $response = $this->authenticatedJson('POST', '/api/movies', $movieData);

        // Assert
        $response->assertStatus(201)
                ->assertJsonStructure(['data' => ['id', 'titulo']]);
        
        $this->assertDatabaseHas('movies', ['titulo' => 'Test Movie']);
    }
}
```

### 2. Teste Unitário (Use Case)

```php
use Tests\TestCase;
use App\Application\Movie\UseCases\CreateMovieUseCase;

class CreateMovieUseCaseTest extends TestCase
{
    /** @test */
    public function it_creates_movie_successfully()
    {
        // Arrange
        $user = $this->createAuthenticatedUser();
        $useCase = app(CreateMovieUseCase::class);
        $dto = new CreateMovieDTO(/* ... */);

        // Act
        $result = $useCase->execute($dto, $user->id);

        // Assert
        $this->assertInstanceOf(Movie::class, $result);
        $this->assertEquals('Test Movie', $result->titulo);
    }
}
```

---

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Banco de dados não encontrado

```bash
# Recriar banco de teste
make test-env-down
make test-env-up
```

#### 2. Permissões de arquivo

```bash
# Corrigir permissões dos scripts
chmod +x homyflix-api/docker/scripts/*.sh
```

#### 3. Container não inicia

```bash
# Verificar logs
docker-compose logs homyflix-api

# Reconstruir containers
docker-compose down
docker-compose up --build
```

#### 4. Migrations falham

```bash
# Acessar container e verificar conexão
docker-compose exec homyflix-api bash
php artisan migrate:status --env=testing
```

#### 5. Testes não encontram banco

Verificar se as variáveis de ambiente estão corretas:

```bash
# Dentro do container
env | grep DB_
```

### Comandos de Debug

```bash
# Verificar status dos containers
docker-compose ps

# Verificar conexão com banco
docker-compose exec homyflix-api pg_isready -h postgres -p 5432 -U homyflix

# Verificar banco de teste
docker-compose exec postgres psql -U homyflix -d postgres -c "\l"
```

---

## 📊 Coverage de Testes

### Executar com Coverage

```bash
# Coverage HTML
make test-coverage

# Coverage XML (para CI/CD)
docker-compose exec homyflix-api vendor/bin/phpunit --coverage-xml coverage-xml
```

### Visualizar Coverage

```bash
# Abrir relatório HTML
open coverage/index.html
```

---

## 🔄 CI/CD

### Exemplo para GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Run tests
        run: |
          cd homyflix-api
          make ci-test
```

---

## 📝 Próximos Passos

1. **Criar testes específicos** para cada Use Case
2. **Implementar testes de integração** para APIs
3. **Configurar coverage** mínimo obrigatório
4. **Adicionar testes de performance**
5. **Implementar testes E2E**

---

## 🆘 Suporte

Para dúvidas sobre testes:

1. Verificar logs: `make logs`
2. Acessar container: `make shell`
3. Executar debug: `php artisan tinker`
4. Verificar configurações: `php artisan config:show`

---

✅ **Ambiente de testes configurado e pronto para uso!** 