#!/bin/bash

# Script para executar testes no ambiente Docker
# Este script deve ser executado dentro do container da aplicação

set -e

echo "🧪 Iniciando configuração do ambiente de testes..."

# Verificar se o arquivo .env.testing existe
if [ ! -f ".env.testing" ]; then
    echo "❌ Arquivo .env.testing não encontrado!"
    exit 1
fi

# Carregar variáveis do ambiente de teste
export $(grep -v '^#' .env.testing | xargs)

echo "📊 Configurando banco de dados de teste..."

# Aguardar o PostgreSQL estar disponível
echo "⏳ Aguardando PostgreSQL..."
until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USERNAME; do
    echo "PostgreSQL ainda não está pronto. Aguardando..."
    sleep 2
done

echo "✅ PostgreSQL está disponível!"

# Criar banco de teste se não existir
echo "🗄️ Verificando banco de dados de teste..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_DATABASE'" | grep -q 1 || \
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d postgres -c "CREATE DATABASE $DB_DATABASE"

echo "✅ Banco de dados de teste configurado!"

# Executar migrations no banco de teste
echo "🔄 Executando migrations no banco de teste..."
php artisan migrate:fresh --database=pgsql --force --env=testing

# Executar seeders se necessário (opcional)
if [ "$1" = "--seed" ]; then
    echo "🌱 Executando seeders..."
    php artisan db:seed --database=pgsql --force --env=testing
fi

# Limpar cache
echo "🧹 Limpando cache..."
php artisan cache:clear --env=testing
php artisan config:clear --env=testing
php artisan route:clear --env=testing

# Executar testes
echo "🚀 Executando testes..."

# Definir argumentos padrão se nenhum for fornecido
PHPUNIT_ARGS=${@:2}
if [ -z "$PHPUNIT_ARGS" ]; then
    PHPUNIT_ARGS="--verbose --colors=always"
fi

# Executar PHPUnit
vendor/bin/phpunit $PHPUNIT_ARGS

echo "✅ Testes concluídos!" 