import type { Meta, StoryObj } from '@storybook/html-vite';
import { cssVar, cssVarName, radius } from '@bdynamic/plinth-tokens';
import { code, page, pageParameters, section, table } from './page.ts';

const meta = {
  title: 'Foundations/Radii',
  tags: ['!autodocs'],
  parameters: pageParameters,
} satisfies Meta;

export default meta;

export const Radii: StoryObj = {
  render: () =>
    page(
      section(
        'Radii',
        '',
        table(
          ['Token', 'Value', 'Preview'],
          Object.entries(radius).map(([name, value]) => [
            code(cssVarName('radius', name)),
            value,
            `<div class="sb-radius" style="border-radius: ${cssVar('radius', name)}"></div>`,
          ]),
        ),
      ),
    ),
};
