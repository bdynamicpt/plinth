import type { Meta, StoryObj } from '@storybook/html-vite';
import { button, buttonSizes, buttonVariants, type ButtonArgs } from './button.ts';
import { sampleIcons } from './icons.ts';
import '@bdynamic/plinth-css/src/components/icon.css';
import '@bdynamic/plinth-css/src/components/button.css';

const meta = {
  title: 'Components/Button',
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
  parameters: {
    docs: {
      description: {
        component:
          'The main action control. Use one primary button per view for the main action, secondary for the others, ghost for low-emphasis actions, danger for a destructive action, and danger-ghost for a low-emphasis destructive one (Remove next to an item). It renders a `<button type="button">`, or a link when given an `href`; a `type` you pass (submit, reset) replaces the default, and `wire:click`, `x-on:click` and `@click` reach it. Icons go in the `icon` (leading) and `trailing` slots, and are 16px on small buttons and 20px otherwise; set `mirror-icon` or `mirror-trailing` on arrows so they flip in right-to-left text (switch **Direction** in the toolbar). Disabled is `disabled` on a button and `aria-disabled` on a link. Busy shows a spinner and keeps focus; change the label too (Saving), since screen readers announce the busy state unreliably, and block the action yourself: a busy submit button still submits its form. The small size keeps a 40px touch target. A button with only an icon is the icon button (#18).',
      },
    },
  },
} satisfies Meta<ButtonArgs>;

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Primary: Story = {};
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
