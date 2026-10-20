// Markup contract: packages/css/src/components/dialog.css
import { useId, type ComponentProps, type ReactNode } from 'react';
import { PlinthIconButton } from './PlinthIconButton';
import { dialogSidePhone, type DialogSidePhone } from './dialog';
import { classNames, hasContent } from './markup';
import { useSwipeToClose } from './swipe';

interface DialogOptions {
  /** The dialog's id; one is generated when it is missing. */
  id?: string;
  /** The heading, and the dialog's accessible name. */
  title: string;
  /** A line under the title, and the dialog's accessible description. */
  description?: string;
  /** The close button's accessible name. */
  closeLabel?: string;
  /** Whether the close button, Escape and the backdrop close it; false makes an alert dialog. */
  dismissible?: boolean;
  /** How it shows below 768px: centred, or a bottom sheet. */
  sidePhone?: DialogSidePhone;
  /** The actions under the body (Vue's `footer` slot). */
  footer?: ReactNode;
}

/**
 * A `<dialog>`: open it with a button that has `commandfor` and `command="show-modal"`, or with
 * `showModal()` on a ref. `onClose` is the dialog's close event (Vue's `close`): its buttons, the
 * close button, Escape, the backdrop or `close()`.
 */
export type PlinthDialogProps = DialogOptions & Omit<ComponentProps<'dialog'>, keyof DialogOptions>;

export function PlinthDialog({
  id,
  title,
  description,
  closeLabel = 'Close',
  dismissible = true,
  sidePhone,
  footer,
  className,
  children,
  ref,
  ...rest
}: PlinthDialogProps) {
  const generatedId = useId();
  // A bottom panel on a phone is dragged down to close (modal.css).
  const swipe = useSwipeToClose(ref);
  if (!title?.trim()) {
    throw new Error("<PlinthDialog> needs a title: it is the dialog's accessible name.");
  }
  const dialogId = id?.trim() || `plinth-dialog-${generatedId}`;
  const hasDescription = Boolean(description?.trim());
  const side = dialogSidePhone(sidePhone);
  // React passes lowercase attributes it doesn't know as they are, so the invoker command reaches
  // the button.
  const command = { commandfor: dialogId, command: 'close' };

  // The project's own attributes come after Plinth's and win, as in Blade and Vue; its class is
  // added to Plinth's.
  return (
    <dialog
      id={dialogId}
      role={dismissible ? undefined : 'alertdialog'}
      data-side-phone={side === 'center' ? undefined : side}
      closedby={dismissible ? 'any' : 'closerequest'}
      aria-labelledby={`${dialogId}-title`}
      aria-describedby={hasDescription ? `${dialogId}-description` : undefined}
      {...rest}
      ref={swipe}
      className={classNames('plinth-dialog', className)}
    >
      <div className="plinth-dialog-panel">
        {dismissible && side === 'bottom' ? (
          <div className="plinth-dialog-handle" aria-hidden="true"></div>
        ) : null}
        <div className="plinth-dialog-header">
          <h2 id={`${dialogId}-title`} className="plinth-dialog-title">
            {title}
          </h2>
          {hasDescription ? (
            <p id={`${dialogId}-description`} className="plinth-dialog-description">
              {description}
            </p>
          ) : null}
          {dismissible ? (
            <PlinthIconButton
              className="plinth-dialog-close"
              label={closeLabel}
              variant="ghost"
              {...command}
            >
              {/* The cross is dialogCloseIcon (dialog.ts), written out; parity keeps the copies equal. */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 6l12 12M18 6L6 18"></path>
              </svg>
            </PlinthIconButton>
          ) : null}
        </div>
        <div className="plinth-dialog-body">{children}</div>
        {hasContent(footer) ? <div className="plinth-dialog-footer">{footer}</div> : null}
      </div>
    </dialog>
  );
}
