import type { Meta, StoryObj } from '@storybook/html-vite';
import { dialogSidePhones } from '@bdynamic/plinth-vue';
import { button } from './button.ts';
import { dialog, type DialogArgs } from './dialog.ts';
import { listCard } from './list-card.ts';
import type { ListRowArgs } from './list-row.ts';
import { pillRow } from './pill-row.ts';
import '@bdynamic/plinth-css/src/components/icon.css';
import '@bdynamic/plinth-css/src/components/button.css';
import '@bdynamic/plinth-css/src/components/list-row.css';
import '@bdynamic/plinth-css/src/components/list-card.css';
import '@bdynamic/plinth-css/src/components/pill-row.css';
import '@bdynamic/plinth-css/src/components/modal.css';
import '@bdynamic/plinth-css/src/components/dialog.css';

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

const pills = (labels: string[]) =>
  labels.map((label, n) => ({ label, selected: n === 0, disabled: false }));

/** A project's settings: who sees it, and the rows that open its other settings. */
const settings = () =>
  `<div style="display: grid; gap: var(--plinth-space-4);">${pillRow({
    label: 'Visibility',
    nav: false,
    pills: pills(['Private', 'Workspace', 'Public']),
  })}${listCard({
    headingLevel: 'h3',
    rows: [
      row('Name', { trailing: 'North harbour', button: true, chevron: true }),
      row('Owner', { trailing: 'Sam Lee', button: true, chevron: true }),
      row('Archive when done', { trailing: 'Off', button: true }),
    ],
  })}</div>`;

const footer = (id: string) =>
  action('Cancel', 'secondary', { commandfor: id, command: 'close' }) +
  action('Save', 'primary', { commandfor: id, command: 'close' });

/** A button that opens the dialog with no script: commandfor and command="show-modal". */
const opener = (args: DialogArgs) =>
  action('Open the dialog', 'secondary', { commandfor: args.id, command: 'show-modal' });

const meta = {
  title: 'Components/Dialog',
  render: (args) => opener(args) + dialog(args),
  // The story opens its dialog, as an app would with showModal(). In the docs page the dialogs
  // stay closed until their button is pressed.
  play: ({ canvasElement }) => {
    canvasElement.querySelector<HTMLDialogElement>('dialog.plinth-dialog')?.showModal();
  },
  args: {
    id: 'project',
    title: 'Project settings',
    closeLabel: 'Close',
    dismissible: true,
    sidePhone: 'center',
    body: settings(),
    footer: footer('project'),
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    closeLabel: { control: 'text' },
    dismissible: { control: 'boolean' },
    sidePhone: { control: 'inline-radio', options: [...dialogSidePhones] },
    body: { control: false },
    footer: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A modal for a form, details or settings on a native dialog, centred at every width. ' +
          'Give it an id for commandfor. One that is not dismissible needs a description (its ' +
          'message) and an action that closes it, the least destructive first. In Livewire, put ' +
          'wire:ignore.self on it.',
      },
    },
  },
} satisfies Meta<DialogArgs>;

export default meta;
type Story = StoryObj<DialogArgs>;

/** Centred at every width; the close button, Escape and the backdrop close it. */
export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    id: 'project-described',
    description: 'Who can see the project, and who looks after it.',
    body: settings(),
    footer: footer('project-described'),
  },
};

/**
 * Not dismissible: an alert dialog with no close button, which a tap on the backdrop leaves open.
 * It closes through its own buttons, and Escape acts as Cancel.
 */
export const NotDismissible: Story = {
  args: {
    id: 'leave',
    title: 'Leave without saving?',
    description: 'Your changes to this project are lost if you leave now.',
    dismissible: false,
    body: '<p>Save them first, or leave and start again later.</p>',
    footer:
      action('Stay', 'secondary', { commandfor: 'leave', command: 'close' }) +
      action('Leave', 'danger', { commandfor: 'leave', command: 'close' }),
  },
};

/** A bottom sheet below 768px, a centred dialog from 768px up. */
export const BottomOnPhone: Story = {
  args: {
    id: 'project-bottom',
    sidePhone: 'bottom',
    body: settings(),
    footer: footer('project-bottom'),
  },
};

/** No footer: details to read, and the close button ends it. */
export const WithoutFooter: Story = {
  args: {
    id: 'details',
    title: 'Invoice 2041',
    footer: undefined,
    body: listCard({
      headingLevel: 'h3',
      rows: [
        row('Client', { trailing: 'North harbour' }),
        row('Issued', { trailing: '3 March' }),
        row('Due', { trailing: '2 April' }),
        row('Amount', { trailing: '1 250,00 €' }),
      ],
    }),
  },
};

/** More content than fits: the body scrolls, the header and footer stay put. */
export const LongContent: Story = {
  args: {
    id: 'notifications',
    title: 'Notifications',
    footer: footer('notifications'),
    // Spacing between the cards is the page's layout, not the dialog's.
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
      'And a description that explains what the dialog is for, written long enough to wrap onto more than one line.',
    body: settings(),
    footer: footer('long-title'),
  },
};

/** Right-to-left text: the close button sits on the left, the footer's actions start there. */
export const RightToLeft: Story = {
  render: (args) => {
    const rtl = {
      ...args,
      id: 'project-rtl',
      body: settings(),
      footer: footer('project-rtl'),
    };
    return `<div dir="rtl">${opener(rtl)}${dialog(rtl)}</div>`;
  },
};
