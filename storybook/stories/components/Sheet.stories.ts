import type { Meta, StoryObj } from '@storybook/html-vite';
import { sheetPlacements } from '@bdynamic/plinth-vue';
import { badge } from './badge.ts';
import { button } from './button.ts';
import { icon } from './icon.ts';
import { sampleIcons } from './icons.ts';
import { listCard } from './list-card.ts';
import type { ListRowArgs } from './list-row.ts';
import { sheet, type SheetArgs } from './sheet.ts';
import '@bdynamic/plinth-css/src/components/icon.css';
import '@bdynamic/plinth-css/src/components/button.css';
import '@bdynamic/plinth-css/src/components/badge.css';
import '@bdynamic/plinth-css/src/components/list-row.css';
import '@bdynamic/plinth-css/src/components/list-card.css';
import '@bdynamic/plinth-css/src/components/sheet.css';

const action = (label: string, variant: 'primary' | 'secondary' | 'danger', extra = {}) =>
  button({ label, variant, size: 'md', disabled: false, busy: false }, extra);

const row = (title: string, extra: Partial<ListRowArgs> = {}): ListRowArgs => ({
  title,
  chevron: false,
  button: false,
  current: false,
  disabled: false,
  ...extra,
});

const leadingIcon = (svg: string) => icon({ size: 'md', mirror: false, svg });

const filters = listCard({
  heading: 'Show',
  headingLevel: 'h3',
  rows: [
    row('Status', { trailing: badge({ label: 'Open', tone: 'success', dot: true }) }),
    row('Sort by', { trailing: 'Newest first', button: true, chevron: true }),
    row('Starred only', { leading: leadingIcon(sampleIcons.star), button: true }),
  ],
});

const footer = (id: string) =>
  action('Reset', 'secondary') + action('Apply', 'primary', { commandfor: id, command: 'close' });

/** A button that opens the sheet with no script: commandfor and command="show-modal". */
const opener = (args: SheetArgs) =>
  action('Open the sheet', 'secondary', { commandfor: args.id, command: 'show-modal' });

const meta = {
  title: 'Components/Sheet',
  // The docs page is Sheet.mdx, written by hand.
  tags: ['!autodocs'],
  render: (args) => opener(args) + sheet(args),
  // The story opens its sheet, as an app would with showModal(). In the docs page the sheets stay
  // closed until their button is pressed.
  play: ({ canvasElement }) => {
    canvasElement.querySelector<HTMLDialogElement>('dialog.plinth-sheet')?.showModal();
  },
  args: {
    id: 'filters',
    title: 'Filters',
    closeLabel: 'Close',
    placement: 'center',
    body: filters,
    footer: footer('filters'),
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    closeLabel: { control: 'text' },
    placement: { control: 'inline-radio', options: [...sheetPlacements] },
    body: { control: false },
    footer: { control: false },
  },
} satisfies Meta<SheetArgs>;

export default meta;
type Story = StoryObj<SheetArgs>;

/** A centred dialog from 768px up, a bottom sheet on a phone. */
export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    id: 'filters-described',
    description: 'Only the items that match are shown in the list.',
    footer: footer('filters-described'),
  },
};

/** A full-height panel on the inline-end edge from 768px up, a bottom sheet on a phone. */
export const SidePanel: Story = {
  args: { id: 'filters-side', placement: 'end', footer: footer('filters-side') },
};

/** No footer: the rows act on their own, and the close button ends it. */
export const WithoutFooter: Story = {
  args: {
    id: 'account',
    title: 'Account',
    footer: undefined,
    body: listCard({
      headingLevel: 'h3',
      rows: [
        row('Profile', { href: '#profile', chevron: true }),
        row('Language', { trailing: 'English', href: '#language', chevron: true }),
        row('Sign out', { button: true }),
      ],
    }),
  },
};

/** A short confirmation: the description says what happens, the footer holds the choice. */
export const Confirmation: Story = {
  args: {
    id: 'delete-item',
    title: 'Delete this item?',
    description: 'It is removed for everyone in the workspace. This cannot be undone.',
    body: '<p>Its history and comments are deleted with it.</p>',
    footer:
      action('Cancel', 'secondary', { commandfor: 'delete-item', command: 'close' }) +
      action('Delete', 'danger'),
  },
};

/** More content than fits: the body scrolls, the header and footer stay put. */
export const LongContent: Story = {
  args: {
    id: 'long',
    title: 'Notifications',
    footer: footer('long'),
    // Spacing between the cards is the page's layout, not the sheet's.
    body: `<div style="display: grid; gap: var(--plinth-space-4);">${[1, 2, 3]
      .map((n) =>
        listCard({
          heading: `Group ${n}`,
          headingLevel: 'h3',
          rows: ['Mentions', 'Replies', 'New items', 'Weekly summary'].map((title) =>
            row(title, { trailing: 'On', button: true, chevron: true }),
          ),
        }),
      )
      .join('')}</div>`,
  },
};

export const LongTitle: Story = {
  args: {
    id: 'long-title',
    title: 'A title long enough to wrap onto a second line on a narrow phone screen',
    description:
      'And a description that explains what the sheet is for, written long enough to wrap onto more than one line.',
    footer: footer('long-title'),
  },
};

/** Right-to-left text: the close button sits on the left, and a side panel opens on the left. */
/**
 * closedby="closerequest" on the root: Escape and the buttons close it, a tap on the backdrop
 * doesn't. For a form with unsaved changes.
 */
export const NoBackdropClose: Story = {
  render: (args) => {
    const strict = {
      ...args,
      id: 'rename',
      title: 'Rename',
      body: '<p>A tap outside the sheet leaves it open.</p>',
      footer:
        action('Cancel', 'secondary', { commandfor: 'rename', command: 'close' }) +
        action('Save', 'primary'),
    };
    return opener(strict) + sheet(strict, { closedby: 'closerequest' });
  },
};

export const RightToLeft: Story = {
  render: (args) => {
    const rtl = {
      ...args,
      id: 'filters-rtl',
      placement: 'end' as const,
      footer: footer('filters-rtl'),
    };
    return `<div dir="rtl">${opener(rtl)}${sheet(rtl)}</div>`;
  },
};
