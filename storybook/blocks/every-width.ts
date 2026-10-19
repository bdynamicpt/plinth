/**
 * The pure parts of the AtEveryWidth docs block: the widths it shows, the URL of each frame and
 * the scale that fits a frame into its cell. Kept apart from the React so they can be tested.
 */

/** The widths every component is checked at, the same as the viewport menu. */
export const widths = [
  { width: 390, label: 'Phone' },
  { width: 768, label: 'Tablet' },
  { width: 1440, label: 'Desktop' },
] as const;

export const themes = ['dark', 'light'] as const;
export type Theme = (typeof themes)[number];

export interface FrameGlobals {
  theme: Theme;
  brand?: string;
  dir?: string;
}

/**
 * The URL of one story on its own, as Storybook renders it in the canvas, with the toolbar's
 * globals (theme, brand, direction) set in the query string. Relative, so it works under any
 * base path: a docs page is itself served from iframe.html.
 */
export function frameUrl(storyId: string, globals: FrameGlobals): string {
  const pairs = [`theme:${globals.theme}`];
  if (globals.brand) pairs.push(`brand:${globals.brand}`);
  if (globals.dir) pairs.push(`dir:${globals.dir}`);
  const query = new URLSearchParams({ id: storyId, viewMode: 'story' });
  return `iframe.html?${query.toString()}&globals=${pairs.join(';')}`;
}

/** The scale that fits a frame of `width` into a cell of `available` px, never above 1. */
export function fitScale(available: number, width: number): number {
  if (available <= 0 || width <= 0) return 1;
  return Math.min(1, available / width);
}

/** Reads a theme from an attribute value, falling back to Plinth's default, dark. */
export function toTheme(value: string | undefined): Theme {
  return value === 'light' ? 'light' : 'dark';
}
