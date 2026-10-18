import { escape, rootAttributes, type Attributes } from './markup.ts';

export interface PillArgs {
  label: string;
  /** A number after the label, such as how many items the filter shows. */
  count?: string | number | null;
  /** Renders the pill as a link, for a row that navigates. */
  href?: string;
  /** The selected pill: aria-pressed="true" on a button, aria-current="page" on a link. */
  selected: boolean;
  /** Disables the pill. */
  disabled: boolean;
}

export interface PillRowArgs {
  /** The row's accessible name (aria-label). */
  label?: string;
  /** Renders the row as a <nav>, for pills that are links. */
  nav: boolean;
  pills: PillArgs[];
}

/** A count prints unless it is missing or blank, as Blade's filled() decides. */
const hasCount = (count: PillArgs['count']): count is string | number =>
  count !== undefined && count !== null && String(count).trim() !== '';

/** A pill's markup contract. Blade and Vue must print exactly this (see parity.test.ts). */
export function pill(
  { label, count, href, selected, disabled }: PillArgs,
  attributes: Attributes = {},
): string {
  const tag = href ? 'a' : 'button';
  // A button's type defaults to "button"; a project's own type (submit) replaces it.
  const { type = 'button', ...others } = attributes;
  const { classes, extra } = rootAttributes('plinth-pill', tag === 'button' ? others : attributes);
  const open = [
    tag === 'button' ? `<button type="${escape(type)}"` : '<a',
    ` class="${classes}"`,
    href && !disabled ? ` href="${escape(href)}"` : '',
    tag === 'button' ? ` aria-pressed="${selected}"` : '',
    selected && tag === 'a' ? ' aria-current="page"' : '',
    disabled && tag === 'button' ? ' disabled' : '',
    disabled && tag === 'a' ? ' role="link" aria-disabled="true"' : '',
    extra,
    '>',
  ].join('');
  return [
    open,
    `<span class="plinth-pill-label">${escape(label)}</span>`,
    hasCount(count) ? `<span class="plinth-pill-count">${escape(String(count))}</span>` : '',
    `</${tag}>`,
  ].join('');
}

/** The pill row's markup contract, with its pills. */
export function pillRow({ label, nav, pills }: PillRowArgs, attributes: Attributes = {}): string {
  const tag = nav ? 'nav' : 'div';
  const { classes, extra } = rootAttributes('plinth-pill-row', attributes);
  return [
    `<${tag} class="${classes}"`,
    nav ? '' : ' role="group"',
    label ? ` aria-label="${escape(label)}"` : '',
    extra,
    '>',
    pills.map((p) => pill(p)).join(''),
    `</${tag}>`,
  ].join('');
}
