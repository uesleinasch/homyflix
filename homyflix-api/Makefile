# Makefile para HomyFlix API
# Comandos úteis para desenvolvimento e testes

.PHONY: help install up down test test-unit test-feature test-coverage clean logs shell

# Configurações
DOCKER_COMPOSE = docker-compose
DOCKER_COMPOSE_TEST = docker-compose -f docker/docker-compose.test.yml
API_CONTAINER = homyflix-api
API_TEST_CONTAINER = homyflix-api-test

help: ## Mostrar esta ajuda
	@echo "HomyFlix API - Comandos Disponíveis:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Comandos de ambiente
install: ## Instalar dependências
	$(DOCKER_COMPOSE) run --rm $(API_CONTAINER) composer install
	$(DOCKER_COMPOSE) run --rm $(API_CONTAINER) php artisan key:generate
	$(DOCKER_COMPOSE) run --rm $(API_CONTAINER) php artisan jwt:secret

up: ## Subir ambiente de desenvolvimento
	$(DOCKER_COMPOSE) up -d
	@echo "✅ Ambiente de desenvolvimento rodando!"
	@echo "API: http://localhost:8000"

down: ## Parar ambiente de desenvolvimento
	$(DOCKER_COMPOSE) down

logs: ## Mostrar logs da API
	$(DOCKER_COMPOSE) logs -f $(API_CONTAINER)

shell: ## Acessar shell do container da API
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) bash

# Comandos de banco de dados
migrate: ## Executar migrations
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) php artisan migrate

migrate-fresh: ## Recriar banco de dados
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) php artisan migrate:fresh

seed: ## Executar seeders
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) php artisan db:seed

reset-db: ## Resetar banco de dados com seeders
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) php artisan migrate:fresh --seed

# Comandos de teste
test-setup: ## Configurar ambiente de teste
	$(DOCKER_COMPOSE_TEST) up -d
	@echo "✅ Ambiente de teste configurado!"

test: ## Executar todos os testes
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) ./docker/scripts/run-tests.sh

test-unit: ## Executar apenas testes unitários
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) ./docker/scripts/run-tests.sh --testsuite=Unit

test-feature: ## Executar apenas testes de feature
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) ./docker/scripts/run-tests.sh --testsuite=Feature

test-coverage: ## Executar testes com coverage
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) ./docker/scripts/run-tests.sh --coverage-html coverage

test-watch: ## Executar testes em modo watch
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) vendor/bin/phpunit-watcher watch

test-parallel: ## Executar testes em paralelo
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) vendor/bin/paratest

# Comandos específicos de teste no container dedicado
test-env-up: ## Subir ambiente dedicado para testes
	$(DOCKER_COMPOSE_TEST) up -d

test-env-down: ## Parar ambiente dedicado para testes
	$(DOCKER_COMPOSE_TEST) down

test-env-shell: ## Acessar shell do container de teste
	$(DOCKER_COMPOSE_TEST) exec $(API_TEST_CONTAINER) bash

test-env-run: ## Executar testes no ambiente dedicado
	$(DOCKER_COMPOSE_TEST) exec $(API_TEST_CONTAINER) ./docker/scripts/run-tests.sh

# Comandos de limpeza
clean: ## Limpar cache e arquivos temporários
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) php artisan cache:clear
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) php artisan config:clear
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) php artisan route:clear
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) php artisan view:clear

clean-all: ## Limpeza completa (containers, volumes, etc)
	$(DOCKER_COMPOSE) down -v --remove-orphans
	$(DOCKER_COMPOSE_TEST) down -v --remove-orphans
	docker system prune -f

# Comandos de qualidade de código
lint: ## Executar PHP CS Fixer
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) vendor/bin/php-cs-fixer fix

phpstan: ## Executar PHPStan
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) vendor/bin/phpstan analyse

format: ## Formatar código
	$(DOCKER_COMPOSE) exec $(API_CONTAINER) vendor/bin/php-cs-fixer fix --diff

# Comandos de CI/CD
ci-test: ## Executar testes para CI/CD
	$(DOCKER_COMPOSE_TEST) up -d --build
	$(DOCKER_COMPOSE_TEST) exec -T $(API_TEST_CONTAINER) ./docker/scripts/run-tests.sh --log-junit test-results.xml
	$(DOCKER_COMPOSE_TEST) down

# Comandos de desenvolvimento
fresh: down up migrate-fresh seed ## Ambiente novo completo

dev-setup: install up migrate seed ## Setup inicial para desenvolvimento
	@echo "✅ Ambiente de desenvolvimento pronto!"
	@echo "API: http://localhost:8000"
	@echo "Banco: PostgreSQL na porta 5432" 