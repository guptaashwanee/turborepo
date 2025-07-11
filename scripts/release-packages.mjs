#!/usr/bin/env node

/**
 * Multi-package release script for semantic-release
 * This script can be used to release individual packages in the monorepo
 *
 * Usage:
 * - Release all packages: bun run release:packages
 * - Release specific package: bun run release:packages packages/ui
 */

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const packages = [
	"packages/ui",
	"packages/logger",
	"packages/auth",
	"packages/typescript-config",
];

const apps = ["apps/fms-client", "apps/fms-server"];

function releasePackage(packagePath) {
	const packageJsonPath = path.join(packagePath, "package.json");

	try {
		const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
		const packageName = packageJson.name;

		// Skip private packages unless they're apps
		if (packageJson.private && !packagePath.startsWith("apps/")) {
			console.log(`⏭️  Skipping private package ${packageName}`);
			return;
		}

		console.log(`\n🚀 Releasing ${packageName} from ${packagePath}...`);

		// Run semantic-release from the package directory
		const command = "npx semantic-release";
		execSync(command, {
			cwd: packagePath,
			stdio: "inherit",
			env: {
				...process.env,
				npm_config_tag_format: `${packageName}-v\${version}`,
			},
		});

		console.log(`✅ Successfully released ${packageName}`);
	} catch (error) {
		console.error(`❌ Failed to release ${packagePath}:`, error.message);
	}
}

// Main execution
const targetPackage = process.argv[2];

if (targetPackage) {
	// Release specific package
	if (packages.includes(targetPackage) || apps.includes(targetPackage)) {
		releasePackage(targetPackage);
	} else {
		console.error(
			`❌ Package '${targetPackage}' not found. Available packages:`,
		);
		console.log("Packages:", packages.join(", "));
		console.log("Apps:", apps.join(", "));
	}
} else {
	// Release all packages
	console.log("🚀 Starting multi-package release...");

	for (const pkg of packages) {
		releasePackage(pkg);
	}

	console.log("\n✅ Multi-package release completed!");
}
