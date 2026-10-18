/**
 * Builds the tokens in tokens/*.json (DTCG) with Style Dictionary into dist/:
 *
 * - tokens.css          the custom properties, in @layer plinth, light and dark
 * - index.js, .d.ts     every token with its tier, value(s) and var(); `vars` for JS
 * - tokens.json         the same list as data
 * - tailwind-theme.css  the semantic tokens as Tailwind v4 theme variables
 *
 * Tiers: primitives (tokens/primitives.json, named --plinth-ref-*), semantic (semantic.json and
 * semantic.<theme>.json) and component (component.json). See docs/adr/0001.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import StyleDictionary from 'style-dictionary';
import type { TransformedToken } from 'style-dictionary/types';
import { getReferences } from 'style-dictionary/utils';

type Tier = 'primitive' | 'semantic' | 'component';
type Theme = 'light' | 'dark';

export interface Token {
  /** Path in the source, e.g. ['color', 'surface']. */
  path: string[];
  /** Custom property name, e.g. --plinth-color-surface. */
  name: string;
  /** var(--plinth-…) */
  cssVar: string;
  tier: Tier;
  type: string;
  description?: string;
  /** The resolved value (light theme for themed tokens). */
  value: string;
  /** The resolved dark value, for tokens that change with the theme. */
  dark?: string;
  /** The token this one points to, e.g. ref.color.neutral.50 (light theme). */
  ref?: string;
  darkRef?: string;
  /** What the CSS assigns: a var() of the referenced token, or the value. */
  css: string;
  darkCss?: string;
}

const root = new URL('../', import.meta.url);
const source = (file: string) => fileURLToPath(new URL(`tokens/${file}`, root));
const tierOf: Record<string, Tier> = {
  'primitives.json': 'primitive',
  'semantic.json': 'semantic',
  'semantic.light.json': 'semantic',
  'semantic.dark.json': 'semantic',
  'component.json': 'component',
};
const banner = '/* Built from packages/tokens/tokens/*.json. Do not edit by hand. */';

async function load(theme: Theme): Promise<TransformedToken[]> {
  const sd = new StyleDictionary({
    source: ['primitives.json', 'semantic.json', `semantic.${theme}.json`, 'component.json'].map(
      source,
    ),
    usesDtcg: true,
    log: { verbosity: 'silent', warnings: 'disabled' },
    platforms: {
      css: {
        prefix: 'plinth',
        transforms: ['name/kebab', 'fontFamily/css', 'cubicBezier/css', 'shadow/css/shorthand'],
      },
    },
  });
  const { allTokens, tokens } = await sd.getPlatformTokens('css');

  // A token that is only a reference becomes var(--that-token), so overriding the referenced
  // token flows through; anything else is written as its value.
  for (const token of allTokens) {
    const original = token.original.$value;
    if (typeof original === 'string' && /^\{[^}]+\}$/.test(original)) {
      const [target] = getReferences(original, tokens, { usesDtcg: true });
      token.css = `var(--${target!.name})`;
      token.ref = original.slice(1, -1);
    } else {
      token.css = String(token.$value);
    }
  }
  return allTokens;
}

function toToken(light: TransformedToken, dark?: TransformedToken): Token {
  const themed = dark !== undefined && basename(light.filePath).startsWith('semantic.light');
  return {
    path: light.path,
    name: `--${light.name}`,
    cssVar: `var(--${light.name})`,
    tier: tierOf[basename(light.filePath)]!,
    type: String(light.$type),
    ...(light.$description ? { description: light.$description } : {}),
    value: String(light.$value),
    ...(themed ? { dark: String(dark.$value) } : {}),
    ...(light.ref ? { ref: light.ref as string } : {}),
    ...(themed && dark.ref ? { darkRef: dark.ref as string } : {}),
    css: light.css as string,
    ...(themed ? { darkCss: dark.css as string } : {}),
  };
}

function block(selector: string, lines: [string, string][], indent: string): string {
  const body = lines.map(([name, value]) => `${indent}  ${name}: ${value};`).join('\n');
  return `${indent}${selector} {\n${body}\n${indent}}`;
}

function buildCss(tokens: Token[]): string {
  const themed = tokens.filter((t) => t.darkCss !== undefined);
  const light: [string, string][] = [
    ['color-scheme', 'light'],
    ...themed.map((t): [string, string] => [t.name, t.css]),
  ];
  const dark: [string, string][] = [
    ['color-scheme', 'dark'],
    ...themed.map((t): [string, string] => [t.name, t.darkCss!]),
  ];
  const durations = tokens.filter((t) => t.tier === 'semantic' && t.path[0] === 'duration');

  const blocks = [
    block(
      ':root',
      tokens.filter((t) => t.darkCss === undefined).map((t) => [t.name, t.css]),
      '  ',
    ),
    block(':root,\n  [data-theme="light"]', light, '  '),
    block('[data-theme="dark"],\n  .dark', dark, '  '),
    `  @media (prefers-color-scheme: dark) {\n${block(
      ':root:not([data-theme="light"], .light)',
      dark,
      '    ',
    )}\n  }`,
    `  @media (prefers-reduced-motion: reduce) {\n${block(
      ':root',
      durations.map((t) => [t.name, '0ms']),
      '    ',
    )}\n  }`,
  ];
  return `${banner}\n\n@layer plinth {\n${blocks.join('\n\n')}\n}\n`;
}

/** The semantic tokens as Tailwind v4 theme variables (v4 has no JS presets). */
function buildTailwindTheme(tokens: Token[]): string {
  const semantic = tokens.filter((t) => t.tier === 'semantic');
  const group = (...path: string[]) =>
    semantic.filter((t) => path.every((segment, i) => t.path[i] === segment));
  const entries = (namespace: string, list: Token[]): [string, string][] =>
    list.map((t) => [`--${namespace}-${t.path.at(-1)}`, t.cssVar]);
  const space1 = semantic.find((t) => t.path.join('.') === 'space.1')!;

  const lines: [string, string][] = [
    ...entries('color', group('color')),
    ['--font-sans', group('font', 'family', 'body')[0]!.cssVar],
    ['--font-mono', group('font', 'family', 'mono')[0]!.cssVar],
    ...entries('text', group('font', 'size')),
    ...entries('font-weight', group('font', 'weight')),
    ...entries('leading', group('font', 'leading')),
    // Tailwind multiplies one spacing unit (p-4 is 4 units); Plinth's is the 4px step.
    ['--spacing', space1.cssVar],
    ...entries('radius', group('radius')),
    ...entries('shadow', group('elevation')),
    ...entries('breakpoint', group('breakpoint')),
    ...entries('ease', group('easing')),
  ];
  return `${banner}\n@theme inline {\n${lines.map(([n, v]) => `  ${n}: ${v};`).join('\n')}\n}\n`;
}

/** Nested object of the semantic and component tokens' var()s, for JS. */
function buildVars(tokens: Token[]): Record<string, unknown> {
  const vars: Record<string, unknown> = {};
  for (const token of tokens.filter((t) => t.tier !== 'primitive')) {
    let node = vars;
    for (const segment of token.path.slice(0, -1)) {
      node = (node[segment] ??= {}) as Record<string, unknown>;
    }
    node[token.path.at(-1)!] = token.cssVar;
  }
  return vars;
}

function typeOf(value: unknown, indent = ''): string {
  if (typeof value === 'string') return 'string';
  const entries = Object.entries(value as Record<string, unknown>).map(
    ([key, child]) => `${indent}  ${JSON.stringify(key)}: ${typeOf(child, `${indent}  `)};`,
  );
  return `{\n${entries.join('\n')}\n${indent}}`;
}

const [lightTokens, darkTokens] = await Promise.all([load('light'), load('dark')]);
const darkByName = new Map(darkTokens.map((t) => [t.name, t]));
const tokens = lightTokens.map((t) => toToken(t, darkByName.get(t.name)));
const vars = buildVars(tokens);

const dist = new URL('dist/', root);
mkdirSync(dist, { recursive: true });

const tokenInterface = `export interface Token {
  path: string[];
  name: string;
  cssVar: string;
  tier: 'primitive' | 'semantic' | 'component';
  type: string;
  description?: string;
  value: string;
  dark?: string;
  ref?: string;
  darkRef?: string;
  css: string;
  darkCss?: string;
}`;

const files: Record<string, string> = {
  'tokens.css': buildCss(tokens),
  'tokens.json': `${JSON.stringify(tokens, null, 2)}\n`,
  'tailwind-theme.css': buildTailwindTheme(tokens),
  'index.js': `${banner}\n/** Every token: primitives, semantic and component. */\nexport const tokens = ${JSON.stringify(tokens, null, 2)};\n\n/** The semantic and component tokens as var()s, so a project's overrides still apply. */\nexport const vars = ${JSON.stringify(vars, null, 2)};\n`,
  'index.d.ts': `${banner}\n${tokenInterface}\n\nexport declare const tokens: Token[];\n\nexport declare const vars: ${typeOf(vars)};\n`,
};

for (const [name, contents] of Object.entries(files)) {
  writeFileSync(new URL(name, dist), contents);
}
console.log(`tokens: ${tokens.length} tokens; wrote ${Object.keys(files).join(', ')}`);
