import { render } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { headingLevels, PlinthListCard, PlinthListRow, type HeadingLevel } from '../src/index.ts';

const root = (element: ReactElement) => render(element).container.firstElementChild!;

describe('PlinthListCard', () => {
  it('prints the heading, the list of rows and the footer', () => {
    expect(
      renderToStaticMarkup(
        <PlinthListCard heading="Account" footer="On this device only.">
          <li>
            <PlinthListRow>Language</PlinthListRow>
          </li>
        </PlinthListCard>,
      ),
    ).toBe(
      '<div class="plinth-list-card"><h2 class="plinth-list-card-heading">Account</h2>' +
        '<ul class="plinth-list-card-list" role="list"><li><div class="plinth-list-row"><span class="plinth-list-row-content">' +
        '<span class="plinth-list-row-title">Language</span></span></div></li></ul>' +
        '<p class="plinth-list-card-footer">On this device only.</p></div>',
    );
  });

  it.each(headingLevels)('takes the %s heading level', (level) => {
    expect(
      root(<PlinthListCard heading="Account" headingLevel={level} />).firstElementChild!.tagName,
    ).toBe(level.toUpperCase());
  });

  it('falls back to h2 for a level it does not know', () => {
    expect(
      root(<PlinthListCard heading="Account" headingLevel={'h1' as HeadingLevel} />)
        .firstElementChild!.tagName,
    ).toBe('H2');
  });

  it('escapes the heading and the footer', () => {
    expect(renderToStaticMarkup(<PlinthListCard heading="<b>A</b>" footer="<i>B</i>" />)).toBe(
      '<div class="plinth-list-card"><h2 class="plinth-list-card-heading">&lt;b&gt;A&lt;/b&gt;</h2>' +
        '<ul class="plinth-list-card-list" role="list"></ul><p class="plinth-list-card-footer">&lt;i&gt;B&lt;/i&gt;</p></div>',
    );
  });

  it('leaves out a blank heading and footer', () => {
    const card = root(<PlinthListCard heading=" " footer="  " />);

    expect(card.children).toHaveLength(1);
    expect(card.firstElementChild!.tagName).toBe('UL');
  });

  it('passes other props and the ref to the root', () => {
    const ref = createRef<HTMLDivElement>();
    const card = root(<PlinthListCard ref={ref} className="mb-4" id="account" />);

    expect(card.className).toBe('plinth-list-card mb-4');
    expect(card.id).toBe('account');
    expect(ref.current).toBe(card);
  });
});
