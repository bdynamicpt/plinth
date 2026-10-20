import { sheetCloseIcon } from './sheet';

/**
 * The drawer's presentation from 768px up: `dialog` (the default), centred like the dialog, or
 * `sheet`, a panel on the inline-end edge like the sheet.
 */
export const drawerDesktops = ['dialog', 'sheet'] as const;
export type DrawerDesktop = (typeof drawerDesktops)[number];

/** A presentation from the list, or `dialog` when it is not one of them. */
export function drawerDesktop(value: string | undefined): DrawerDesktop {
  return drawerDesktops.includes(value as DrawerDesktop) ? (value as DrawerDesktop) : 'dialog';
}

/** Where a drawer can rest on a phone, smallest first: a peek, half the screen, or all of it. */
export const drawerSnaps = ['peek', 'half', 'full'] as const;
export type DrawerSnap = (typeof drawerSnaps)[number];

/**
 * The snap points from a list or a string of them separated by spaces: the known ones, each once,
 * smallest first. Empty when there are none (a drawer as tall as its content).
 */
export function drawerSnapPoints(value: readonly string[] | string | undefined): DrawerSnap[] {
  const listed = typeof value === 'string' ? value.split(/\s+/) : (value ?? []);
  return drawerSnaps.filter((snap) => listed.includes(snap));
}

/** The snap point it opens at: `snap` when it is one of `points`, else the largest of them. */
export function drawerSnap(snap: string | undefined, points: DrawerSnap[]): DrawerSnap | undefined {
  return points.includes(snap as DrawerSnap) ? (snap as DrawerSnap) : points.at(-1);
}

/** The close button's icon, the same cross as the sheet's. Blade's drawer prints the same markup. */
export const drawerCloseIcon = sheetCloseIcon;
