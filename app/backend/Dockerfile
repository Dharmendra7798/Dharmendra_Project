FROM node:20-alpine3.19

WORKDIR /app

# Update OS packages to reduce CVEs
RUN apk update && apk upgrade --no-cache

# Copy only package files first (better caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy app source
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
