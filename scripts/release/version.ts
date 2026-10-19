/**
 * `npm run release:version`: turns the pending changesets into the next version.
 *
 * Changesets bumps the four workspaces together (they are one `fixed` group). This script then
 * gives that version to the root package.json, which is the npm package `@bdynamic/plinth`, and
 * writes the changelog: one CHANGELOG.md for both registries, instead of one per workspace.
 * The Composer package has no version field; Packagist reads the tag `npm run release` makes.
 */
import readChangesets from '@changesets/read';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { changelogSection, prependSection, readPackage, sharedVersion } from './lib.ts';

const root = process.cwd();
const changesets = await readChangesets(root);
if (changesets.length === 0) {
  console.log('No changesets, so there is nothing to version.');
  process.exit(0);
}

execFileSync('npx', ['changeset', 'version'], { stdio: 'inherit' });
const version = sharedVersion(root);

const manifest = join(root, 'package.json');
const pkg = JSON.parse(readFileSync(manifest, 'utf8'));
pkg.version = version;
writeFileSync(manifest, JSON.stringify(pkg, null, 2) + '\n');

const changelog = join(root, 'CHANGELOG.md');
const today = new Date().toISOString().slice(0, 10);
const existing = existsSync(changelog) ? readFileSync(changelog, 'utf8') : '';
writeFileSync(changelog, prependSection(existing, changelogSection(version, changesets, today)));

// The lockfile records each workspace's version.
execFileSync(
  'npm',
  ['install', '--package-lock-only', '--ignore-scripts', '--no-audit', '--no-fund'],
  {
    stdio: 'inherit',
  },
);
execFileSync('npx', ['prettier', '--write', 'CHANGELOG.md'], { stdio: 'inherit' });

console.log(`\n${readPackage(root).name} and bdynamicpt/plinth are now ${version}.`);
console.log('Commit this in a pull request; once it is merged, run `npm run release` on main.');
