import { render } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { PlinthHeader } from '../src/index.ts';

const root = (element: ReactElement) => render(element).container.firstElementChild!;

describe('PlinthHeader', () => {
  it('prints the leading action, the title and the actions', () => {
    expect(
      renderToStaticMarkup(
        <PlinthHeader
          title="Message"
          leading={<a href="/inbox">Back</a>}
          actions={<button type="button">Archive</button>}
        />,
      ),
    ).toBe(
      '<header class="plinth-header"><div class="plinth-header-leading"><a href="/inbox">Back</a></div>' +
        '<h1 class="plinth-header-title">Message</h1>' +
        '<div class="plinth-header-actions"><button type="button">Archive</button></div></header>',
    );
  });

  it('leaves out leading and actions that print nothing', () => {
    expect(renderToStaticMarkup(<PlinthHeader title="Settings" leading=" " actions={null} />)).toBe(
      '<header class="plinth-header"><h1 class="plinth-header-title">Settings</h1></header>',
    );
  });

  it('needs a title', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<PlinthHeader title=" " />)).toThrow('needs a title');
    vi.restoreAllMocks();
  });

  it('passes other props and the ref to the root', () => {
    const ref = createRef<HTMLElement>();
    const header = root(<PlinthHeader ref={ref} title="Inbox" className="app-header" id="top" />);

    expect(header.className).toBe('plinth-header app-header');
    expect(header.id).toBe('top');
    expect(ref.current).toBe(header);
  });
});
