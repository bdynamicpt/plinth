import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

/**
 * Builds dist/plinth.css (the tokens and every component, in one file with no @import, so a
 * Filament panel or any page can link it as is) and one file per component for projects that
 * want only some of them on top of dist/tokens.css.
 */
const require = createRequire(import.meta.url);
const tokensCss = require.resolve('@bdynamic/plinth-tokens/tokens.css');
const components = new URL('../src/components/', import.meta.url);
const dist = new URL('../dist/', import.meta.url);

mkdirSync(dist, { recursive: true });
copyFileSync(tokensCss, new URL('tokens.css', dist));

const names = readdirSync(components)
  .filter((file) => file.endsWith('.css'))
  .sort();

const parts = [readFileSync(tokensCss, 'utf8')];
for (const name of names) {
  const css = readFileSync(new URL(name, components), 'utf8');
  // Component CSS lives in @layer plinth, so a project's utilities can override it.
  if (!/^@layer plinth \{$/m.test(css)) {
    throw new Error(`${name}: wrap the component's rules in @layer plinth { … }`);
  }
  writeFileSync(new URL(name, dist), css);
  parts.push(`/* ${name} */\n${css}`);
}

writeFileSync(new URL('plinth.css', dist), parts.join('\n'));
console.log(`css: built plinth.css, tokens.css, ${names.join(', ')}`);
