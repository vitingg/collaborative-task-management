FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY apps/auth-service/package*.json ./apps/auth-service/

RUN npm install
RUN npm install --prefix ./apps/auth-service

COPY . .