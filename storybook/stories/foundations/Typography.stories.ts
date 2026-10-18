import type { Meta, StoryObj } from '@storybook/html-vite';
import { cssVar, cssVarName, font } from '@bdynamic/plinth-tokens';
import { code, page, pageParameters, section, table } from './page.ts';

const meta = {
  title: 'Foundations/Typography',
  tags: ['!autodocs'],
  parameters: pageParameters,
} satisfies Meta;

export default meta;

export const Typography: StoryObj = {
  render: () =>
    page(
      section(
        'Families',
        'Neutral system stacks. A project sets its own typefaces by overriding these.',
        table(
          ['Token', 'Sample', 'Value'],
          Object.entries(font.family).map(([name, value]) => [
            code(cssVarName('font', name)),
            `<span style="font-family: ${cssVar('font', name)}">The quick brown fox</span>`,
            code(value),
          ]),
        ),
      ),
      section(
        'Scale',
        '',
        table(
          ['Token', 'Sample', 'Value'],
          Object.entries(font.size).map(([name, value]) => [
            code(cssVarName('font-size', name)),
            `<span style="font-size: ${cssVar('font-size', name)}; line-height: ${cssVar('leading', 'tight')}">Plinth</span>`,
            value,
          ]),
        ),
      ),
      section(
        'Weights',
        '',
        table(
          ['Token', 'Sample', 'Value'],
          Object.entries(font.weight).map(([name, value]) => [
            code(cssVarName('font-weight', name)),
            `<span style="font-weight: ${cssVar('font-weight', name)}">Plinth</span>`,
            value,
          ]),
        ),
      ),
      section(
        'Line heights',
        '',
        table(
          ['Token', 'Value'],
          Object.entries(font.leading).map(([name, value]) => [
            code(cssVarName('leading', name)),
            value,
          ]),
        ),
      ),
    ),
};
