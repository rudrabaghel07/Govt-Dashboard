import fs from 'fs';

const inPath = './mongo_upload.json';
const outPath = './mongo_upload.ndjson';

if (!fs.existsSync(inPath)) {
  console.error('Input file not found:', inPath);
  process.exit(1);
}

const raw = fs.readFileSync(inPath, 'utf8');
let arr;
try {
  arr = JSON.parse(raw);
} catch (err) {
  console.error('Failed to parse JSON:', err.message);
  process.exit(1);
}

const out = arr.map(obj => JSON.stringify(obj)).join('\n');
fs.writeFileSync(outPath, out, 'utf8');
console.log('Wrote', outPath, 'with', arr.length, 'documents');
