import { getStoryContext, waitForPageReady, type TestRunnerConfig } from '@storybook/test-runner';
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

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },

  async postVisit(page, context) {
    const story = await getStoryContext(page, context);

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
