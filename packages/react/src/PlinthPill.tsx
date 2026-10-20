// Markup contract: packages/css/src/components/pill-row.css
import type { ComponentProps, ElementType } from 'react';
import { classNames } from './markup';

interface PillOptions {
  /** A number after the label, such as how many items the filter shows. */
  count?: string | number | null;
  /** The selected pill: aria-pressed="true" on a button, aria-current="page" on a link. */
  selected?: boolean;
  /** Disables the pill. */
  disabled?: boolean;
}

/** A `<button>`, or with an `href` a link, for a row that navigates. */
export type PlinthPillProps =
  | (PillOptions & Omit<ComponentProps<'button'>, keyof PillOptions> & { href?: undefined })
  | (PillOptions & Omit<ComponentProps<'a'>, keyof PillOptions> & { href: string });

export function PlinthPill({
  count,
  href,
  selected = false,
  disabled = false,
  className,
  children,
  ...rest
}: PlinthPillProps) {
  const tag = href ? 'a' : 'button';
  const Tag = tag as ElementType;
  // Missing or blank prints no count, as Blade's filled() decides.
  const hasCount = count != null && String(count).trim() !== '';

  // The project's own attributes come after Plinth's and win, as in Blade and Vue; its class is
  // added to Plinth's.
  return (
    <Tag
      type={tag === 'button' ? 'button' : undefined}
      href={tag === 'a' && !disabled ? href : undefined}
      aria-pressed={tag === 'button' ? String(selected) : undefined}
      aria-current={tag === 'a' && selected ? 'page' : undefined}
      disabled={tag === 'button' && disabled ? true : undefined}
      role={tag === 'a' && disabled ? 'link' : undefined}
      aria-disabled={tag === 'a' && disabled ? 'true' : undefined}
      {...rest}
      className={classNames('plinth-pill', className)}
    >
      <span className="plinth-pill-label">{children}</span>
      {hasCount ? <span className="plinth-pill-count">{count}</span> : null}
    </Tag>
  );
}
