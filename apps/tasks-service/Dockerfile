FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY apps/tasks-service/package*.json ./apps/tasks-service/

RUN npm install
RUN npm install --prefix ./apps/tasks-service

COPY . .