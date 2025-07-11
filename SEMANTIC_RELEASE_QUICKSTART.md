# Semantic Release Quick Start

## 🚀 Getting Started

Your turborepo is now configured with semantic-release! Here's how to use it:

### 1. Making Commits
Use the interactive commit tool to ensure proper gitmoji formatting:

```bash
bun run commit
```

This will guide you through:
- Selecting the appropriate gitmoji emoji
- Writing a clear commit message
- Following the project's commit convention

### 2. Testing Releases (Dry Run)
Before making actual releases, test what would happen:

```bash
bun run release:dry
```

This shows you:
- What version would be released
- What commits would be included
- What the changelog would look like

### 3. Manual Release (Local)
For immediate releases from your local machine:

```bash
bun run release
```

**⚠️ Prerequisites:**
- Clean working directory
- On main/master branch
- Have `GITHUB_TOKEN` environment variable set

### 4. Automatic Releases (Recommended)
The preferred way is through GitHub Actions:

1. Push commits to `main` branch
2. GitHub Action automatically:
   - Runs quality checks
   - Builds the project
   - Runs tests
   - Creates release if warranted

### 5. Branch Strategy
- **`main`** → Production releases (`1.0.0`)
- **`develop`** → Beta releases (`1.0.0-beta.1`)
- **`release`** → Release candidates (`1.0.0-rc.1`)

## 📝 Commit Examples

### Major Release (Breaking Changes)
```bash
# Will create version 2.0.0
💥 remove deprecated authentication API

BREAKING CHANGE: The old auth.login() method has been removed.
Use auth.signIn() instead.
```

### Minor Release (New Features)
```bash
# Will create version 1.1.0
✨ add user profile management

Users can now update their profile information including
avatar, bio, and contact preferences.
```

### Patch Release (Bug Fixes)
```bash
# Will create version 1.0.1
🐛 fix navigation menu not closing on mobile

The hamburger menu now properly closes when a navigation
item is selected on mobile devices.
```

## 🛠️ Setup Repository (One Time)

### GitHub Repository Settings
1. Go to your repository → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `GITHUB_TOKEN` (automatically provided by GitHub)
   - `NPM_TOKEN` (optional, only if publishing to npm)
   - `TURBO_TOKEN` (optional, for Turbo remote caching)

### Protect Main Branch
1. Go to Settings → Branches
2. Add branch protection rule for `main`:
   - Require status checks to pass
   - Require pull request reviews
   - Include administrators

## 🔧 Configuration Files

- **`.releaserc.json`** - Main semantic-release configuration
- **`.github/workflows/release.yml`** - GitHub Actions workflow
- **`commitlint.config.js`** - Commit message linting
- **`docs/SEMANTIC_RELEASE.md`** - Detailed documentation

## 🎯 Next Steps

1. **Make your first commit:**
   ```bash
   bun run commit
   # Select ✨ :sparkles: and describe your feature
   ```

2. **Test the release process:**
   ```bash
   bun run release:dry
   ```

3. **Set up GitHub secrets** (see above)

4. **Make your first release** by pushing to main!

## 💡 Tips

- Use meaningful commit messages
- One logical change per commit
- Test your changes before committing
- Use the dry-run mode to preview releases
- Check the generated CHANGELOG.md

## 🆘 Need Help?

- Check `docs/SEMANTIC_RELEASE.md` for detailed documentation
- Review the [Gitmoji guide](https://gitmoji.dev/)
- See [semantic-release documentation](https://semantic-release.gitbook.io/)

Happy releasing! 🎉
