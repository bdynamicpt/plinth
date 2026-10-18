import { copyFileSync, cpSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

/**
 * Builds dist/plinth.css (the tokens and every component, in one file with no @import, so a
 * Filament panel or any page can link it as is) and one file per component for projects that
 * want only some of them on top of dist/tokens.css.
 */
const require = createRequire(import.meta.url);
const tokensCss = require.resolve('@bdynamic/plinth-tokens/tokens.css');
const tokenNames = new Set(
  (
    JSON.parse(readFileSync(require.resolve('@bdynamic/plinth-tokens/tokens.json'), 'utf8')) as {
      name: string;
    }[]
  ).map((token) => token.name),
);
const components = new URL('../src/components/', import.meta.url);
const dist = new URL('../dist/', import.meta.url);

mkdirSync(dist, { recursive: true });
copyFileSync(tokensCss, new URL('tokens.css', dist));
// The default typefaces, with their @font-face rules in fonts/index.css (see fonts/README.md).
cpSync(new URL('../fonts/', import.meta.url), new URL('fonts/', dist), { recursive: true });

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
  // Every var(--plinth-…) must be a token or one of the component's own custom properties
  // (--plinth-<component>-…, defined in the same file).
  const component = name.replace(/\.css$/, '');
  for (const [, used] of css.matchAll(/var\((--plinth-[a-z0-9-]+)/g)) {
    const own = used!.startsWith(`--plinth-${component}-`) && css.includes(`${used}:`);
    if (!tokenNames.has(used!) && !own) {
      throw new Error(`${name}: ${used} is not a Plinth token`);
    }
  }
  writeFileSync(new URL(name, dist), css);
  parts.push(`/* ${name} */\n${css}`);
}

writeFileSync(new URL('plinth.css', dist), parts.join('\n'));
console.log(`css: built plinth.css, tokens.css, fonts/, ${names.join(', ')}`);
