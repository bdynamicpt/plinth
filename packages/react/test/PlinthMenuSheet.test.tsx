import { fireEvent, render } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PlinthMenuSheet } from '../src/index.ts';

const root = (element: ReactElement) =>
  render(element).container.firstElementChild! as HTMLDialogElement;

describe('PlinthMenuSheet', () => {
  it('is a sheet from the end, with the user row, the navigation and the account', () => {
    const menu = root(
      <PlinthMenuSheet
        id="menu"
        userName="Sam Lee"
        userDetail="sam@example.com"
        userHref="/profile"
        userSrc="/sam.jpg"
        account={<button type="button">Sign out</button>}
      >
        <a href="/inbox">Inbox</a>
      </PlinthMenuSheet>,
    );
    const user = menu.querySelector('.plinth-menu-sheet-user')!;

    expect(menu.tagName).toBe('DIALOG');
    expect(menu.className).toBe('plinth-sheet plinth-menu-sheet');
    expect(menu.dataset.placement).toBe('end');
    expect(menu.querySelector('h2')?.textContent).toBe('Menu');
    expect(user.tagName).toBe('A');
    expect(user.getAttribute('href')).toBe('/profile');
    expect(user.querySelector('.plinth-list-row-title')?.textContent).toBe('Sam Lee');
    expect(user.querySelector('.plinth-list-row-description')?.textContent).toBe('sam@example.com');
    expect(user.querySelector('.plinth-list-row-chevron')).not.toBeNull();
    expect(user.querySelector('.plinth-avatar')?.getAttribute('aria-hidden')).toBe('true');
    expect(user.querySelector('.plinth-avatar')?.getAttribute('data-size')).toBe('lg');
    expect(user.querySelector('img')?.getAttribute('src')).toBe('/sam.jpg');
    expect(menu.querySelector('.plinth-menu-sheet-nav')?.getAttribute('aria-labelledby')).toBe(
      'menu-title',
    );
    expect(menu.querySelector('.plinth-menu-sheet-nav')?.innerHTML).toBe(
      '<a href="/inbox">Inbox</a>',
    );
    expect(menu.querySelector('.plinth-menu-sheet-account')?.textContent).toBe('Sign out');
  });

  it('leaves out a blank user, and blank parts of the user row', () => {
    expect(
      root(<PlinthMenuSheet userName=" " />).querySelector('.plinth-menu-sheet-user'),
    ).toBeNull();

    const user = root(
      <PlinthMenuSheet userName="Sam Lee" userDetail=" " userHref=" " userSrc=" " account="  " />,
    );
    const row = user.querySelector('.plinth-menu-sheet-user')!;

    expect(row.tagName).toBe('DIV');
    expect(row.querySelector('.plinth-list-row-description')).toBeNull();
    expect(row.querySelector('.plinth-list-row-chevron')).toBeNull();
    expect(row.querySelector('img')).toBeNull();
    expect(row.querySelector('.plinth-avatar-initials')?.textContent).toBe('SL');
    expect(user.querySelector('.plinth-menu-sheet-account')).toBeNull();
  });

  it('generates an id when it has none, and trims one it is given', () => {
    const menu = root(<PlinthMenuSheet title="Navigation" closeLabel="Fechar" />);

    expect(menu.id).toMatch(/^plinth-menu-sheet-/);
    expect(menu.querySelector('.plinth-menu-sheet-nav')?.getAttribute('aria-labelledby')).toBe(
      `${menu.id}-title`,
    );
    expect(menu.querySelector('h2')?.textContent).toBe('Navigation');
    expect(menu.querySelector('.plinth-sheet-close')?.getAttribute('aria-label')).toBe('Fechar');
    expect(root(<PlinthMenuSheet id=" menu " />).id).toBe('menu');
  });

  it('passes other props, onClose and the ref to the dialog, and lets a project attribute win', () => {
    const ref = createRef<HTMLDialogElement>();
    const onClose = vi.fn();
    const menu = root(
      <PlinthMenuSheet
        ref={ref}
        className="is-shell"
        aria-labelledby="menu-heading"
        data-testid="menu"
        onClose={onClose}
      />,
    );
    fireEvent(menu, new Event('close'));

    expect(menu.className).toBe('plinth-sheet plinth-menu-sheet is-shell');
    expect(menu.getAttribute('aria-labelledby')).toBe('menu-heading');
    expect(menu.getAttribute('data-testid')).toBe('menu');
    expect(onClose).toHaveBeenCalledOnce();
    expect(ref.current).toBe(menu);
  });
});
