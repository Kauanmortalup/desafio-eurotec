FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy everything, including the data folder.
COPY . .

# Ensure that the /app/data folder exists in the container.
RUN mkdir -p /app/data

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/src/server.js"]
