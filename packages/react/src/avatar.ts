import { resolveSize, type Size } from './size';

/** The avatar sizes (24, 32, 40 and 56 px), from the shared size scale. `md` is the default. */
export const avatarSizes = ['sm', 'md', 'lg', 'xl'] as const satisfies readonly Size[];

export type AvatarSize = (typeof avatarSizes)[number];

/** A size from the list, or `md` when it is not one of them. */
export function avatarSize(value: string | undefined): AvatarSize {
  return resolveSize(value, avatarSizes, 'md');
}

/**
 * Initials from a name: the first letter of the first and the last word, upper case. Blade's
 * Initials::from() does the same; the parity tests compare them.
 */
export function initialsFrom(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  // Whole code points, so a letter outside the basic plane isn't split in half.
  const first = [...words[0]!][0]!;
  const last = words.length > 1 ? [...words.at(-1)!][0]! : '';
  return (first + last).toUpperCase();
}

/** The person shown when there is neither an image nor a name to take initials from. */
export const avatarGlyph =
  '<svg class="plinth-avatar-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="9" r="4"></circle><path d="M4.5 20a7.5 7.5 0 0 1 15 0"></path></svg>';
