// Markup contract: packages/css/src/components/pill-row.css
import type { ComponentProps, ElementType } from 'react';
import { classNames } from './markup';

interface PillRowOptions {
  /** The row's accessible name (aria-label). */
  label?: string;
  /** Renders the row as a <nav>, for pills that are links. */
  nav?: boolean;
}

export type PlinthPillRowProps = PillRowOptions & Omit<ComponentProps<'div'>, keyof PillRowOptions>;

export function PlinthPillRow({
  label,
  nav = false,
  className,
  children,
  ...rest
}: PlinthPillRowProps) {
  const Tag = (nav ? 'nav' : 'div') as ElementType;
  return (
    <Tag
      role={nav ? undefined : 'group'}
      aria-label={label || undefined}
      {...rest}
      className={classNames('plinth-pill-row', className)}
    >
      {children}
    </Tag>
  );
}
