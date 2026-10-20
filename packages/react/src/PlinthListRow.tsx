// Markup contract: packages/css/src/components/list-row.css
import type { ComponentProps, ElementType, ReactNode } from 'react';
import { classNames, hasContent } from './markup';

interface ListRowOptions {
  /** A second line under the title. */
  description?: string;
  /** The row's own chevron, at the end, for a row that opens something. */
  chevron?: boolean;
  /** Renders the row as a button, when it has no href. */
  button?: boolean;
  /** The row for the page being shown: aria-current="page", on a link or static row. */
  current?: boolean;
  /** Disables a link or button row. */
  disabled?: boolean;
  /** Before the title: an icon or an avatar (Vue's `leading` slot). */
  leading?: ReactNode;
  /** After the title: a value, a badge or a switch (Vue's `trailing` slot). */
  trailing?: ReactNode;
}

/** A link with an `href`, a `<button>` with `button`, otherwise a static `<div>`. */
export type PlinthListRowProps =
  | (ListRowOptions & Omit<ComponentProps<'a'>, keyof ListRowOptions> & { href: string })
  | (ListRowOptions &
      Omit<ComponentProps<'button'>, keyof ListRowOptions> & { href?: undefined; button: true })
  | (ListRowOptions &
      Omit<ComponentProps<'div'>, keyof ListRowOptions> & { href?: undefined; button?: false });

export function PlinthListRow({
  description,
  chevron = false,
  href,
  button = false,
  current = false,
  disabled = false,
  leading,
  trailing,
  className,
  children,
  ...rest
}: PlinthListRowProps) {
  const tag = href ? 'a' : button ? 'button' : 'div';
  const Tag = tag as ElementType;
  const hasTrailing = hasContent(trailing);

  // The project's own attributes come after Plinth's and win, as in Blade and Vue; its class is
  // added to Plinth's.
  return (
    <Tag
      type={tag === 'button' ? 'button' : undefined}
      href={tag === 'a' && !disabled ? href : undefined}
      aria-current={current && tag !== 'button' ? 'page' : undefined}
      disabled={tag === 'button' && disabled ? true : undefined}
      role={tag === 'a' && disabled ? 'link' : undefined}
      aria-disabled={tag === 'a' && disabled ? 'true' : undefined}
      {...rest}
      className={classNames('plinth-list-row', className)}
    >
      {hasContent(leading) ? <span className="plinth-list-row-leading">{leading}</span> : null}
      <span className="plinth-list-row-content">
        <span className="plinth-list-row-title">{children}</span>
        {description ? <span className="plinth-list-row-description">{description}</span> : null}
      </span>
      {/* The chevron is listRowChevron (list-row.ts), written out; parity keeps the copies equal. */}
      {hasTrailing || chevron ? (
        <span className="plinth-list-row-trailing">
          {hasTrailing ? trailing : null}
          {chevron ? (
            <span
              className="plinth-icon plinth-list-row-chevron"
              data-size="sm"
              data-mirror=""
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 6l6 6-6 6"></path>
              </svg>
            </span>
          ) : null}
        </span>
      ) : null}
    </Tag>
  );
}
