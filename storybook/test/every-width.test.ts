import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { fitScale, frameUrl, toTheme, widths } from '../blocks/every-width.ts';

describe('AtEveryWidth', () => {
  it('shows the three widths of the viewport menu', () => {
    expect(widths.map((w) => w.width)).toEqual([390, 768, 1440]);
  });

  it('builds the URL of a story with its globals', () => {
    expect(frameUrl('components-sheet--default', { theme: 'light' })).toBe(
      'iframe.html?id=components-sheet--default&viewMode=story&globals=theme:light',
    );
    expect(
      frameUrl('components-badge--default', { theme: 'dark', brand: 'example', dir: 'rtl' }),
    ).toBe(
      'iframe.html?id=components-badge--default&viewMode=story&globals=theme:dark;brand:example;dir:rtl',
    );
  });

  it('scales a frame down to fit its cell, never up', () => {
    expect(fitScale(195, 390)).toBe(0.5);
    expect(fitScale(2000, 1440)).toBe(1);
    expect(fitScale(0, 390)).toBe(1);
  });

  it('reads the theme, dark by default', () => {
    expect(toTheme('light')).toBe('light');
    expect(toTheme('dark')).toBe('dark');
    expect(toTheme(undefined)).toBe('dark');
  });

  it('is on every component docs page, under the first example', () => {
    const dir = new URL('../stories/components/', import.meta.url);
    const pages = readdirSync(dir).filter((file) => file.endsWith('.mdx'));
    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      const source = readFileSync(new URL(page, dir), 'utf8');
      const block = source.indexOf('<AtEveryWidth of={');
      expect(block, `${page} has no <AtEveryWidth>`).toBeGreaterThan(-1);
      const firstCanvas = source.indexOf('<Canvas of={');
      const firstHeading = source.indexOf('\n## ');
      expect(block, `${page}: <AtEveryWidth> comes after the first canvas`).toBeGreaterThan(
        firstCanvas,
      );
      expect(block, `${page}: <AtEveryWidth> comes before the first section`).toBeLessThan(
        firstHeading,
      );
    }
  });
});
