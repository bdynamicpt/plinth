import {
  confirmDialogFieldLabels,
  confirmDialogKind,
  confirmDialogPattern,
  confirmDialogTone,
  dialogSidePhone,
  type ConfirmDialogKind,
  type ConfirmDialogTone,
  type DialogSidePhone,
} from '@bdynamic/plinth-vue';
import { button } from './button.ts';
import { escape, rootAttributes, type Attributes } from './markup.ts';

export interface ConfirmDialogArgs {
  /** The dialog's id: commandfor and aria-labelledby point at it. */
  id: string;
  /** The question, and the dialog's accessible name. */
  title: string;
  /** What happens if the person confirms, and the dialog's accessible description. */
  message: string;
  /** What it asks for: only a yes, a phrase typed exactly, or the person's password. */
  kind: ConfirmDialogKind;
  /** The phrase to type, for the type-to-confirm kind. */
  phrase?: string;
  /** The field's label; `:phrase` shows the phrase in it. Each kind has a default. */
  fieldLabel?: string;
  /** The confirm button's label. */
  confirmLabel: string;
  /** The cancel button's label. */
  cancelLabel: string;
  /** danger makes the confirm button the danger variant, for a destructive action. */
  tone: ConfirmDialogTone;
  /** A message under the field, set by the app (a wrong password). */
  error?: string;
  /** The confirm button is busy while the app checks. */
  busy: boolean;
  /** How it shows below 768px: centred, or a bottom sheet. */
  sidePhone: DialogSidePhone;
}

/** The confirmation dialog's markup contract. Blade, Vue and React print exactly this. */
export function confirmDialog(
  {
    id,
    title,
    message,
    kind,
    phrase,
    fieldLabel,
    confirmLabel,
    cancelLabel,
    tone,
    error,
    busy,
    sidePhone,
  }: ConfirmDialogArgs,
  attributes: Attributes = {},
): string {
  // A project's own closedby and role replace Plinth's.
  const { closedby = 'closerequest', role = 'alertdialog', ...others } = attributes;
  const { classes, extra } = rootAttributes('plinth-dialog plinth-confirm-dialog', others);
  const side = dialogSidePhone(sidePhone);
  const type = confirmDialogKind(kind);
  const hasError = type !== 'simple' && Boolean(error?.trim());
  const ids = (part: string) => `${escape(id)}-${part}`;

  let field = '';
  if (type !== 'simple') {
    const label = escape(fieldLabel?.trim() || confirmDialogFieldLabels[type]);
    const input =
      type === 'type'
        ? ` type="text" name="confirmation" required pattern="${escape(confirmDialogPattern(phrase!.trim()))}" autocomplete="off" autocapitalize="none" spellcheck="false"`
        : ' type="password" name="password" required autocomplete="current-password"';
    field = [
      '<div class="plinth-confirm-dialog-field">',
      `<label for="${ids('field')}" class="plinth-confirm-dialog-label">`,
      type === 'type'
        ? label.split(':phrase').join(`<strong>${escape(phrase!.trim())}</strong>`)
        : label,
      '</label>',
      `<input id="${ids('field')}" class="plinth-confirm-dialog-input"${input}`,
      hasError ? ` aria-invalid="true" aria-describedby="${ids('error')}"` : '',
      '>',
      '</div>',
    ].join('');
  }

  return [
    `<dialog class="${classes}"${extra} id="${escape(id)}"`,
    role ? ` role="${escape(role)}"` : '',
    side === 'center' ? '' : ` data-side-phone="${side}"`,
    ` closedby="${escape(closedby)}" aria-labelledby="${ids('title')}" aria-describedby="${ids('message')}">`,
    '<form method="dialog" class="plinth-confirm-dialog-form">',
    '<div class="plinth-dialog-header">',
    `<h2 id="${ids('title')}" class="plinth-dialog-title">${escape(title)}</h2>`,
    '</div>',
    '<div class="plinth-dialog-body">',
    `<p id="${ids('message')}" class="plinth-confirm-dialog-message">${escape(message)}</p>`,
    field,
    hasError
      ? `<p id="${ids('error')}" class="plinth-confirm-dialog-error" role="alert">${escape(error!)}</p>`
      : '',
    '</div>',
    '<div class="plinth-dialog-footer">',
    button(
      { label: cancelLabel, variant: 'secondary', size: 'md', disabled: false, busy: false },
      { commandfor: id, command: 'close' },
    ),
    button(
      {
        label: confirmLabel,
        variant: confirmDialogTone(tone) === 'danger' ? 'danger' : 'primary',
        size: 'md',
        disabled: false,
        busy,
      },
      { class: 'plinth-confirm-dialog-confirm', type: 'submit', value: 'confirm' },
    ),
    '</div>',
    '</form>',
    '</dialog>',
  ].join('');
}
