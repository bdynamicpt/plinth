import { fireEvent, render } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { PlinthPill, PlinthPillRow } from '../src/index.ts';

const root = (element: ReactElement) => render(element).container.firstElementChild!;

describe('PlinthPillRow', () => {
  it('prints a group of pills, named by its label', () => {
    expect(
      renderToStaticMarkup(
        <PlinthPillRow label="Status">
          <PlinthPill selected>All</PlinthPill>
        </PlinthPillRow>,
      ),
    ).toBe(
      '<div role="group" aria-label="Status" class="plinth-pill-row">' +
        '<button type="button" aria-pressed="true" class="plinth-pill"><span class="plinth-pill-label">All</span></button></div>',
    );
  });

  it('is a nav with nav, and leaves out a blank label', () => {
    const row = root(<PlinthPillRow nav label="" />);

    expect(row.tagName).toBe('NAV');
    expect(row.hasAttribute('role')).toBe(false);
    expect(row.hasAttribute('aria-label')).toBe(false);
  });

  it('passes other props and the ref to the root, and lets a project attribute win', () => {
    const ref = createRef<HTMLDivElement>();
    const row = root(<PlinthPillRow ref={ref} className="mb-4" role="toolbar" />);

    expect(row.className).toBe('plinth-pill-row mb-4');
    expect(row.getAttribute('role')).toBe('toolbar');
    expect(ref.current).toBe(row);
  });
});

describe('PlinthPill', () => {
  it('is a toggle button, with a count', () => {
    const onClick = vi.fn();
    const pill = root(
      <PlinthPill count={0} onClick={onClick}>
        Archived
      </PlinthPill>,
    );
    fireEvent.click(pill);

    expect(pill.tagName).toBe('BUTTON');
    expect(pill.getAttribute('aria-pressed')).toBe('false');
    expect(pill.querySelector('.plinth-pill-count')?.textContent).toBe('0');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('leaves out a missing or blank count', () => {
    for (const count of [undefined, null, ' ']) {
      expect(
        root(<PlinthPill count={count}>Open</PlinthPill>).querySelector('.plinth-pill-count'),
      ).toBeNull();
    }
  });

  it('is disabled natively as a button', () => {
    expect((root(<PlinthPill disabled>Open</PlinthPill>) as HTMLButtonElement).disabled).toBe(true);
  });

  it('is a link with an href: current when selected, and disabled without its href', () => {
    const link = root(
      <PlinthPill href="/open" selected>
        Open
      </PlinthPill>,
    );
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('aria-current')).toBe('page');
    expect(link.hasAttribute('aria-pressed')).toBe(false);
    expect(link.hasAttribute('type')).toBe(false);

    const disabled = root(
      <PlinthPill href="/open" disabled>
        Open
      </PlinthPill>,
    );
    expect(disabled.hasAttribute('href')).toBe(false);
    expect(disabled.getAttribute('role')).toBe('link');
    expect(disabled.getAttribute('aria-disabled')).toBe('true');
  });

  it('passes other props and the ref to the root, and lets a project attribute win', () => {
    const ref = createRef<HTMLButtonElement>();
    const pill = root(
      <PlinthPill ref={ref} className="ms-2" aria-pressed="mixed">
        Open
      </PlinthPill>,
    );

    expect(pill.className).toBe('plinth-pill ms-2');
    expect(pill.getAttribute('aria-pressed')).toBe('mixed');
    expect(ref.current).toBe(pill);
  });
});
