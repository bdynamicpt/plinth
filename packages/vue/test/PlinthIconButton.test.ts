import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { controlSizes, buttonVariants, PlinthIconButton } from '../src/index.ts';

const svg = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"></path></svg>';
const slots = { default: svg };

describe('PlinthIconButton', () => {
  it('prints the icon button markup contract', () => {
    const wrapper = mount(PlinthIconButton, { props: { label: 'Close' }, slots });

    expect(wrapper.html().replace(/>\s+</g, '><')).toBe(
      `<button type="button" class="plinth-button plinth-icon-button" data-variant="ghost" data-size="md" aria-label="Close"><span class="plinth-icon" data-size="md" aria-hidden="true">${svg}</span></button>`,
    );
  });

  it('takes an aria-label attribute as its label', () => {
    const wrapper = mount(PlinthIconButton, { attrs: { 'aria-label': 'Close' }, slots });

    expect(wrapper.attributes('aria-label')).toBe('Close');
  });

  it.each(buttonVariants.flatMap((variant) => controlSizes.map((size) => [variant, size])))(
    'takes the %s variant at the %s size',
    (variant, size) => {
      // @ts-expect-error: the pairs are built from the lists, so they are valid.
      const wrapper = mount(PlinthIconButton, { props: { label: 'Go', variant, size }, slots });
      expect(wrapper.attributes()).toMatchObject({ 'data-variant': variant, 'data-size': size });
      expect(wrapper.get('.plinth-icon').attributes('data-size')).toBe(size === 'sm' ? 'sm' : 'md');
    },
  );

  it('is a toggle when pressed is set, and not otherwise', () => {
    const on = mount(PlinthIconButton, { props: { label: 'Favourite', pressed: true }, slots });
    const off = mount(PlinthIconButton, { props: { label: 'Favourite', pressed: false }, slots });
    const plain = mount(PlinthIconButton, { props: { label: 'Favourite' }, slots });

    expect(on.attributes('aria-pressed')).toBe('true');
    expect(off.attributes('aria-pressed')).toBe('false');
    expect(plain.attributes('aria-pressed')).toBeUndefined();
  });

  it('disables, shows busy and flips like the button', () => {
    expect(
      mount(PlinthIconButton, { props: { label: 'Close', disabled: true }, slots }).attributes(
        'disabled',
      ),
    ).toBe('');
    const busy = mount(PlinthIconButton, { props: { label: 'Close', busy: true }, slots });
    expect(busy.attributes('aria-busy')).toBe('true');
    expect(busy.find('.plinth-icon').exists()).toBe(false);
    const flipped = mount(PlinthIconButton, { props: { label: 'Next', mirror: true }, slots });
    expect(flipped.get('.plinth-icon').attributes('data-mirror')).toBe('');
  });

  it('is a link with an href', () => {
    const wrapper = mount(PlinthIconButton, {
      props: { label: 'Next page', href: '/page/2' },
      slots,
    });

    expect(wrapper.element.tagName).toBe('A');
    expect(wrapper.attributes('type')).toBeUndefined();
  });

  it('passes classes and listeners to its root', async () => {
    let clicks = 0;
    const wrapper = mount(PlinthIconButton, {
      props: { label: 'Close' },
      attrs: { class: 'ms-2', onClick: () => clicks++ },
      slots,
    });

    expect(wrapper.classes()).toEqual(['plinth-button', 'plinth-icon-button', 'ms-2']);
    await wrapper.trigger('click');
    expect(clicks).toBe(1);
  });

  it('shows busy and flips as a link too', () => {
    const busy = mount(PlinthIconButton, {
      props: { href: '/next', label: 'Next', busy: true },
      slots: { default: svg },
    });

    expect(busy.find('.plinth-button-spinner').exists()).toBe(true);
    expect(busy.find('.plinth-icon').exists()).toBe(false);
    expect(busy.attributes()).toMatchObject({ 'aria-busy': 'true', 'aria-disabled': 'true' });

    const flipped = mount(PlinthIconButton, {
      props: { href: '/next', label: 'Next', mirror: true },
      slots: { default: svg },
    });

    expect(flipped.find('.plinth-icon').attributes('data-mirror')).toBe('');
  });

  it('disables a link with aria-disabled and no href', () => {
    const wrapper = mount(PlinthIconButton, {
      props: { href: '/next', label: 'Next', disabled: true },
      slots: { default: svg },
    });

    expect(wrapper.element.tagName).toBe('A');
    expect(wrapper.attributes('href')).toBeUndefined();
    expect(wrapper.attributes()).toMatchObject({ role: 'link', 'aria-disabled': 'true' });
    expect(wrapper.attributes('aria-busy')).toBeUndefined();
  });
});
