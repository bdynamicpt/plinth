/** The heading levels a component's heading can take. `h2` is the default. */
export const headingLevels = ['h2', 'h3', 'h4', 'h5', 'h6'] as const;
export type HeadingLevel = (typeof headingLevels)[number];

/** A level from the list, or `h2` when it is not one of them. */
export function headingLevel(value: string | undefined): HeadingLevel {
  return headingLevels.includes(value as HeadingLevel) ? (value as HeadingLevel) : 'h2';
}
