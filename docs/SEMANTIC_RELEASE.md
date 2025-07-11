# Semantic Release Configuration

This project uses [semantic-release](https://semantic-release.gitbook.io/) to automate the release process based on commit messages following the [Gitmoji](https://gitmoji.dev/) convention.

## How It Works

### Commit Convention
This project uses Gitmoji commits. Each commit should start with a relevant emoji followed by a descriptive message:

**Major Version Bumps (Breaking Changes):**
- 💥 `:boom:` - Introduce breaking changes

**Minor Version Bumps (New Features):**
- ✨ `:sparkles:` - Introduce new features
- 🎉 `:tada:` - Begin a project
- ✅ `:white_check_mark:` - Add, update, or pass tests

**Patch Version Bumps (Bug Fixes & Improvements):**
- 🐛 `:bug:` - Fix a bug
- 🚑 `:ambulance:` - Critical hotfix
- 🔒 `:lock:` - Fix security issues
- ⚡ `:zap:` - Improve performance
- 🎨 `:lipstick:` - Add or update the UI and style files
- 📝 `:memo:` - Add or update documentation
- 📦 `:package:` - Add or update compiled files or packages
- ⬆️ `:arrow_up:` - Upgrade dependencies
- ♻️ `:recycle:` - Refactor code
- 🔧 `:wrench:` - Add or update configuration files
- And many more...

### Release Process

1. **Automated Analysis**: On push to `main`, `master`, `develop`, or `release` branches, semantic-release analyzes commits since the last release
2. **Version Calculation**: Based on the highest impact commit:
   - 💥 Breaking changes → Major version (1.0.0 → 2.0.0)
   - ✨ New features → Minor version (1.0.0 → 1.1.0)
   - 🐛 Bug fixes → Patch version (1.0.0 → 1.0.1)
3. **Release Creation**: If changes warrant a release:
   - Updates version in `package.json`
   - Generates `CHANGELOG.md`
   - Creates GitHub release with release notes
   - Publishes to npm (if configured)

### Branch Strategy

- **`main`/`master`**: Production releases
- **`develop`**: Beta pre-releases (e.g., `1.1.0-beta.1`)
- **`release`**: Release candidate pre-releases (e.g., `1.1.0-rc.1`)

## Configuration Files

### `.releaserc.json`
Main semantic-release configuration that:
- Defines release branches
- Configures gitmoji-based commit analysis
- Sets up changelog generation
- Configures GitHub releases

### `.github/workflows/release.yml`
GitHub Actions workflow that:
- Runs quality checks (lint, format, type check)
- Builds all packages
- Runs tests
- Executes semantic-release on successful builds

## Scripts

### Root Package Scripts
```bash
# Run semantic-release (typically in CI)
bun run release

# Dry run to see what would be released
bun run release:dry

# Make a commit with gitmoji
bun run commit
```

### Monorepo Structure
The release process works with this Turborepo monorepo containing:

**Apps:**
- `fms-client` - React frontend with Vite
- `fms-server` - Hono-based API server
- Additional apps: `api-server`, `mobile-app`, `web-app`

**Packages:**
- `@anscer/ui` - Shared UI components
- `@anscer/logger` - Logging utilities
- `@anscer/auth` - Authentication module
- `@anscer/typescript-config` - Shared TypeScript configs

## Setup Requirements

### Repository Secrets (GitHub Settings → Secrets and variables → Actions)

1. **`GITHUB_TOKEN`** (automatically provided)
2. **`NPM_TOKEN`** (optional, for npm publishing)
3. **`TURBO_TOKEN`** (optional, for Turbo remote caching)

### Repository Variables
1. **`TURBO_TEAM`** (optional, for Turbo remote caching)

## Making Releases

### Manual Release (Local)
```bash
# Dry run to preview
bun run release:dry

# Actual release (ensure you're on main branch with clean working directory)
bun run release
```

### Automatic Release (CI)
Simply push commits to `main` branch. The GitHub Action will:
1. Run all quality checks
2. Build the project
3. Run tests  
4. Create release if commits warrant it

## Example Workflow

1. **Feature Development:**
   ```bash
   git checkout -b feature/user-auth
   # Make changes
   git add .
   bun run commit  # Use interactive gitmoji commit
   # Select ✨ :sparkles: "Introduce new features"
   git push origin feature/user-auth
   ```

2. **Create PR and merge to main**

3. **Automatic Release:**
   - GitHub Action runs
   - Detects ✨ commits → Minor version bump
   - Creates release `1.1.0` with changelog
   - Publishes to npm (if configured)

## Troubleshooting

### No Release Created
- Check if commits follow gitmoji convention
- Ensure commits are meaningful (not just chore/style)
- Verify the branch is configured for releases

### Failed Release
- Check GitHub Action logs
- Verify all tests pass
- Ensure build succeeds
- Check repository permissions

### Version Not Updated
- semantic-release only updates versions when there are new commits since last release
- Use `bun run release:dry` to preview what would happen

## Best Practices

1. **Meaningful Commits**: Each commit should represent a logical change
2. **Proper Emojis**: Choose emojis that accurately reflect the change impact
3. **Clear Messages**: Write descriptive commit messages after the emoji
4. **Testing**: Ensure all tests pass before merging
5. **Documentation**: Update docs for new features or breaking changes

## Resources

- [Semantic Release Documentation](https://semantic-release.gitbook.io/)
- [Gitmoji Reference](https://gitmoji.dev/)
- [Conventional Commits](https://conventionalcommits.org/)
- [Turborepo Documentation](https://turbo.build/repo/docs)
