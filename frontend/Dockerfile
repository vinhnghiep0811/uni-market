# --- Stage 1: Base (Cài đặt dependencies chung) ---
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- Stage 2: Development (DÙNG CHO DOCKER-COMPOSE TARGET) ---
# Stage này dành riêng cho việc code ở máy local
FROM base AS development
WORKDIR /app
COPY . .
# Next.js telemetry (tùy chọn)
ENV NEXT_TELEMETRY_DISABLED 1
EXPOSE 3000
# Chạy lệnh dev để có hot-reload
CMD ["npm", "run", "dev"]

# --- Stage 3: Builder (Dùng để đóng gói cho Production) ---
FROM base AS builder
WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# --- Stage 4: Runner (Bản Production siêu nhẹ) ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]