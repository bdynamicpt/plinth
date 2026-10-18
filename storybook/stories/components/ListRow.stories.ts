import type { Meta, StoryObj } from '@storybook/html-vite';
import { avatar } from './avatar.ts';
import { badge } from './badge.ts';
import { icon } from './icon.ts';
import { iconButton } from './icon-button.ts';
import { sampleIcons } from './icons.ts';
import { listRow, type ListRowArgs } from './list-row.ts';
import '@bdynamic/plinth-css/src/components/icon.css';
import '@bdynamic/plinth-css/src/components/avatar.css';
import '@bdynamic/plinth-css/src/components/badge.css';
import '@bdynamic/plinth-css/src/components/button.css';
import '@bdynamic/plinth-css/src/components/list-row.css';

const leadingIcon = (svg: string) => icon({ size: 'md', mirror: false, svg });
const person = avatar({ name: 'Ana Lima', size: 'md', decorative: true });
const moreActions = iconButton({
  label: 'More actions for Ana Lima',
  variant: 'ghost',
  size: 'sm',
  disabled: false,
  busy: false,
  svg: sampleIcons.more,
});

const meta = {
  title: 'Components/List Row',
  // The docs page is ListRow.mdx, written by hand.
  tags: ['!autodocs'],
  render: (args) => listRow(args),
  args: { title: 'Notifications', chevron: false, button: false, current: false, disabled: false },
  argTypes: {
    description: { control: 'text' },
    href: { control: 'text' },
    leading: { control: 'text' },
    trailing: { control: 'text' },
  },
} satisfies Meta<ListRowArgs>;

export default meta;
type Story = StoryObj<ListRowArgs>;

export const Default: Story = {};
export const WithDescription: Story = { args: { description: 'Email and push' } };
export const WithIcon: Story = { args: { leading: leadingIcon(sampleIcons.bell) } };
export const WithAvatar: Story = {
  args: { title: 'Ana Lima', description: 'ana@example.com', leading: person },
};
export const WithValue: Story = {
  args: { title: 'Language', leading: leadingIcon(sampleIcons.globe), trailing: 'English' },
};
export const WithBadge: Story = {
  args: { title: 'Invoices', trailing: badge({ label: '3 due', tone: 'warning', dot: false }) },
};
export const Link: Story = {
  args: {
    title: 'Language',
    leading: leadingIcon(sampleIcons.globe),
    trailing: 'English',
    chevron: true,
    href: '#language',
  },
};
export const Button: Story = { args: { title: 'Sign out', button: true } };
export const Current: Story = {
  args: {
    title: 'Overview',
    leading: leadingIcon(sampleIcons.star),
    href: '#overview',
    current: true,
  },
};
export const Disabled: Story = { args: { title: 'Export', button: true, disabled: true } };
export const DisabledLink: Story = {
  args: { title: 'Billing', href: '#billing', chevron: true, disabled: true },
};
export const WithAction: Story = {
  args: { title: 'Ana Lima', description: 'Owner', leading: person, trailing: moreActions },
};
export const LongText: Story = {
  args: {
    title: 'Send a summary of the week to everyone in the workspace',
    description: 'Every Monday morning, in the language each person has chosen for their account',
    trailing: 'Weekly',
    chevron: true,
    href: '#summary',
  },
};

const settings = [
  listRow({
    ...meta.args,
    title: 'Overview',
    leading: leadingIcon(sampleIcons.star),
    href: '#overview',
    current: true,
  }),
  listRow({
    ...meta.args,
    leading: leadingIcon(sampleIcons.bell),
    trailing: badge({ label: 'On', tone: 'success', dot: true }),
    href: '#notifications',
    chevron: true,
  }),
  listRow({
    ...meta.args,
    title: 'Language',
    leading: leadingIcon(sampleIcons.globe),
    trailing: 'English',
    href: '#language',
    chevron: true,
  }),
  listRow({ ...meta.args, title: 'Sign out', button: true }),
];

/** Rows in a list, each in its own <li>, with the dividers between them. */
export const List: Story = {
  render: () =>
    `<ul style="margin: 0; padding: 0; list-style: none;">${settings.map((row) => `<li>${row}</li>`).join('')}</ul>`,
};

/** The same rows in right-to-left text: the slots swap sides and the chevrons point left. */
export const RightToLeft: Story = {
  render: () => `<div dir="rtl">${settings.join('')}</div>`,
};
