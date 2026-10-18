import { getStoryContext, waitForPageReady, type TestRunnerConfig } from '@storybook/test-runner';
import { checkA11y, injectAxe } from 'axe-playwright';

/** Every story is checked with axe in both themes at the three widths. */
const themes = ['light', 'dark'] as const;
const widths = [390, 768, 1440] as const;

const config: TestRunnerConfig = {
  async preVisit(page) {
    await injectAxe(page);
  },

  async postVisit(page, context) {
    const story = await getStoryContext(page, context);

    for (const theme of themes) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        await page.evaluate((value) => {
          document.documentElement.dataset.theme = value;
        }, theme);
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
