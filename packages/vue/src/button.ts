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

/** A variant from the list, or `primary` when it is not one of them. */
export function buttonVariant(value: string | undefined): ButtonVariant {
  return buttonVariants.includes(value as ButtonVariant) ? (value as ButtonVariant) : 'primary';
}
