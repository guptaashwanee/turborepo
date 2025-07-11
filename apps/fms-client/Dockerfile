# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install global dependencies
RUN npm install -g bun

# Copy package files
COPY package.json bun.lockb* ./
COPY turbo.json ./
COPY .turbo ./.turbo

# Copy shared packages
COPY packages ./packages

# Copy the client app
COPY apps/fms-client ./apps/fms-client

# Install dependencies
RUN bun install --frozen-lockfile

# Build the application
WORKDIR /app/apps/fms-client
RUN bun run build

# Production stage with Nginx
FROM nginx:alpine AS production

# Copy the built application to nginx
COPY --from=builder /app/apps/fms-client/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY apps/fms-client/nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user
RUN addgroup -g 1001 -S nginx
RUN adduser -S nginx -u 1001

# Change ownership
RUN chown -R nginx:nginx /usr/share/nginx/html
RUN chown -R nginx:nginx /var/cache/nginx
RUN chown -R nginx:nginx /var/log/nginx
RUN chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid
RUN chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
