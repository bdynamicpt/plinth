import { buttonIconSize, type ButtonSize, type ButtonVariant } from '@bdynamic/plinth-vue';
import { escape, rootAttributes, type Attributes } from './markup.ts';

export interface IconButtonArgs {
  /** The accessible name: required, since the button has no visible text. */
  label: string;
  variant: ButtonVariant;
  size: ButtonSize;
  /** Renders a link instead of a button. */
  href?: string;
  disabled: boolean;
  busy: boolean;
  /** Makes it a toggle: true or false prints aria-pressed. */
  pressed?: boolean;
  /** Flips the icon in right-to-left text, for icons that point a direction. */
  mirror?: boolean;
  /** The project's own SVG (trusted, not escaped). */
  svg: string;
}

/** The icon button's markup contract. Blade and Vue must print exactly this (see parity.test.ts). */
export function iconButton(
  { label, variant, size, href, disabled, busy, pressed, mirror, svg }: IconButtonArgs,
  attributes: Attributes = {},
): string {
  const { type = 'button', 'aria-label': ariaLabel, ...others } = attributes;
  const name = label || ariaLabel || '';
  const { classes, extra } = rootAttributes(
    'plinth-button plinth-icon-button',
    href ? { ...others, ...(attributes.type ? { type } : {}) } : others,
  );
  const isBusy = busy && !disabled;
  const state = [
    ` aria-label="${escape(name)}"`,
    pressed !== undefined && !href ? ` aria-pressed="${pressed}"` : '',
    isBusy ? ' aria-busy="true" aria-disabled="true"' : '',
    disabled && !href ? ' disabled' : '',
    disabled && href ? ' role="link" aria-disabled="true"' : '',
  ].join('');
  const open = href
    ? `<a class="${classes}"${disabled ? '' : ` href="${escape(href)}"`}`
    : `<button type="${escape(type)}" class="${classes}"`;
  const inner = isBusy
    ? '<span class="plinth-button-spinner" aria-hidden="true"></span>'
    : `<span class="plinth-icon" data-size="${buttonIconSize(size)}"${mirror ? ' data-mirror' : ''} aria-hidden="true">${svg}</span>`;
  return `${open} data-variant="${variant}" data-size="${size}"${state}${extra}>${inner}${href ? '</a>' : '</button>'}`;
}
