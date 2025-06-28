# Usar a imagem base do PHP 8.2 com FPM
FROM php:8.2-fpm

# Instalar dependências do sistema necessárias para o Laravel e PostgreSQL
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql zip

# Instalar o Composer (gerenciador de dependências do PHP)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Definir o diretório de trabalho
WORKDIR /var/www/html

# Copiar os arquivos de dependência e instalar as dependências do Composer
COPY composer.json composer.lock ./
RUN composer install --no-interaction --no-plugins --no-scripts --prefer-dist

# Copiar o restante dos arquivos da aplicação
COPY . .

# Expor a porta 8000 para o servidor de desenvolvimento do Laravel
EXPOSE 8000

# Comando para iniciar o servidor de desenvolvimento do Laravel
CMD sh -c "php artisan migrate:fresh --seed && php artisan serve --host=0.0.0.0 --port=8000"
