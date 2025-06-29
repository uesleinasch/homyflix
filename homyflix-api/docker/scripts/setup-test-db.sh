#!/bin/bash

# Script para configurar banco de dados de teste
# Este script cria e configura o banco de dados de teste no PostgreSQL

set -e

echo "🗄️ Configurando banco de dados de teste..."

# Carregar variáveis do ambiente de teste
if [ -f ".env.testing" ]; then
    export $(grep -v '^#' .env.testing | xargs)
else
    echo "❌ Arquivo .env.testing não encontrado!"
    exit 1
fi

# Aguardar PostgreSQL estar disponível
echo "⏳ Aguardando PostgreSQL..."
until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USERNAME; do
    echo "PostgreSQL ainda não está pronto. Aguardando..."
    sleep 2
done

echo "✅ PostgreSQL está disponível!"

# Criar banco de teste se não existir
echo "📊 Criando banco de dados de teste: $DB_DATABASE"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_DATABASE'" | grep -q 1 || {
    echo "🆕 Criando novo banco de dados: $DB_DATABASE"
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d postgres -c "CREATE DATABASE $DB_DATABASE"
}

echo "✅ Banco de dados $DB_DATABASE está disponível!"

# Configurar permissões
echo "🔐 Configurando permissões..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_DATABASE << EOF
GRANT ALL PRIVILEGES ON DATABASE $DB_DATABASE TO $DB_USERNAME;
GRANT ALL PRIVILEGES ON SCHEMA public TO $DB_USERNAME;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USERNAME;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USERNAME;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USERNAME;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USERNAME;
EOF

echo "✅ Permissões configuradas!"

# Executar migrations
echo "🔄 Executando migrations..."
php artisan migrate:fresh --database=pgsql --force --env=testing

echo "✅ Banco de dados de teste configurado com sucesso!"
echo "📋 Detalhes:"
echo "   - Host: $DB_HOST"
echo "   - Porta: $DB_PORT"
echo "   - Banco: $DB_DATABASE"
echo "   - Usuário: $DB_USERNAME" 