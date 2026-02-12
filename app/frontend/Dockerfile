FROM node:20-alpine AS build

WORKDIR /app

# Upgrade npm to patched version
RUN npm install -g npm@latest

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
