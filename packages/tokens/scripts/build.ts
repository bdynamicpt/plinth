import { mkdirSync, writeFileSync } from 'node:fs';
import { buildCss, buildTailwindTheme } from '../src/generate.ts';
import * as tokens from '../src/tokens.ts';

const dist = new URL('../dist/', import.meta.url);
mkdirSync(dist, { recursive: true });

const files: Record<string, string> = {
  'tokens.css': buildCss(),
  'tokens.json': `${JSON.stringify(tokens, null, 2)}\n`,
  'tailwind-theme.css': buildTailwindTheme(),
};

for (const [name, contents] of Object.entries(files)) {
  writeFileSync(new URL(name, dist), contents);
}

console.log(`tokens: wrote ${Object.keys(files).join(', ')}`);
