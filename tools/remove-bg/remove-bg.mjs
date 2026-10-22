import { removeBackground } from '@imgly/background-removal-node';
import fs from 'node:fs';
import path from 'node:path';
const [, , outDir, ...files] = process.argv;
for (const f of files) {
  const blob = await removeBackground(path.resolve(f), { model: 'medium', output: { format: 'image/png' } });
  const out = path.join(outDir, path.basename(f, path.extname(f)) + '.png');
  fs.writeFileSync(out, Buffer.from(await blob.arrayBuffer()));
  console.log('wrote', out);
}
