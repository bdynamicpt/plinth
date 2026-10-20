/**
 * Opens every docs page at the three widths and fails if one scrolls sideways (#70). A wide
 * table, like Storybook's Controls table, has to scroll inside itself instead of widening the
 * page; preview.css does that for tables in `.sbdocs-content`.
 */
import { chromium } from 'playwright';

const widths = [390, 768, 1440];

export async function checkDocsWidth(url: string): Promise<string[]> {
  const index = (await (await fetch(`${url}/index.json`)).json()) as {
    entries: Record<string, { id: string; type: string }>;
  };
  const docs = Object.values(index.entries).filter((entry) => entry.type === 'docs');

  const browser = await chromium.launch();
  const failures: string[] = [];
  try {
    const page = await browser.newPage();
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const { id } of docs) {
        await page.goto(`${url}/iframe.html?viewMode=docs&id=${id}`, { waitUntil: 'networkidle' });
        await page.locator('.sbdocs-content').waitFor();
        const extra = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        if (extra > 0) failures.push(`${id} at ${width} px scrolls ${extra} px sideways`);
      }
    }
  } finally {
    await browser.close();
  }
  return failures;
}
