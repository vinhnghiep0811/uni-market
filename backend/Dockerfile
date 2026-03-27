# --- Stage 1: deps ---
FROM node:20-alpine AS deps
WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate

# --- Stage 2: development ---
FROM node:20-alpine AS development
WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY --from=deps /app/generated ./generated
COPY --from=deps /app/prisma.config.ts ./prisma.config.ts
COPY . .

ENV NODE_ENV=development

EXPOSE 3001 5555
CMD ["npm", "run", "start:dev"]

# --- Stage 3: builder ---
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY --from=deps /app/generated ./generated
COPY --from=deps /app/prisma.config.ts ./prisma.config.ts
COPY . .

ENV NODE_ENV=production

RUN npm run build
RUN npm prune --omit=dev

# --- Stage 4: production ---
FROM node:20-alpine AS production
WORKDIR /app

RUN apk add --no-cache openssl

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=deps /app/generated ./generated
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy --config ./prisma.config.ts && node dist/src/main.js"]
