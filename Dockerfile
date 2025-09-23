FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copia tudo, inclusive a pasta data
COPY . .

# Garante que a pasta /app/data existe no container
RUN mkdir -p /app/data

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/src/server.js"]
