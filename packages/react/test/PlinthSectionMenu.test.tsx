import { fireEvent, render } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { PlinthSectionMenu, PlinthSectionMenuItem } from '../src/index.ts';

const root = (element: ReactElement) => render(element).container.firstElementChild!;

describe('PlinthSectionMenu', () => {
  it('prints a nav of links, named by its label', () => {
    expect(
      renderToStaticMarkup(
        <PlinthSectionMenu label="Project">
          <PlinthSectionMenuItem href="/tasks" current count={8}>
            Tasks
          </PlinthSectionMenuItem>
        </PlinthSectionMenu>,
      ),
    ).toBe(
      '<nav aria-label="Project" class="plinth-section-menu">' +
        '<a href="/tasks" aria-current="page" class="plinth-section-menu-item">' +
        '<span class="plinth-section-menu-label">Tasks</span><span class="plinth-section-menu-count">8</span></a></nav>',
    );
  });

  it('is a group of buttons without nav, and leaves out a blank label', () => {
    const menu = root(<PlinthSectionMenu nav={false} label=" " />);

    expect(menu.tagName).toBe('DIV');
    expect(menu.getAttribute('role')).toBe('group');
    expect(menu.hasAttribute('aria-label')).toBe(false);
  });

  it('passes other props and the ref to the root, and lets a project attribute win', () => {
    const ref = createRef<HTMLElement>();
    const menu = root(
      <PlinthSectionMenu ref={ref} nav={false} className="sticky" role="toolbar" />,
    );

    expect(menu.className).toBe('plinth-section-menu sticky');
    expect(menu.getAttribute('role')).toBe('toolbar');
    expect(ref.current).toBe(menu);
  });
});

describe('PlinthSectionMenuItem', () => {
  it('is a toggle button without an href, or with a blank one', () => {
    const onClick = vi.fn();
    const item = root(
      <PlinthSectionMenuItem href={' ' as string} current onClick={onClick}>
        Day
      </PlinthSectionMenuItem>,
    );
    fireEvent.click(item);

    expect(item.tagName).toBe('BUTTON');
    expect(item.getAttribute('type')).toBe('button');
    expect(item.getAttribute('aria-pressed')).toBe('true');
    expect(item.hasAttribute('href')).toBe(false);
    expect(onClick).toHaveBeenCalledOnce();
    expect(
      (root(<PlinthSectionMenuItem disabled>Year</PlinthSectionMenuItem>) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });

  it('escapes the label and the count', () => {
    expect(
      renderToStaticMarkup(
        <PlinthSectionMenuItem count="<b>">{'<i>Tasks</i>'}</PlinthSectionMenuItem>,
      ),
    ).toContain(
      '<span class="plinth-section-menu-label">&lt;i&gt;Tasks&lt;/i&gt;</span><span class="plinth-section-menu-count">&lt;b&gt;</span>',
    );
  });

  it('leaves out a missing or blank count, and keeps zero', () => {
    const count = (value: string | number | null | undefined) =>
      root(<PlinthSectionMenuItem count={value}>Tasks</PlinthSectionMenuItem>).querySelector(
        '.plinth-section-menu-count',
      )?.textContent;

    expect([undefined, null, ' ', 0, '3'].map(count)).toEqual([
      undefined,
      undefined,
      undefined,
      '0',
      '3',
    ]);
  });

  it('is a disabled link without its href', () => {
    const link = root(
      <PlinthSectionMenuItem href="/tasks" disabled>
        Tasks
      </PlinthSectionMenuItem>,
    );

    expect(link.tagName).toBe('A');
    expect(link.hasAttribute('href')).toBe(false);
    expect(link.getAttribute('role')).toBe('link');
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.hasAttribute('aria-current')).toBe(false);
  });

  it('passes other props and the ref to the root, and lets a project attribute win', () => {
    const ref = createRef<HTMLAnchorElement>();
    const item = root(
      <PlinthSectionMenuItem
        ref={ref}
        href="/tasks"
        current
        className="ms-2"
        aria-current="location"
      >
        Tasks
      </PlinthSectionMenuItem>,
    );

    expect(item.className).toBe('plinth-section-menu-item ms-2');
    expect(item.getAttribute('aria-current')).toBe('location');
    expect(ref.current).toBe(item);
  });
});
