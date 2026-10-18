import { avatar } from './avatar.ts';
import { listRow } from './list-row.ts';
import { escape, type Attributes } from './markup.ts';
import { sheet } from './sheet.ts';

export interface MenuSheetArgs {
  /** The dialog's id: the header's menu button points commandfor at it. */
  id: string;
  /** The heading, and the sheet's and the navigation's accessible name. */
  title: string;
  /** The close button's accessible name. */
  closeLabel: string;
  /** The signed-in user's name; leave it out for no user row. */
  userName?: string;
  /** A second line under the name: an email or a role. */
  userDetail?: string;
  /** The user's picture; initials from the name stand in without it. */
  userSrc?: string;
  /** Makes the user row a link, to the profile. */
  userHref?: string;
  /** The navigation: list cards of link rows (trusted markup, not escaped). */
  nav: string;
  /** The account actions, below the navigation: a list card (trusted markup). */
  account?: string;
}

/** The menu sheet's markup contract. Blade and Vue must print exactly this (see parity.test.ts). */
export function menuSheet(
  { id, title, closeLabel, userName, userDetail, userSrc, userHref, nav, account }: MenuSheetArgs,
  attributes: Attributes = {},
): string {
  const { class: extraClass, ...others } = attributes;
  const user = userName?.trim()
    ? listRow(
        {
          title: userName,
          description: userDetail?.trim() ? userDetail : undefined,
          leading: avatar({ name: userName, src: userSrc, size: 'lg', decorative: true }),
          href: userHref?.trim() ? userHref : undefined,
          chevron: Boolean(userHref?.trim()),
          button: false,
          current: false,
          disabled: false,
        },
        { class: 'plinth-menu-sheet-user' },
      )
    : '';
  const body = [
    user,
    `<nav class="plinth-menu-sheet-nav" aria-labelledby="${escape(id)}-title">${nav}</nav>`,
    account?.trim() ? `<div class="plinth-menu-sheet-account">${account}</div>` : '',
  ].join('');
  return sheet(
    { id, title, closeLabel, placement: 'end', body },
    { class: ['plinth-menu-sheet', extraClass].filter(Boolean).join(' '), ...others },
  );
}
