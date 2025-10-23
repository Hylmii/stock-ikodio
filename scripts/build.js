#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log(' Building all packages...');

try {
  // Build packages first (they're dependencies of apps)
  execSync('npm run build --workspace=packages/utils', { stdio: 'inherit' });
  execSync('npm run build --workspace=packages/ui', { stdio: 'inherit' });
  
  // Then build apps
  execSync('npm run build --workspace=apps/web', { stdio: 'inherit' });
  
  console.log(' All packages built successfully!');
} catch (error) {
  console.error(' Build failed:', error.message);
  process.exit(1);
}