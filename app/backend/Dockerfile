FROM node:20-alpine3.19

WORKDIR /app

# Patch OS vulnerabilities
RUN apk update && apk upgrade --no-cache

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
