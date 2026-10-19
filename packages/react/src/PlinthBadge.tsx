// Markup contract: packages/css/src/components/badge.css
import type { ComponentProps } from 'react';
import { classNames } from './markup';
import { tone as toTone, type Tone } from './tones';

export type PlinthBadgeProps = ComponentProps<'span'> & {
  tone?: Tone;
  dot?: boolean;
};

export function PlinthBadge({ tone, dot = false, className, children, ...rest }: PlinthBadgeProps) {
  return (
    // The project's own attributes come last and win, as in Blade and Vue.
    <span data-tone={toTone(tone)} {...rest} className={classNames('plinth-badge', className)}>
      {dot ? <span className="plinth-badge-dot" aria-hidden="true"></span> : null}
      <span className="plinth-badge-label">{children}</span>
    </span>
  );
}
