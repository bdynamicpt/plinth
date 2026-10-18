import { resolveSize, type Size } from './size';

/** The icon sizes (16, 20 and 24 px), from the shared size scale. `md` is the default. */
export const iconSizes = ['sm', 'md', 'lg'] as const satisfies readonly Size[];

export type IconSize = (typeof iconSizes)[number];

/** A size from the list, or `md` when it is not one of them. */
export function iconSize(value: string | undefined): IconSize {
  return resolveSize(value, iconSizes, 'md');
}
