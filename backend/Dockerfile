# --- Stage 1: Base (Các thiết lập chung) ---
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma/
RUN npx prisma generate

# --- Stage 2: Development (Dùng để code, có hot-reload) ---
FROM base AS development
COPY . .
ENV NODE_ENV=development
# Port cho debugger hoặc app
EXPOSE 3001 5555 
CMD ["npm", "run", "start:dev"]

# --- Stage 3: Build (Chỉ dùng để compile code) ---
FROM base AS build-step
COPY . .
RUN npm run build
# Xóa bớt devDependencies cho nhẹ
RUN npm prune --production

# --- Stage 4: Production (Image cuối cùng cực nhẹ) ---
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build-step /app/dist ./dist
COPY --from=build-step /app/node_modules ./node_modules
COPY --from=build-step /app/package*.json ./
COPY --from=build-step /app/prisma ./prisma

EXPOSE 3001
CMD ["node", "dist/main.js"]