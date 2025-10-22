FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY apps/notifications-service/package*.json ./apps/notifications-service/

RUN npm install
RUN npm install --prefix ./apps/notifications-service

COPY . .