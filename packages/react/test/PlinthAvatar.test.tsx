import { render } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  avatarGlyph,
  avatarSizes,
  initialsFrom,
  PlinthAvatar,
  type AvatarSize,
  type Tone,
} from '../src/index.ts';

const root = (element: ReactElement) => render(element).container.firstElementChild!;

describe('PlinthAvatar', () => {
  afterEach(() => vi.restoreAllMocks());

  it('prints the avatar markup contract, with initials from the name', () => {
    expect(renderToStaticMarkup(<PlinthAvatar name="Ana Lima" />)).toBe(
      '<span data-size="md" role="img" aria-label="Ana Lima" class="plinth-avatar">' +
        '<span class="plinth-avatar-initials" aria-hidden="true">AL</span></span>',
    );
  });

  it('prints the image in place of the initials', () => {
    const avatar = root(<PlinthAvatar name="Ana Lima" src="/ana.jpg" />);

    expect(avatar.querySelector('img')?.getAttribute('src')).toBe('/ana.jpg');
    expect(avatar.querySelector('img')?.getAttribute('alt')).toBe('');
    expect(avatar.querySelector('.plinth-avatar-initials')).toBeNull();
  });

  it('takes initials it is given, and shows the person glyph with neither', () => {
    expect(root(<PlinthAvatar name="Nadia West" initials="NW" />).textContent).toBe('NW');

    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const glyph = root(<PlinthAvatar />).querySelector('svg')!;
    expect(glyph.outerHTML).toBe(avatarGlyph);
  });

  it.each(avatarSizes)('takes the %s size', (size) => {
    expect(root(<PlinthAvatar name="Ana" size={size} />).getAttribute('data-size')).toBe(size);
  });

  it('falls back to md for a size it does not know', () => {
    expect(
      root(<PlinthAvatar name="Ana" size={'xs' as AvatarSize} />).getAttribute('data-size'),
    ).toBe('md');
  });

  it('adds the status to the name, and its dot', () => {
    const avatar = root(<PlinthAvatar name="Ana Lima" status="success" statusLabel="Online" />);

    expect(avatar.getAttribute('aria-label')).toBe('Ana Lima, Online');
    expect(avatar.querySelector('.plinth-avatar-status')?.getAttribute('data-tone')).toBe(
      'success',
    );
  });

  it('falls back to neutral for a status it does not know', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const avatar = root(<PlinthAvatar name="Ana" status={'loud' as Tone} />);

    expect(avatar.querySelector('.plinth-avatar-status')?.getAttribute('data-tone')).toBe(
      'neutral',
    );
    expect(avatar.getAttribute('aria-label')).toBe('Ana');
  });

  it('is hidden from screen readers when decorative', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const avatar = root(<PlinthAvatar name="Ana" status="success" decorative />);

    expect(avatar.getAttribute('aria-hidden')).toBe('true');
    expect(avatar.hasAttribute('role')).toBe(false);
    expect(avatar.hasAttribute('aria-label')).toBe(false);
    expect(warn).not.toHaveBeenCalled();
  });

  it('warns about a missing name and a status without a label', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(<PlinthAvatar name=" " status="danger" />);

    expect(warn.mock.calls.map(([message]) => message)).toEqual([
      'PlinthAvatar needs a name, or decorative when the name is shown next to it.',
      'PlinthAvatar needs a statusLabel with a status: colour alone does not say what it means.',
    ]);
  });

  it('stays quiet in production, as Vue does', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubEnv('NODE_ENV', 'production');

    render(<PlinthAvatar name=" " status="danger" />);

    vi.unstubAllEnvs();
    expect(warn).not.toHaveBeenCalled();
  });

  it('escapes the name and the initials', () => {
    expect(renderToStaticMarkup(<PlinthAvatar name="<b>A</b>" initials="<i>" />)).toBe(
      '<span data-size="md" role="img" aria-label="&lt;b&gt;A&lt;/b&gt;" class="plinth-avatar">' +
        '<span class="plinth-avatar-initials" aria-hidden="true">&lt;i&gt;</span></span>',
    );
  });

  it('passes other props and the ref to the root, and lets a project attribute win', () => {
    const ref = createRef<HTMLSpanElement>();
    const avatar = root(
      <PlinthAvatar ref={ref} name="Sam Lee" className="ms-2" data-testid="me" aria-label="Sam" />,
    );

    expect(avatar.className).toBe('plinth-avatar ms-2');
    expect(avatar.getAttribute('data-testid')).toBe('me');
    expect(avatar.getAttribute('aria-label')).toBe('Sam');
    expect(ref.current).toBe(avatar);
  });

  it('takes initials from the first and the last word', () => {
    expect(initialsFrom('  ana  maria lima ')).toBe('AL');
    expect(initialsFrom('')).toBe('');
  });
});
