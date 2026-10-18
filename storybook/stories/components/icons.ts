/**
 * Sample icons for the stories: simple shapes drawn for Plinth, not taken from an icon set.
 * Projects bring their own icons.
 */
const outline = (paths: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

export const sampleIcons = {
  check: outline('<path d="M5 12l5 5L19 7"/>'),
  alert: outline('<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.01"/>'),
  arrow: outline('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
};
