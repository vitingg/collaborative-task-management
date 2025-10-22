  # apps/web/Dockerfile
  FROM node:20-alpine AS development

  WORKDIR /app

  COPY package*.json ./
  COPY apps/web/package*.json ./apps/web/

  RUN npm install
  RUN npm install --prefix ./apps/web

  COPY . .

  EXPOSE 3000