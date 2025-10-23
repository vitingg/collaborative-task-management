FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY apps/tasks-service/package*.json ./apps/tasks-service/
COPY packages/types/package*.json ./packages/types/

RUN npm install

COPY . .