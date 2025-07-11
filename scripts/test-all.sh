#!/bin/bash

# Comprehensive Test Suite for Turborepo Monorepo
# Tests: Versions, Build, Semantic Release, Docker Setup

echo "🧪 Turborepo Monorepo Test Suite"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Helper functions
pass_test() {
    echo -e "${GREEN}✅ PASS:${NC} $1"
    ((TESTS_PASSED++))
}

fail_test() {
    echo -e "${RED}❌ FAIL:${NC} $1"
    ((TESTS_FAILED++))
}

warn_test() {
    echo -e "${YELLOW}⚠️  WARN:${NC} $1"
}

info_test() {
    echo -e "${BLUE}ℹ️  INFO:${NC} $1"
}

echo ""
echo "📦 Testing Package Versions"
echo "----------------------------"

# Test 1: Check if all packages have version 0.1.0
info_test "Checking package versions..."
version_check=true

packages=(
    "apps/fms-client/package.json"
    "apps/fms-server/package.json"
    "packages/ui/package.json"
    "packages/logger/package.json"
    "packages/auth/package.json"
    "packages/typescript-config/package.json"
)

for pkg in "${packages[@]}"; do
    if [ -f "$pkg" ]; then
        version=$(grep -o '"version": "[^"]*"' "$pkg" | cut -d'"' -f4)
        if [ "$version" = "0.1.0" ]; then
            pass_test "$pkg has version 0.1.0"
        else
            fail_test "$pkg has version $version (expected 0.1.0)"
            version_check=false
        fi
    else
        fail_test "$pkg not found"
        version_check=false
    fi
done

if [ "$version_check" = true ]; then
    pass_test "All packages have standardized version 0.1.0"
else
    fail_test "Version standardization incomplete"
fi

echo ""
echo "🔧 Testing Build System"
echo "------------------------"

# Test 2: Check if build dependencies are installed
info_test "Checking build dependencies..."
if command -v bun >/dev/null 2>&1; then
    pass_test "Bun is installed"
else
    fail_test "Bun is not installed"
fi

if [ -f "bun.lock" ]; then
    pass_test "Bun lockfile exists"
else
    fail_test "Bun lockfile missing"
fi

# Test 3: Lint and format check
info_test "Running linting..."
if bun run lint:root >/dev/null 2>&1; then
    pass_test "Root linting passed"
else
    fail_test "Root linting failed"
fi

info_test "Running format check..."
if bun run format:root >/dev/null 2>&1; then
    pass_test "Root formatting passed"
else
    fail_test "Root formatting failed"
fi

# Test 4: TypeScript compilation
info_test "Running TypeScript checks..."
if bun run build >/dev/null 2>&1; then
    pass_test "Build process completed successfully"
else
    fail_test "Build process failed"
fi

echo ""
echo "🚀 Testing Semantic Release Configuration"
echo "----------------------------------------"

# Test 5: Semantic release configuration
if [ -f ".releaserc.json" ]; then
    pass_test "Semantic release config exists"
    
    # Check if the config is valid JSON
    if jq empty .releaserc.json >/dev/null 2>&1; then
        pass_test "Semantic release config is valid JSON"
    else
        fail_test "Semantic release config has invalid JSON syntax"
    fi
else
    fail_test "Semantic release config missing"
fi

# Test 6: Semantic release dependencies
semantic_deps=("semantic-release" "semantic-release-gitmoji" "@semantic-release/changelog" "@semantic-release/github")
for dep in "${semantic_deps[@]}"; do
    if grep -q "\"$dep\"" package.json; then
        pass_test "Dependency $dep is installed"
    else
        fail_test "Dependency $dep is missing"
    fi
done

# Test 7: Semantic release dry run
info_test "Testing semantic release dry run..."
if timeout 30s bun run release:dry >/dev/null 2>&1; then
    pass_test "Semantic release dry run completed"
else
    warn_test "Semantic release dry run timed out or failed (may need git repository)"
fi

echo ""
echo "🐳 Testing Docker Configuration"
echo "-------------------------------"

# Test 8: Docker files existence
docker_files=(
    "docker-compose.yml"
    ".dockerignore"
    "apps/fms-server/Dockerfile"
    "apps/fms-client/Dockerfile"
    "apps/fms-client/nginx.conf"
)

for file in "${docker_files[@]}"; do
    if [ -f "$file" ]; then
        pass_test "Docker file $file exists"
    else
        fail_test "Docker file $file missing"
    fi
done

# Test 9: Docker compose syntax validation
if command -v docker-compose >/dev/null 2>&1; then
    if docker-compose config >/dev/null 2>&1; then
        pass_test "docker-compose.yml syntax is valid"
    else
        fail_test "docker-compose.yml has syntax errors"
    fi
else
    warn_test "docker-compose not installed, skipping syntax validation"
fi

# Test 10: Nginx config syntax
if command -v nginx >/dev/null 2>&1; then
    if nginx -t -c "$(pwd)/apps/fms-client/nginx.conf" >/dev/null 2>&1; then
        pass_test "nginx.conf syntax is valid"
    else
        fail_test "nginx.conf has syntax errors"
    fi
else
    warn_test "nginx not installed, skipping syntax validation"
fi

# Test 11: Docker scripts in package.json
docker_scripts=("docker:build" "docker:up" "docker:down" "docker:logs" "docker:clean")
for script in "${docker_scripts[@]}"; do
    if grep -q "\"$script\"" package.json; then
        pass_test "Docker script $script exists in package.json"
    else
        fail_test "Docker script $script missing from package.json"
    fi
done

echo ""
echo "📝 Testing Documentation"
echo "------------------------"

# Test 12: Documentation files
docs=(
    "docs/SEMANTIC_RELEASE.md"
    "docs/DOCKER.md"
    "SEMANTIC_RELEASE_QUICKSTART.md"
    "CHANGELOG.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        pass_test "Documentation file $doc exists"
    else
        fail_test "Documentation file $doc missing"
    fi
done

echo ""
echo "🔍 Testing GitHub Actions"
echo "-------------------------"

# Test 13: GitHub Actions workflow
if [ -f ".github/workflows/release.yml" ]; then
    pass_test "GitHub Actions workflow exists"
    
    # Check for required jobs
    if grep -q "jobs:" .github/workflows/release.yml; then
        pass_test "Workflow has jobs defined"
    else
        fail_test "Workflow missing jobs definition"
    fi
    
    required_jobs=("setup" "quality" "build" "test" "release")
    for job in "${required_jobs[@]}"; do
        if grep -q "$job:" .github/workflows/release.yml; then
            pass_test "Workflow has $job job"
        else
            fail_test "Workflow missing $job job"
        fi
    done
else
    fail_test "GitHub Actions workflow missing"
fi

echo ""
echo "🎯 Testing Application Structure"
echo "--------------------------------"

# Test 14: Application files
app_files=(
    "apps/fms-server/src/index.ts"
    "apps/fms-client/src/main.tsx"
    "apps/fms-server/package.json"
    "apps/fms-client/package.json"
)

for file in "${app_files[@]}"; do
    if [ -f "$file" ]; then
        pass_test "Application file $file exists"
    else
        fail_test "Application file $file missing"
    fi
done

# Test 15: Package structure
shared_packages=(
    "packages/ui/package.json"
    "packages/logger/package.json"
    "packages/auth/package.json"
    "packages/typescript-config/package.json"
)

for pkg in "${shared_packages[@]}"; do
    if [ -f "$pkg" ]; then
        pass_test "Shared package $pkg exists"
    else
        fail_test "Shared package $pkg missing"
    fi
done

echo ""
echo "📊 Test Results Summary"
echo "======================="
echo -e "Tests passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Total tests: $((TESTS_PASSED + TESTS_FAILED))"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n🎉 ${GREEN}All tests passed! Your monorepo is ready.${NC}"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Make your first commit: bun run commit"
    echo "2. Test semantic release: bun run release:dry"  
    echo "3. Test Docker build: bun run docker:build"
    echo "4. Start applications: bun run docker:up"
    exit 0
else
    echo -e "\n❌ ${RED}Some tests failed. Please fix the issues above.${NC}"
    exit 1
fi
