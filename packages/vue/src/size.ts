/**
 * One size scale for every component, as Filament has (and as Blade's Size enum). Each component
 * supports the sizes that make sense for it and falls back to its default for the rest.
 */
export const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type Size = (typeof sizes)[number];

/** The control sizes (28, 32 and 40 px): buttons, icon buttons, inputs. */
export const controlSizes = ['sm', 'md', 'lg'] as const satisfies readonly Size[];
export type ControlSize = (typeof controlSizes)[number];

/** A size from `supported`, or `fallback` when it isn't one of them. */
export function resolveSize<T extends Size>(
  value: string | undefined,
  supported: readonly T[],
  fallback: T,
): T {
  return supported.includes(value as T) ? (value as T) : fallback;
}

/** The size of the icons inside a control of this size. */
export function iconSizeFor(size: Size): 'sm' | 'md' {
  return size === 'xs' || size === 'sm' ? 'sm' : 'md';
}
