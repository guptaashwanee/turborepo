#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Custom release script for Turborepo monorepo
 * Creates GitHub releases for apps without npm publishing
 * Fully automated - no manual intervention required
 */

const APPS_DIR = 'apps';

async function getChangedApps() {
  try {
    // Get the last commit message to see if it's a changeset version bump
    const lastCommit = execSync('git log -1 --pretty=%B', { encoding: 'utf-8' }).trim();
    
    console.log('Last commit:', lastCommit);
    
    // Look for changeset version commits
    if (!lastCommit.includes('chore: release version') && !lastCommit.includes('RELEASING:')) {
      console.log('No release commit detected');
      return [];
    }

    // Get apps that have version changes in the last commit
    const changedFiles = execSync('git diff HEAD~1 --name-only', { encoding: 'utf-8' })
      .split('\n')
      .filter(Boolean);

    const changedApps = new Set();
    
    for (const file of changedFiles) {
      if (file.startsWith(`${APPS_DIR}/`) && file.includes('package.json')) {
        const appName = file.split('/')[1];
        console.log(`Found changed app: ${appName}`);
        changedApps.add(appName);
      }
    }

    return Array.from(changedApps);
  } catch (error) {
    console.error('Error getting changed apps:', error.message);
    return [];
  }
}

async function getAppVersion(appName) {
  const packagePath = join(APPS_DIR, appName, 'package.json');
  
  if (!existsSync(packagePath)) {
    throw new Error(`Package.json not found for app: ${appName}`);
  }

  const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
  return packageJson.version;
}

async function checkGitHubCLI() {
  try {
    execSync('gh --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error('❌ GitHub CLI (gh) is not installed or not available');
    console.error('📋 To install GitHub CLI:');
    console.error('   macOS: brew install gh');
    console.error('   Linux: https://github.com/cli/cli/blob/trunk/docs/install_linux.md');
    console.error('   Windows: https://github.com/cli/cli/releases');
    return false;
  }
}

async function checkIfReleaseExists(tagName) {
  try {
    execSync(`git tag -l "${tagName}"`, { encoding: 'utf-8', stdio: 'pipe' });
    const output = execSync(`git tag -l "${tagName}"`, { encoding: 'utf-8' }).trim();
    return output === tagName;
  } catch (error) {
    return false;
  }
}

async function createGitHubRelease(appName, version) {
  const tagName = `${appName}@${version}`;
  const releaseName = `${appName} v${version}`;
  
  // Check if release already exists
  if (await checkIfReleaseExists(tagName)) {
    console.log(`⏭️  Release ${tagName} already exists, skipping...`);
    return;
  }
  
  try {
    console.log(`🏷️  Creating tag: ${tagName}`);
    
    // Create and push tag
    execSync(`git tag -a "${tagName}" -m "Release ${releaseName}"`, { stdio: 'inherit' });
    execSync(`git push origin "${tagName}"`, { stdio: 'inherit' });
    
    // Generate release notes from commits since last tag for this app
    let releaseNotes = `Release ${releaseName}`;
    try {
      const lastTag = execSync(`git describe --tags --abbrev=0 ${tagName}~1 2>/dev/null || echo ""`, { encoding: 'utf-8' }).trim();
      if (lastTag) {
        const commits = execSync(`git log ${lastTag}..${tagName} --oneline --grep="${appName}" || git log ${lastTag}..${tagName} --oneline`, { encoding: 'utf-8' }).trim();
        if (commits) {
          releaseNotes = `Release ${releaseName}\n\n## Changes\n${commits}`;
        }
      }
    } catch (e) {
      console.log('Could not generate detailed release notes, using basic notes');
    }
    
    // Create GitHub release using GitHub CLI
    const releaseCommand = [
      'gh release create',
      `"${tagName}"`,
      `--title "${releaseName}"`,
      `--notes "${releaseNotes}"`,
      '--latest'
    ].join(' ');
    
    console.log(`📋 Creating GitHub release: ${releaseName}`);
    execSync(releaseCommand, { stdio: 'inherit' });
    
    console.log(`✅ Created GitHub release: ${releaseName}`);
  } catch (error) {
    console.error(`❌ Failed to create release for ${appName}:`, error.message);
    // Don't throw - continue with other apps
  }
}

async function main() {
  try {
    console.log('🤖 Automated Release Manager Starting...');
    
    // Check if GitHub CLI is available
    if (!(await checkGitHubCLI())) {
      console.error('💥 GitHub CLI is required for creating releases');
      process.exit(1);
    }
    
    console.log('🔍 Checking for app changes...');
    
    const changedApps = await getChangedApps();
    
    if (changedApps.length === 0) {
      console.log('✨ No apps to release - all done!');
      return;
    }

    console.log(`📦 Found ${changedApps.length} app(s) to release:`, changedApps);

    for (const appName of changedApps) {
      console.log(`\n🚀 Processing release for ${appName}...`);
      
      const version = await getAppVersion(appName);
      console.log(`📋 Version: ${version}`);
      
      await createGitHubRelease(appName, version);
    }

    console.log('\n🎉 Automated release process completed successfully!');
  } catch (error) {
    console.error('💥 Automated release process failed:', error.message);
    process.exit(1);
  }
}

main();
