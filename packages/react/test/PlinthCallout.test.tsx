import { render } from '@testing-library/react';
import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  PlinthCallout,
  calloutIcons,
  calloutRoles,
  calloutTones,
  type CalloutRole,
  type CalloutTone,
} from '../src/index.ts';

const icon = (tone: CalloutTone) =>
  `<span class="plinth-icon plinth-callout-icon" data-size="md" aria-hidden="true">${calloutIcons[tone]}</span>`;

describe('PlinthCallout', () => {
  it('prints the callout markup contract', () => {
    expect(
      renderToStaticMarkup(
        <PlinthCallout
          tone="warning"
          title="Your trial ends in 3 days"
          actions={<button type="button">Add</button>}
        >
          Add a payment method.
        </PlinthCallout>,
      ),
    ).toBe(
      [
        '<div data-tone="warning" role="note" class="plinth-callout">',
        icon('warning'),
        '<div class="plinth-callout-body">',
        '<p class="plinth-callout-title">Your trial ends in 3 days</p>',
        '<div class="plinth-callout-text">Add a payment method.</div>',
        '<div class="plinth-callout-actions"><button type="button">Add</button></div>',
        '</div></div>',
      ].join(''),
    );
  });

  it('is a neutral note with only the text by default', () => {
    expect(renderToStaticMarkup(<PlinthCallout>Drafts are private.</PlinthCallout>)).toBe(
      [
        '<div data-tone="neutral" role="note" class="plinth-callout">',
        icon('neutral'),
        '<div class="plinth-callout-body"><div class="plinth-callout-text">Drafts are private.</div></div>',
        '</div>',
      ].join(''),
    );
  });

  it.each(calloutTones)('prints the %s tone with its icon', (tone) => {
    const html = renderToStaticMarkup(<PlinthCallout tone={tone}>Text</PlinthCallout>);

    expect(html).toContain(`data-tone="${tone}"`);
    expect(html).toContain(icon(tone));
  });

  it.each(calloutRoles)('takes the %s role', (role) => {
    const { container } = render(<PlinthCallout role={role}>Text</PlinthCallout>);

    expect(container.firstElementChild?.getAttribute('role')).toBe(role);
  });

  it('falls back to a neutral note for a tone or role it does not know', () => {
    // Unknown values, as a project might pass from untyped data.
    const { container } = render(
      <PlinthCallout tone={'loud' as CalloutTone} role={'log' as CalloutRole}>
        Text
      </PlinthCallout>,
    );
    const root = container.firstElementChild!;

    expect(root.getAttribute('data-tone')).toBe('neutral');
    expect(root.getAttribute('role')).toBe('note');
  });

  it('leaves out a blank title, text and actions', () => {
    expect(
      renderToStaticMarkup(
        <PlinthCallout title=" " actions={null}>
          {' '}
        </PlinthCallout>,
      ),
    ).toContain('<div class="plinth-callout-body"></div>');
  });

  it('takes a title with markup', () => {
    expect(
      renderToStaticMarkup(
        <PlinthCallout
          title={
            <>
              Read <code>brand.css</code>
            </>
          }
        />,
      ),
    ).toContain('<p class="plinth-callout-title">Read <code>brand.css</code></p>');
  });

  it('puts a project’s icon in place of the tone’s', () => {
    expect(
      renderToStaticMarkup(<PlinthCallout tone="info" icon={<svg id="bell"></svg>} />),
    ).toContain(
      '<span class="plinth-icon plinth-callout-icon" data-size="md" aria-hidden="true"><svg id="bell"></svg></span>',
    );
  });

  it('escapes the title and the text', () => {
    const html = renderToStaticMarkup(<PlinthCallout title="<b>t</b>">{'<i>x</i>'}</PlinthCallout>);

    expect(html).toContain('&lt;b&gt;t&lt;/b&gt;');
    expect(html).toContain('&lt;i&gt;x&lt;/i&gt;');
  });

  it('keeps extra classes, attributes and the ref on its root', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <PlinthCallout ref={ref} className="mb-4" id="trial" aria-labelledby="trial-title">
        Text
      </PlinthCallout>,
    );
    const root = container.firstElementChild!;

    expect(root.className).toBe('plinth-callout mb-4');
    expect(root.id).toBe('trial');
    expect(root.getAttribute('aria-labelledby')).toBe('trial-title');
    expect(ref.current).toBe(root);
  });

  it('lets a project’s own attributes win, as Blade and Vue do', () => {
    const { container } = render(<PlinthCallout data-tone="custom">Text</PlinthCallout>);

    expect(container.firstElementChild?.getAttribute('data-tone')).toBe('custom');
  });
});
