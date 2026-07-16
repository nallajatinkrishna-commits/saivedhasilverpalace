import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'assets', 'images');
const destDir = path.join(__dirname, 'dist', 'assets', 'images');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  if (fs.existsSync(srcDir)) {
    copyDir(srcDir, destDir);
    console.log('Successfully copied assets/images to dist/assets/images');
  } else {
    console.warn('Warning: Source assets/images folder not found');
  }

  // Copy script.js to dist/script.js
  const srcScript = path.join(__dirname, 'script.js');
  const destScript = path.join(__dirname, 'dist', 'script.js');
  if (fs.existsSync(srcScript)) {
    fs.copyFileSync(srcScript, destScript);
    console.log('Successfully copied script.js to dist/script.js');
  }
} catch (err) {
  console.error('Error copying assets:', err);
}
