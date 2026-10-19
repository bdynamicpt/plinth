import type { Meta, StoryObj } from '@storybook/html-vite';
import { avatar, avatarSizes, samplePhoto, tones, type AvatarArgs } from './avatar.ts';
import '@bdynamic/plinth-css/src/components/avatar.css';

const meta = {
  title: 'Components/Avatar',
  render: (args) => avatar(args),
  args: { name: 'Ana Lima', size: 'md', decorative: false },
  argTypes: {
    size: { control: 'inline-radio', options: avatarSizes },
    status: { control: 'inline-radio', options: [undefined, ...tones] },
    src: { control: 'text' },
    initials: { control: 'text' },
    statusLabel: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A person or an organisation at a glance: an image, then initials, then a glyph, with an optional status dot.',
      },
    },
  },
} satisfies Meta<AvatarArgs>;

export default meta;
type Story = StoryObj<AvatarArgs>;

export const Initials: Story = {};
export const Image: Story = { args: { src: samplePhoto } };
export const GivenInitials: Story = { args: { name: 'Plinth Design', initials: 'PD' } };
export const SingleName: Story = { args: { name: 'Zé' } };
export const Glyph: Story = { args: { name: undefined, decorative: true } };
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const ExtraLarge: Story = { args: { size: 'xl', src: samplePhoto } };
export const WithStatus: Story = { args: { status: 'success', statusLabel: 'Online' } };
export const Decorative: Story = { args: { decorative: true } };

/** Every size, and the status dot in each tone. */
export const Gallery: Story = {
  render: () =>
    `<div style="display: grid; gap: var(--plinth-space-4);">
      <div style="display: flex; gap: var(--plinth-space-3); align-items: center;">${avatarSizes
        .map((size) => avatar({ name: 'Ana Lima', size, decorative: false }))
        .join('')}</div>
      <div style="display: flex; gap: var(--plinth-space-3); align-items: center;">${tones
        .map((tone) =>
          avatar({
            name: 'Ana Lima',
            size: 'lg',
            status: tone,
            statusLabel: tone,
            decorative: false,
          }),
        )
        .join('')}</div>
    </div>`,
};
