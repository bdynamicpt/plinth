// Markup contract: packages/css/src/components/drawer.css
import { useId, type ComponentProps, type ReactNode } from 'react';
import { PlinthIconButton } from './PlinthIconButton';
import {
  drawerDesktop,
  drawerSnap,
  drawerSnapPoints,
  type DrawerDesktop,
  type DrawerSnap,
} from './drawer';
import { classNames, hasContent } from './markup';
import { useSwipeToClose } from './swipe';

interface DrawerOptions {
  /** The dialog's id; one is generated when it is missing. */
  id?: string;
  /** The heading, and the drawer's accessible name. */
  title: string;
  /** A line under the title, and the drawer's accessible description. */
  description?: string;
  /** The close button's accessible name. */
  closeLabel?: string;
  /** Its presentation from 768px up: a dialog or a sheet. */
  desktop?: DrawerDesktop;
  /** Where it can rest on a phone (a list, or a string separated by spaces); none for as tall as its content. */
  snapPoints?: readonly DrawerSnap[] | string;
  /** The snap point it opens at; the largest listed when it is missing. */
  snap?: DrawerSnap;
  /** The actions under the body (Vue's `footer` slot). */
  footer?: ReactNode;
}

/**
 * A `<dialog>` on the bottom edge of a phone that the person drags: open it with a button that
 * has `commandfor` and `command="show-modal"`, or with `showModal()` on a ref. `onClose` is the
 * dialog's close event (Vue's `close`): the close button, Escape, the backdrop, a swipe down or
 * `close()`.
 */
export type PlinthDrawerProps = DrawerOptions & Omit<ComponentProps<'dialog'>, keyof DrawerOptions>;

export function PlinthDrawer({
  id,
  title,
  description,
  closeLabel = 'Close',
  desktop,
  snapPoints,
  snap,
  footer,
  className,
  children,
  ref,
  ...rest
}: PlinthDrawerProps) {
  const generatedId = useId();
  // Dragged down to close, and opened at its snap point (modal.css).
  const swipe = useSwipeToClose(ref);
  if (!title?.trim()) {
    throw new Error("<PlinthDrawer> needs a title: it is the drawer's accessible name.");
  }
  const drawerId = id?.trim() || `plinth-drawer-${generatedId}`;
  const hasDescription = Boolean(description?.trim());
  const points = drawerSnapPoints(snapPoints);

  // The project's own attributes come after Plinth's and win, as in Blade and Vue; its class is
  // added to Plinth's.
  return (
    <dialog
      id={drawerId}
      data-desktop={drawerDesktop(desktop)}
      data-snap-points={points.length ? points.join(' ') : undefined}
      data-snap={drawerSnap(snap, points)}
      closedby="any"
      aria-labelledby={`${drawerId}-title`}
      aria-describedby={hasDescription ? `${drawerId}-description` : undefined}
      {...rest}
      ref={swipe}
      className={classNames('plinth-drawer', className)}
    >
      <div className="plinth-drawer-panel">
        <div className="plinth-drawer-handle" aria-hidden="true"></div>
        <div className="plinth-drawer-header">
          <h2 id={`${drawerId}-title`} className="plinth-drawer-title">
            {title}
          </h2>
          {hasDescription ? (
            <p id={`${drawerId}-description`} className="plinth-drawer-description">
              {description}
            </p>
          ) : null}
          <PlinthIconButton
            className="plinth-drawer-close"
            label={closeLabel}
            variant="ghost"
            commandfor={drawerId}
            command="close"
          >
            {/* The cross is drawerCloseIcon (drawer.ts), written out; parity keeps the copies equal. */}
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
        <div className="plinth-drawer-body">{children}</div>
        {hasContent(footer) ? <div className="plinth-drawer-footer">{footer}</div> : null}
      </div>
    </dialog>
  );
}
