#!/usr/bin/env node

/**
 * Cleanup Script
 * Removes JSON test files and other temporary data files
 * 
 * Usage: node scripts/cleanup-json.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const filePatternsToRemove = [
  '**/mock-data.json',
  '**/test-data.json',
  '**/fake-*.json',
  '**/seed-*.json',
  '**/*.test.json',
  '**/api/mock/**/*.json',
  '**/data/**/*.json',
];

console.log('🧹 Cleanup Script');
console.log('=================\n');

function removeFiles(dir, patterns) {
  let removed = 0;

  function traverse(currentDir) {
    try {
      const files = fs.readdirSync(currentDir);

      for (const file of files) {
        const filePath = path.join(currentDir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
          // Skip node_modules and hidden directories
          if (file !== 'node_modules' && file !== '.git' && !file.startsWith('.')) {
            traverse(filePath);
          }
        } else {
          // Check if file matches any pattern
          for (const pattern of patterns) {
            const patternParts = pattern.split('/');
            const fileName = patternParts[patternParts.length - 1];

            if (matchesPattern(file, fileName) || filePath.includes(pattern.replace('**/', ''))) {
              try {
                fs.unlinkSync(filePath);
                console.log(`  ✓ Removed: ${path.relative(rootDir, filePath)}`);
                removed++;
              } catch (err) {
                console.log(`  ✗ Failed to remove: ${path.relative(rootDir, filePath)}`);
              }
            }
          }
        }
      }
    } catch (err) {
      // Skip directories we can't read
    }
  }

  traverse(dir);
  return removed;
}

function matchesPattern(fileName, pattern) {
  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');

  return new RegExp(`^${regexPattern}$`).test(fileName);
}

try {
  console.log('🔍 Scanning for JSON test files...\n');
  const removed = removeFiles(rootDir, filePatternsToRemove);

  console.log(`\n✅ Cleanup Complete!`);
  console.log(`   Files removed: ${removed}`);
  console.log('\n');
  process.exit(0);
} catch (error) {
  console.error('❌ Cleanup Error:', error.message);
  process.exit(1);
}
