import { dialogCloseIcon, dialogSidePhone, type DialogSidePhone } from '@bdynamic/plinth-vue';
import { iconButton } from './icon-button.ts';
import { escape, rootAttributes, type Attributes } from './markup.ts';

export interface DialogArgs {
  /** The dialog's id: commandfor and aria-labelledby point at it. */
  id: string;
  /** The heading, and the dialog's accessible name. */
  title: string;
  /** A line under the title, and the dialog's accessible description. */
  description?: string;
  /** The close button's accessible name. */
  closeLabel: string;
  /**
   * Whether the person may walk away: the close button, Escape and the backdrop close it. When
   * false it is an alert dialog that closes through its own buttons, Escape acting as Cancel.
   */
  dismissible: boolean;
  /** How it shows below 768px: centred, or a bottom sheet. */
  sidePhone: DialogSidePhone;
  /** The body's content (trusted markup, not escaped). */
  body: string;
  /** The footer's content, usually its actions (trusted markup). */
  footer?: string;
}

/** The dialog's markup contract. Blade, Vue and React must print exactly this (see parity.test.ts). */
export function dialog(
  { id, title, description, closeLabel, dismissible, sidePhone, body, footer }: DialogArgs,
  attributes: Attributes = {},
): string {
  // A project's own closedby and role replace Plinth's.
  const {
    closedby = dismissible ? 'any' : 'closerequest',
    role = dismissible ? undefined : 'alertdialog',
    ...others
  } = attributes;
  const { classes, extra } = rootAttributes('plinth-dialog', others);
  const hasDescription = Boolean(description?.trim());
  const side = dialogSidePhone(sidePhone);
  const close = dismissible
    ? iconButton(
        {
          label: closeLabel,
          variant: 'ghost',
          size: 'md',
          disabled: false,
          busy: false,
          svg: dialogCloseIcon,
        },
        { class: 'plinth-dialog-close', commandfor: id, command: 'close' },
      )
    : '';
  return [
    `<dialog class="${classes}"${extra} id="${escape(id)}"`,
    role ? ` role="${escape(role)}"` : '',
    side === 'center' ? '' : ` data-side-phone="${side}"`,
    ` closedby="${escape(closedby)}" aria-labelledby="${escape(id)}-title"`,
    hasDescription ? ` aria-describedby="${escape(id)}-description"` : '',
    '>',
    '<div class="plinth-dialog-panel">',
    // A bottom sheet on a phone that can be dismissed has the grab handle (modal.css).
    dismissible && side === 'bottom'
      ? '<div class="plinth-dialog-handle" aria-hidden="true"></div>'
      : '',
    '<div class="plinth-dialog-header">',
    `<h2 id="${escape(id)}-title" class="plinth-dialog-title">${escape(title)}</h2>`,
    hasDescription
      ? `<p id="${escape(id)}-description" class="plinth-dialog-description">${escape(description!)}</p>`
      : '',
    close,
    '</div>',
    `<div class="plinth-dialog-body">${body}</div>`,
    footer?.trim() ? `<div class="plinth-dialog-footer">${footer}</div>` : '',
    '</div>',
    '</dialog>',
  ].join('');
}
