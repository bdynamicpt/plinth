import {
  avatarGlyph,
  avatarSizes,
  initialsFrom,
  tones,
  type AvatarSize,
  type Tone,
} from '@bdynamic/plinth-vue';
import { escape, rootAttributes, type Attributes } from './markup.ts';

export { avatarSizes, tones, type AvatarSize };

export interface AvatarArgs {
  /** Whose avatar it is: the accessible name, and where initials come from. */
  name?: string;
  /** An image; shown instead of initials when set. */
  src?: string;
  /** Initials to show instead of the ones taken from the name. */
  initials?: string;
  size: AvatarSize;
  /** A status dot in one of the badge's tones. */
  status?: Tone;
  /** What the status means (Online); joins the accessible name. */
  statusLabel?: string;
  /** Hidden from screen readers, for an avatar next to the name it shows. */
  decorative: boolean;
}

/** The avatar's markup contract. Blade and Vue must print exactly this (see parity.test.ts). */
export function avatar(
  { name = '', src, initials, size, status, statusLabel, decorative }: AvatarArgs,
  attributes: Attributes = {},
): string {
  const { classes, extra } = rootAttributes('plinth-avatar', attributes);
  const label = decorative ? '' : status && statusLabel ? `${name}, ${statusLabel}` : name;
  const meaning = decorative ? ' aria-hidden="true"' : ` role="img" aria-label="${escape(label)}"`;
  const letters = initials ?? initialsFrom(name);
  const face = src
    ? `<img class="plinth-avatar-image" src="${escape(src)}" alt="">`
    : letters
      ? `<span class="plinth-avatar-initials" aria-hidden="true">${escape(letters)}</span>`
      : avatarGlyph;
  const dot = status
    ? `<span class="plinth-avatar-status" data-tone="${status}" aria-hidden="true"></span>`
    : '';
  return `<span class="${classes}"${extra} data-size="${size}"${meaning}>${face}${dot}</span>`;
}

/** A sample portrait drawn in SVG, so stories and tests need no network. */
export const samplePhoto = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#c7d2fe"/><circle cx="32" cy="26" r="12" fill="#6366f1"/><path d="M10 64a22 22 0 0 1 44 0z" fill="#4f46e5"/></svg>',
)}`;
