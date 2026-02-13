FROM node:20-alpine

WORKDIR /app

# Upgrade OS packages to fix OpenSSL CVEs
RUN apk update && apk upgrade

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
