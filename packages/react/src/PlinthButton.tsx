// Markup contract: packages/css/src/components/button.css
import type { ComponentProps, ReactNode } from 'react';
import { buttonVariant, type ButtonVariant } from './button';
import { classNames, hasContent } from './markup';
import { controlSizes, iconSizeFor, resolveSize, type ControlSize } from './size';

interface ButtonOptions {
  variant?: ButtonVariant;
  size?: ControlSize;
  disabled?: boolean;
  /** Working: a spinner in the leading icon's place, and the button reads as busy. */
  busy?: boolean;
  /** The leading icon (Vue's `icon` slot). */
  icon?: ReactNode;
  /** The trailing icon (Vue's `trailing` slot). */
  trailing?: ReactNode;
  /** Flips the leading icon in right-to-left text, for icons that point a direction. */
  mirrorIcon?: boolean;
  /** Flips the trailing icon in right-to-left text, for an arrow such as Next. */
  mirrorTrailing?: boolean;
}

/** A `<button>`, or with an `href` a link that looks like one. */
export type PlinthButtonProps =
  | (ButtonOptions & Omit<ComponentProps<'button'>, keyof ButtonOptions> & { href?: undefined })
  | (ButtonOptions & Omit<ComponentProps<'a'>, keyof ButtonOptions> & { href: string });

export function PlinthButton({
  href,
  variant,
  size,
  disabled = false,
  busy = false,
  icon,
  trailing,
  mirrorIcon = false,
  mirrorTrailing = false,
  className,
  children,
  ...rest
}: PlinthButtonProps) {
  const dataSize = resolveSize(size, controlSizes, 'md');
  const iconSize = iconSizeFor(dataSize);
  const isBusy = busy && !disabled;
  const common = {
    className: classNames('plinth-button', className),
    'data-variant': buttonVariant(variant),
    'data-size': dataSize,
    'aria-busy': isBusy ? ('true' as const) : undefined,
  };
  const content = (
    <>
      {isBusy ? (
        <span className="plinth-button-spinner" aria-hidden="true"></span>
      ) : hasContent(icon) ? (
        <span
          className="plinth-icon"
          data-size={iconSize}
          data-mirror={mirrorIcon ? '' : undefined}
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
      <span className="plinth-button-label">{children}</span>
      {hasContent(trailing) ? (
        <span
          className="plinth-icon"
          data-size={iconSize}
          data-mirror={mirrorTrailing ? '' : undefined}
          aria-hidden="true"
        >
          {trailing}
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <a
        {...(rest as ComponentProps<'a'>)}
        {...common}
        href={disabled ? undefined : href}
        role={disabled ? 'link' : undefined}
        aria-disabled={isBusy || disabled ? 'true' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      {...(rest as ComponentProps<'button'>)}
      {...common}
      disabled={disabled || undefined}
      aria-disabled={isBusy ? 'true' : undefined}
    >
      {content}
    </button>
  );
}
