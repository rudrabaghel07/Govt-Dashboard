const fs = require('fs');
const path = require('path');

const inputPath = path.resolve(__dirname, '..', 'mongo_upload.json');
const outNdjson = path.resolve(__dirname, '..', 'mongo_upload.ndjson');
const outFixed = path.resolve(__dirname, '..', 'mongo_upload.fixed.json');

const text = fs.readFileSync(inputPath, 'utf8');
let objs = [];
let i = 0;
while (i < text.length) {
  // find next '{'
  if (text[i] === '{') {
    let start = i;
    let depth = 0;
    let j = i;
    for (; j < text.length; j++) {
      if (text[j] === '{') depth++;
      else if (text[j] === '}') {
        depth--;
        if (depth === 0) {
          let slice = text.slice(start, j + 1);
          // try parse
          try {
            const obj = JSON.parse(slice);
            objs.push(obj);
            i = j + 1;
            break;
          } catch (err) {
            // If parse fails, attempt to clean common issues: replace single quotes, remove trailing commas
            // but to avoid unsafe transformations, just advance one char and continue searching
            // fallback: try to recover by finding next '}' and continue
            continue;
          }
        }
      }
    }
    // if loop ended without finding a balanced object, break to avoid infinite loop
    if (j >= text.length) break;
  } else {
    i++;
  }
}

if (objs.length === 0) {
  console.error('No objects extracted. File may be too corrupted.');
  process.exit(2);
}

// write NDJSON
const nd = objs.map(o => JSON.stringify(o)).join('\n') + '\n';
fs.writeFileSync(outNdjson, nd, 'utf8');
console.log('Wrote', outNdjson, 'with', objs.length, 'objects');

// write fixed array JSON
fs.writeFileSync(outFixed, JSON.stringify(objs, null, 2), 'utf8');
console.log('Wrote', outFixed);
