import { listRowChevron } from '@bdynamic/plinth-vue';
import { escape, rootAttributes, type Attributes } from './markup.ts';

export interface ListRowArgs {
  title: string;
  /** A second line under the title. */
  description?: string;
  /** Markup before the title: an icon or a decorative avatar (trusted, not escaped). */
  leading?: string;
  /** Markup after the title: a value, a badge or, in a static row, a control (trusted). */
  trailing?: string;
  /** The row's own chevron, at the end, for a row that opens something. */
  chevron: boolean;
  /** Renders the row as a link. */
  href?: string;
  /** Renders the row as a button, when it has no href. */
  button: boolean;
  /** The row for the page being shown: aria-current="page", on a link or static row. */
  current: boolean;
  /** Disables a link or button row. */
  disabled: boolean;
}

/** The list row's markup contract. Blade and Vue must print exactly this (see parity.test.ts). */
export function listRow(
  { title, description, leading, trailing, chevron, href, button, current, disabled }: ListRowArgs,
  attributes: Attributes = {},
): string {
  const tag = href ? 'a' : button ? 'button' : 'div';
  // A button's type defaults to "button"; a project's own type (submit) replaces it.
  const { type = 'button', ...others } = attributes;
  const { classes, extra } = rootAttributes(
    'plinth-list-row',
    tag === 'button' ? others : attributes,
  );
  const open = [
    tag === 'button' ? `<button type="${escape(type)}"` : `<${tag}`,
    ` class="${classes}"`,
    href && !disabled ? ` href="${escape(href)}"` : '',
    current && tag !== 'button' ? ' aria-current="page"' : '',
    disabled && tag === 'button' ? ' disabled' : '',
    disabled && tag === 'a' ? ' role="link" aria-disabled="true"' : '',
    extra,
    '>',
  ].join('');
  const end = trailing || chevron;
  return [
    open,
    leading ? `<span class="plinth-list-row-leading">${leading}</span>` : '',
    '<span class="plinth-list-row-content">',
    `<span class="plinth-list-row-title">${escape(title)}</span>`,
    description ? `<span class="plinth-list-row-description">${escape(description)}</span>` : '',
    '</span>',
    end
      ? `<span class="plinth-list-row-trailing">${trailing ?? ''}${chevron ? listRowChevron : ''}</span>`
      : '',
    `</${tag}>`,
  ].join('');
}
