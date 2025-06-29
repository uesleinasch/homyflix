-- Script para criação automática do banco de dados de teste
-- Este script é executado automaticamente quando o container PostgreSQL é iniciado


SELECT 'CREATE DATABASE homyflix_test'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'homyflix_test')\gexec

\c homyflix_test;
GRANT ALL PRIVILEGES ON DATABASE homyflix_test TO homyflix;
GRANT ALL PRIVILEGES ON SCHEMA public TO homyflix;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO homyflix;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO homyflix;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO homyflix;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO homyflix;


\c homyflix;
\echo 'Banco de dados de teste homyflix_test criado com sucesso!' 