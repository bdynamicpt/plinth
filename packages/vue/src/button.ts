/** The button's variants. `primary` is the default. */
export const buttonVariants = [
  'primary',
  'accent',
  'secondary',
  'ghost',
  'danger',
  'danger-ghost',
] as const;
export type ButtonVariant = (typeof buttonVariants)[number];

/** The button's sizes (32, 40 and 44 px tall). `md` is the default. */
export const buttonSizes = ['sm', 'md', 'lg'] as const;
export type ButtonSize = (typeof buttonSizes)[number];

/** A variant from the list, or `primary` when it is not one of them. */
export function buttonVariant(value: string | undefined): ButtonVariant {
  return buttonVariants.includes(value as ButtonVariant) ? (value as ButtonVariant) : 'primary';
}

/** A size from the list, or `md` when it is not one of them. */
export function buttonSize(value: string | undefined): ButtonSize {
  return buttonSizes.includes(value as ButtonSize) ? (value as ButtonSize) : 'md';
}

/** The size of the icons inside a button of the given size. */
export function buttonIconSize(size: ButtonSize): 'sm' | 'md' {
  return size === 'sm' ? 'sm' : 'md';
}
