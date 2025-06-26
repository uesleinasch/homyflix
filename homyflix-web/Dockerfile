# Estágio de desenvolvimento
FROM node:22-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia o package.json e o package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Expõe a porta do Vite
EXPOSE 5173

# Comando para iniciar o servidor de desenvolvimento com hot-reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
