import { tokens } from '@bdynamic/plinth-tokens';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * The example brand must restyle the components through tokens alone: it overrides semantic or
 * component tokens, never primitives or a component's own classes, and keeps text readable.
 */
const css = readFileSync(new URL('../brands/example.css', import.meta.url), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
);
const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({
  selector: selector!.trim(),
  declarations: Object.fromEntries(
    [...body!.matchAll(/(--[a-z0-9-]+):\s*([^;]+);/g)].map(([, name, value]) => [
      name,
      value!.trim(),
    ]),
  ),
}));
const light = blocks.find((b) => b.selector === "[data-brand='example']")!.declarations;
const dark = {
  ...light,
  ...blocks.find((b) => b.selector.includes("[data-theme='dark']"))!.declarations,
};
const byName = new Map(tokens.map((t) => [t.name, t]));

const hex = (value: string) =>
  value.length === 4 ? `#${[...value.slice(1)].map((c) => c + c).join('')}` : value;
function contrast(a: string, b: string): number {
  const luminance = (value: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const channel = parseInt(hex(value).slice(i, i + 2), 16) / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    }) as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p) as [number, number];
  return (x + 0.05) / (y + 0.05);
}

describe('the example brand', () => {
  it('only overrides semantic and component tokens', () => {
    for (const block of blocks) {
      for (const name of Object.keys(block.declarations)) {
        expect(byName.get(name)?.tier, name).toMatch(/^(semantic|component)$/);
      }
    }
  });

  it('never targets a component', () => {
    for (const block of blocks) {
      expect(block.selector).not.toMatch(/\.plinth-/);
    }
  });

  it('changes colours, radii and the font', () => {
    expect(light).toHaveProperty('--plinth-color-accent');
    expect(light).toHaveProperty('--plinth-color-primary');
    expect(light).toHaveProperty('--plinth-radius-pill');
    expect(light).toHaveProperty('--plinth-font-family-body');
  });

  describe.each([
    ['light', light, 'value'],
    ['dark', dark, 'dark'],
  ] as const)('%s', (_mode, overrides, key) => {
    const color = (name: string) =>
      overrides[`--plinth-color-${name}`] ?? byName.get(`--plinth-color-${name}`)![key]!;
    it.each([
      ['text', 'surface'],
      ['text', 'surface-raised'],
      ['text-muted', 'surface'],
      ['text-muted', 'surface-sunken'],
      ['accent-text', 'surface'],
      ['accent-text', 'accent-subtle'],
      ['on-accent', 'accent'],
      ['on-accent', 'accent-hover'],
      ['on-accent', 'accent-active'],
      ['on-primary', 'primary'],
      ['on-primary', 'primary-hover'],
      ['on-primary', 'primary-active'],
    ])('%s on %s meets WCAG AA (4.5:1)', (fg, bg) => {
      expect(contrast(color(fg), color(bg))).toBeGreaterThanOrEqual(4.5);
    });

    it.each(['surface', 'surface-raised', 'surface-sunken'])(
      'the focus ring stands out on %s (3:1)',
      (bg) => {
        expect(contrast(color('focus-ring'), color(bg))).toBeGreaterThanOrEqual(3);
      },
    );
  });
});
