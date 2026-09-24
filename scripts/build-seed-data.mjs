import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const curriculumDir = path.resolve(__dirname, '../lib/db/curriculum');
const outputDir = path.resolve(__dirname, './data');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(curriculumDir).filter((f) => f.endsWith('.ts'));

for (const file of files) {
  const content = fs.readFileSync(path.join(curriculumDir, file), 'utf-8');
  // Strip import statements for models/types and type annotations
  let jsContent = content
    .replace(/import\s+{[^}]+}\s+from\s+['"]@\/models\/types['"];?\s*/g, '')
    .replace(/:\s*(?:Post|Category|Quiz|DailyWord|User)\[\]/g, '')
    .replace(/:\s*(?:Post|Category|Quiz|DailyWord|User)(?=\s*=)/g, '');

  const outFileName = file.replace(/\.ts$/, '.mjs');
  fs.writeFileSync(path.join(outputDir, outFileName), jsContent, 'utf-8');
  console.log(`✓ Generated scripts/data/${outFileName}`);
}

console.log('✨ All curriculum data converted to scripts/data/*.mjs');
