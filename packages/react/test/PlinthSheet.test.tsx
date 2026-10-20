import { fireEvent, render } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PlinthSheet, sheetCloseIcon, type SheetSide } from '../src/index.ts';

const close =
  '<button type="button" class="plinth-button plinth-icon-button plinth-sheet-close" data-variant="ghost" data-size="md" aria-label="Close" commandfor="filters" command="close">' +
  `<span class="plinth-icon" data-size="md" aria-hidden="true">${sheetCloseIcon}</span></button>`;

const root = (element: ReactElement) =>
  render(element).container.firstElementChild! as HTMLDialogElement;

describe('PlinthSheet', () => {
  afterEach(() => vi.restoreAllMocks());

  it('prints the dialog, the header, the body and the footer', () => {
    expect(
      renderToStaticMarkup(
        <PlinthSheet
          id="filters"
          title="Filters"
          description="Narrow the list down."
          footer={<button type="button">Apply</button>}
        >
          <p>Body</p>
        </PlinthSheet>,
      ),
    ).toBe(
      '<dialog id="filters" data-side="end" closedby="any" aria-labelledby="filters-title" aria-describedby="filters-description" class="plinth-sheet">' +
        '<div class="plinth-sheet-panel">' +
        '<div class="plinth-sheet-header">' +
        '<h2 id="filters-title" class="plinth-sheet-title">Filters</h2>' +
        '<p id="filters-description" class="plinth-sheet-description">Narrow the list down.</p>' +
        close +
        '</div>' +
        '<div class="plinth-sheet-body"><p>Body</p></div>' +
        '<div class="plinth-sheet-footer"><button type="button">Apply</button></div>' +
        '</div>' +
        '</dialog>',
    );
  });

  it('has the grab handle where its side on a phone is the bottom', () => {
    const handle = (side: SheetSide, sidePhone?: SheetSide) =>
      root(<PlinthSheet title="Filters" side={side} sidePhone={sidePhone} />).querySelector(
        '.plinth-sheet-panel > .plinth-sheet-handle',
      );

    expect(handle('bottom')?.getAttribute('aria-hidden')).toBe('true');
    expect(handle('end', 'bottom')).not.toBeNull();
    expect(handle('bottom', 'start')).toBeNull();
    expect(handle('end')).toBeNull();
  });

  it('leaves out a blank description and a footer that prints nothing', () => {
    const sheet = root(<PlinthSheet title="Filters" description="  " footer=" " />);

    expect(sheet.hasAttribute('aria-describedby')).toBe(false);
    expect(sheet.querySelector('.plinth-sheet-description')).toBeNull();
    expect(sheet.querySelector('.plinth-sheet-footer')).toBeNull();
    expect(
      root(<PlinthSheet title="Filters" footer={[false, null]} />).querySelector(
        '.plinth-sheet-footer',
      ),
    ).toBeNull();
  });

  it('escapes the title and the description', () => {
    const html = renderToStaticMarkup(
      <PlinthSheet id="x" title="<b>A</b>" description="<i>B</i>" />,
    );

    expect(html).toContain('class="plinth-sheet-title">&lt;b&gt;A&lt;/b&gt;</h2>');
    expect(html).toContain('class="plinth-sheet-description">&lt;i&gt;B&lt;/i&gt;</p>');
  });

  it('takes a side, and falls back to end', () => {
    const side = (value: string) =>
      root(<PlinthSheet title="Filters" side={value as SheetSide} />).dataset.side;

    expect(side('start')).toBe('start');
    expect(side('top')).toBe('top');
    expect(side('bottom')).toBe('bottom');
    expect(side('left')).toBe('end');
  });

  it('takes a side on a phone, and leaves it out when it is missing or unknown', () => {
    const sidePhone = (value?: string) =>
      root(<PlinthSheet title="Filters" sidePhone={value as SheetSide} />).dataset.sidePhone;

    expect(sidePhone('bottom')).toBe('bottom');
    expect(sidePhone('start')).toBe('start');
    expect(sidePhone('left')).toBeUndefined();
    expect(sidePhone()).toBeUndefined();
  });

  it("takes the close button's label", () => {
    const sheet = root(<PlinthSheet title="Filtros" closeLabel="Fechar" />);

    expect(sheet.querySelector('.plinth-sheet-close')?.getAttribute('aria-label')).toBe('Fechar');
  });

  it('generates an id when it has none, trims one it is given, and wires the title to it', () => {
    const sheet = root(<PlinthSheet title="Filters" />);

    expect(sheet.id).toMatch(/^plinth-sheet-/);
    expect(sheet.getAttribute('aria-labelledby')).toBe(`${sheet.id}-title`);
    expect(sheet.querySelector('h2')?.id).toBe(`${sheet.id}-title`);
    expect(sheet.querySelector('.plinth-sheet-close')?.getAttribute('commandfor')).toBe(sheet.id);
    expect(root(<PlinthSheet id=" filters " title="Filters" />).id).toBe('filters');
  });

  it('needs a title', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<PlinthSheet title=" " />)).toThrow('needs a title');
  });

  it('passes other props, onClose and the ref to the dialog, and lets a project attribute win', () => {
    const ref = createRef<HTMLDialogElement>();
    const onClose = vi.fn();
    const sheet = root(
      <PlinthSheet
        ref={ref}
        id="filters"
        title="Filters"
        className="is-busy"
        closedby="closerequest"
        aria-labelledby="filters-heading"
        onClose={onClose}
      />,
    );
    fireEvent(sheet, new Event('close'));

    expect(sheet.className).toBe('plinth-sheet is-busy');
    expect(sheet.getAttribute('closedby')).toBe('closerequest');
    expect(sheet.getAttribute('aria-labelledby')).toBe('filters-heading');
    expect(onClose).toHaveBeenCalledOnce();
    expect(ref.current).toBe(sheet);
  });
});
