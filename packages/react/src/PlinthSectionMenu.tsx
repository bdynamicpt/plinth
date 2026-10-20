// Markup contract: packages/css/src/components/section-menu.css
import type { ComponentProps, ElementType } from 'react';
import { classNames } from './markup';

interface SectionMenuOptions {
  /** The menu's accessible name (aria-label). */
  label?: string;
  /** A <nav> of links (the default); false for a <div role="group"> of buttons. */
  nav?: boolean;
}

/** A `<nav>`, or without `nav` a `<div role="group">`. */
export type PlinthSectionMenuProps = SectionMenuOptions &
  Omit<ComponentProps<'nav'>, keyof SectionMenuOptions>;

export function PlinthSectionMenu({
  label,
  nav = true,
  className,
  children,
  ...rest
}: PlinthSectionMenuProps) {
  const Tag = (nav ? 'nav' : 'div') as ElementType;
  // A blank label counts as missing, as Blade's filled() decides.
  return (
    <Tag
      role={nav ? undefined : 'group'}
      aria-label={label?.trim() ? label : undefined}
      {...rest}
      className={classNames('plinth-section-menu', className)}
    >
      {children}
    </Tag>
  );
}
