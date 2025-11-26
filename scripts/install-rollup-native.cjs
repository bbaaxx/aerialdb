#!/usr/bin/env node

// Script to ensure platform-specific native binaries are installed
// This fixes the Cloudflare Pages deployment issue with optional dependencies

const { execSync } = require('child_process');

// List of native binaries that need to be installed for Linux x64
const nativeDependencies = [
  '@rollup/rollup-linux-x64-gnu',
  'lightningcss-linux-x64-gnu',
  '@tailwindcss/oxide-linux-x64-gnu'
];

function installNativeBinary(packageName, requirePath) {
  try {
    // Try to require the native binary
    require(requirePath || packageName);
    console.log(`✓ ${packageName} already installed`);
    return true;
  } catch (error) {
    console.log(`Installing ${packageName}...`);
    try {
      // Install and save to optionalDependencies to prevent npm from removing it
      execSync(`npm install --force --save-optional ${packageName}`, {
        stdio: 'inherit'
      });
      console.log(`✓ Successfully installed ${packageName}`);
      return true;
    } catch (installError) {
      console.warn(`⚠ Could not install ${packageName}:`, installError.message);
      console.warn('This may cause build failures on Linux platforms.');
      return false;
    }
  }
}

// Install all native dependencies
nativeDependencies.forEach(dep => installNativeBinary(dep));
