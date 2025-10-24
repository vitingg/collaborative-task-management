FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./

COPY apps/api-gateway/package*.json ./apps/api-gateway/
COPY apps/auth-service/package*.json ./apps/auth-service/
COPY apps/tasks-service/package*.json ./apps/tasks-service/
COPY apps/notifications-service/package*.json ./apps/notifications-service/
COPY apps/web/package*.json ./apps/web/

COPY packages/types/package*.json ./packages/types/

RUN npm install


COPY . .