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

  // Bake data/db.json products into script.js fallback and write to both locations
  const srcScript = path.join(__dirname, 'script.js');
  const destScript = path.join(__dirname, 'dist', 'script.js');
  const dbPath = path.join(__dirname, 'data', 'db.json');

  if (fs.existsSync(srcScript)) {
    let scriptContent = fs.readFileSync(srcScript, 'utf8');

    if (fs.existsSync(dbPath)) {
      try {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        const products = db.products || [];

        const startPattern = 'products = [';

        // Find the index of products = [ that is the fallback array (not let products = [];)
        let startIndex = -1;
        let searchIndex = 0;
        while (true) {
          const idx = scriptContent.indexOf(startPattern, searchIndex);
          if (idx === -1) break;
          if (scriptContent[idx + startPattern.length] !== ']') {
            startIndex = idx;
            break;
          }
          searchIndex = idx + 1;
        }

        let endIndex = -1;
        let matchedLen = 0;
        const patterns = [
          '];\r\n    }',
          '];\n    }',
          ']\r\n    }',
          ']\n    }'
        ];

        if (startIndex !== -1) {
          for (let pat of patterns) {
            const idx = scriptContent.indexOf(pat, startIndex);
            if (idx !== -1) {
              endIndex = idx;
              matchedLen = pat.length;
              break;
            }
          }
        }

        if (startIndex !== -1 && endIndex !== -1) {
          const before = scriptContent.substring(0, startIndex);
          const after = scriptContent.substring(endIndex + matchedLen);

          // Format products JSON neatly with indentation
          const productsJson = `products = ${JSON.stringify(products, null, 2)};`;
          
          scriptContent = before + productsJson + '\n    }' + after;
          
          // Save back to source script.js so they remain in sync
          fs.writeFileSync(srcScript, scriptContent, 'utf8');
          console.log('Successfully baked data/db.json products into source script.js fallback');
        } else {
          console.warn('Warning: Could not find products fallback array patterns in script.js');
        }
      } catch (dbErr) {
        console.error('Failed to parse db.json or bake script.js:', dbErr);
      }
    }

    // Write the baked script to dist/script.js
    fs.writeFileSync(destScript, scriptContent, 'utf8');
    console.log('Successfully copied (and baked) script.js to dist/script.js');
  }

  // Copy debug-images.html to dist/debug-images.html
  const srcDebug = path.join(__dirname, 'debug-images.html');
  const destDebug = path.join(__dirname, 'dist', 'debug-images.html');
  if (fs.existsSync(srcDebug)) {
    fs.copyFileSync(srcDebug, destDebug);
    console.log('Successfully copied debug-images.html to dist/debug-images.html');
  }
} catch (err) {
  console.error('Error copying assets:', err);
}
