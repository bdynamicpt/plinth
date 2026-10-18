import {
  buttonIconSize,
  buttonSizes,
  buttonVariants,
  type ButtonSize,
  type ButtonVariant,
} from '@bdynamic/plinth-vue';
import { escape, rootAttributes, type Attributes } from './markup.ts';

export { buttonSizes, buttonVariants, type ButtonSize, type ButtonVariant };

export interface ButtonArgs {
  label: string;
  variant: ButtonVariant;
  size: ButtonSize;
  /** Renders a link instead of a button. */
  href?: string;
  disabled: boolean;
  /** Working: a spinner in the leading icon's place, and the button reads as busy. */
  busy: boolean;
  /** The project's own SVG for the leading icon (trusted, not escaped). */
  icon?: string;
  /** The project's own SVG for the trailing icon (trusted, not escaped). */
  trailingIcon?: string;
}

const iconSpan = (svg: string, size: ButtonSize) =>
  `<span class="plinth-icon" data-size="${buttonIconSize(size)}" aria-hidden="true">${svg}</span>`;

/** The button's markup contract. Blade and Vue must print exactly this (see parity.test.ts). */
export function button(
  { label, variant, size, href, disabled, busy, icon, trailingIcon }: ButtonArgs,
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
      ? iconSpan(icon, size)
      : '';
  return [
    `${open} data-variant="${variant}" data-size="${size}"${state}${extra}>`,
    lead,
    `<span class="plinth-button-label">${escape(label)}</span>`,
    trailingIcon ? iconSpan(trailingIcon, size) : '',
    href ? '</a>' : '</button>',
  ].join('');
}
