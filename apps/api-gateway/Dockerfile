FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY apps/api-gateway/package*.json ./apps/api-gateway/
COPY packages/types/package*.json ./packages/types/

RUN npm install

COPY . .