FROM node:20-alpine

WORKDIR /app

# Patch OS CVEs
RUN apk update && apk upgrade

# Copy only dependency files first (better caching)
COPY package*.json ./

# Install only production deps (no devDependencies)
RUN npm ci --omit=dev

# Copy app source
COPY . .

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "server.js"]
