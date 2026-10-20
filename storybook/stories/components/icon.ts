import { iconSizes, type IconSize } from '@bdynamic/plinth-vue';

export { iconSizes, type IconSize };

export interface IconArgs {
  size: IconSize;
  /** Makes the icon meaningful; without it the icon is decorative and hidden. */
  label?: string;
  /** Flips the icon in right-to-left text, for icons that point a direction. */
  mirror: boolean;
  /** The project's own SVG markup (trusted, not escaped). */
  svg: string;
}

import { escape, rootAttributes, type Attributes } from './markup.ts';

/**
 * The icon's markup contract. Blade and Vue must print exactly this (see parity.test.ts). A label
 * can also come as an aria-label attribute; a blank one leaves the icon decorative.
 */
export function icon({ size, label, mirror, svg }: IconArgs, attributes: Attributes = {}): string {
  const { 'aria-label': ariaLabel, ...others } = attributes;
  const name = (label ?? ariaLabel ?? '').trim() ? (label ?? ariaLabel) : undefined;
  const { classes, extra } = rootAttributes('plinth-icon', others);
  const meaning = name ? ` role="img" aria-label="${escape(name)}"` : ' aria-hidden="true"';
  return `<span class="${classes}"${extra} data-size="${size}"${mirror ? ' data-mirror' : ''}${meaning}>${svg}</span>`;
}
