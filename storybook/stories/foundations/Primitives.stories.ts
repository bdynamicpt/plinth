import type { Meta, StoryObj } from '@storybook/html-vite';
import { code, group, page, pageParameters, section, tokenTable } from './page.ts';

const meta = {
  title: 'Foundations/Primitives',
  tags: ['!autodocs'],
  parameters: pageParameters,
} satisfies Meta;

export default meta;

const ramps = [...new Set(group('primitive', 'ref', 'color').map((t) => t.path[2]!))];

export const Primitives: StoryObj = {
  render: () =>
    page(
      section(
        'Primitives',
        'The raw scales, named by value (--plinth-ref-*). Semantic tokens are built from them; components never use them directly, and Stylelint rejects them in component CSS.',
        '',
      ),
      ...ramps.map((ramp) =>
        section(
          `Colour: ${ramp}`,
          '',
          `<div class="sb-ramp">${group('primitive', 'ref', 'color', ramp)
            .map(
              (t) =>
                `<div class="sb-swatch"><div class="sb-chip" style="background-color: ${t.cssVar}"></div>${code(t.path.at(-1)!)}<span>${t.value}</span></div>`,
            )
            .join('')}</div>`,
        ),
      ),
      section(
        'Spacing',
        'A 4px grid: the key is the number of 4px steps.',
        tokenTable(group('primitive', 'ref', 'space')),
      ),
      section('Sizes', '', tokenTable(group('primitive', 'ref', 'size'))),
      section('Radii', '', tokenTable(group('primitive', 'ref', 'radius'))),
      section('Type', '', tokenTable(group('primitive', 'ref', 'font'))),
      section(
        'Motion',
        '',
        tokenTable([
          ...group('primitive', 'ref', 'duration'),
          ...group('primitive', 'ref', 'easing'),
        ]),
      ),
    ),
};
