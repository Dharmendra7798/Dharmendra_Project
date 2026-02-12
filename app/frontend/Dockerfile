# ---------- Build Stage ----------
FROM node:20-alpine3.20 AS build

WORKDIR /app

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package*.json ./
RUN npm install && npm audit fix || true && npm update glob cross-spawn tar || true

COPY . .
RUN npm run build

# ---------- Runtime Stage ----------
FROM nginx:1.26-alpine

# 🔐 Patch OS vulnerabilities
RUN apk update && apk upgrade --no-cache

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
