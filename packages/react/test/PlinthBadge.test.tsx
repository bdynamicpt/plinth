import { render } from '@testing-library/react';
import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PlinthBadge, tones, type Tone } from '../src/index.ts';

describe('PlinthBadge', () => {
  it('prints the badge markup contract', () => {
    expect(
      renderToStaticMarkup(
        <PlinthBadge tone="success" dot>
          Paid
        </PlinthBadge>,
      ),
    ).toBe(
      '<span data-tone="success" class="plinth-badge"><span class="plinth-badge-dot" aria-hidden="true"></span><span class="plinth-badge-label">Paid</span></span>',
    );
  });

  it('is neutral and has no dot by default', () => {
    expect(renderToStaticMarkup(<PlinthBadge>Draft</PlinthBadge>)).toBe(
      '<span data-tone="neutral" class="plinth-badge"><span class="plinth-badge-label">Draft</span></span>',
    );
  });

  it.each(tones)('accepts the %s tone', (tone) => {
    const { container } = render(<PlinthBadge tone={tone}>Paid</PlinthBadge>);

    expect(container.firstElementChild?.getAttribute('data-tone')).toBe(tone);
  });

  it('falls back to neutral for a tone it does not know', () => {
    // An unknown tone, as a project might pass from untyped data.
    const { container } = render(<PlinthBadge tone={'purple' as Tone}>Paid</PlinthBadge>);

    expect(container.firstElementChild?.getAttribute('data-tone')).toBe('neutral');
  });

  it('escapes the label', () => {
    expect(renderToStaticMarkup(<PlinthBadge>{'<b>x</b>'}</PlinthBadge>)).toContain(
      '&lt;b&gt;x&lt;/b&gt;',
    );
  });

  it('keeps extra classes, attributes and the ref on its root', () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(
      <PlinthBadge ref={ref} tone="danger" className="ms-2" id="status" data-testid="status">
        Late
      </PlinthBadge>,
    );
    const root = container.firstElementChild!;

    expect(root.className).toBe('plinth-badge ms-2');
    expect(root.id).toBe('status');
    expect(root.getAttribute('data-testid')).toBe('status');
    expect(ref.current).toBe(root);
  });

  it('lets a project’s own attributes win, as Blade and Vue do', () => {
    const { container } = render(
      <PlinthBadge tone="success" data-tone="custom">
        Paid
      </PlinthBadge>,
    );

    expect(container.firstElementChild?.getAttribute('data-tone')).toBe('custom');
  });
});
