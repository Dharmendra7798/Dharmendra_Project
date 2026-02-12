FROM node:20-alpine

WORKDIR /app

# Upgrade npm to patched version (fixes tar/glob CVEs)
RUN npm install -g npm@latest

# Copy package files first
COPY package*.json ./

# Install only prod deps
RUN npm ci --omit=dev

# Copy app source
COPY . .

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "server.js"]
