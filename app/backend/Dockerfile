FROM node:20-alpine

WORKDIR /app

RUN apk update && apk upgrade

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 5000
CMD ["node", "server.js"]
