import { compile } from '@tailwindcss/node';
import { createRequire } from 'node:module';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildCss, buildTailwindTheme } from '../src/generate.ts';
import {
  color,
  cssVar,
  palette,
  parseRef,
  resolveRef,
  resolvedColors,
  space,
  vars,
  type Theme,
} from '../src/index.ts';

const themes: Theme[] = ['light', 'dark'];

/** WCAG 2 contrast ratio between two hex colours. */
function contrast(a: string, b: string): number {
  const luminance = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const channel = parseInt(hex.slice(i, i + 2), 16) / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    }) as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

describe('palette references', () => {
  it('resolves a reference to its hex value', () => {
    expect(resolveRef('{neutral.900}')).toBe(palette.neutral[900]);
  });

  it('rejects references that do not exist', () => {
    expect(() => parseRef('{neutral.123}')).toThrow('Unknown palette step');
    expect(() => parseRef('{nope.100}')).toThrow('Not a palette reference');
    expect(() => parseRef('#ffffff')).toThrow('Not a palette reference');
  });

  it.each(themes)('resolves every %s colour', (theme) => {
    for (const ref of Object.values(color[theme])) {
      expect(() => parseRef(ref)).not.toThrow();
    }
  });

  it('gives light and dark the same colour names', () => {
    expect(Object.keys(color.dark).sort()).toEqual(Object.keys(color.light).sort());
  });
});

describe('contrast', () => {
  const textPairs = [
    ['text', 'background'],
    ['text', 'surface'],
    ['text', 'surface-muted'],
    ['text-muted', 'surface'],
    ['brand-text', 'surface'],
    ['on-brand', 'brand'],
    ['neutral-text', 'neutral-surface'],
    ['success-text', 'success-surface'],
    ['warning-text', 'warning-surface'],
    ['danger-text', 'danger-surface'],
  ] as const;

  describe.each(themes)('%s', (theme) => {
    const colors = resolvedColors(theme);
    it.each(textPairs)('%s on %s meets WCAG AA (4.5:1)', (fg, bg) => {
      expect(contrast(colors[fg], colors[bg])).toBeGreaterThanOrEqual(4.5);
    });
  });
});

describe('CSS custom properties', () => {
  const css = buildCss();

  it('defines every palette step and points semantic colours at it', () => {
    expect(css).toContain('--plinth-palette-neutral-900: #18181b;');
    expect(css).toContain('--plinth-color-text: var(--plinth-palette-neutral-900);');
  });

  it('defines spacing, radii, layers, type, breakpoints and motion', () => {
    for (const name of [
      '--plinth-space-4: 1rem;',
      '--plinth-radius-full: 9999px;',
      '--plinth-layer-modal: 400;',
      '--plinth-font-size-md: 1rem;',
      '--plinth-font-sans:',
      '--plinth-breakpoint-md: 768px;',
      '--plinth-duration-fast: 120ms;',
      '--plinth-size-touch: 2.5rem;',
    ]) {
      expect(css).toContain(name);
    }
  });

  it("puts everything in @layer plinth, so a project's overrides win", () => {
    expect(css).toMatch(/^\/\*.*\*\/\n\n@layer plinth \{\n/);
    expect(css.trimEnd().endsWith('}')).toBe(true);
    expect(css.match(/@layer/g)).toHaveLength(1);
  });

  it('switches to dark with data-theme, the .dark class or the system preference', () => {
    expect(css).toMatch(/\[data-theme="dark"\],\n {2}\.dark \{\n {4}color-scheme: dark;/);
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain(':root:not([data-theme="light"], .light)');
  });

  it('turns motion off when the user asks for reduced motion', () => {
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{\n {4}:root \{\n {6}--plinth-duration-fast: 0ms;/,
    );
  });

  it('has one var() per token in the JS export', () => {
    expect(vars.space[4]).toBe('var(--plinth-space-4)');
    expect(vars.color.text).toBe(cssVar('color', 'text'));
    for (const value of Object.values(vars.space)) {
      expect(css).toContain(`${value.slice(4, -1)}:`);
    }
    expect(Object.keys(vars.space)).toEqual(Object.keys(space));
  });
});

describe('Tailwind', () => {
  const theme = buildTailwindTheme();

  it('exposes the tokens as Tailwind v4 theme variables that read the custom properties', () => {
    expect(theme).toContain('@theme inline {');
    expect(theme).toContain('--color-surface: var(--plinth-color-surface);');
    expect(theme).toContain('--color-text-muted: var(--plinth-color-text-muted);');
    expect(theme).toContain('--spacing: var(--plinth-space-1);');
    expect(theme).toContain('--radius-md: var(--plinth-radius-md);');
    expect(theme).toContain('--text-sm: var(--plinth-font-size-sm);');
    expect(theme).toContain('--font-sans: var(--plinth-font-sans);');
    expect(theme).toContain('--breakpoint-md: 768px;');
    for (const name of Object.keys(color.light)) {
      expect(theme).toContain(`--color-${name}: var(--plinth-color-${name});`);
    }
  });

  it('gives a project the utilities, built by Tailwind itself', async () => {
    const base = path.dirname(createRequire(import.meta.url).resolve('tailwindcss/package.json'));
    const compiler = await compile(
      `@import 'tailwindcss/theme';\n@import 'tailwindcss/utilities';\n${theme}`,
      {
        base,
        onDependency: () => {},
      },
    );
    const css = compiler.build(['bg-surface', 'text-text-muted', 'p-4', 'rounded-md', 'md:p-8']);

    expect(css).toMatch(/\.bg-surface \{\s*background-color: var\(--plinth-color-surface\);/);
    expect(css).toMatch(/\.text-text-muted \{\s*color: var\(--plinth-color-text-muted\);/);
    expect(css).toMatch(/\.p-4 \{\s*padding: calc\(var\(--plinth-space-1\) \* 4\);/);
    expect(css).toMatch(/\.rounded-md \{\s*border-radius: var\(--plinth-radius-md\);/);
    expect(css).toContain('@media (width >= 768px)');
  });
});
