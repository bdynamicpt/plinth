import type { Meta, StoryObj } from '@storybook/html-vite';
import { breakpoint, cssVar, cssVarName, layer, size, space } from '@bdynamic/plinth-tokens';
import { code, page, pageParameters, section, table } from './page.ts';

const meta = {
  title: 'Foundations/Spacing',
  tags: ['!autodocs'],
  parameters: pageParameters,
} satisfies Meta;

export default meta;

export const Spacing: StoryObj = {
  render: () =>
    page(
      section(
        'Spacing',
        'Steps on a 4px grid: the key is the number of 4px steps. Components use these, never raw lengths.',
        table(
          ['Token', 'Value', 'Preview'],
          Object.entries(space).map(([name, value]) => [
            code(cssVarName('space', name)),
            value,
            `<div class="sb-bar" style="inline-size: ${cssVar('space', name)}"></div>`,
          ]),
        ),
      ),
      section(
        'Sizes',
        'The smallest touch target any component may have.',
        table(
          ['Token', 'Value'],
          Object.entries(size).map(([name, value]) => [code(cssVarName('size', name)), value]),
        ),
      ),
      section(
        'Layers',
        'Stacking order. Components use these, never a raw z-index.',
        table(
          ['Token', 'Value'],
          Object.entries(layer).map(([name, value]) => [code(cssVarName('layer', name)), value]),
        ),
      ),
      section(
        'Breakpoints',
        'Mobile first: base rules are the phone, and these add to them. Custom properties cannot be used in media queries, so CSS writes the values.',
        table(
          ['Token', 'Value', 'Media query'],
          Object.entries(breakpoint).map(([name, value]) => [
            code(cssVarName('breakpoint', name)),
            value,
            code(`@media (min-width: ${value})`),
          ]),
        ),
      ),
    ),
};
