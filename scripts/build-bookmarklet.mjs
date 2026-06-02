import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const sourcePath = join(root, 'src', 'emptyclassroom.js');
const outDir = join(root, 'dist');
const outPath = join(outDir, 'bookmarklet.txt');

const source = readFileSync(sourcePath, 'utf8').trim();
const bookmarklet = `javascript:void(${encodeURIComponent(source)})`;

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, bookmarklet, 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`Length: ${bookmarklet.length} characters`);
