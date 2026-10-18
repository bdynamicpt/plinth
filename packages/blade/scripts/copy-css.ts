import { copyFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

// Ships the built CSS inside the Composer package, so a Filament panel needs no Node build.
const require = createRequire(import.meta.url);
const dist = new URL('../resources/dist/', import.meta.url);

mkdirSync(dist, { recursive: true });
copyFileSync(require.resolve('@bdynamic/plinth-css'), new URL('plinth.css', dist));
console.log('blade: copied plinth.css to resources/dist');
