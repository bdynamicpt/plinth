import type { Meta, StoryObj } from '@storybook/html-vite';
import { avatar } from './avatar.ts';
import { badge } from './badge.ts';
import { icon } from './icon.ts';
import { sampleIcons } from './icons.ts';
import { listCard, type ListCardArgs } from './list-card.ts';
import type { ListRowArgs } from './list-row.ts';
import '@bdynamic/plinth-css/src/components/icon.css';
import '@bdynamic/plinth-css/src/components/avatar.css';
import '@bdynamic/plinth-css/src/components/badge.css';
import '@bdynamic/plinth-css/src/components/list-row.css';
import '@bdynamic/plinth-css/src/components/list-card.css';

const leadingIcon = (svg: string) => icon({ size: 'md', mirror: false, svg });

const row = (title: string, extra: Partial<ListRowArgs> = {}): ListRowArgs => ({
  title,
  chevron: false,
  button: false,
  current: false,
  disabled: false,
  ...extra,
});

const settings = [
  row('Notifications', {
    leading: leadingIcon(sampleIcons.bell),
    trailing: badge({ label: 'On', tone: 'success', dot: true }),
    href: '#notifications',
    chevron: true,
  }),
  row('Language', {
    leading: leadingIcon(sampleIcons.globe),
    trailing: 'English',
    href: '#language',
    chevron: true,
  }),
  row('Favourites', { leading: leadingIcon(sampleIcons.star), href: '#favourites', chevron: true }),
];

const meta = {
  title: 'Components/List Card',
  render: (args) => listCard(args),
  args: { heading: 'Preferences', headingLevel: 'h2', rows: settings },
  argTypes: {
    heading: { control: 'text' },
    headingLevel: { control: 'select', options: ['h2', 'h3', 'h4', 'h5', 'h6'] },
    footer: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Related rows on a raised surface, with an optional heading and footer note.',
      },
    },
  },
} satisfies Meta<ListCardArgs>;

export default meta;
type Story = StoryObj<ListCardArgs>;

export const Default: Story = {};

export const WithoutHeading: Story = { args: { heading: undefined } };

export const WithFooter: Story = {
  args: { footer: 'Changes apply on every device you are signed in on.' },
};

/** A card under an h2 of its own section takes a lower heading level. */
export const HeadingLevel: Story = { args: { heading: 'Display', headingLevel: 'h3' } };

export const SingleRow: Story = {
  args: { heading: 'Session', rows: [row('Sign out', { button: true })] },
};

/** Rows of every kind in one card: the current page, a static row and a disabled button. */
export const MixedRows: Story = {
  args: {
    heading: 'Workspace',
    rows: [
      row('Overview', {
        description: 'Everything at a glance',
        leading: leadingIcon(sampleIcons.star),
        href: '#overview',
        chevron: true,
        current: true,
      }),
      row('Ana Lima', {
        description: 'Owner',
        leading: avatar({ name: 'Ana Lima', size: 'md', decorative: true }),
        trailing: 'Admin',
      }),
      row('Export', { button: true, disabled: true }),
    ],
  },
};

export const LongText: Story = {
  args: {
    heading: 'A heading long enough to wrap onto a second line on a narrow phone screen',
    footer:
      'A footer note that explains what the settings above change, written long enough to wrap onto more than one line.',
    rows: [
      row('Send a summary of the week to everyone in the workspace', {
        description: 'Every Monday morning, in the language each person has chosen',
        trailing: 'Weekly',
        href: '#summary',
        chevron: true,
      }),
    ],
  },
};

/** Two cards one after the other, as on a settings page. */
export const Stacked: Story = {
  render: () =>
    `<div style="display: grid; gap: var(--plinth-space-6);">${listCard(meta.args)}${listCard({
      ...meta.args,
      heading: 'Account',
      footer: 'Signing out ends the session on this device only.',
      rows: [row('Email', { trailing: 'ana@example.com' }), row('Sign out', { button: true })],
    })}</div>`,
};

/** The same card in right-to-left text: the slots swap sides and the chevrons point left. */
export const RightToLeft: Story = {
  render: () => `<div dir="rtl">${listCard({ ...meta.args, ...WithFooter.args })}</div>`,
};
