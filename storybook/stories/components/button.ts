import {
  iconSizeFor,
  controlSizes,
  buttonVariants,
  type ControlSize,
  type ButtonVariant,
} from '@bdynamic/plinth-vue';
import { escape, rootAttributes, type Attributes } from './markup.ts';

export { controlSizes, buttonVariants, type ControlSize, type ButtonVariant };

export interface ButtonArgs {
  label: string;
  variant: ButtonVariant;
  size: ControlSize;
  /** Renders a link instead of a button. */
  href?: string;
  disabled: boolean;
  /** Working: a spinner in the leading icon's place, and the button reads as busy. */
  busy: boolean;
  /** The project's own SVG for the leading icon (trusted, not escaped). */
  icon?: string;
  /** The project's own SVG for the trailing icon (trusted, not escaped). */
  trailingIcon?: string;
  /** Flips the leading icon in right-to-left text, for icons that point a direction. */
  mirrorIcon?: boolean;
  /** Flips the trailing icon in right-to-left text, for an arrow such as Next. */
  mirrorTrailing?: boolean;
}

const iconSpan = (svg: string, size: ControlSize, mirror = false) =>
  `<span class="plinth-icon" data-size="${iconSizeFor(size)}"${mirror ? ' data-mirror' : ''} aria-hidden="true">${svg}</span>`;

/** The button's markup contract. Blade and Vue must print exactly this (see parity.test.ts). */
export function button(
  {
    label,
    variant,
    size,
    href,
    disabled,
    busy,
    icon,
    trailingIcon,
    mirrorIcon,
    mirrorTrailing,
  }: ButtonArgs,
  attributes: Attributes = {},
): string {
  // A button's type defaults to "button"; a project's own type (submit, reset) replaces it.
  const { type = 'button', ...others } = attributes;
  const { classes, extra } = rootAttributes('plinth-button', href ? attributes : others);
  const isBusy = busy && !disabled;
  const state = [
    isBusy ? ' aria-busy="true" aria-disabled="true"' : '',
    disabled && !href ? ' disabled' : '',
    disabled && href ? ' role="link" aria-disabled="true"' : '',
  ].join('');
  const open = href
    ? `<a class="${classes}"${disabled ? '' : ` href="${escape(href)}"`}`
    : `<button type="${escape(type)}" class="${classes}"`;
  const lead = isBusy
    ? '<span class="plinth-button-spinner" aria-hidden="true"></span>'
    : icon
      ? iconSpan(icon, size, mirrorIcon)
      : '';
  return [
    `${open}${extra} data-variant="${variant}" data-size="${size}"${state}>`,
    lead,
    `<span class="plinth-button-label">${escape(label)}</span>`,
    trailingIcon ? iconSpan(trailingIcon, size, mirrorTrailing) : '',
    href ? '</a>' : '</button>',
  ].join('');
}
