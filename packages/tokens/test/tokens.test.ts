import { describe, expect, it } from 'vitest';
import { buildCss, buildTailwindPreset, buildTailwindTheme } from '../src/generate.ts';
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

  it('switches to dark with data-theme, the .dark class or the system preference', () => {
    expect(css).toMatch(/\[data-theme="dark"\],\n\.dark \{\n {2}color-scheme: dark;/);
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain(':root:not([data-theme="light"], .light)');
  });

  it('turns motion off when the user asks for reduced motion', () => {
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{\n {2}:root \{\n {4}--plinth-duration-fast: 0ms;/,
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
  it('exports the tokens as theme values that read the custom properties', () => {
    const { extend } = buildTailwindPreset().theme;
    expect(extend.colors.plinth.surface).toBe('var(--plinth-color-surface)');
    expect(extend.colors.plinth.palette.brand[600]).toBe('var(--plinth-palette-brand-600)');
    expect(extend.spacing['plinth-4']).toBe('var(--plinth-space-4)');
    expect(extend.borderRadius['plinth-md']).toBe('var(--plinth-radius-md)');
    expect(extend.zIndex['plinth-modal']).toBe('var(--plinth-layer-modal)');
    expect(extend.screens['plinth-md']).toBe('768px');
    expect(Object.keys(extend.colors.plinth)).toEqual([...Object.keys(color.light), 'palette']);
  });

  it('builds a Tailwind v4 @theme', () => {
    const theme = buildTailwindTheme();
    expect(theme).toContain('@theme inline {');
    expect(theme).toContain('--color-plinth-surface: var(--plinth-color-surface);');
    expect(theme).toContain('--spacing-plinth-4: var(--plinth-space-4);');
    expect(theme).toContain('--breakpoint-plinth-md: 768px;');
  });
});
