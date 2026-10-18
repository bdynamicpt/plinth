import type { Meta, StoryObj } from '@storybook/html-vite';
import { controlSizes, buttonVariants } from './button.ts';
import { iconButton, type IconButtonArgs } from './icon-button.ts';
import { sampleIcons } from './icons.ts';
import '@bdynamic/plinth-css/src/components/icon.css';
import '@bdynamic/plinth-css/src/components/button.css';

const meta = {
  title: 'Components/Icon button',
  // The docs page is IconButton.mdx, written by hand.
  tags: ['!autodocs'],
  render: (args) => iconButton(args),
  args: {
    label: 'More actions',
    variant: 'ghost',
    size: 'md',
    disabled: false,
    busy: false,
    svg: sampleIcons.more,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: buttonVariants },
    size: { control: 'inline-radio', options: controlSizes },
    href: { control: 'text' },
    pressed: { control: 'boolean' },
    mirror: { control: 'boolean' },
    svg: { control: 'text' },
  },
} satisfies Meta<IconButtonArgs>;

export default meta;
type Story = StoryObj<IconButtonArgs>;

export const Ghost: Story = {};
export const Secondary: Story = {
  args: { variant: 'secondary', label: 'Close', svg: sampleIcons.close },
};
export const Primary: Story = {
  args: { variant: 'primary', label: 'Done', svg: sampleIcons.check },
};
export const DangerGhost: Story = {
  args: { variant: 'danger-ghost', label: 'Remove', svg: sampleIcons.close },
};
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const Pressed: Story = {
  args: { label: 'Favourite', svg: sampleIcons.star, pressed: true },
};
export const NotPressed: Story = {
  args: { label: 'Favourite', svg: sampleIcons.star, pressed: false },
};
export const Link: Story = {
  args: {
    variant: 'secondary',
    label: 'Next page',
    svg: sampleIcons.arrow,
    href: '#next',
    mirror: true,
  },
};
export const Disabled: Story = { args: { disabled: true } };
export const Busy: Story = { args: { variant: 'secondary', busy: true, label: 'Saving' } };

/** Every variant at every size. */
export const Gallery: Story = {
  render: () =>
    `<div style="display: grid; gap: var(--plinth-space-3);">${controlSizes
      .map(
        (size) =>
          `<div style="display: flex; gap: var(--plinth-space-3); align-items: center;">${buttonVariants
            .map((variant) =>
              iconButton({
                label: `${variant} ${size}`,
                variant,
                size,
                disabled: false,
                busy: false,
                svg: sampleIcons.more,
              }),
            )
            .join('')}</div>`,
      )
      .join('')}</div>`,
};
