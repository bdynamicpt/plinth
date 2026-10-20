// Markup contract: packages/css/src/components/confirm-dialog.css
import { Fragment, useId, type ComponentProps } from 'react';
import { PlinthButton } from './PlinthButton';
import {
  confirmDialogFieldLabels,
  confirmDialogKind,
  confirmDialogPattern,
  confirmDialogTone,
  type ConfirmDialogKind,
  type ConfirmDialogTone,
} from './confirm-dialog';
import { dialogSidePhone, type DialogSidePhone } from './dialog';
import { classNames } from './markup';

interface ConfirmDialogOptions {
  /** The dialog's id; one is generated when it is missing. */
  id?: string;
  /** The question, and the dialog's accessible name. */
  title: string;
  /** What happens if the person confirms, and the dialog's accessible description. */
  message: string;
  /** What it asks for: only a yes, a phrase typed exactly, or the person's password. */
  kind?: ConfirmDialogKind;
  /** The phrase to type, for the type-to-confirm kind. */
  phrase?: string;
  /** The field's label; `:phrase` shows the phrase in it. Each kind has a default. */
  fieldLabel?: string;
  /** The confirm button's label. */
  confirmLabel?: string;
  /** The cancel button's label. */
  cancelLabel?: string;
  /** danger makes the confirm button the danger variant, for a destructive action. */
  tone?: ConfirmDialogTone;
  /** A message under the field, set by the app (a wrong password). */
  error?: string;
  /** The confirm button is busy while the app checks. */
  busy?: boolean;
  /** How it shows below 768px: centred, or a bottom sheet. */
  sidePhone?: DialogSidePhone;
}

/**
 * A confirmation dialog on a `<dialog>`: open it with a button that has `commandfor` and
 * `command="show-modal"`, or with `showModal()` on a ref. `onSubmit` (it bubbles from the form)
 * is the confirm, after the browser checked the field; `onClose` is the dialog's close event
 * (Vue's `close`), with `returnValue` "confirm" when it was confirmed.
 */
export type PlinthConfirmDialogProps = ConfirmDialogOptions &
  Omit<ComponentProps<'dialog'>, keyof ConfirmDialogOptions | 'children'>;

export function PlinthConfirmDialog({
  id,
  title,
  message,
  kind,
  phrase,
  fieldLabel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone,
  error,
  busy = false,
  sidePhone,
  className,
  ...rest
}: PlinthConfirmDialogProps) {
  const generatedId = useId();
  if (!title?.trim()) {
    throw new Error("<PlinthConfirmDialog> needs a title: it is the dialog's accessible name.");
  }
  if (!message?.trim()) {
    throw new Error(
      "<PlinthConfirmDialog> needs a message: it is the dialog's accessible description.",
    );
  }
  const type = confirmDialogKind(kind);
  if (type === 'type' && !phrase?.trim()) {
    throw new Error(
      '<PlinthConfirmDialog kind="type"> needs a phrase: it is what the person types.',
    );
  }
  const dialogId = id?.trim() || `plinth-confirm-dialog-${generatedId}`;
  const side = dialogSidePhone(sidePhone);
  const phraseText = phrase?.trim() ?? '';
  const hasError = type !== 'simple' && Boolean(error?.trim());
  const errorAttributes = hasError
    ? { 'aria-invalid': true, 'aria-describedby': `${dialogId}-error` }
    : {};
  // React passes lowercase attributes it doesn't know as they are, so the invoker command reaches
  // the button.
  const command = { commandfor: dialogId, command: 'close' };

  let field = null;
  if (type !== 'simple') {
    const label = fieldLabel?.trim() || confirmDialogFieldLabels[type];
    const parts = type === 'type' ? label.split(':phrase') : [label];
    field = (
      <div className="plinth-confirm-dialog-field">
        <label htmlFor={`${dialogId}-field`} className="plinth-confirm-dialog-label">
          {parts.map((part, n) => (
            <Fragment key={n}>
              {n > 0 ? <strong>{phraseText}</strong> : null}
              {part}
            </Fragment>
          ))}
        </label>
        {type === 'type' ? (
          <input
            id={`${dialogId}-field`}
            className="plinth-confirm-dialog-input"
            type="text"
            name="confirmation"
            required
            pattern={confirmDialogPattern(phraseText)}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck="false"
            {...errorAttributes}
          />
        ) : (
          <input
            id={`${dialogId}-field`}
            className="plinth-confirm-dialog-input"
            type="password"
            name="password"
            required
            autoComplete="current-password"
            {...errorAttributes}
          />
        )}
      </div>
    );
  }

  // The project's own attributes come after Plinth's and win, as in Blade and Vue; its class is
  // added to Plinth's.
  return (
    <dialog
      id={dialogId}
      role="alertdialog"
      data-side-phone={side === 'center' ? undefined : side}
      closedby="closerequest"
      aria-labelledby={`${dialogId}-title`}
      aria-describedby={`${dialogId}-message`}
      {...rest}
      className={classNames('plinth-dialog plinth-confirm-dialog', className)}
    >
      <form method="dialog" className="plinth-confirm-dialog-form">
        <div className="plinth-dialog-header">
          <h2 id={`${dialogId}-title`} className="plinth-dialog-title">
            {title}
          </h2>
        </div>
        <div className="plinth-dialog-body">
          <p id={`${dialogId}-message`} className="plinth-confirm-dialog-message">
            {message}
          </p>
          {field}
          {hasError ? (
            <p id={`${dialogId}-error`} className="plinth-confirm-dialog-error" role="alert">
              {error}
            </p>
          ) : null}
        </div>
        <div className="plinth-dialog-footer">
          <PlinthButton variant="secondary" {...command}>
            {cancelLabel}
          </PlinthButton>
          <PlinthButton
            className="plinth-confirm-dialog-confirm"
            type="submit"
            value="confirm"
            variant={confirmDialogTone(tone) === 'danger' ? 'danger' : 'primary'}
            busy={busy}
          >
            {confirmLabel}
          </PlinthButton>
        </div>
      </form>
    </dialog>
  );
}
