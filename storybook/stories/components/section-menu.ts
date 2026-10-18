import { escape, rootAttributes, type Attributes } from './markup.ts';

export interface SectionMenuItemArgs {
  label: string;
  /** A number after the label, such as how many items the section holds. */
  count?: string | number | null;
  /** The section's address; without it the item is a button that switches the view in place. */
  href?: string;
  /** The current section: aria-current="page" on a link, aria-pressed="true" on a button. */
  current: boolean;
  /** Disables the item. */
  disabled: boolean;
}

export interface SectionMenuArgs {
  /** The menu's accessible name (aria-label). */
  label?: string;
  /** A <nav> of links (the default); false for a <div role="group"> of buttons. */
  nav: boolean;
  items: SectionMenuItemArgs[];
}

/** A count prints unless it is missing or blank, as Blade's filled() decides. */
const hasCount = (count: SectionMenuItemArgs['count']): count is string | number =>
  count !== undefined && count !== null && String(count).trim() !== '';

/** An item's markup contract. Blade and Vue must print exactly this (see parity.test.ts). */
export function sectionMenuItem(
  { label, count, href, current, disabled }: SectionMenuItemArgs,
  attributes: Attributes = {},
): string {
  const tag = href ? 'a' : 'button';
  // A button's type defaults to "button"; a project's own type (submit) replaces it.
  const { type = 'button', ...others } = attributes;
  const { classes, extra } = rootAttributes(
    'plinth-section-menu-item',
    tag === 'button' ? others : attributes,
  );
  const open = [
    tag === 'button' ? `<button type="${escape(type)}"` : '<a',
    ` class="${classes}"`,
    href && !disabled ? ` href="${escape(href)}"` : '',
    tag === 'button' ? ` aria-pressed="${current}"` : '',
    current && tag === 'a' ? ' aria-current="page"' : '',
    disabled && tag === 'button' ? ' disabled' : '',
    disabled && tag === 'a' ? ' role="link" aria-disabled="true"' : '',
    extra,
    '>',
  ].join('');
  return [
    open,
    `<span class="plinth-section-menu-label">${escape(label)}</span>`,
    hasCount(count)
      ? `<span class="plinth-section-menu-count">${escape(String(count))}</span>`
      : '',
    `</${tag}>`,
  ].join('');
}

/** The section menu's markup contract, with its items. */
export function sectionMenu(
  { label, nav, items }: SectionMenuArgs,
  attributes: Attributes = {},
): string {
  const tag = nav ? 'nav' : 'div';
  const { classes, extra } = rootAttributes('plinth-section-menu', attributes);
  return [
    `<${tag} class="${classes}"`,
    nav ? '' : ' role="group"',
    label ? ` aria-label="${escape(label)}"` : '',
    extra,
    '>',
    items.map((item) => sectionMenuItem(item)).join(''),
    `</${tag}>`,
  ].join('');
}
