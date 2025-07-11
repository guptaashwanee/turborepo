# Use the official Bun image
FROM oven/bun:1-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json bun.lockb* ./

# Copy turbo and shared packages configuration
COPY turbo.json ./
COPY .turbo ./.turbo

# Copy shared packages
COPY packages ./packages

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY apps/fms-server ./apps/fms-server

# Build the application
WORKDIR /app/apps/fms-server
RUN bun run build

# Production stage
FROM oven/bun:1-alpine AS production

WORKDIR /app

# Copy built application
COPY --from=base /app/apps/fms-server/dist ./dist
COPY --from=base /app/apps/fms-server/package.json ./package.json

# Copy shared packages that are needed at runtime
COPY --from=base /app/packages ./packages

# Install only production dependencies
RUN bun install --production --frozen-lockfile

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory to the nodejs user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the application
CMD ["bun", "dist/index.js"]
