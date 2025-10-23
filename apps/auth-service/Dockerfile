FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY apps/auth-service/package*.json ./apps/auth-service/
COPY packages/types/package*.json ./packages/types/

RUN npm install


COPY . .