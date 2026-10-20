import type { Meta, StoryObj } from '@storybook/html-vite';
import { dialogSidePhones } from '@bdynamic/plinth-vue';
import { button } from './button.ts';
import { dialog, type DialogArgs } from './dialog.ts';
import { listCard } from './list-card.ts';
import type { ListRowArgs } from './list-row.ts';
import '@bdynamic/plinth-css/src/components/icon.css';
import '@bdynamic/plinth-css/src/components/button.css';
import '@bdynamic/plinth-css/src/components/list-row.css';
import '@bdynamic/plinth-css/src/components/list-card.css';
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

/** A short form: Plinth has no field component yet, so the story styles its own inputs. */
const field = (id: string, label: string, value: string, type = 'text') =>
  `<label for="${id}" style="display: grid; gap: var(--plinth-space-1); font-size: var(--plinth-font-size-sm); color: var(--plinth-color-text-muted);">${label}` +
  `<input id="${id}" type="${type}" value="${value}" style="box-sizing: border-box; min-block-size: var(--plinth-touch-target); padding-inline: var(--plinth-space-3); font: inherit; font-size: var(--plinth-font-size-md); color: var(--plinth-color-text); background: var(--plinth-color-surface); border: var(--plinth-border-width-thin) solid var(--plinth-color-border); border-radius: var(--plinth-radius-control);"></label>`;

const form = (id: string) =>
  `<div style="display: grid; gap: var(--plinth-space-4);">${field(`${id}-name`, 'Name', 'North harbour')}${field(`${id}-email`, 'Contact email', 'team@example.com', 'email')}</div>`;

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
    title: 'Edit project',
    closeLabel: 'Close',
    dismissible: true,
    sidePhone: 'center',
    body: form('project'),
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
          'A modal for a form, details or settings on a native dialog, centred at every width.',
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
    description: 'The name shows to everyone in the workspace.',
    body: form('project-described'),
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
    body: form('project-bottom'),
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
    id: 'terms',
    title: 'Terms of service',
    footer: footer('terms'),
    body: Array.from(
      { length: 12 },
      (_, n) =>
        `<p>Section ${n + 1}. The service is provided as it is, and the terms may change with notice. Read each section before you accept them.</p>`,
    ).join(''),
  },
};

export const LongTitle: Story = {
  args: {
    id: 'long-title',
    title: 'A title long enough to wrap onto a second line on a narrow phone screen',
    description:
      'And a description that explains what the dialog is for, written long enough to wrap onto more than one line.',
    body: form('long-title'),
    footer: footer('long-title'),
  },
};

/** Right-to-left text: the close button sits on the left, the footer's actions start there. */
export const RightToLeft: Story = {
  render: (args) => {
    const rtl = {
      ...args,
      id: 'project-rtl',
      body: form('project-rtl'),
      footer: footer('project-rtl'),
    };
    return `<div dir="rtl">${opener(rtl)}${dialog(rtl)}</div>`;
  },
};
