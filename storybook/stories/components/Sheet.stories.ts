import type { Meta, StoryObj } from '@storybook/html-vite';
import { sheetSides } from '@bdynamic/plinth-vue';
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
import '@bdynamic/plinth-css/src/components/modal.css';
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
    side: 'end',
    body: filters,
    footer: footer('filters'),
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    closeLabel: { control: 'text' },
    side: { control: 'inline-radio', options: [...sheetSides] },
    sidePhone: {
      control: 'inline-radio',
      options: ['none', ...sheetSides],
      mapping: { none: undefined },
    },
    body: { control: false },
    footer: { control: false },
  },
  parameters: {
    // The open dialog takes no room in the page, so the frames at every width get their height.
    everyWidth: { height: 720 },
    docs: {
      description: {
        component:
          'A modal panel on a native dialog, on the edge you pick with `side` (end, start, top or bottom) at every width; `side-phone` picks another edge below 768px. For a modal centred on the screen, use the dialog.',
      },
    },
  },
} satisfies Meta<SheetArgs>;

export default meta;
type Story = StoryObj<SheetArgs>;

/** On the end edge, the default: the right in left-to-right text. */
export const Default: Story = {};

/** On the start edge: the left in left-to-right text. */
export const Start: Story = {
  args: { id: 'filters-start', side: 'start', footer: footer('filters-start') },
};

/** On the top edge, the screen's width and as tall as its content. */
export const Top: Story = {
  args: { id: 'filters-top', side: 'top', footer: footer('filters-top') },
};

/** On the bottom edge, the screen's width, clearing the home indicator. */
export const Bottom: Story = {
  args: { id: 'filters-bottom', side: 'bottom', footer: footer('filters-bottom') },
};

/** A side panel from 768px up, a bottom sheet on a phone: `side="end" side-phone="bottom"`. */
export const EndBottomOnPhone: Story = {
  args: {
    id: 'filters-end-bottom',
    side: 'end',
    sidePhone: 'bottom',
    footer: footer('filters-end-bottom'),
  },
};

/** On the start edge from 768px up, a bottom sheet on a phone. */
export const StartBottomOnPhone: Story = {
  args: {
    id: 'filters-start-bottom',
    side: 'start',
    sidePhone: 'bottom',
    footer: footer('filters-start-bottom'),
  },
};

/** On the top edge from 768px up, a bottom sheet on a phone, nearer the thumb. */
export const TopBottomOnPhone: Story = {
  args: {
    id: 'filters-top-bottom',
    side: 'top',
    sidePhone: 'bottom',
    footer: footer('filters-top-bottom'),
  },
};

/** On the bottom edge from 768px up, a panel on the start edge on a phone. */
export const BottomStartOnPhone: Story = {
  args: {
    id: 'filters-bottom-start',
    side: 'bottom',
    sidePhone: 'start',
    footer: footer('filters-bottom-start'),
  },
};

export const WithDescription: Story = {
  args: {
    id: 'filters-described',
    description: 'Only the items that match are shown in the list.',
    footer: footer('filters-described'),
  },
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

/** More content than fits: the body scrolls, the header and footer stay put. */
export const LongContent: Story = {
  args: {
    id: 'long',
    title: 'Notifications',
    sidePhone: 'bottom',
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

/** Right-to-left text: the end edge is the left, and the close button sits on the left. */
export const RightToLeft: Story = {
  render: (args) => {
    const rtl = { ...args, id: 'filters-rtl', footer: footer('filters-rtl') };
    return `<div dir="rtl">${opener(rtl)}${sheet(rtl)}</div>`;
  },
};

/** Right-to-left text on the start edge: the right. */
export const RightToLeftStart: Story = {
  render: (args) => {
    const rtl = {
      ...args,
      id: 'filters-rtl-start',
      side: 'start' as const,
      footer: footer('filters-rtl-start'),
    };
    return `<div dir="rtl">${opener(rtl)}${sheet(rtl)}</div>`;
  },
};
