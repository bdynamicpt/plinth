import { render } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { iconSizes, PlinthIcon, type IconSize } from '../src/index.ts';

const svg = (
  <svg viewBox="0 0 24 24">
    <path d="M5 12l5 5L19 7"></path>
  </svg>
);
const svgMarkup = '<svg viewBox="0 0 24 24"><path d="M5 12l5 5L19 7"></path></svg>';
const root = (element: ReactElement) => render(element).container.firstElementChild!;

describe('PlinthIcon', () => {
  it('prints a decorative icon, hidden from assistive technology', () => {
    expect(renderToStaticMarkup(<PlinthIcon>{svg}</PlinthIcon>)).toBe(
      `<span class="plinth-icon" data-size="md" aria-hidden="true">${svgMarkup}</span>`,
    );
  });

  it('prints a meaningful icon with a label', () => {
    const icon = root(<PlinthIcon label="Warning">{svg}</PlinthIcon>);

    expect(icon.getAttribute('role')).toBe('img');
    expect(icon.getAttribute('aria-label')).toBe('Warning');
    expect(icon.hasAttribute('aria-hidden')).toBe(false);
  });

  it('takes an aria-label attribute as its label', () => {
    expect(renderToStaticMarkup(<PlinthIcon aria-label="Warning">{svg}</PlinthIcon>)).toBe(
      `<span class="plinth-icon" data-size="md" role="img" aria-label="Warning">${svgMarkup}</span>`,
    );
  });

  it('stays decorative with a blank label', () => {
    const icon = root(<PlinthIcon label="  ">{svg}</PlinthIcon>);

    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.hasAttribute('role')).toBe(false);
  });

  it.each(iconSizes)('takes the %s size', (size) => {
    expect(root(<PlinthIcon size={size}>{svg}</PlinthIcon>).getAttribute('data-size')).toBe(size);
  });

  it('falls back to md for a size it does not know', () => {
    // An unknown size, as a project might pass from untyped data.
    const icon = root(<PlinthIcon size={'huge' as IconSize}>{svg}</PlinthIcon>);

    expect(icon.getAttribute('data-size')).toBe('md');
  });

  it('marks an icon to mirror in right-to-left text', () => {
    expect(root(<PlinthIcon mirror>{svg}</PlinthIcon>).getAttribute('data-mirror')).toBe('');
    expect(root(<PlinthIcon>{svg}</PlinthIcon>).hasAttribute('data-mirror')).toBe(false);
  });

  it('escapes the label', () => {
    const html = renderToStaticMarkup(<PlinthIcon label={'"><b>x</b>'}>{svg}</PlinthIcon>);

    expect(html).toContain('aria-label="&quot;&gt;&lt;b&gt;x&lt;/b&gt;"');
    expect(html).not.toContain('<b>');
  });

  it('keeps extra classes, attributes and the ref on its root', () => {
    const ref = createRef<HTMLSpanElement>();
    const icon = root(
      <PlinthIcon ref={ref} className="ms-2" id="extra">
        {svg}
      </PlinthIcon>,
    );

    expect(icon.className).toBe('plinth-icon ms-2');
    expect(icon.id).toBe('extra');
    expect(ref.current).toBe(icon);
  });
});
