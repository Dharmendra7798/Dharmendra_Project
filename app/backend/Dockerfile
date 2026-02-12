FROM node:20-alpine3.20

# 🔐 Patch OS-level vulnerabilities
RUN apk update && apk upgrade --no-cache

WORKDIR /app

# Copy manifests first (better layer caching)
COPY package*.json ./

# 🔐 Install prod deps & patch vulnerable transitive deps
RUN npm ci --omit=dev \
  && npm audit fix --omit=dev || true \
  && npm update glob cross-spawn tar || true

# Copy source code
COPY . .

EXPOSE 5000
ENV NODE_ENV=production

# 🧑‍💻 Run as non-root (extra security hardening)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["node", "server.js"]
