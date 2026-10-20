// Markup contract: packages/css/src/components/section-menu.css
import type { ComponentProps, ElementType } from 'react';
import { classNames } from './markup';

interface SectionMenuItemOptions {
  /** A number after the label, such as how many items the section holds. */
  count?: string | number | null;
  /** The current section: aria-current="page" on a link, aria-pressed="true" on a button. */
  current?: boolean;
  /** Disables the item. */
  disabled?: boolean;
}

/**
 * A link to the section's address, or without an `href` a `<button>` that switches the view in
 * place.
 */
export type PlinthSectionMenuItemProps =
  | (SectionMenuItemOptions &
      Omit<ComponentProps<'button'>, keyof SectionMenuItemOptions> & { href?: undefined })
  | (SectionMenuItemOptions &
      Omit<ComponentProps<'a'>, keyof SectionMenuItemOptions> & { href: string });

export function PlinthSectionMenuItem({
  count,
  href,
  current = false,
  disabled = false,
  className,
  children,
  ...rest
}: PlinthSectionMenuItemProps) {
  // A blank href counts as missing, as Blade's filled() decides.
  const tag = href?.trim() ? 'a' : 'button';
  const Tag = tag as ElementType;
  // Missing or blank prints no count, as Blade's filled() decides.
  const hasCount = count != null && String(count).trim() !== '';

  // The project's own attributes come after Plinth's and win, as in Blade and Vue; its class is
  // added to Plinth's.
  return (
    <Tag
      type={tag === 'button' ? 'button' : undefined}
      href={tag === 'a' && !disabled ? href : undefined}
      aria-pressed={tag === 'button' ? String(current) : undefined}
      aria-current={tag === 'a' && current ? 'page' : undefined}
      disabled={tag === 'button' && disabled ? true : undefined}
      role={tag === 'a' && disabled ? 'link' : undefined}
      aria-disabled={tag === 'a' && disabled ? 'true' : undefined}
      {...rest}
      className={classNames('plinth-section-menu-item', className)}
    >
      <span className="plinth-section-menu-label">{children}</span>
      {hasCount ? <span className="plinth-section-menu-count">{count}</span> : null}
    </Tag>
  );
}
