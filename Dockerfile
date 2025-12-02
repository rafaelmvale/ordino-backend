FROM node:20-alpine AS deps

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --silent

FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm run build

FROM node:20-alpine AS release
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY package.json package-lock.json ./
RUN npm ci --only=production --silent
CMD ["node", "dist/main.js"]
