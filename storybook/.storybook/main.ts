import type { StorybookConfig } from '@storybook/html-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  framework: '@storybook/html-vite',
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.ts'],
  addons: [
    // remark-gfm: Markdown tables in the MDX docs pages.
    {
      name: '@storybook/addon-docs',
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
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
