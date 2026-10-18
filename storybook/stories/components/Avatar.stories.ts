import type { Meta, StoryObj } from '@storybook/html-vite';
import { avatar, type AvatarArgs } from './avatar.ts';
import '@bdynamic/plinth-css/src/components/avatar.css';

const meta = {
  title: 'Components/Avatar',
  render: (args) => avatar(args),
  args: { label: 'Content' },
  parameters: {
    docs: {
      description: {
        component: 'TODO what it is, when to use it, and what a user must know.',
      },
    },
  },
} satisfies Meta<AvatarArgs>;

export default meta;
type Story = StoryObj<AvatarArgs>;

export const Default: Story = {};
