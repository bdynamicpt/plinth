import type { Meta, StoryObj } from '@storybook/html-vite';
import { badge, tones, type BadgeArgs } from './badge.ts';
import '@bdynamic/plinth-css/src/components/badge.css';

const meta = {
  title: 'Components/Badge',
  render: badge,
  args: { label: 'Draft', tone: 'neutral', dot: false },
  argTypes: {
    tone: { control: 'inline-radio', options: tones },
    dot: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A short label with an optional dot and a tone. The label carries the meaning; the tone and the dot only reinforce it, so never use colour alone.',
      },
    },
  },
} satisfies Meta<BadgeArgs>;

export default meta;
type Story = StoryObj<BadgeArgs>;

export const Neutral: Story = {};
export const Success: Story = { args: { label: 'Paid', tone: 'success' } };
export const Warning: Story = { args: { label: 'Due soon', tone: 'warning' } };
export const Danger: Story = { args: { label: 'Overdue', tone: 'danger' } };
export const WithDot: Story = { args: { label: 'Online', tone: 'success', dot: true } };

/** Every tone, with and without the dot. */
export const AllTones: Story = {
  render: () =>
    `<div style="display: flex; flex-wrap: wrap; gap: var(--plinth-space-2);">${tones
      .flatMap((tone) => [false, true].map((dot) => badge({ label: tone, tone, dot })))
      .join('')}</div>`,
};
