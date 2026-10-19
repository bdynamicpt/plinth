// Markup contract: packages/css/src/components/callout.css
import type { ComponentProps, ReactNode } from 'react';
import {
  calloutIcons,
  calloutRole,
  calloutTone,
  type CalloutRole,
  type CalloutTone,
} from './callout';
import { classNames, hasContent } from './markup';

interface CalloutOptions {
  tone?: CalloutTone;
  /** `note` for a note in the page; `status` or `alert` for a message the app adds. */
  role?: CalloutRole;
  /** A short title above the text; it may hold a little markup. */
  title?: ReactNode;
  /** Buttons or links under the text (Vue's actions slot). */
  actions?: ReactNode;
  /** The project's own SVG in place of the tone's icon (Vue's icon slot). */
  icon?: ReactNode;
}

export type PlinthCalloutProps = CalloutOptions & Omit<ComponentProps<'div'>, keyof CalloutOptions>;

export function PlinthCallout({
  tone,
  role,
  title,
  actions,
  icon,
  className,
  children,
  ...rest
}: PlinthCalloutProps) {
  const dataTone = calloutTone(tone);
  return (
    <div
      data-tone={dataTone}
      role={calloutRole(role)}
      {...rest}
      className={classNames('plinth-callout', className)}
    >
      {hasContent(icon) ? (
        <span className="plinth-icon plinth-callout-icon" data-size="md" aria-hidden="true">
          {icon}
        </span>
      ) : (
        <span
          className="plinth-icon plinth-callout-icon"
          data-size="md"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: calloutIcons[dataTone] }}
        />
      )}
      <div className="plinth-callout-body">
        {hasContent(title) ? <p className="plinth-callout-title">{title}</p> : null}
        {hasContent(children) ? <div className="plinth-callout-text">{children}</div> : null}
        {hasContent(actions) ? <div className="plinth-callout-actions">{actions}</div> : null}
      </div>
    </div>
  );
}
