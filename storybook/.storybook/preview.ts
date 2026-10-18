import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/html-vite';
import '@bdynamic/plinth-css/plinth.css';
import '../brands/example.css';
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
  globalTypes: {
    brand: {
      description: "Plinth's neutral defaults, or the made-up example brand (brands/example.css)",
      toolbar: {
        title: 'Brand',
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Plinth defaults' },
          { value: 'example', title: 'Example brand (Tidewater)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { brand: 'default' },
  decorators: [
    // Sets data-brand on <html>; the example brand overrides tokens under [data-brand='example'].
    (story, context) => {
      const root = document.documentElement;
      if (context.globals.brand === 'example') root.dataset.brand = 'example';
      else delete root.dataset.brand;
      return story();
    },
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
