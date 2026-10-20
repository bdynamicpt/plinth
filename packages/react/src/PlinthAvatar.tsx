// Markup contract: packages/css/src/components/avatar.css
import { useEffect, type ComponentProps } from 'react';
import { avatarSize, initialsFrom, type AvatarSize } from './avatar';
import { classNames } from './markup';
import { tone as toTone, type Tone } from './tones';

// The app's bundler replaces it, as it does in React itself.
declare const process: { env: { NODE_ENV?: string } };

interface AvatarOptions {
  /** Whose avatar it is: the accessible name, and where initials come from. */
  name?: string;
  src?: string;
  initials?: string;
  size?: AvatarSize;
  status?: Tone;
  statusLabel?: string;
  /** Hidden from screen readers, for an avatar next to the name it shows. */
  decorative?: boolean;
}

export type PlinthAvatarProps = AvatarOptions &
  Omit<ComponentProps<'span'>, keyof AvatarOptions | 'children'>;

export function PlinthAvatar({
  name = '',
  src,
  initials,
  size,
  status,
  statusLabel,
  decorative = false,
  className,
  ...rest
}: PlinthAvatarProps) {
  const dataTone = status ? toTone(status) : undefined;
  const label = decorative ? undefined : dataTone && statusLabel ? `${name}, ${statusLabel}` : name;
  const letters = initials ?? initialsFrom(name);

  // The same mistakes Blade refuses, and Vue warns about while developing: an avatar with no
  // name, and a status only colour explains.
  useEffect(() => {
    if (decorative || process.env.NODE_ENV === 'production') return;
    if (!name.trim()) {
      console.warn('PlinthAvatar needs a name, or decorative when the name is shown next to it.');
    }
    if (status && !statusLabel) {
      console.warn(
        'PlinthAvatar needs a statusLabel with a status: colour alone does not say what it means.',
      );
    }
  }, [decorative, name, status, statusLabel]);

  // The project's own attributes come after Plinth's and win, as in Blade and Vue; its class is
  // added to Plinth's.
  return (
    <span
      data-size={avatarSize(size)}
      role={label === undefined ? undefined : 'img'}
      aria-label={label}
      aria-hidden={decorative ? 'true' : undefined}
      {...rest}
      className={classNames('plinth-avatar', className)}
    >
      {src ? (
        <img className="plinth-avatar-image" src={src} alt="" />
      ) : letters ? (
        <span className="plinth-avatar-initials" aria-hidden="true">
          {letters}
        </span>
      ) : (
        <svg
          className="plinth-avatar-glyph"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="9" r="4"></circle>
          <path d="M4.5 20a7.5 7.5 0 0 1 15 0"></path>
        </svg>
      )}
      {dataTone ? (
        <span className="plinth-avatar-status" data-tone={dataTone} aria-hidden="true"></span>
      ) : null}
    </span>
  );
}
