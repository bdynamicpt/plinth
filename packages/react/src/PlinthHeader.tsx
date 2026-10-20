// Markup contract: packages/css/src/components/header.css
import type { ComponentProps, ReactNode } from 'react';
import { classNames, hasContent } from './markup';

interface HeaderOptions {
  /** The page's title, an <h1>. */
  title: string;
  /** The leading action, usually a back link or a menu button (Vue's `leading` slot). */
  leading?: ReactNode;
  /** The trailing actions, usually icon buttons (Vue's `actions` slot). */
  actions?: ReactNode;
}

export type PlinthHeaderProps = HeaderOptions &
  Omit<ComponentProps<'header'>, keyof HeaderOptions | 'children'>;

export function PlinthHeader({ title, leading, actions, className, ...rest }: PlinthHeaderProps) {
  if (!title?.trim()) {
    throw new Error("<PlinthHeader> needs a title: it is the page's heading.");
  }
  return (
    <header {...rest} className={classNames('plinth-header', className)}>
      {hasContent(leading) ? <div className="plinth-header-leading">{leading}</div> : null}
      <h1 className="plinth-header-title">{title}</h1>
      {hasContent(actions) ? <div className="plinth-header-actions">{actions}</div> : null}
    </header>
  );
}
