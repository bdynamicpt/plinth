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

/**
 * The invoker commands a button can send to the element its `commandfor` names: the dialog and
 * popover commands, or a custom one, which starts with two dashes.
 */
export type InvokerCommand =
  | 'show-modal'
  | 'close'
  | 'request-close'
  | 'show-popover'
  | 'hide-popover'
  | 'toggle-popover'
  | `--${string}`;

/**
 * The invoker command attributes, typed here because `@types/react` doesn't list them yet. React
 * passes them to the DOM as they are, lowercase. Plinth types them on its own buttons rather than
 * adding them to React's global types.
 */
export interface InvokerCommandProps {
  /** The id of the element the command goes to, such as a dialog. */
  commandfor?: string;
  /** What to do to it, such as `show-modal` or `close`. */
  command?: InvokerCommand;
}
