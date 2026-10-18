import { escape, rootAttributes, type Attributes } from './markup.ts';

export interface HeaderArgs {
  /** The page's title, an <h1>. */
  title: string;
  /** The leading action, usually a back link or a menu button (trusted markup, not escaped). */
  leading?: string;
  /** The trailing actions, usually icon buttons (trusted markup). */
  actions?: string;
}

/** The header's markup contract. Blade and Vue must print exactly this (see parity.test.ts). */
export function header(
  { title, leading, actions }: HeaderArgs,
  attributes: Attributes = {},
): string {
  const { classes, extra } = rootAttributes('plinth-header', attributes);
  return [
    `<header class="${classes}"${extra}>`,
    leading?.trim() ? `<div class="plinth-header-leading">${leading}</div>` : '',
    `<h1 class="plinth-header-title">${escape(title)}</h1>`,
    actions?.trim() ? `<div class="plinth-header-actions">${actions}</div>` : '',
    '</header>',
  ].join('');
}
