// Markup contract: packages/css/src/components/sheet.css
import { useId, type ComponentProps, type ReactNode } from 'react';
import { PlinthIconButton } from './PlinthIconButton';
import { classNames, hasContent } from './markup';
import { sheetPlacement, type SheetPlacement } from './sheet';

interface SheetOptions {
  /** The dialog's id; one is generated when it is missing. */
  id?: string;
  /** The heading, and the sheet's accessible name. */
  title: string;
  /** A line under the title, and the sheet's accessible description. */
  description?: string;
  /** The close button's accessible name. */
  closeLabel?: string;
  /** Where the sheet shows from 768px up. */
  placement?: SheetPlacement;
  /** The actions under the body (Vue's `footer` slot). */
  footer?: ReactNode;
}

/**
 * A `<dialog>`: open it with a button that has `commandfor` and `command="show-modal"`, or with
 * `showModal()` on a ref. `onClose` is the dialog's close event (Vue's `close`): the close button,
 * Escape, the backdrop or `close()`.
 */
export type PlinthSheetProps = SheetOptions & Omit<ComponentProps<'dialog'>, keyof SheetOptions>;

export function PlinthSheet({
  id,
  title,
  description,
  closeLabel = 'Close',
  placement,
  footer,
  className,
  children,
  ...rest
}: PlinthSheetProps) {
  const generatedId = useId();
  if (!title?.trim()) {
    throw new Error("<PlinthSheet> needs a title: it is the sheet's accessible name.");
  }
  const sheetId = id?.trim() || `plinth-sheet-${generatedId}`;
  const hasDescription = Boolean(description?.trim());
  // React passes lowercase attributes it doesn't know as they are, so the invoker command reaches
  // the button.
  const command = { commandfor: sheetId, command: 'close' };

  // The project's own attributes come after Plinth's and win, as in Blade and Vue; its class is
  // added to Plinth's.
  return (
    <dialog
      id={sheetId}
      data-placement={sheetPlacement(placement)}
      closedby="any"
      aria-labelledby={`${sheetId}-title`}
      aria-describedby={hasDescription ? `${sheetId}-description` : undefined}
      {...rest}
      className={classNames('plinth-sheet', className)}
    >
      <div className="plinth-sheet-header">
        <h2 id={`${sheetId}-title`} className="plinth-sheet-title">
          {title}
        </h2>
        {hasDescription ? (
          <p id={`${sheetId}-description`} className="plinth-sheet-description">
            {description}
          </p>
        ) : null}
        <PlinthIconButton
          className="plinth-sheet-close"
          label={closeLabel}
          variant="ghost"
          {...command}
        >
          {/* The cross is sheetCloseIcon (sheet.ts), written out; parity keeps the copies equal. */}
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
      </div>
      <div className="plinth-sheet-body">{children}</div>
      {hasContent(footer) ? <div className="plinth-sheet-footer">{footer}</div> : null}
    </dialog>
  );
}
