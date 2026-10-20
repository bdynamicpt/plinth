import type { Meta, StoryObj } from '@storybook/html-vite';
import { confirmDialogKinds, confirmDialogTones, dialogSidePhones } from '@bdynamic/plinth-vue';
import { button } from './button.ts';
import { confirmDialog, type ConfirmDialogArgs } from './confirm-dialog.ts';
import '@bdynamic/plinth-css/src/components/icon.css';
import '@bdynamic/plinth-css/src/components/button.css';
import '@bdynamic/plinth-css/src/components/modal.css';
import '@bdynamic/plinth-css/src/components/dialog.css';
import '@bdynamic/plinth-css/src/components/confirm-dialog.css';

/** A button that opens the dialog with no script: commandfor and command="show-modal". */
const opener = (args: ConfirmDialogArgs) =>
  button(
    { label: 'Open the dialog', variant: 'secondary', size: 'md', disabled: false, busy: false },
    { commandfor: args.id, command: 'show-modal' },
  );

/** Opens the story's dialog, as an app would with showModal(), and types into its field. */
const open =
  (typed?: string) =>
  ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const dialog = canvasElement.querySelector<HTMLDialogElement>('dialog.plinth-confirm-dialog');
    dialog?.showModal();
    const input = dialog?.querySelector<HTMLInputElement>('.plinth-confirm-dialog-input');
    if (input && typed !== undefined) {
      input.value = typed;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

const meta = {
  title: 'Components/Confirm Dialog',
  render: (args) => opener(args) + confirmDialog(args),
  // In the docs page the dialogs stay closed until their button is pressed.
  play: open(),
  args: {
    id: 'archive',
    title: 'Archive 3 tickets?',
    message: 'They leave the board and the search. You can bring them back from the archive.',
    kind: 'simple',
    confirmLabel: 'Archive',
    cancelLabel: 'Cancel',
    tone: 'neutral',
    busy: false,
    sidePhone: 'center',
  },
  argTypes: {
    title: { control: 'text' },
    message: { control: 'text' },
    kind: { control: 'inline-radio', options: [...confirmDialogKinds] },
    phrase: { control: 'text' },
    fieldLabel: { control: 'text' },
    confirmLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
    tone: { control: 'inline-radio', options: [...confirmDialogTones] },
    error: { control: 'text' },
    busy: { control: 'boolean' },
    sidePhone: { control: 'inline-radio', options: [...dialogSidePhones] },
  },
  parameters: {
    // The open dialog takes no room in the page, so the frames at every width get their height.
    everyWidth: { height: 480 },
    docs: {
      description: {
        component:
          'A dialog that asks a person to confirm an action before it happens: simple, type ' +
          'to confirm, or password. It is never dismissible; Cancel and Escape close it, and ' +
          'the confirm button submits its form (listen for submit on the dialog). The app ' +
          'checks a password, never Plinth. Give it an id for commandfor, and in Livewire put ' +
          'wire:ignore.self on it.',
      },
    },
  },
} satisfies Meta<ConfirmDialogArgs>;

export default meta;
type Story = StoryObj<ConfirmDialogArgs>;

/** Simple: the question, what happens, Cancel and the action. */
export const Default: Story = {};

/** danger makes the confirm button the danger variant, for an action that destroys something. */
export const Danger: Story = {
  args: {
    id: 'remove',
    title: 'Remove Sam Lee from the workspace?',
    message: 'They lose access to every project at once. Their tickets stay.',
    confirmLabel: 'Remove',
    tone: 'danger',
  },
};

const typeArgs: Partial<ConfirmDialogArgs> = {
  title: 'Delete this project?',
  message: 'Its tickets, files and history go with it, and this cannot be undone.',
  kind: 'type',
  phrase: 'harbour',
  confirmLabel: 'Delete project',
  tone: 'danger',
};

/** Type to confirm, empty: the confirm button looks disabled until the text matches. */
export const TypeToConfirm: Story = { args: { ...typeArgs, id: 'delete' } };

/** Typing: still no match, so the confirm button still looks disabled. */
export const TypeToConfirmTyping: Story = {
  args: { ...typeArgs, id: 'delete-typing' },
  play: open('harb'),
};

/** Matching: the text is the phrase, and the confirm button works. */
export const TypeToConfirmMatching: Story = {
  args: { ...typeArgs, id: 'delete-matching' },
  play: open('harbour'),
};

const passwordArgs: Partial<ConfirmDialogArgs> = {
  title: 'Change the billing email?',
  message: 'Invoices go to the new address from the next one. Enter your password to go on.',
  kind: 'password',
  confirmLabel: 'Change email',
};

/**
 * Password, empty: the field is required, so the confirm button looks disabled until something is
 * typed; the app checks what is.
 */
export const Password: Story = { args: { ...passwordArgs, id: 'billing' } };

/** Busy: the app is checking the password, and the confirm button shows it. */
export const PasswordBusy: Story = {
  args: { ...passwordArgs, id: 'billing-busy', busy: true },
  play: open('correct horse'),
};

/** The app found the password wrong: the error under the field, announced when it appears. */
export const PasswordError: Story = {
  args: {
    ...passwordArgs,
    id: 'billing-error',
    error: 'That password isn’t right. Try again.',
  },
  play: open('wrong horse'),
};

/** A bottom sheet below 768px, a centred dialog from 768px up. */
export const BottomOnPhone: Story = {
  args: { ...typeArgs, id: 'delete-bottom', sidePhone: 'bottom' },
};

/** A long question, message, phrase and labels wrap, and the buttons share the footer. */
export const LongText: Story = {
  args: {
    id: 'long',
    title: 'Archive every ticket in the North harbour project that has been closed this year?',
    message:
      'They leave the board, the search and the reports, and the people watching them stop ' +
      'getting updates. You can bring each of them back from the archive later on.',
    kind: 'type',
    phrase: 'archive closed tickets',
    fieldLabel: 'To go on, type :phrase in the field below',
    confirmLabel: 'Archive the closed tickets',
  },
};

/** Right-to-left text: the actions start on the left. */
export const RightToLeft: Story = {
  args: { ...typeArgs, id: 'delete-rtl' },
  render: (args) => `<div dir="rtl">${opener(args)}${confirmDialog(args)}</div>`,
};
