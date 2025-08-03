#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple SVG to PNG conversion using Canvas (if available) or create placeholder
// For production, you might want to use a proper image processing library like sharp

const iconSizes = [16, 48, 128];

console.log('🎨 Generating PNG icons...');

// Create the dist/icons directory if it doesn't exist
const distIconsDir = path.join(__dirname, '..', 'dist', 'icons');
if (!fs.existsSync(distIconsDir)) {
  fs.mkdirSync(distIconsDir, { recursive: true });
}

// For now, we'll copy the SVG files and create simple PNG placeholders
// In a real production build, you'd convert SVG to PNG using a library like sharp
iconSizes.forEach(size => {
  const svgPath = path.join(__dirname, '..', 'icons', `icon${size}.svg`);
  const distSvgPath = path.join(distIconsDir, `icon${size}.svg`);
  
  if (fs.existsSync(svgPath)) {
    fs.copyFileSync(svgPath, distSvgPath);
    console.log(`✅ Copied icon${size}.svg`);
  } else {
    console.warn(`⚠️  Warning: icon${size}.svg not found`);
  }
});

// Copy the actual logo PNG files
const logoFiles = ['logo16.png', 'logo48.png', 'logo128.png'];

logoFiles.forEach(filename => {
  const sourcePath = path.join(__dirname, '..', 'icons', filename);
  const destPath = path.join(distIconsDir, filename);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${filename}`);
  } else {
    console.warn(`⚠️  Warning: ${filename} not found`);
  }
});

console.log('🎉 Icon generation complete!');
console.log('📝 Logo PNG files have been copied successfully.'); 