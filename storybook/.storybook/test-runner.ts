import { getStoryContext, waitForPageReady, type TestRunnerConfig } from '@storybook/test-runner';
import { checkA11y, injectAxe } from 'axe-playwright';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import path from 'node:path';

/**
 * Every story is checked in both themes at the three widths: axe must find no violations, and
 * with PLINTH_VISUAL=1 its screenshot must match the baseline in __screenshots__/.
 *
 * Screenshots depend on the fonts and the renderer, so baselines are made in Playwright's Docker
 * image, the same one CI runs in (`npm run test:visual` here, or `--update` to refresh them).
 * Without PLINTH_VISUAL, the run still renders and checks every combination, without comparing
 * pixels, so it passes on any machine.
 */
const themes = ['light', 'dark'] as const;
const widths = [390, 768, 1440] as const;
const compareScreenshots = process.env.PLINTH_VISUAL === '1';
const snapshotsDir = path.join(process.cwd(), '__screenshots__');

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },

  async preVisit(page) {
    await injectAxe(page);
  },

  async postVisit(page, context) {
    const story = await getStoryContext(page, context);
    const root = page.locator('#storybook-root');

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

        if (compareScreenshots) {
          const image = await root.screenshot({ animations: 'disabled' });
          expect(image).toMatchImageSnapshot({
            customSnapshotsDir: snapshotsDir,
            customSnapshotIdentifier: `${context.id}--${theme}-${width}`,
            failureThreshold: 0.001,
            failureThresholdType: 'percent',
          });
        }
      }
    }
  },
};

export default config;
