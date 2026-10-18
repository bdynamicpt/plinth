/** The icon sizes (16, 20 and 24 px). `md` is the default. */
export const iconSizes = ['sm', 'md', 'lg'] as const;

export type IconSize = (typeof iconSizes)[number];

/** A size from the list, or `md` when it is not one of them. */
export function iconSize(value: string | undefined): IconSize {
  return iconSizes.includes(value as IconSize) ? (value as IconSize) : 'md';
}
