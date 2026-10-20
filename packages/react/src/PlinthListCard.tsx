// Markup contract: packages/css/src/components/list-card.css
import type { ComponentProps } from 'react';
import { headingLevel as resolveLevel, type HeadingLevel } from './heading';
import { classNames } from './markup';

interface ListCardOptions {
  /** A heading above the card. */
  heading?: string;
  /** The heading's element, h2 to h6. */
  headingLevel?: HeadingLevel;
  /** A note under the card. */
  footer?: string;
}

/** A card of list rows: `children` are its `<li>` elements, each holding a list row. */
export type PlinthListCardProps = ListCardOptions &
  Omit<ComponentProps<'div'>, keyof ListCardOptions>;

export function PlinthListCard({
  heading,
  headingLevel,
  footer,
  className,
  children,
  ...rest
}: PlinthListCardProps) {
  const Heading = resolveLevel(headingLevel);
  return (
    <div {...rest} className={classNames('plinth-list-card', className)}>
      {heading?.trim() ? <Heading className="plinth-list-card-heading">{heading}</Heading> : null}
      <ul className="plinth-list-card-list" role="list">
        {children}
      </ul>
      {footer?.trim() ? <p className="plinth-list-card-footer">{footer}</p> : null}
    </div>
  );
}
