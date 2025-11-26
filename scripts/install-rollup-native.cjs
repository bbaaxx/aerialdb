#!/usr/bin/env node

// Script to ensure platform-specific Rollup binaries are installed
// This fixes the Cloudflare Pages deployment issue with optional dependencies

const { execSync } = require('child_process');

try {
  // Try to require the Linux x64 native binary
  require('@rollup/rollup-linux-x64-gnu');
  console.log('✓ Rollup native binary already installed');
} catch (error) {
  console.log('Installing @rollup/rollup-linux-x64-gnu...');
  try {
    // Use --force to install even on non-Linux platforms (needed for CI/CD)
    execSync('npm install --no-save --force @rollup/rollup-linux-x64-gnu', {
      stdio: 'inherit'
    });
    console.log('✓ Successfully installed Rollup native binary');
  } catch (installError) {
    console.warn('⚠ Could not install @rollup/rollup-linux-x64-gnu:', installError.message);
    console.warn('This may cause build failures on Linux platforms.');
  }
}
