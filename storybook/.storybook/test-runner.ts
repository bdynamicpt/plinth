import { getStoryContext, waitForPageReady, type TestRunnerConfig } from '@storybook/test-runner';
import type { Page } from 'playwright';
import { checkA11y, injectAxe } from 'axe-playwright';

/**
 * Every story is checked with axe in both themes at the three widths, and with the example
 * brand in both themes at the phone width.
 */
const themes = ['light', 'dark'] as const;
const runs = [
  ...[390, 768, 1440].map((width) => ({ brand: undefined, width })),
  { brand: 'example', width: 390 },
] as const;

/**
 * Tabs through every focusable element in the story and checks each one shows Plinth's focus
 * ring (the focus-ring colour, at the focus-ring width), not just the browser's default outline.
 */
async function checkFocusRing(page: Page): Promise<void> {
  const count = await page.evaluate(
    () =>
      document.querySelectorAll(
        '#storybook-root :is(a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"]))',
      ).length,
  );
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  for (let i = 0; i < count; i++) {
    await page.keyboard.press('Tab');
    const result = await page.evaluate(() => {
      const element = document.activeElement as HTMLElement | null;
      if (!element || !document.getElementById('storybook-root')?.contains(element)) return null;
      const probe = document.createElement('span');
      probe.style.color = 'var(--plinth-color-focus-ring)';
      probe.style.outline = 'var(--plinth-focus-ring-width) solid';
      document.body.append(probe);
      const expected = getComputedStyle(probe);
      const want = { color: expected.color, width: expected.outlineWidth };
      probe.remove();
      const style = getComputedStyle(element);
      return {
        element: element.outerHTML.slice(0, 80),
        ok:
          style.outlineStyle === 'solid' &&
          style.outlineColor === want.color &&
          style.outlineWidth === want.width,
        got: `${style.outlineStyle} ${style.outlineWidth} ${style.outlineColor}`,
        want: `solid ${want.width} ${want.color}`,
      };
    });
    if (result && !result.ok) {
      throw new Error(
        `No Plinth focus ring on ${result.element}: outline is ${result.got}, expected ${result.want}`,
      );
    }
  }
}

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },

  async postVisit(page, context) {
    const story = await getStoryContext(page, context);

    await checkFocusRing(page);

    for (const theme of themes) {
      for (const { brand, width } of runs) {
        await page.setViewportSize({ width, height: 900 });
        await page.evaluate(
          ([themeValue, brandValue]) => {
            const root = document.documentElement;
            root.dataset.theme = themeValue;
            if (brandValue) root.dataset.brand = brandValue;
            else delete root.dataset.brand;
          },
          [theme, brand] as const,
        );
        await waitForPageReady(page);

        await checkA11y(page, '#storybook-root', {
          axeOptions: story.parameters?.a11y?.options,
          verbose: false,
          detailedReport: true,
          detailedReportOptions: { html: true },
        });
      }
    }
  },
};

export default config;
