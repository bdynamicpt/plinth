import { headingLevel, type HeadingLevel } from '@bdynamic/plinth-vue';
import { listRow, type ListRowArgs } from './list-row.ts';
import { escape, rootAttributes, type Attributes } from './markup.ts';

export interface ListCardArgs {
  /** A heading above the card. */
  heading?: string;
  /** The heading's element, h2 to h6. */
  headingLevel: HeadingLevel;
  /** A note under the card. */
  footer?: string;
  /** The rows, each printed in its own <li>. */
  rows: ListRowArgs[];
}

/** The rows as the card's slot: each list row in its own <li>. */
export const listCardRows = (rows: ListRowArgs[]) =>
  rows.map((row) => `<li>${listRow(row)}</li>`).join('');

/** The list card's markup contract. Blade and Vue must print exactly this (see parity.test.ts). */
export function listCard(
  { heading, headingLevel: level, footer, rows }: ListCardArgs,
  attributes: Attributes = {},
): string {
  const tag = headingLevel(level);
  const { classes, extra } = rootAttributes('plinth-list-card', attributes);
  return [
    `<div class="${classes}"${extra}>`,
    heading?.trim() ? `<${tag} class="plinth-list-card-heading">${escape(heading)}</${tag}>` : '',
    `<ul class="plinth-list-card-list" role="list">${listCardRows(rows)}</ul>`,
    footer?.trim() ? `<p class="plinth-list-card-footer">${escape(footer)}</p>` : '',
    '</div>',
  ].join('');
}
