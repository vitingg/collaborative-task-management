FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY apps/notifications-service/package*.json ./apps/notifications-service/
COPY packages/types/package*.json ./packages/types/

RUN npm install


COPY . .