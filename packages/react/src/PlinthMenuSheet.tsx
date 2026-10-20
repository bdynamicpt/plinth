// Markup contract: packages/css/src/components/menu-sheet.css
import { useId, type ReactNode } from 'react';
import { PlinthAvatar } from './PlinthAvatar';
import { PlinthListRow } from './PlinthListRow';
import { PlinthSheet, type PlinthSheetProps } from './PlinthSheet';
import { classNames, hasContent } from './markup';

interface MenuSheetOptions {
  /** The dialog's id, for the menu button's commandfor; one is generated when it is missing. */
  id?: string;
  /** The heading, and the sheet's and the navigation's accessible name. */
  title?: string;
  /** The close button's accessible name. */
  closeLabel?: string;
  /** The signed-in user's name; leave it out for no user row. */
  userName?: string;
  /** A second line under the name: an email or a role. */
  userDetail?: string;
  /** The user's picture; initials from the name stand in without it. */
  userSrc?: string;
  /** Makes the user row a link, to the profile. */
  userHref?: string;
  /** The account's rows under the navigation, such as Sign out (Vue's `account` slot). */
  account?: ReactNode;
}

/** A sheet from the end: `children` are the navigation. `onClose` is the dialog's close event. */
export type PlinthMenuSheetProps = MenuSheetOptions &
  Omit<PlinthSheetProps, keyof MenuSheetOptions | 'description' | 'side' | 'sidePhone' | 'footer'>;

const filled = (value: string | undefined) => (value?.trim() ? value : undefined);

export function PlinthMenuSheet({
  id,
  title = 'Menu',
  closeLabel = 'Close',
  userName,
  userDetail,
  userSrc,
  userHref,
  account,
  className,
  children,
  ...rest
}: PlinthMenuSheetProps) {
  const generatedId = useId();
  const menuId = id?.trim() || `plinth-menu-sheet-${generatedId}`;
  const href = filled(userHref);

  return (
    <PlinthSheet
      id={menuId}
      title={title}
      closeLabel={closeLabel}
      side="end"
      sidePhone="bottom"
      {...rest}
      className={classNames('plinth-menu-sheet', className)}
    >
      {userName?.trim() ? (
        <PlinthListRow
          className="plinth-menu-sheet-user"
          description={filled(userDetail)}
          // Without an href the row is a static one.
          href={href as string}
          chevron={Boolean(href)}
          leading={<PlinthAvatar name={userName} src={filled(userSrc)} size="lg" decorative />}
        >
          {userName}
        </PlinthListRow>
      ) : null}
      <nav className="plinth-menu-sheet-nav" aria-labelledby={`${menuId}-title`}>
        {children}
      </nav>
      {hasContent(account) ? <div className="plinth-menu-sheet-account">{account}</div> : null}
    </PlinthSheet>
  );
}
