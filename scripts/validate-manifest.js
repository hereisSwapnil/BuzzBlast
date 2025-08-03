#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating manifest.json...');

const manifestPath = path.join(__dirname, '..', 'dist', 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error('❌ manifest.json not found in dist/ folder');
  process.exit(1);
}

try {
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestContent);
  
  // Basic validation
  const requiredFields = ['manifest_version', 'name', 'version', 'description'];
  const missingFields = requiredFields.filter(field => !manifest[field]);
  
  if (missingFields.length > 0) {
    console.error(`❌ Missing required fields: ${missingFields.join(', ')}`);
    process.exit(1);
  }
  
  // Validate manifest version
  if (manifest.manifest_version !== 3) {
    console.error('❌ Manifest version must be 3');
    process.exit(1);
  }
  
  // Validate content scripts
  if (!manifest.content_scripts || !Array.isArray(manifest.content_scripts)) {
    console.error('❌ Content scripts must be an array');
    process.exit(1);
  }
  
  // Check if required files exist
  const requiredFiles = [
    'content.js',
    'background.js',
    'popup.html',
    'popup.js',
    'content.css'
  ];
  
  const missingFiles = requiredFiles.filter(file => {
    const filePath = path.join(__dirname, '..', 'dist', file);
    return !fs.existsSync(filePath);
  });
  
  if (missingFiles.length > 0) {
    console.error(`❌ Missing required files: ${missingFiles.join(', ')}`);
    process.exit(1);
  }
  
  // Check icons
  const iconSizes = [16, 48, 128];
  const missingIcons = iconSizes.filter(size => {
    const iconPath = path.join(__dirname, '..', 'dist', 'icons', `logo${size}.png`);
    return !fs.existsSync(iconPath);
  });
  
  if (missingIcons.length > 0) {
    console.warn(`⚠️  Missing PNG icons: ${missingIcons.join(', ')}`);
  } else {
    console.log('✅ All PNG icons found');
  }
  
  console.log('✅ Manifest validation passed!');
  console.log(`📦 Extension: ${manifest.name} v${manifest.version}`);
  console.log(`📝 Description: ${manifest.description}`);
  
} catch (error) {
  console.error('❌ Error validating manifest:', error.message);
  process.exit(1);
} 