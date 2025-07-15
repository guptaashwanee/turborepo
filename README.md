# turborepo

A Turborepo monorepo with multiple packages and applications.

## Getting Started

To install dependencies:

```bash
bun install
```

To run in development mode:

```bash
bun run dev
```

To build all packages:

```bash
bun run build
```

## Packages

- `@anscer/logger` - Logging utilities
- `@anscer/typescript-config` - Shared TypeScript configurations  
- `@anscer/ui` - UI component library
- `@anscer/auth` - Authentication utilities

## Apps

- `fms-client` - Frontend application
- `fms-server` - Backend application

## Development

### Code Quality

```bash
# Format code
bun run format

# Lint code
bun run lint

# Type check
bun run typecheck

# Run tests
bun run test
```

### Releases

This project uses [Changesets](https://github.com/changesets/changesets) for version management and publishing.

When you make changes that should be released:

```bash
# Create a changeset describing your changes
bun run changeset
```

See [docs/CHANGESETS.md](./docs/CHANGESETS.md) for detailed information about the release process.

## Project Structure

This is a [Turborepo](https://turbo.build/repo) monorepo with the following structure:

- `apps/` - Applications
- `packages/` - Shared packages
- `docs/` - Documentation

This project was created using `bun init` in bun v1.2.16. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
