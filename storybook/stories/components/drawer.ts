import {
  drawerCloseIcon,
  drawerDesktop,
  drawerSnap,
  drawerSnapPoints,
  type DrawerDesktop,
  type DrawerSnap,
} from '@bdynamic/plinth-vue';
import { iconButton } from './icon-button.ts';
import { escape, rootAttributes, type Attributes } from './markup.ts';

export interface DrawerArgs {
  /** The dialog's id: commandfor and aria-labelledby point at it. */
  id: string;
  /** The heading, and the drawer's accessible name. */
  title: string;
  /** A line under the title, and the drawer's accessible description. */
  description?: string;
  /** The close button's accessible name. */
  closeLabel: string;
  /** Its presentation from 768px up: a dialog or a sheet. */
  desktop: DrawerDesktop;
  /** Where it can rest on a phone: any of peek, half and full; none for as tall as its content. */
  snapPoints?: DrawerSnap[];
  /** The snap point it opens at; the largest listed when it is missing. */
  snap?: DrawerSnap;
  /** The body's content (trusted markup, not escaped). */
  body: string;
  /** The footer's content, usually its actions (trusted markup). */
  footer?: string;
}

/** The drawer's markup contract. Blade, Vue and React must print exactly this (see parity.test.ts). */
export function drawer(
  { id, title, description, closeLabel, desktop, snapPoints, snap, body, footer }: DrawerArgs,
  attributes: Attributes = {},
): string {
  // closedby="any" is the default; a project's own closedby replaces it.
  const { closedby = 'any', ...others } = attributes;
  const { classes, extra } = rootAttributes('plinth-drawer', others);
  const hasDescription = Boolean(description?.trim());
  const points = drawerSnapPoints(snapPoints);
  const opensAt = drawerSnap(snap, points);
  const close = iconButton(
    {
      label: closeLabel,
      variant: 'ghost',
      size: 'md',
      disabled: false,
      busy: false,
      svg: drawerCloseIcon,
    },
    { class: 'plinth-drawer-close', commandfor: id, command: 'close' },
  );
  return [
    `<dialog class="${classes}"${extra} id="${escape(id)}"`,
    ` data-desktop="${drawerDesktop(desktop)}"`,
    points.length ? ` data-snap-points="${points.join(' ')}" data-snap="${opensAt}"` : '',
    ` closedby="${escape(closedby)}" aria-labelledby="${escape(id)}-title"`,
    hasDescription ? ` aria-describedby="${escape(id)}-description"` : '',
    '>',
    '<div class="plinth-drawer-panel">',
    '<div class="plinth-drawer-handle" aria-hidden="true"></div>',
    '<div class="plinth-drawer-header">',
    `<h2 id="${escape(id)}-title" class="plinth-drawer-title">${escape(title)}</h2>`,
    hasDescription
      ? `<p id="${escape(id)}-description" class="plinth-drawer-description">${escape(description!)}</p>`
      : '',
    close,
    '</div>',
    `<div class="plinth-drawer-body">${body}</div>`,
    footer?.trim() ? `<div class="plinth-drawer-footer">${footer}</div>` : '',
    '</div>',
    '</dialog>',
  ].join('');
}
