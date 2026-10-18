import type { Meta, StoryObj } from '@storybook/html-vite';
import { button, buttonSizes, buttonVariants, type ButtonArgs } from './button.ts';
import { sampleIcons } from './icons.ts';
import '@bdynamic/plinth-css/src/components/icon.css';
import '@bdynamic/plinth-css/src/components/button.css';

const meta = {
  title: 'Components/Button',
  // The docs page is Button.mdx, written by hand.
  tags: ['!autodocs'],
  render: (args) => button(args),
  args: { label: 'Save', variant: 'primary', size: 'md', disabled: false, busy: false },
  argTypes: {
    variant: { control: 'inline-radio', options: buttonVariants },
    size: { control: 'inline-radio', options: buttonSizes },
    href: { control: 'text' },
    disabled: { control: 'boolean' },
    busy: { control: 'boolean' },
    icon: { control: 'text' },
    trailingIcon: { control: 'text' },
    mirrorIcon: { control: 'boolean' },
    mirrorTrailing: { control: 'boolean' },
  },
} satisfies Meta<ButtonArgs>;

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Primary: Story = {};
export const Accent: Story = { args: { variant: 'accent', label: 'Upgrade plan' } };
export const Secondary: Story = { args: { variant: 'secondary', label: 'Cancel' } };
export const Ghost: Story = { args: { variant: 'ghost', label: 'Skip' } };
export const Danger: Story = { args: { variant: 'danger', label: 'Delete' } };
export const DangerGhost: Story = { args: { variant: 'danger-ghost', label: 'Remove' } };
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const WithIcon: Story = { args: { icon: sampleIcons.check } };
export const WithTrailingIcon: Story = {
  args: {
    variant: 'secondary',
    label: 'Next',
    trailingIcon: sampleIcons.arrow,
    mirrorTrailing: true,
  },
};
export const Link: Story = { args: { variant: 'secondary', label: 'Read more', href: '#more' } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledLink: Story = {
  args: { variant: 'secondary', label: 'Read more', href: '#more', disabled: true },
};
export const Busy: Story = { args: { busy: true, label: 'Saving' } };

/** Every variant at every size. */
export const Gallery: Story = {
  render: () =>
    `<div style="display: grid; gap: var(--plinth-space-4);">${buttonSizes
      .map(
        (size) =>
          `<div style="display: flex; flex-wrap: wrap; gap: var(--plinth-space-3); align-items: center;">${buttonVariants
            .map((variant) =>
              button({ label: variant, variant, size, disabled: false, busy: false }),
            )
            .join('')}</div>`,
      )
      .join('')}</div>`,
};
