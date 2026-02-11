# frontend/Dockerfile
FROM node:18-alpine AS build
WORKDIR /app

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# lightweight healthcheck
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O- http://localhost || exit 1
