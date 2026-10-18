import { compile } from '@tailwindcss/node';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { tokens, vars, type Token } from '../dist/index.js';

// These run against dist/, which Turborepo builds before the tests.
const css = readFileSync(new URL('../dist/tokens.css', import.meta.url), 'utf8');
const theme = readFileSync(new URL('../dist/tailwind-theme.css', import.meta.url), 'utf8');

const byPath = new Map(tokens.map((t) => [t.path.join('.'), t]));
const token = (path: string): Token => {
  const found = byPath.get(path);
  if (!found) throw new Error(`No token ${path}`);
  return found;
};
const tier = (name: Token['tier']) => tokens.filter((t) => t.tier === name);

/** Relative luminance (WCAG 2) of a hex or oklch() colour. */
function luminance(color: string): number {
  const linear = (channel: number) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  let rgb: [number, number, number];
  const oklch = /^oklch\(([\d.]+) ([\d.]+) ([\d.]+)/.exec(color);
  if (oklch) {
    // oklch -> oklab -> linear sRGB (Björn Ottosson's matrices).
    const [L, C, h] = oklch.slice(1).map(Number) as [number, number, number];
    const a = C * Math.cos((h * Math.PI) / 180);
    const b = C * Math.sin((h * Math.PI) / 180);
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const clamp = (x: number) => Math.min(1, Math.max(0, x));
    rgb = [
      clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
      clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
      clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
    ];
  } else {
    rgb = [1, 3, 5].map((i) => linear(parseInt(color.slice(i, i + 2), 16) / 255)) as [
      number,
      number,
      number,
    ];
  }
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

/** WCAG 2 contrast ratio between two colours. */
function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

describe('tiers', () => {
  it('has primitives, semantic and component tokens', () => {
    expect(tier('primitive').length).toBeGreaterThan(50);
    expect(tier('semantic').length).toBeGreaterThan(30);
    expect(tier('component').map((t) => t.path.join('.'))).toEqual([
      'header.height',
      'list-row.height',
      'pill.height',
    ]);
  });

  it('names every primitive --plinth-ref-*, and nothing else', () => {
    for (const t of tokens) {
      expect(t.name.startsWith('--plinth-ref-')).toBe(t.tier === 'primitive');
    }
  });

  it('has the neutrals from 0 to 1000, one brand ramp, and the scales', () => {
    expect(token('ref.color.neutral.0').value).toBe('oklch(1 0 0)');
    expect(token('ref.color.neutral.1000').value).toMatch(/^oklch\(0\.145 /);
    expect(token('ref.color.brand.600').value).toBe('#2563eb');
    expect(token('ref.space.1').value).toBe('0.25rem');
    expect(token('ref.space.4').value).toBe('1rem');
  });

  it('has the semantic colours the issue names, in light and dark', () => {
    for (const name of [
      'surface',
      'surface-raised',
      'text',
      'text-muted',
      'border',
      'divider',
      'accent',
      'success',
      'warning',
      'danger',
      'focus-ring',
      'overlay',
    ]) {
      const t = token(`color.${name}`);
      expect(t.dark, name).toBeDefined();
      expect(t.darkCss, name).toBeDefined();
    }
  });

  it('builds semantic colours from primitives, so a primitive change flows through', () => {
    for (const t of tier('semantic').filter((t) => t.type === 'color')) {
      expect(t.ref, t.name).toMatch(/^ref\.color\./);
      expect(t.darkRef, t.name).toMatch(/^ref\.color\./);
    }
  });

  it('has a focus ring: a colour, a width and an offset', () => {
    expect(token('color.focus-ring').dark).toBeDefined();
    expect(token('focus-ring.width').value).toBe('2px');
    expect(token('focus-ring.offset').value).toBe('0');
    expect(token('focus-ring.offset-filled').value).toBe('2px');
    expect(token('focus-ring.offset-inset').value).toBe('-2px');
  });

  it('defaults to Geist and Geist Mono, with system fonts behind them', () => {
    expect(token('ref.font.family.sans').value).toMatch(/^'Geist Variable', Geist, system-ui/);
    expect(token('ref.font.family.mono').value).toMatch(/^'Geist Mono Variable', 'Geist Mono'/);
  });

  it('has letter spacing for headings', () => {
    expect(token('font.tracking.tight').value).toBe('-0.02em');
  });

  it('has avatar sizes of 24, 32, 40 and 56 px', () => {
    expect(['sm', 'md', 'lg', 'xl'].map((s) => token(`size.avatar.${s}`).value)).toEqual([
      '1.5rem',
      '2rem',
      '2.5rem',
      '3.5rem',
    ]);
  });

  it('has icon sizes of 16, 20 and 24 px', () => {
    expect(['sm', 'md', 'lg'].map((s) => token(`size.icon.${s}`).value)).toEqual([
      '1rem',
      '1.25rem',
      '1.5rem',
    ]);
  });

  it('has control sizes, the touch target, layers, elevation and breakpoints', () => {
    expect(['sm', 'md', 'lg'].map((s) => token(`control.${s}`).value)).toEqual([
      '1.75rem',
      '2rem',
      '2.5rem',
    ]);
    expect(token('touch-target').value).toBe('2.5rem');
    expect(
      ['base', 'sticky', 'overlay', 'sheet', 'toast'].map((l) => token(`layer.${l}`).value),
    ).toEqual(['0', '100', '200', '300', '400']);
    expect(token('elevation.2').dark).toBeDefined();
    expect(token('breakpoint.md').value).toBe('768px');
    expect(token('breakpoint.lg').value).toBe('1280px');
  });

  it('builds component tokens from semantic tokens', () => {
    for (const t of tier('component')) {
      expect(byPath.get(t.ref!)?.tier, t.name).toBe('semantic');
    }
  });
});

describe('contrast', () => {
  const pairs = [
    ['text', 'surface'],
    ['text', 'surface-raised'],
    ['text', 'surface-sunken'],
    ['text-muted', 'surface'],
    ['text-muted', 'surface-raised'],
    ['text-muted', 'surface-sunken'],
    ['text-subtle', 'surface'],
    ['text-subtle', 'surface-raised'],
    ['on-primary', 'primary'],
    ['on-primary', 'primary-hover'],
    ['on-primary', 'primary-active'],
    ['accent-text', 'surface'],
    ['accent-text', 'accent-subtle'],
    ['on-accent', 'accent'],
    ['on-accent', 'accent-hover'],
    ['on-accent', 'accent-active'],
    ['on-danger', 'danger-solid'],
    ['on-danger', 'danger-solid-hover'],
    ['on-danger', 'danger-solid-active'],
    ['success-text', 'success-surface'],
    ['warning-text', 'warning-surface'],
    ['danger-text', 'danger-surface'],
    ['danger-text', 'surface'],
    ['danger-text', 'surface-raised'],
  ] as const;

  describe.each(['light', 'dark'] as const)('%s', (mode) => {
    const value = (name: string) => {
      const t = token(`color.${name}`);
      return mode === 'light' ? t.value : t.dark!;
    };
    it.each(pairs)('%s on %s meets WCAG AA (4.5:1)', (fg, bg) => {
      expect(contrast(value(fg), value(bg))).toBeGreaterThanOrEqual(4.5);
    });

    // WCAG 1.4.11: the focus indicator needs 3:1 against what it sits on.
    it.each(['surface', 'surface-raised', 'surface-sunken'])(
      'the focus ring stands out on %s (3:1)',
      (bg) => {
        expect(contrast(value('focus-ring'), value(bg))).toBeGreaterThanOrEqual(3);
      },
    );
  });
});

describe('CSS custom properties', () => {
  it('puts everything in @layer plinth, so a project’s overrides win', () => {
    expect(css).toMatch(/^\/\*.*\*\/\n\n@layer plinth \{\n/);
    expect(css.trimEnd().endsWith('}')).toBe(true);
    expect(css.match(/@layer/g)).toHaveLength(1);
  });

  it('defines every token, pointing references at the token they use', () => {
    for (const t of tokens) {
      expect(css).toContain(`${t.name}: ${t.css};`);
    }
    expect(css).toContain('--plinth-color-text: var(--plinth-ref-color-neutral-950);');
    expect(css).toContain('--plinth-header-height: var(--plinth-space-14);');
  });

  it('switches to dark with data-theme, the .dark class or the system preference', () => {
    expect(css).toMatch(/\[data-theme="dark"\],\n {2}\.dark \{\n {4}color-scheme: dark;/);
    expect(css).toContain('--plinth-color-text: var(--plinth-ref-color-neutral-100);');
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain(':root:not([data-theme="light"], .light)');
  });

  it('turns motion off when the user asks for reduced motion', () => {
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{\n {4}:root \{\n {6}--plinth-duration-fast: 0ms;/,
    );
  });
});

describe('JS export', () => {
  it('exposes the semantic and component tokens as var()s', () => {
    expect(vars.color.surface).toBe('var(--plinth-color-surface)');
    expect(vars.space['4']).toBe('var(--plinth-space-4)');
    expect(vars.header.height).toBe('var(--plinth-header-height)');
    expect(vars).not.toHaveProperty('ref');
  });
});

describe('Tailwind', () => {
  it('exposes the semantic tokens as Tailwind v4 theme variables', () => {
    expect(theme).toContain('@theme inline {');
    expect(theme).toContain('--spacing: var(--plinth-space-1);');
    expect(theme).toContain('--radius-control: var(--plinth-radius-control);');
    expect(theme).toContain('--text-sm: var(--plinth-font-size-sm);');
    expect(theme).toContain('--font-sans: var(--plinth-font-family-body);');
    expect(theme).toContain('--shadow-1: var(--plinth-elevation-1);');
    expect(theme).toContain('--breakpoint-md: var(--plinth-breakpoint-md);');
    expect(theme).not.toContain('--plinth-ref-');
    for (const t of tier('semantic').filter((t) => t.type === 'color')) {
      expect(theme).toContain(`--color-${t.path[1]}: ${t.cssVar};`);
    }
  });

  it('gives a project the utilities, built by Tailwind itself', async () => {
    const base = path.dirname(createRequire(import.meta.url).resolve('tailwindcss/package.json'));
    const compiler = await compile(
      `@import 'tailwindcss/theme';\n@import 'tailwindcss/utilities';\n${theme}`,
      { base, onDependency: () => {} },
    );
    const out = compiler.build(['bg-surface', 'text-text-muted', 'p-4', 'rounded-control']);

    expect(out).toMatch(/\.bg-surface \{\s*background-color: var\(--plinth-color-surface\);/);
    expect(out).toMatch(/\.text-text-muted \{\s*color: var\(--plinth-color-text-muted\);/);
    expect(out).toMatch(/\.p-4 \{\s*padding: calc\(var\(--plinth-space-1\) \* 4\);/);
    expect(out).toMatch(/\.rounded-control \{\s*border-radius: var\(--plinth-radius-control\);/);
  });
});
