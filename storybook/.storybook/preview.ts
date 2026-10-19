import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/html-vite';
import { DocsPage } from '../blocks/DocsPage.tsx';
import '@bdynamic/plinth-css/fonts.css';
import '@bdynamic/plinth-css/tokens.css';
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
    // Every story file gets Storybook's page, plus the link to the website and the block at every width.
    docs: { page: DocsPage },
    options: {
      storySort: {
        order: ['Branding', 'Foundations', ['Overview', 'Focus ring'], 'Components'],
      },
    },
  },
  globalTypes: {
    dir: {
      description: 'Text direction: left to right, or right to left (Arabic, Hebrew)',
      toolbar: {
        title: 'Direction',
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'Left to right' },
          { value: 'rtl', title: 'Right to left' },
        ],
        dynamicTitle: true,
      },
    },
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
  initialGlobals: { brand: 'default', dir: 'ltr' },
  decorators: [
    // Sets dir on <html>, so logical properties and mirrored icons can be checked right to left.
    (story, context) => {
      document.documentElement.dir = context.globals.dir === 'rtl' ? 'rtl' : 'ltr';
      return story();
    },
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
      defaultTheme: 'dark',
      attributeName: 'data-theme',
    }),
  ],
  tags: ['autodocs'],
};

export default preview;
