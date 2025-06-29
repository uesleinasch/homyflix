#!/bin/bash

# Só deus na causa de resto vai ou rasga
# Script para configurar banco de dados de teste
# Este script cria e configura o banco de dados de teste no PostgreSQL

set -e

echo "🗄️ Configurando banco de dados de teste..."

# Carregar variáveis do ambiente de teste
if [ -f ".env.testing" ]; then
    export $(grep -v '^#' .env.testing | xargs)
else
    echo " Arquivo .env.testing não encontrado!"
    exit 1
fi

echo " Aguardando PostgreSQL..."
RETRY_COUNT=0
MAX_RETRIES=30

until php -r "
try {
    \$pdo = new PDO('pgsql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_DATABASE', '$DB_USERNAME', '$DB_PASSWORD');
    echo 'Conexão OK';
    exit(0);
} catch (Exception \$e) {
    exit(1);
}
" >/dev/null 2>&1; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo " Timeout aguardando PostgreSQL após $MAX_RETRIES tentativas"
        exit 1
    fi
    echo "PostgreSQL ainda não está pronto. Tentativa $RETRY_COUNT/$MAX_RETRIES..."
    sleep 2
done

echo " PostgreSQL está disponível!"
echo " Banco de dados configurado!"

echo " Executando migrations..."
php artisan migrate:fresh --database=pgsql --force --env=testing

echo "👤 Criando usuário padrão de teste..."
# Executa o seeder para criar o usuário padrão
php artisan db:seed --class=TestUserSeeder --database=pgsql --force --env=testing

echo " Banco de dados de teste configurado com sucesso!"
echo " Detalhes:"
echo "   - Host: $DB_HOST"
echo "   - Porta: $DB_PORT"
echo "   - Banco: $DB_DATABASE"
echo "   - Usuário: $DB_USERNAME"
echo ""
echo "👤 Usuário de teste padrão criado:"
echo "   - Nome: John Smith"
echo "   - Email: test@jacto.com"
echo "   - Senha: 123456789" 