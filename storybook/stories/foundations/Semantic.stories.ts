import type { Meta, StoryObj } from '@storybook/html-vite';
import { group, page, pageParameters, section, tokenTable } from './page.ts';

const meta = {
  title: 'Foundations/Semantic',
  tags: ['!autodocs'],
  parameters: pageParameters,
} satisfies Meta;

export default meta;

export const Semantic: StoryObj = {
  render: () =>
    page(
      section(
        'Semantic tokens',
        'What components use, named by role. Colours and elevation change between light and dark; previews follow the theme and the brand in the toolbar. A project brings its brand by overriding these.',
        '',
      ),
      section('Colours', '', tokenTable(group('semantic', 'color'))),
      section('Elevation', '', tokenTable(group('semantic', 'elevation'))),
      section('Spacing', '', tokenTable(group('semantic', 'space'))),
      section('Radii', '', tokenTable(group('semantic', 'radius'))),
      section('Typography', '', tokenTable(group('semantic', 'font'))),
      section(
        'Sizes',
        'Control heights, and the smallest touch target any component may have.',
        tokenTable([...group('semantic', 'control'), ...group('semantic', 'touch-target')]),
      ),
      section(
        'Layers',
        'Stacking order. Components use these, never a raw z-index.',
        tokenTable(group('semantic', 'layer')),
      ),
      section(
        'Breakpoints',
        'Mobile first: base rules are the phone, and these add to them. Custom properties cannot be used in media queries, so CSS writes the values: @media (min-width: 768px).',
        tokenTable(group('semantic', 'breakpoint')),
      ),
      section(
        'Motion',
        'Durations drop to 0ms under prefers-reduced-motion.',
        tokenTable([...group('semantic', 'duration'), ...group('semantic', 'easing')]),
      ),
    ),
};
