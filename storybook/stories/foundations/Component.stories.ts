import type { Meta, StoryObj } from '@storybook/html-vite';
import { group, page, pageParameters, section, tokenTable } from './page.ts';

const meta = {
  title: 'Foundations/Component tokens',
  tags: ['!autodocs'],
  parameters: pageParameters,
} satisfies Meta;

export default meta;

export const ComponentTokens: StoryObj = {
  name: 'Component tokens',
  render: () =>
    page(
      section(
        'Component tokens',
        'Only values a project may need to tune for one component. They are built from semantic tokens.',
        tokenTable(group('component')),
      ),
    ),
};
