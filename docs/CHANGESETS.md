# Changesets Configuration

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and release processes in our Turborepo monorepo. Unlike npm publishing, this setup focuses on Docker-based releases for applications.

## How It Works

Changesets follows a different approach than semantic-release - instead of deriving versions from commit messages, developers explicitly declare the intent and impact of their changes through changeset files.

### Creating a Changeset

When you make changes that should be released, create a changeset:

```bash
bun run changeset
```

This interactive CLI will:
1. Ask which packages have changed
2. Ask whether the change is a major, minor, or patch
3. Ask for a summary of the changes
4. Generate a changeset file in `.changeset/`

### Types of Changes

- **Major (Breaking Changes)**: API changes that break existing functionality
- **Minor (New Features)**: New features that are backward compatible
- **Patch (Bug Fixes)**: Bug fixes and small improvements

### Example Changeset File

```markdown
---
"@anscer/logger": minor
"@anscer/typescript-config": patch
---

Add new log level configuration and update TypeScript configs for better compatibility
```

## Release Process

### Development Workflow

1. **Make Changes**: Develop your feature/fix
2. **Create Changeset**: Run `bun run changeset` to describe your changes
3. **Commit**: Commit both your code changes and the changeset file
4. **Open PR**: Create a pull request

### Release Workflow

When changes are pushed to the `main` branch, our GitHub Actions workflow will:

1. **Check for Changesets**: Look for uncommitted changesets
2. **Create Release PR**: If changesets exist, create/update a "Release" PR that:
   - Updates package versions
   - Updates CHANGELOG.md files
   - Removes consumed changeset files
3. **Build Docker Images**: When the Release PR is merged, automatically builds and pushes Docker images to GitHub Container Registry for:
   - `fms-client` - Frontend application
   - `fms-server` - Backend application

## Configuration

### Changeset Config (`.changeset/config.json`)

```json
{
  "changelog": ["@changesets/changelog-github", { "repo": "guptaashwanee/turborepo" }],
  "commit": false,
  "access": "restricted",
  "baseBranch": "main", 
  "updateInternalDependencies": "patch",
  "ignore": ["@anscer/*"]
}
```

Key settings:

- **changelog**: Uses GitHub integration for rich changelog generation
- **commit**: We don't auto-commit version changes (handled by CI)
- **access**: Internal packages (restricted access)
- **ignore**: All packages are ignored since this is for internal use only

### Application Releases

This monorepo focuses on Docker-based releases for applications rather than npm package publishing:

- `fms-client` - Frontend application (built and pushed as Docker image)
- `fms-server` - Backend application (built and pushed as Docker image)

### Internal Packages

All packages are private and used internally within the monorepo:

- `@anscer/ui` - Internal UI components  
- `@anscer/auth` - Internal authentication utilities
- `@anscer/logger` - Internal logging utilities
- `@anscer/typescript-config` - Internal TypeScript configurations

## Commands

```bash
# Create a new changeset
bun run changeset

# Preview what versions would be released
bun run changeset:version

# Publish packages (usually handled by CI)
bun run changeset:publish
```

## GitHub Actions Integration

The `.github/workflows/release.yml` workflow:

1. **Runs on Push to Main**: Triggers when changes are pushed to main branch
2. **Creates Release PR**: Uses `changesets/action` to create/update release PRs  
3. **Auto-builds Docker Images**: When release PR is merged, automatically builds and pushes Docker images to GitHub Container Registry

### Required Secrets

Make sure these secrets are configured in your GitHub repository:

- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

## Benefits of Changesets

1. **Explicit Intent**: Developers explicitly declare the impact of changes
2. **Flexible Versioning**: Different packages can have different version bumps
3. **Rich Changelogs**: Integration with GitHub for links and contributor info
4. **Monorepo Friendly**: Built specifically for monorepos like Turborepo
5. **Review Process**: Changes go through PR review before release
6. **Docker Integration**: Seamless integration with Docker-based deployments

## Migration from Semantic Release

This project was migrated from semantic-release to provide:

- More explicit control over versioning
- Better monorepo support
- Cleaner integration with PR workflows
- More predictable release process
- Docker-focused deployment strategy

The gitmoji commit convention can still be used for commit messages, but versioning is now controlled through changesets rather than commit message parsing.
