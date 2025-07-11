# Docker Configuration

This document explains how to build and run the FMS applications using Docker.

## 🐳 Available Applications

### FMS Server
- **Technology**: Bun + Hono
- **Port**: 3000
- **Base Image**: `oven/bun:1-alpine`
- **Health Check**: `GET /`

### FMS Client
- **Technology**: React + Vite + TanStack Router
- **Port**: 8080
- **Base Image**: `nginx:alpine`
- **Health Check**: `GET /health`

## 🚀 Quick Start

### Build and Run All Services
```bash
# Build all Docker images
bun run docker:build

# Start all services in detached mode
bun run docker:up

# View logs from all services
bun run docker:logs

# Stop all services
bun run docker:down
```

### Individual Application Commands

#### Build Individual Images
```bash
# Build FMS Server
docker build -f apps/fms-server/Dockerfile -t fms-server .

# Build FMS Client
docker build -f apps/fms-client/Dockerfile -t fms-client .
```

#### Run Individual Containers
```bash
# Run FMS Server
docker run -p 3000:3000 --name fms-server-container fms-server

# Run FMS Client
docker run -p 8080:8080 --name fms-client-container fms-client
```

## 📋 Docker Compose Services

### Services Overview
- **fms-server**: Backend API server (Bun + Hono)
- **fms-client**: Frontend React application (Nginx)

### Network Configuration
- All services run on the `app-network` bridge network
- Services can communicate using service names as hostnames
- Client can proxy API requests to `http://fms-server:3000`

### Health Checks
Both services include health checks:
- **Interval**: 30 seconds
- **Timeout**: 10 seconds  
- **Retries**: 3
- **Start Period**: 40 seconds

## 🔧 Configuration

### Environment Variables

#### FMS Server
- `NODE_ENV=production`
- `PORT=3000`

#### FMS Client
- Nginx serves static files on port 8080
- API requests proxied to `/api/` → `http://fms-server:3000/`

### Ports
- **FMS Client**: `localhost:8080`
- **FMS Server**: `localhost:3000`

## 📁 File Structure

```
apps/
├── fms-client/
│   ├── Dockerfile          # Multi-stage build (Node.js → Nginx)
│   └── nginx.conf          # Nginx configuration
└── fms-server/
    └── Dockerfile          # Bun-based build
docker-compose.yml          # Orchestration configuration
.dockerignore              # Docker ignore patterns
```

## 🛠️ Development Workflow

### Local Development
```bash
# Start development servers (not Docker)
bun run dev

# Run in Docker for testing
bun run docker:build
bun run docker:up
```

### Production Deployment
```bash
# Build optimized images
docker-compose build --no-cache

# Deploy
docker-compose up -d

# Monitor
docker-compose logs -f
```

## 📊 Monitoring & Debugging

### View Logs
```bash
# All services
bun run docker:logs

# Specific service
docker-compose logs -f fms-server
docker-compose logs -f fms-client
```

### Service Status
```bash
# Check running containers
docker-compose ps

# Check health status
docker-compose exec fms-server curl http://localhost:3000/
docker-compose exec fms-client curl http://localhost:8080/health
```

### Debugging
```bash
# Execute commands in running containers
docker-compose exec fms-server sh
docker-compose exec fms-client sh

# View container details
docker inspect fms-server
docker inspect fms-client
```

## 🧹 Cleanup

### Remove Everything
```bash
# Stop and remove containers, networks, and volumes
bun run docker:clean

# Or manually:
docker-compose down -v --remove-orphans
docker system prune -f
```

### Remove Images
```bash
# Remove built images
docker rmi fms-server fms-client

# Remove all unused images
docker image prune -a
```

## 🔐 Security Features

### Multi-stage Builds
- Minimal production images
- No build dependencies in final images
- Reduced attack surface

### Non-root Users
- Both containers run as non-root users
- Proper file ownership and permissions
- Enhanced security posture

### Nginx Security Headers
- X-Frame-Options
- X-XSS-Protection  
- X-Content-Type-Options
- Content-Security-Policy
- Referrer-Policy

## 📝 Best Practices

1. **Image Optimization**
   - Multi-stage builds for smaller images
   - Alpine Linux base images
   - Minimal dependencies

2. **Security**
   - Non-root container users
   - Security headers in Nginx
   - Health checks for monitoring

3. **Development**
   - Consistent environment across dev/prod
   - Easy local testing with Docker
   - Proper logging and monitoring

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clean build cache
docker builder prune

# Build without cache
docker-compose build --no-cache
```

#### Network Issues
```bash
# Recreate networks
docker-compose down
docker network prune
docker-compose up
```

#### Permission Issues
```bash
# Check container user
docker-compose exec fms-server whoami
docker-compose exec fms-client whoami
```

#### Health Check Failures
```bash
# Check service logs
docker-compose logs fms-server
docker-compose logs fms-client

# Manual health check
curl http://localhost:3000/
curl http://localhost:8080/health
```
