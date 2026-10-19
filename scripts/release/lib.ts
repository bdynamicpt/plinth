/**
 * What the release scripts share: the packages that carry Plinth's one version, and the
 * changelog section a version adds.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** The workspaces Changesets versions together (the `fixed` group in .changeset/config.json). */
export const versioned = ['tokens', 'css', 'vue', 'react', 'blade'].map(
  (name) => `packages/${name}`,
);

export type Bump = 'major' | 'minor' | 'patch' | 'none';

export interface Changeset {
  summary: string;
  releases: { name: string; type: Bump }[];
}

const headings = { major: 'Breaking changes', minor: 'New', patch: 'Fixes' } as const;
const order: Bump[] = ['major', 'minor', 'patch', 'none'];

/** The largest bump a changeset asks for, across the packages it names. */
export function bumpOf(changeset: Changeset): Bump {
  return (
    order.find((bump) => changeset.releases.some((release) => release.type === bump)) ?? 'none'
  );
}

/** The `## version` section for CHANGELOG.md: one line per changeset, grouped by bump. */
export function changelogSection(version: string, changesets: Changeset[], date: string): string {
  const lines = [`## ${version} (${date})`];
  for (const bump of ['major', 'minor', 'patch'] as const) {
    const entries = changesets.filter((changeset) => bumpOf(changeset) === bump);
    if (entries.length === 0) continue;
    lines.push('', `### ${headings[bump]}`, '');
    for (const { summary } of entries) {
      const [first = '', ...rest] = summary.trim().split('\n');
      lines.push(`- ${first}`, ...rest.map((line) => (line ? `  ${line}` : '')));
    }
  }
  return lines.join('\n');
}

const title = '# Changelog';

/** Puts a section at the top of the changelog, under its title. */
export function prependSection(changelog: string, section: string): string {
  const body = changelog.startsWith(title)
    ? changelog.slice(title.length).trim()
    : changelog.trim();
  return [title, section, body].filter(Boolean).join('\n\n') + '\n';
}

/** Reads a package.json. */
export function readPackage(
  root: string,
  dir = '.',
): { name: string; version: string; private?: boolean } {
  return JSON.parse(readFileSync(join(root, dir, 'package.json'), 'utf8'));
}

/**
 * The one version every versioned workspace has. Throws if they differ, which means the
 * `fixed` group in .changeset/config.json no longer covers them all.
 */
export function sharedVersion(root: string): string {
  const versions = new Map(versioned.map((dir) => [dir, readPackage(root, dir).version]));
  const distinct = new Set(versions.values());
  if (distinct.size !== 1) {
    const list = [...versions].map(([dir, version]) => `${dir} ${version}`).join(', ');
    throw new Error(`The packages should share one version, but they have ${list}.`);
  }
  return [...distinct][0] as string;
}
