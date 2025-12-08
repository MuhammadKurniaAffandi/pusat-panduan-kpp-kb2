# ========================================
# STAGE 1: Dependencies
# ========================================
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy root workspace files
COPY package*.json ./
COPY turbo.json* ./

# Copy frontend package.json
COPY apps/web/package*.json ./apps/web/

# Install dependencies (all in root node_modules)
RUN npm install

# ========================================
# STAGE 2: Builder
# ========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies (only root node_modules)
COPY --from=deps /app/node_modules ./node_modules

# Copy package files
COPY package*.json ./
COPY turbo.json* ./
COPY apps/web/package*.json ./apps/web/

# Copy source code
COPY apps/web/next.config.* ./apps/web/
COPY apps/web/tsconfig.json ./apps/web/
COPY apps/web/tailwind.config.* ./apps/web/
COPY apps/web/postcss.config.* ./apps/web/
COPY apps/web/components.json ./apps/web/
COPY apps/web/public ./apps/web/public
COPY apps/web/src ./apps/web/src

# Set build-time environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1

# Build application
WORKDIR /app/apps/web
RUN npm run build

# ========================================
# STAGE 3: Production Runner
# ========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public files (if any)
COPY --from=builder /app/apps/web/public ./public

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "apps/web/server.js"]