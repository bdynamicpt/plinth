import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/html-vite';
import vue from '@vitejs/plugin-vue';
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
  // Stories read the Vue package from its source, not its dist, so a running Storybook never
  // shows a stale build after main moves (the component CSS already comes from source).
  viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), vue()];
    config.resolve ??= {};
    const existing = config.resolve.alias ?? [];
    config.resolve.alias = [
      ...(Array.isArray(existing)
        ? existing
        : Object.entries(existing).map(([find, replacement]) => ({ find, replacement }))),
      {
        find: /^@bdynamic\/plinth-vue$/,
        replacement: fileURLToPath(new URL('../../packages/vue/src/index.ts', import.meta.url)),
      },
    ];
    return config;
  },
};

export default config;
