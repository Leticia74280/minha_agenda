# 1. Escolhemos uma imagem base leve com Node.js pré-instalado
FROM node:22-alpine

RUN apk add --no-cache wget

# 2. Definimos a pasta de trabalho dentro do container
WORKDIR /app

# 3. Copiamos o package.json primeiro (para aproveitar o cache do Docker)
COPY package*.json ./
COPY package-lock*.json ./

# 4. Instalamos as dependências dentro do container
RUN npm install

# 5. Copiamos todo o resto do código fonte para dentro do container
COPY . .

# 6. Expomos a porta que a aplicação usa
EXPOSE 3000

# 7. Comando para iniciar a aplicação quando o container rodar
CMD ["node", "server.js"]
