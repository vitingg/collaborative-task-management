FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY apps/api-gateway/package*.json ./apps/api-gateway/

RUN npm install
RUN npm install --prefix ./apps/api-gateway

COPY . .