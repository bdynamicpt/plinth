import type { Meta, StoryObj } from '@storybook/html-vite';
import { icon, iconSizes, type IconArgs } from './icon.ts';
import { sampleIcons } from './icons.ts';
import '@bdynamic/plinth-css/src/components/icon.css';

const meta = {
  title: 'Components/Icon',
  render: (args) => icon(args),
  args: { size: 'md', mirror: false, svg: sampleIcons.check },
  argTypes: {
    size: { control: 'inline-radio', options: iconSizes },
    label: { control: 'text' },
    mirror: { control: 'boolean' },
    svg: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A project’s own SVG, sized by Plinth (16, 20 or 24 px) and coloured by the text around it. Plinth ships no icons: pass an inline SVG, or a sprite `<use>`, drawn with `currentColor`. An icon is decorative and hidden from screen readers unless it has a `label` (or an `aria-label`); give it one only when the icon carries meaning that nothing next to it says. Set `mirror` on icons that point a direction (arrows, chevrons, back, send), so they flip in right-to-left text; it changes nothing in left-to-right text. Switch **Direction** in the toolbar to see it.',
      },
    },
  },
} satisfies Meta<IconArgs>;

export default meta;
type Story = StoryObj<IconArgs>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const Labelled: Story = { args: { svg: sampleIcons.alert, label: 'Warning' } };
export const Filled: Story = { args: { svg: sampleIcons.star } };
/** Rendered right to left, where the mirrored arrow points the other way. */
export const Mirrored: Story = {
  args: { svg: sampleIcons.arrow, mirror: true },
  decorators: [(story) => `<div dir="rtl">${story() as string}</div>`],
};

/** Every size, and the icon taking its colour from the text around it. */
export const Gallery: Story = {
  render: () =>
    `<div style="display: grid; gap: var(--plinth-space-4);">
      <div style="display: flex; gap: var(--plinth-space-4); align-items: center;">${iconSizes
        .map((size) => icon({ size, mirror: false, svg: sampleIcons.check }))
        .join('')}</div>
      <p style="margin: 0; color: var(--plinth-color-accent-text);">${icon({ size: 'sm', mirror: false, svg: sampleIcons.star })} Text and icon share a colour</p>
      <p dir="rtl" lang="ar" style="margin: 0;">${icon({ size: 'md', mirror: true, svg: sampleIcons.arrow })} النص من اليمين إلى اليسار</p>
    </div>`,
};
