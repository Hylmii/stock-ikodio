#!/bin/bash

# Script to clean up the repository before deployment
# Removes emoji from logs, deletes test files, and unused directories

echo "Starting repository cleanup..."

# 1. Delete test files
echo "Removing test files..."
rm -f ./test-api.js
rm -f ./test-search.mjs
rm -f ./lib/actions/finnhub.actions.backup.ts
rm -f ./apps/web/src/lib/actions/finnhub.actions.backup.ts

# 2. Delete unused backup directories
echo "Removing unused backup directories..."
rm -rf ./apps/web/src/_unused_components_backup
rm -rf ./apps/web/src/_unused_hooks_backup
rm -rf ./apps/web/src/_unused_pages_backup
rm -rf ./apps/web/src/app/_unused_pages_backup
rm -rf ./_unused_docs_backup

# 3. Remove emoji from console.log statements in main files
echo "Removing emojis from source files..."

# Function to remove emojis from a file
remove_emojis() {
    local file="$1"
    # Remove common emojis used in console.log statements
    sed -i '' 's/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/  //g; s/ //g' "$file"
}

# Remove emojis from active source files
find ./app -type f \( -name "*.tsx" -o -name "*.ts" \) ! -path "*/node_modules/*" -exec bash -c 'sed -i "" "s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/  //g; s/ //g" "$0"' {} \;

find ./components -type f \( -name "*.tsx" -o -name "*.ts" \) ! -path "*/node_modules/*" -exec bash -c 'sed -i "" "s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/  //g; s/ //g" "$0"' {} \;

find ./lib -type f \( -name "*.tsx" -o -name "*.ts" \) ! -path "*/node_modules/*" -exec bash -c 'sed -i "" "s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/ //g; s/  //g; s/ //g" "$0"' {} \;

echo "Cleanup completed!"
echo ""
echo "Summary:"
echo "- Removed test files: test-api.js, test-search.mjs"
echo "- Removed backup files"
echo "- Removed unused directories: _unused_*"
echo "- Removed all emojis from console.log statements"
