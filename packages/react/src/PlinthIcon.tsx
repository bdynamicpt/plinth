// Markup contract: packages/css/src/components/icon.css
import type { ComponentProps } from 'react';
import { iconSize, type IconSize } from './icon';
import { classNames } from './markup';

export type PlinthIconProps = ComponentProps<'span'> & {
  size?: IconSize;
  /** Makes the icon meaningful; without it the icon is decorative and hidden. */
  label?: string;
  /** Flips the icon in right-to-left text, for icons that point a direction. */
  mirror?: boolean;
};

export function PlinthIcon({
  size,
  label,
  mirror = false,
  className,
  children,
  'aria-label': ariaLabel,
  ...rest
}: PlinthIconProps) {
  // The label can also come as an aria-label attribute; a blank one leaves the icon decorative.
  const value = label ?? ariaLabel;
  const name = value?.trim() ? value : undefined;
  // The project's own attributes come after Plinth's and win, as in Blade and Vue; its class
  // (taken out of them) is added to Plinth's.
  return (
    <span
      className={classNames('plinth-icon', className)}
      data-size={iconSize(size)}
      data-mirror={mirror ? '' : undefined}
      role={name ? 'img' : undefined}
      aria-label={name}
      aria-hidden={name ? undefined : 'true'}
      {...rest}
    >
      {children}
    </span>
  );
}
