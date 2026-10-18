import { copyFileSync, cpSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createRequire } from 'node:module';

// Ships the built CSS inside the Composer package, so a Filament panel needs no Node build.
const require = createRequire(import.meta.url);
const dist = new URL('../resources/dist/', import.meta.url);

mkdirSync(dist, { recursive: true });
const css = require.resolve('@bdynamic/plinth-css');
copyFileSync(css, new URL('plinth.css', dist));
cpSync(`${dirname(css)}/fonts/`, new URL('fonts/', dist), { recursive: true });
console.log('blade: copied plinth.css and fonts/ to resources/dist');
