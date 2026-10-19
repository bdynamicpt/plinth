import { fireEvent, render } from '@testing-library/react';
import { createRef, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  buttonVariants,
  controlSizes,
  PlinthButton,
  type ButtonVariant,
  type ControlSize,
} from '../src/index.ts';

const svg = (
  <svg viewBox="0 0 24 24">
    <path d="M5 12l5 5L19 7"></path>
  </svg>
);
const root = (element: ReactElement) => render(element).container.firstElementChild!;
const icons = (element: Element) => [...element.querySelectorAll('.plinth-icon')];

describe('PlinthButton', () => {
  it('prints the button markup contract', () => {
    expect(renderToStaticMarkup(<PlinthButton>Save</PlinthButton>)).toBe(
      '<button type="button" class="plinth-button" data-variant="primary" data-size="md"><span class="plinth-button-label">Save</span></button>',
    );
  });

  it('prints a link when given an href', () => {
    const link = root(
      <PlinthButton href="/orders" variant="secondary">
        Orders
      </PlinthButton>,
    );

    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/orders');
    expect(link.hasAttribute('type')).toBe(false);
  });

  it.each(
    buttonVariants.flatMap((variant) => controlSizes.map((size) => [variant, size] as const)),
  )('takes the %s variant at the %s size', (variant, size) => {
    const button = root(
      <PlinthButton variant={variant} size={size}>
        Save
      </PlinthButton>,
    );

    expect(button.getAttribute('data-variant')).toBe(variant);
    expect(button.getAttribute('data-size')).toBe(size);
  });

  it('falls back to primary and md for values it does not know', () => {
    // Unknown values, as a project might pass from untyped data.
    const button = root(
      <PlinthButton variant={'loud' as ButtonVariant} size={'huge' as ControlSize}>
        Save
      </PlinthButton>,
    );

    expect(button.getAttribute('data-variant')).toBe('primary');
    expect(button.getAttribute('data-size')).toBe('md');
  });

  it('prints the leading and trailing icons, sized to the button', () => {
    const button = root(
      <PlinthButton size="sm" icon={svg} trailing={svg}>
        Next
      </PlinthButton>,
    );

    expect(icons(button).map((icon) => icon.getAttribute('data-size'))).toEqual(['sm', 'sm']);
    expect(icons(button).map((icon) => icon.getAttribute('aria-hidden'))).toEqual(['true', 'true']);
  });

  it('leaves out icons that print nothing', () => {
    expect(
      icons(
        root(
          <PlinthButton icon={null} trailing="  ">
            Next
          </PlinthButton>,
        ),
      ),
    ).toHaveLength(0);
  });

  it('flips the leading icon on a button without flipping the trailing one', () => {
    const button = root(
      <PlinthButton mirrorIcon icon={svg} trailing={svg}>
        Back
      </PlinthButton>,
    );

    expect(icons(button).map((icon) => icon.getAttribute('data-mirror'))).toEqual(['', null]);
  });

  it('flips the trailing icon when asked', () => {
    const button = root(
      <PlinthButton mirrorTrailing trailing={svg}>
        Next
      </PlinthButton>,
    );

    expect(button.querySelector('.plinth-icon')!.getAttribute('data-mirror')).toBe('');
  });

  it('disables a button with disabled, and a link with aria-disabled and no href', () => {
    expect(root(<PlinthButton disabled>Save</PlinthButton>).hasAttribute('disabled')).toBe(true);

    const link = root(
      <PlinthButton href="/orders" disabled>
        Orders
      </PlinthButton>,
    );
    expect(link.getAttribute('role')).toBe('link');
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.hasAttribute('href')).toBe(false);
  });

  it('shows a spinner and stays focusable while busy', () => {
    const button = root(
      <PlinthButton busy icon={svg}>
        Save
      </PlinthButton>,
    );

    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.hasAttribute('disabled')).toBe(false);
    expect(button.querySelector('.plinth-button-spinner')).not.toBeNull();
    expect(button.querySelector('.plinth-icon')).toBeNull();
  });

  it('lets disabled win over busy', () => {
    const button = root(
      <PlinthButton disabled busy>
        Save
      </PlinthButton>,
    );

    expect(button.hasAttribute('disabled')).toBe(true);
    expect(button.hasAttribute('aria-busy')).toBe(false);
  });

  it('prints the icons, flips them and shows busy on a link too', () => {
    const link = root(
      <PlinthButton href="/next" mirrorIcon mirrorTrailing icon={svg} trailing={svg}>
        Next
      </PlinthButton>,
    );

    expect(icons(link).map((icon) => icon.getAttribute('data-mirror'))).toEqual(['', '']);
    expect(icons(link).map((icon) => icon.getAttribute('data-size'))).toEqual(['md', 'md']);

    const busy = root(
      <PlinthButton href="/next" busy icon={svg}>
        Next
      </PlinthButton>,
    );

    expect(busy.querySelector('.plinth-button-spinner')).not.toBeNull();
    expect(busy.querySelector('.plinth-icon')).toBeNull();
    expect(busy.getAttribute('aria-busy')).toBe('true');
    expect(busy.getAttribute('aria-disabled')).toBe('true');
    expect(busy.getAttribute('href')).toBe('/next');
  });

  it('escapes the label', () => {
    expect(renderToStaticMarkup(<PlinthButton>{'<b>x</b>'}</PlinthButton>)).toContain(
      '&lt;b&gt;x&lt;/b&gt;',
    );
  });

  it('passes classes, a type, listeners and the ref to its root', () => {
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const button = root(
      <PlinthButton ref={ref} className="ms-2" type="submit" onClick={onClick}>
        Save
      </PlinthButton>,
    );

    expect(button.className).toBe('plinth-button ms-2');
    expect(button.getAttribute('type')).toBe('submit');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(ref.current).toBe(button);
  });

  it('passes attributes and the ref to a link', () => {
    const ref = createRef<HTMLAnchorElement>();
    const link = root(
      <PlinthButton ref={ref} href="/orders" target="_blank" data-testid="orders">
        Orders
      </PlinthButton>,
    );

    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('data-testid')).toBe('orders');
    expect(ref.current).toBe(link);
  });
});
