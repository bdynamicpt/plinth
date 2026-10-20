import { fireEvent, render } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { buttonVariants, controlSizes, PlinthIconButton } from '../src/index.ts';

const svg = (
  <svg viewBox="0 0 24 24">
    <path d="M6 6l12 12M18 6L6 18"></path>
  </svg>
);
const svgMarkup = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"></path></svg>';
const root = (element: ReactElement) => render(element).container.firstElementChild!;

describe('PlinthIconButton', () => {
  it('prints the icon button markup contract', () => {
    expect(renderToStaticMarkup(<PlinthIconButton label="Close">{svg}</PlinthIconButton>)).toBe(
      `<button type="button" class="plinth-button plinth-icon-button" data-variant="ghost" data-size="md" aria-label="Close"><span class="plinth-icon" data-size="md" aria-hidden="true">${svgMarkup}</span></button>`,
    );
  });

  it('takes an aria-label attribute as its label', () => {
    const button = root(
      <PlinthIconButton label="" aria-label="Close">
        {svg}
      </PlinthIconButton>,
    );

    expect(button.getAttribute('aria-label')).toBe('Close');
  });

  it.each(
    buttonVariants.flatMap((variant) => controlSizes.map((size) => [variant, size] as const)),
  )('takes the %s variant at the %s size', (variant, size) => {
    const button = root(
      <PlinthIconButton label="Go" variant={variant} size={size}>
        {svg}
      </PlinthIconButton>,
    );

    expect(button.getAttribute('data-variant')).toBe(variant);
    expect(button.getAttribute('data-size')).toBe(size);
    expect(button.querySelector('.plinth-icon')!.getAttribute('data-size')).toBe(
      size === 'sm' ? 'sm' : 'md',
    );
  });

  it('is a toggle when pressed is set, and not otherwise', () => {
    const pressed = (value?: boolean) =>
      root(
        <PlinthIconButton label="Favourite" pressed={value}>
          {svg}
        </PlinthIconButton>,
      ).getAttribute('aria-pressed');

    expect(pressed(true)).toBe('true');
    expect(pressed(false)).toBe('false');
    expect(pressed()).toBeNull();
  });

  it('disables, shows busy and flips like the button', () => {
    expect(
      root(
        <PlinthIconButton label="Close" disabled>
          {svg}
        </PlinthIconButton>,
      ).hasAttribute('disabled'),
    ).toBe(true);

    const busy = root(
      <PlinthIconButton label="Close" busy>
        {svg}
      </PlinthIconButton>,
    );
    expect(busy.getAttribute('aria-busy')).toBe('true');
    expect(busy.getAttribute('aria-disabled')).toBe('true');
    expect(busy.querySelector('.plinth-icon')).toBeNull();

    const flipped = root(
      <PlinthIconButton label="Next" mirror>
        {svg}
      </PlinthIconButton>,
    );
    expect(flipped.querySelector('.plinth-icon')!.getAttribute('data-mirror')).toBe('');
  });

  it('is a link with an href, without a type or aria-pressed', () => {
    const link = root(
      <PlinthIconButton label="Next page" href="/page/2" pressed>
        {svg}
      </PlinthIconButton>,
    );

    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/page/2');
    expect(link.hasAttribute('type')).toBe(false);
    expect(link.hasAttribute('aria-pressed')).toBe(false);
  });

  it('shows busy and flips as a link too', () => {
    const busy = root(
      <PlinthIconButton href="/next" label="Next" busy>
        {svg}
      </PlinthIconButton>,
    );

    expect(busy.querySelector('.plinth-button-spinner')).not.toBeNull();
    expect(busy.querySelector('.plinth-icon')).toBeNull();
    expect(busy.getAttribute('aria-busy')).toBe('true');
    expect(busy.getAttribute('aria-disabled')).toBe('true');

    const flipped = root(
      <PlinthIconButton href="/next" label="Next" mirror>
        {svg}
      </PlinthIconButton>,
    );
    expect(flipped.querySelector('.plinth-icon')!.getAttribute('data-mirror')).toBe('');
  });

  it('disables a link with aria-disabled and no href', () => {
    const link = root(
      <PlinthIconButton href="/next" label="Next" disabled>
        {svg}
      </PlinthIconButton>,
    );

    expect(link.tagName).toBe('A');
    expect(link.hasAttribute('href')).toBe(false);
    expect(link.getAttribute('role')).toBe('link');
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.hasAttribute('aria-busy')).toBe(false);
  });

  it('escapes the label', () => {
    const html = renderToStaticMarkup(
      <PlinthIconButton label={'"><b>x</b>'}>{svg}</PlinthIconButton>,
    );

    expect(html).toContain('aria-label="&quot;&gt;&lt;b&gt;x&lt;/b&gt;"');
    expect(html).not.toContain('<b>');
  });

  it('passes classes, listeners and the ref to its root', () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const button = root(
      <PlinthIconButton ref={ref} label="Close" className="ms-2" onClick={onClick}>
        {svg}
      </PlinthIconButton>,
    );

    expect(button.className).toBe('plinth-button plinth-icon-button ms-2');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(ref.current).toBe(button);
  });

  it("lets the project's attribute win over its own, on a button and a link", () => {
    const button = root(
      <PlinthIconButton label="Bold" pressed={false} aria-pressed="mixed">
        {svg}
      </PlinthIconButton>,
    );
    const link = root(
      <PlinthIconButton href="/next" label="Next" disabled role="button">
        {svg}
      </PlinthIconButton>,
    );

    expect(button.getAttribute('aria-pressed')).toBe('mixed');
    expect(link.getAttribute('role')).toBe('button');
  });

  it('takes the invoker command attributes as typed props, and a link does not', () => {
    const button = root(
      <PlinthIconButton label="Close" commandfor="filters" command="close">
        {svg}
      </PlinthIconButton>,
    );

    expect(button.getAttribute('commandfor')).toBe('filters');
    expect(button.getAttribute('command')).toBe('close');

    root(
      // @ts-expect-error a link sends no invoker command
      <PlinthIconButton href="/filters" label="Filters" command="show-modal">
        {svg}
      </PlinthIconButton>,
    );
  });
});
