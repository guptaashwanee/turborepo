# Copilot Instructions

## Architecture Overview

This is a **Bun-powered TypeScript monorepo** using Turborepo for build orchestration. The codebase follows a full-stack architecture:

- **Frontend**: React 19 + TanStack Router + Vite (fms-client)
- **Backend**: Hono.js API server (fms-server) 
- **Shared packages**: UI components (@anscer/ui), logger, TypeScript configs
- **Build system**: Turborepo with Biome for formatting/linting

### Key Applications
- `apps/fms-client/` - React frontend with TanStack Router file-based routing
- `apps/fms-server/` - Hono.js API server with Bun runtime

### Shared Packages  
- `packages/ui/` - Radix UI + Tailwind component library with CVA variants
- `packages/logger/` - Pino logger with pretty printing
- `packages/typescript-config/` - Shared TypeScript configurations

## Development Workflows

### Core Commands
- `bun dev` - Start all apps in parallel development mode
- `bun build` - Build all packages and apps with dependency ordering
- `bun test` - Run tests across all workspaces
- `turbo run <task>` - Execute tasks with caching and parallelization

### Package Management
- Uses **Bun workspaces** with catalog dependencies for React versions
- Internal packages use `workspace:*` protocol (e.g., `@anscer/logger`)
- React deps use `catalog:client` for version consistency

### Code Quality
- **Biome** (not Prettier/ESLint) for formatting and linting
- **Lefthook** git hooks run `turbo format` and `turbo lint` on pre-commit
- **Commitizen + Gitmoji** for conventional commits (`bun run commit`)

## Project-Specific Conventions

### Frontend Patterns (fms-client)
- **TanStack Router**: File-based routing in `src/routes/` with auto-generated route tree
- **Path aliases**: Use `@/` for src and `@anscer/ui` for UI components
- **State management**: TanStack Query for server state, React state for local
- **Styling**: Tailwind CSS with component-first approach

### Backend Patterns (fms-server)
- **Hono.js**: Lightweight web framework with `c.text()` and `c.json()` responses
- **Bun runtime**: Uses `bun run --hot` for development with hot reload
- **Export pattern**: Default export object with `port` and `fetch` properties

### UI Package Patterns
- **CVA variants**: Use `class-variance-authority` for component variants
- **Radix primitives**: Unstyled accessible components as base
- **Compound components**: Export both primitive and styled versions
- **Focus-visible**: Custom focus-visible styling with ring utilities

### Monorepo Structure
- **Package naming**: Use `@anscer/` namespace for internal packages
- **TypeScript**: Shared configs in `packages/typescript-config/` (base.json, react-library.json)
- **Turbo tasks**: Build tasks have `dependsOn: ["^build"]` for proper ordering
- **Docker**: Multi-service setup with health checks in docker-compose.yml

## Integration Points

### Workspace Dependencies
- UI package consumed via path alias in Vite config: `@anscer/ui`
- Logger used across apps with consistent Pino formatting
- TypeScript configs extended in each package's tsconfig.json

### Build Dependencies
- Client build depends on UI package build completion
- Turbo ensures proper dependency graph execution
- Biome runs with VCS integration for staged file linting

### Release Process
- **Semantic release**: Automated with gitmoji conventional commits
- **Package releases**: Use `scripts/release-packages.mjs` for individual package publishing
- **GitHub Actions**: Automated releases via `.github/workflows/release.yml`

When making changes, respect the established patterns: use workspace dependencies, follow the file-based routing structure, maintain Biome formatting, and ensure Turbo task dependencies are correctly configured.
