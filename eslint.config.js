import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import storybook from 'eslint-plugin-storybook';
import vue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/storybook-static/**',
      '**/vendor/**',
      '**/node_modules/**',
      '**/.turbo/**',
      'site/public/build/**',
      'site/storage/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  ...storybook.configs['flat/recommended'],
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  prettier,
);
