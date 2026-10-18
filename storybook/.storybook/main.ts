import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  framework: '@storybook/html-vite',
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.ts'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-mcp',
  ],
  features: {
    // Turns on the MCP docs tools once the HTML renderer generates a components manifest (#7).
    componentsManifest: true,
  },
  core: {
    disableTelemetry: true,
  },
};

export default config;
