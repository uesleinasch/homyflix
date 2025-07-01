# Makefile do HomyFlix
# Comandos para gerenciar todo o projeto (API + Frontend + Testes)

.PHONY: help install up down test test-unit test-feature test-coverage test-watch test-parallel test-env-up test-env-down test-env-shell test-env-run test-quick test-quick-unit test-quick-feature test-quick-coverage clean logs shell migrate seed

# Configurações
DOCKER_COMPOSE = docker compose
DOCKER_COMPOSE_TEST = docker compose -f docker-compose.test.yml
API_CONTAINER = homyflix-api
API_TEST_CONTAINER = homyflix-api-test
WEB_CONTAINER = homyflix-web

help: ## Mostrar esta ajuda
	@echo "🎬 HomyFlix - Teste JACTO - Sistema de Gerenciamento de Filmes. Semjam bem vindos pessoal. Espero que esse makefile seja útil para vocês."
	@echo ""
	@echo "🚀 Comandos Principais:"
	@echo "  up              Subir todo o ambiente (API + Frontend + DB)"
	@echo "  down            Parar todo o ambiente"
	@echo "  install         Instalar todas as dependências"
	@echo "  fresh           Ambiente completamente novo"
	@echo "  dev-setup       Setup inicial para desenvolvimento"
	@echo ""
	@echo "🗄️  Comandos de Banco de Dados:"
	@echo "  migrate         Executar migrations"
	@echo "  migrate-fresh   Recriar banco de dados"
	@echo "  seed            Executar seeders"
	@echo "  reset-db        Resetar banco com seeders"
	@echo ""
	@echo "🧪 Comandos de Teste:"
	@echo "  test            Executar todos os testes da API"
	@echo "  test-unit       Executar testes unitários"
	@echo "  test-feature    Executar testes de feature"
	@echo "  test-coverage   Executar testes com coverage"
	@echo "  test-watch      Executar testes em modo watch"
	@echo "  test-parallel   Executar testes em paralelo"
	@echo ""
	@echo "🔧 Ambiente de Teste Dedicado:"
	@echo "  test-env-up     Subir ambiente dedicado para testes"
	@echo "  test-env-down   Parar ambiente de testes"
	@echo "  test-env-shell  Acessar shell do container de teste"
	@echo "  test-env-run    Executar testes no ambiente dedicado"
	@echo ""
	@echo "🏃 Comandos Rápidos (com ambiente ativo):"
	@echo "  test-quick      Executar testes (assume ambiente ativo)"
	@echo "  test-quick-unit Executar testes unitários (assume ambiente ativo)"
	@echo ""
	@echo "📋 Comandos Específicos:"
	@echo "  shell           Acessar shell do container da API"
	@echo "  web-shell       Acessar shell do container do frontend"
	@echo "  logs            Ver logs de todos os serviços"
	@echo "  logs-api        Ver logs apenas da API"
	@echo "  logs-web        Ver logs apenas do frontend"
	@echo ""
	@echo "🧹 Comandos de Limpeza:"
	@echo "  clean           Limpar cache da aplicação"
	@echo "  clean-all       Limpeza completa (containers, volumes)"
	@echo ""
	@echo "⚡ Comandos de Qualidade:"
	@echo "  lint            Executar PHP CS Fixer"
	@echo "  phpstan         Executar PHPStan"
	@echo "  format          Formatar código"
	@echo ""
	@echo "🚀 Comandos de CI/CD:"
	@echo "  ci-test         Executar testes para CI/CD"
	@echo ""

# =====================================
# 🚀 COMANDOS PRINCIPAIS
# =====================================

up: ## Subir todo o ambiente
	$(DOCKER_COMPOSE) up -d
	@echo "✅ Ambiente completo rodando!"
	@echo "🔗 API: http://localhost:8000"
	@echo "🔗 Frontend: http://localhost:5173"
	@echo "🗄️ PostgreSQL: localhost:5432"

down: ## Parar todo o ambiente
	$(DOCKER_COMPOSE) down
	$(DOCKER_COMPOSE_TEST) down 2>/dev/null || true

install: ## Instalar todas as dependências
	$(DOCKER_COMPOSE) run --rm $(API_CONTAINER) composer install
	$(DOCKER_COMPOSE) run --rm $(API_CONTAINER) php artisan key:generate
	$(DOCKER_COMPOSE) run --rm $(API_CONTAINER) php artisan jwt:secret
	$(DOCKER_COMPOSE) exec $(WEB_CONTAINER) npm install 2>/dev/null || true

fresh: ## Ambiente completamente novo
	make down
	make up
	make migrate-fresh
	make seed
	@echo "✅ Ambiente fresh configurado!"

dev-setup: ## Setup inicial completo para desenvolvimento
	make install
	make up
	make migrate
	make seed
	@echo "✅ Ambiente de desenvolvimento pronto!"
	@echo "🔗 API: http://localhost:8000"
	@echo "🔗 Frontend: http://localhost:5173"

# =====================================
# 📋 COMANDOS DE ACESSO
# =====================================

shell: ## Acessar shell do container da API
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) bash

web-shell: ## Acessar shell do container do frontend
	$(DOCKER_COMPOSE) exec $(WEB_CONTAINER) sh

logs: ## Ver logs de todos os serviços
	$(DOCKER_COMPOSE) logs -f

logs-api: ## Ver logs apenas da API
	$(DOCKER_COMPOSE) logs -f $(API_CONTAINER)

logs-web: ## Ver logs apenas do frontend
	$(DOCKER_COMPOSE) logs -f $(WEB_CONTAINER)

# =====================================
# 🗄️ COMANDOS DE BANCO DE DADOS
# =====================================

migrate: ## Executar migrations
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) php artisan migrate

migrate-fresh: ## Recriar banco de dados
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) php artisan migrate:fresh

seed: ## Executar seeders
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) php artisan db:seed

reset-db: ## Resetar banco de dados com seeders
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) php artisan migrate:fresh --seed

# =====================================
# 🧪 COMANDOS DE TESTE
# =====================================

test: ## Executar todos os testes
	@echo "🚀 Subindo ambiente de teste..."
	$(DOCKER_COMPOSE_TEST) up -d
	@echo "⏳ Aguardando containers ficarem prontos..."
	sleep 10
	$(DOCKER_COMPOSE_TEST) exec $(API_TEST_CONTAINER) ./docker/scripts/run-tests.sh
	@echo "🧹 Parando ambiente de teste..."
	$(DOCKER_COMPOSE_TEST) down

test-unit: ## Executar apenas testes unitários
	@echo "🚀 Subindo ambiente de teste..."
	$(DOCKER_COMPOSE_TEST) up -d
	@echo "⏳ Aguardando containers ficarem prontos..."
	sleep 10
	$(DOCKER_COMPOSE_TEST) exec $(API_TEST_CONTAINER) ./docker/scripts/run-tests.sh --testsuite=Unit
	@echo "🧹 Parando ambiente de teste..."
	$(DOCKER_COMPOSE_TEST) down

test-feature: ## Executar apenas testes de feature
	@echo "🚀 Subindo ambiente de teste..."
	$(DOCKER_COMPOSE_TEST) up -d
	@echo "⏳ Aguardando containers ficarem prontos..."
	sleep 10
	$(DOCKER_COMPOSE_TEST) exec $(API_TEST_CONTAINER) ./docker/scripts/run-tests.sh --testsuite=Feature
	@echo "🧹 Parando ambiente de teste..."
	$(DOCKER_COMPOSE_TEST) down

test-coverage: ## Executar testes com coverage
	@echo "🚀 Subindo ambiente de teste..."
	$(DOCKER_COMPOSE_TEST) up -d
	@echo "⏳ Aguardando containers ficarem prontos..."
	sleep 10
	$(DOCKER_COMPOSE_TEST) exec $(API_TEST_CONTAINER) ./docker/scripts/run-tests.sh --coverage-html coverage
	@echo "🧹 Parando ambiente de teste..."
	$(DOCKER_COMPOSE_TEST) down

test-watch: ## Executar testes em modo watch (mantém ambiente ativo)
	@echo "🚀 Subindo ambiente de teste para modo watch..."
	$(DOCKER_COMPOSE_TEST) up -d
	@echo "⏳ Aguardando containers ficarem prontos..."
	sleep 10
	@echo "👀 Executando testes em modo watch (Ctrl+C para parar)..."
	$(DOCKER_COMPOSE_TEST) exec $(API_TEST_CONTAINER) vendor/bin/phpunit-watcher watch || true
	@echo "🧹 Parando ambiente de teste..."
	$(DOCKER_COMPOSE_TEST) down

test-parallel: ## Executar testes em paralelo
	@echo "🚀 Subindo ambiente de teste..."
	$(DOCKER_COMPOSE_TEST) up -d
	@echo "⏳ Aguardando containers ficarem prontos..."
	sleep 10
	$(DOCKER_COMPOSE_TEST) exec $(API_TEST_CONTAINER) vendor/bin/paratest
	@echo "🧹 Parando ambiente de teste..."
	$(DOCKER_COMPOSE_TEST) down

# =====================================
# 🔧 AMBIENTE DE TESTE DEDICADO
# =====================================

test-env-up: ## Subir ambiente dedicado para testes
	$(DOCKER_COMPOSE_TEST) up -d
	@echo "✅ Ambiente de teste configurado!"

test-env-down: ## Parar ambiente de testes
	$(DOCKER_COMPOSE_TEST) down

test-env-shell: ## Acessar shell do container de teste
	$(DOCKER_COMPOSE_TEST) exec $(API_TEST_CONTAINER) bash

test-env-run: ## Executar testes no ambiente dedicado
	$(DOCKER_COMPOSE_TEST) exec $(API_TEST_CONTAINER) ./docker/scripts/run-tests.sh

# =====================================
# 🏃 COMANDOS RÁPIDOS (AMBIENTE ATIVO)
# =====================================

test-quick: ## Executar testes (assume ambiente de teste ativo)
	$(DOCKER_COMPOSE_TEST) exec $(API_TEST_CONTAINER) ./docker/scripts/run-tests.sh

test-quick-unit: ## Executar testes unitários (assume ambiente de teste ativo)
	$(DOCKER_COMPOSE_TEST) exec $(API_TEST_CONTAINER) ./docker/scripts/run-tests.sh --testsuite=Unit

test-quick-feature: ## Executar testes de feature (assume ambiente de teste ativo)
	$(DOCKER_COMPOSE_TEST) exec $(API_TEST_CONTAINER) ./docker/scripts/run-tests.sh --testsuite=Feature

test-quick-coverage: ## Executar testes com coverage (assume ambiente de teste ativo)
	$(DOCKER_COMPOSE_TEST) exec $(API_TEST_CONTAINER) ./docker/scripts/run-tests.sh --coverage-html coverage

# =====================================
# 🧹 COMANDOS DE LIMPEZA
# =====================================

clean: ## Limpar cache da aplicação
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) php artisan cache:clear
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) php artisan config:clear
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) php artisan route:clear
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) php artisan view:clear

clean-all: ## Limpeza completa (containers, volumes, etc)
	$(DOCKER_COMPOSE) down -v --remove-orphans
	$(DOCKER_COMPOSE_TEST) down -v --remove-orphans 2>/dev/null || true
	docker system prune -f

# =====================================
# ⚡ COMANDOS DE QUALIDADE
# =====================================

lint: ## Executar PHP CS Fixer
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) vendor/bin/php-cs-fixer fix

phpstan: ## Executar PHPStan
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) vendor/bin/phpstan analyse

format: ## Formatar código
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) vendor/bin/php-cs-fixer fix --diff

# =====================================
# 🚀 COMANDOS DE CI/CD
# =====================================

ci-test: ## Executar testes para CI/CD
	$(DOCKER_COMPOSE_TEST) up -d --build
	$(DOCKER_COMPOSE_TEST) exec -T $(API_TEST_CONTAINER) ./docker/scripts/run-tests.sh --log-junit test-results.xml
	$(DOCKER_COMPOSE_TEST) down

# =====================================
# 📦 COMANDOS DO FRONTEND
# =====================================

web-install: ## Instalar dependências do frontend
	$(DOCKER_COMPOSE) exec $(WEB_CONTAINER) npm install

web-build: ## Build do frontend
	$(DOCKER_COMPOSE) exec $(WEB_CONTAINER) npm run build 