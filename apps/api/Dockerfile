# ========================================
# STAGE 1: Dependencies
# ========================================
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy root workspace files
COPY package*.json ./
COPY turbo.json* ./

# Copy backend package.json
COPY apps/api/package*.json ./apps/api/

# Copy Prisma schema
COPY apps/api/prisma ./apps/api/prisma/

# Install dependencies (all in root node_modules)
RUN npm install

# Generate Prisma Client
WORKDIR /app/apps/api
RUN npx prisma generate

# ========================================
# STAGE 2: Builder
# ========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage (only root node_modules)
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/prisma ./apps/api/prisma

# Copy package files
COPY package*.json ./
COPY turbo.json* ./
COPY apps/api/package*.json ./apps/api/

# Copy source code
COPY apps/api/tsconfig*.json ./apps/api/
COPY apps/api/nest-cli.json ./apps/api/
COPY apps/api/src ./apps/api/src

# Build application
WORKDIR /app/apps/api
RUN npm run build

# ========================================
# STAGE 3: Production Runner
# ========================================
FROM node:20-alpine AS runner

RUN apk add --no-cache dumb-init

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY --from=builder /app/apps/api/package*.json ./

# Install ONLY production dependencies for this app
RUN npm install --omit=dev && npm cache clean --force

# Copy built application
COPY --from=builder /app/apps/api/dist ./dist

# Copy Prisma files
COPY --from=builder /app/apps/api/prisma ./prisma

# Copy Prisma Client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["dumb-init", "node", "dist/main"]