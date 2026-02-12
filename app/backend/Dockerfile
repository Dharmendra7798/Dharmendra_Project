# backend/Dockerfile (UPDATED & SECURE)
FROM node:20-alpine3.19

# 🔐 Patch OS-level vulnerabilities (OpenSSL, etc.)
RUN apk update && apk upgrade --no-cache

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# 🔒 Install prod deps & auto-fix known vuln deps where possible
RUN npm ci --only=production && npm audit fix --production || true

# Copy source
COPY . .

EXPOSE 5000
ENV NODE_ENV=production

CMD ["node", "server.js"]
