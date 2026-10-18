import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
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
// The default typefaces (ADR 3), self-hosted from npm: each package's woff2 files and its licence
// go in fonts/<family>/, and fonts/index.css gathers their @font-face rules. Each family is split
// by script, so a browser downloads only the files a page needs.
const fontFaces = [
  '/* Geist and Geist Mono, from @fontsource-variable (SIL Open Font Licence). */',
];
for (const family of ['geist', 'geist-mono']) {
  const css = require.resolve(`@fontsource-variable/${family}`);
  const folder = new URL(`fonts/${family}/`, dist);
  mkdirSync(folder, { recursive: true });
  copyFileSync(
    require.resolve(`@fontsource-variable/${family}/LICENSE`),
    new URL('LICENSE', folder),
  );
  const faces = readFileSync(css, 'utf8');
  for (const [, file] of faces.matchAll(/url\(\.\/files\/([^)]+)\)/g)) {
    copyFileSync(`${dirname(css)}/files/${file}`, new URL(file!, folder));
  }
  fontFaces.push(faces.replaceAll('url(./files/', `url(./${family}/`));
}
writeFileSync(new URL('fonts/index.css', dist), fontFaces.join('\n'));

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
