#!/bin/bash

# Script para executar testes no ambiente Docker
# Este script deve ser executado dentro do container da aplicação

set -e

echo "Iniciando configuração do ambiente de testes..."

echo "Aguardando PostgreSQL..."
RETRY_COUNT=0
MAX_RETRIES=15

until php -r "
try {
    \$pdo = new PDO('pgsql:host=postgres-test;port=5432;dbname=homyflix_test', 'homyflix', 'password');
    echo 'Conexão OK';
    exit(0);
} catch (Exception \$e) {
    exit(1);
}
" >/dev/null 2>&1; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "❌ Timeout aguardando PostgreSQL após $MAX_RETRIES tentativas"
        exit 1
    fi
    echo "PostgreSQL ainda não está pronto. Tentativa $RETRY_COUNT/$MAX_RETRIES..."
    sleep 3
done

echo "✅ PostgreSQL está disponível!"

echo "🔄 Executando migrations no banco de teste..."
php artisan migrate:fresh --database=pgsql --force --env=testing

if [ "$1" = "--seed" ]; then
    echo "🌱 Executando seeders..."
    php artisan db:seed --database=pgsql --force --env=testing
fi

echo "🧹 Limpando cache..."
php artisan cache:clear --env=testing
php artisan config:clear --env=testing
php artisan route:clear --env=testing

echo "Executando testes..."

PHPUNIT_ARGS=${@:1}
if [ -z "$PHPUNIT_ARGS" ]; then
    PHPUNIT_ARGS="--colors=always --display-warnings --display-errors"
fi

vendor/bin/phpunit $PHPUNIT_ARGS

echo "✅ Testes concluídos!" 