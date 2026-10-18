import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/html-vite';
import '@bdynamic/plinth-css/plinth.css';
import './preview.css';

/** The widths every component is checked at: a phone, a tablet and a desktop. */
export const viewports = {
  phone: { name: 'Phone (390)', styles: { width: '390px', height: '844px' }, type: 'mobile' },
  tablet: { name: 'Tablet (768)', styles: { width: '768px', height: '1024px' }, type: 'tablet' },
  desktop: {
    name: 'Desktop (1440)',
    styles: { width: '1440px', height: '900px' },
    type: 'desktop',
  },
} as const;

const preview: Preview = {
  parameters: {
    layout: 'padded',
    viewport: { options: viewports },
    a11y: { test: 'error' },
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: [
          'Branding',
          'Foundations',
          ['Colours', 'Typography', 'Spacing', 'Radii'],
          'Components',
        ],
      },
    },
  },
  decorators: [
    // Sets data-theme on <html>; the tokens do the rest.
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
  tags: ['autodocs'],
};

export default preview;
